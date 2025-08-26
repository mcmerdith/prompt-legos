import { LegoPrompt } from "@/lib/prompt";
import { fatal, warn } from "@/lib/toast";
import type { NodeId } from "@/utils/shims";
import { WritableDraft } from "immer";
import z from "zod/v4";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

const NodeId = z.union([z.string(), z.number()]);

const PromptStoreData = z.object({
  activeNode: NodeId.optional(),
  values: z.record(NodeId, LegoPrompt),
});
type PromptStoreData = z.infer<typeof PromptStoreData>;

interface PromptStoreActions {
  setActiveEditor(nodeId: NodeId | undefined): void;
  create(nodeId: NodeId, value: LegoPrompt): LegoPrompt;
  delete(nodeId: NodeId): void;
  update(
    nodeId: NodeId,
    update: (current: WritableDraft<LegoPrompt>) => void,
  ): void;
}

type PromptStoreState = PromptStoreData & PromptStoreActions;

export const usePromptStore = create<PromptStoreState>()(
  devtools(
    persist(
      immer((set) => ({
        activeNode: undefined,
        setActiveEditor: (nodeId) => set(() => ({ activeNode: nodeId })),

        values: {},
        create(nodeId, value) {
          set((state) => {
            state.values[nodeId] = value;
          });
          return value;
        },
        delete: (nodeId) =>
          set((state) => {
            delete state.values[nodeId];
          }),
        update: (nodeId, update) =>
          set((state) => {
            update(state.values[nodeId]);
          }),
      })),
      {
        name: "prompt-store",
        version: 1,
        merge: (persistedState, currentState) => {
          const validated = PromptStoreData.safeParse(persistedState);
          if (!validated.success) {
            warn("Invalid prompt store, re-initializing...", undefined, {
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
