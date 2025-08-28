import { WritableDraft } from "immer";
import z from "zod/v4";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

import { createSinglePrompt, LegoPrompt } from "@/lib/prompt";
import { fatal, toast } from "@/lib/toast";
import type { NodeId } from "@/utils/shims";

const NodeId = z.union([z.string(), z.number()]);

const PromptStoreData = z.object({
  activeNode: NodeId.optional(),
  inputSpec: z.record(NodeId, z.string().array().or(z.undefined())),
  values: z.record(NodeId, LegoPrompt.or(z.undefined())),
});
type PromptStoreData = z.infer<typeof PromptStoreData>;

interface PromptStoreActions {
  /** Set the node to editor in the prompt creator */
  setActiveEditor(nodeId: NodeId | undefined): void;
  /** Set the current input spec for a node */
  create(nodeId: NodeId, promptIds: string[], force?: boolean): void;
  /** Recreate a nodes value based on its stored input spec */
  recreate(nodeId: NodeId): void;
  /** Delete the stored value for a node */
  delete(nodeId: NodeId): void;
  /** Update the stored  value for a node */
  update(
    nodeId: NodeId,
    update: (current: WritableDraft<LegoPrompt>) => void,
  ): void;
}

type PromptStoreState = PromptStoreData & PromptStoreActions;

export const usePromptStore = create<PromptStoreState>()(
  devtools(
    persist(
      immer((set, get) => ({
        activeNode: undefined,
        inputSpec: {},
        values: {},
        setActiveEditor: (nodeId) => set(() => ({ activeNode: nodeId })),
        create(nodeId, promptIds, force) {
          set((state) => {
            const oldIds = new Set(state.inputSpec[nodeId]);
            const newIds = new Set(promptIds);
            if (oldIds.size > 0) {
              const difference = newIds.symmetricDifference(oldIds);

              if (difference.size > 0) {
                toast.warn(
                  "Prompt node mismatch!",
                  `Node ${nodeId} expected [${[...oldIds]}], but we have [${[...newIds]}]. You should recreate the node`,
                );
              }
            }

            const newIdArr = [...newIds];
            state.inputSpec[nodeId] = newIdArr;

            if (force) {
              // overwrite everything
              state.values[nodeId] = {
                prompts: newIdArr.map((segment) => createSinglePrompt(segment)),
              };
            } else {
              // try to reuse old segments
              state.values[nodeId] = {
                prompts: newIdArr.map(
                  (newId) =>
                    state.values[nodeId]?.prompts.find((p) => p.id === newId) ??
                    createSinglePrompt(newId),
                ),
              };
            }
          });
        },
        recreate(nodeId) {
          const store = get();
          const spec = store.inputSpec[nodeId];
          if (!spec)
            fatal(
              "Failed to recreate prompt store!",
              `Node ${nodeId} has no saved input spec. Try reloading or recreating the node`,
            );
          store.create(nodeId, spec, true);
        },
        delete: (nodeId) =>
          set((state) => {
            if (state.activeNode === nodeId) state.activeNode = undefined;
            delete state.values[nodeId];
          }),
        update: (nodeId, update) =>
          set((current) => {
            const value = current.values[nodeId];
            if (!value) {
              toast.error("Failed to update prompt", "Not initialized");
              return;
            }
            update(value);
          }),
      })),
      {
        name: "prompt-store",
        version: 1,
        merge: (persistedState, currentState) => {
          const validated = PromptStoreData.safeParse(persistedState);
          if (!validated.success) {
            toast.warn("Invalid prompt store, re-initializing...", undefined, {
              error: validated.error,
            });
            console.warn(z.prettifyError(validated.error));
            return currentState;
          }

          return {
            ...currentState,
            ...validated.data,
            values: {
              ...currentState.values,
              ...validated.data.values,
            },
          };
        },
        migrate: (_state, _version) => {
          fatal(
            "Incompatible version detected!",
            "Please downgrade or use the 'Reset' button in settings",
          );
        },
      },
    ),
  ),
);
