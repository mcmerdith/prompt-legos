import { useCallback, useRef, useState, type KeyboardEvent } from "react";

import { toast } from "@/lib/toast";
import { useEditorContext } from "@/lib/use-editor-context";

import { PromptGroup } from "./prompt";
import { SectionPath } from "./prompt-search";

export function useUnifiedInput({
  group,
  parent,
}: {
  group: PromptGroup;
  parent: SectionPath;
}) {
  const editor = useEditorContext();
  if (!editor)
    throw new Error("useUnifiedInput can only be used in an editor context!");
  const { promptId, sectionId } = parent;
  const valueInputs = useRef<{ [id: string]: HTMLInputElement | null }>({});
  const weightInputs = useRef<{ [id: string]: HTMLInputElement | null }>({});
  const [focusItemId, setFocusItemId] = useState<string | null>(null);

  const setFocusedInput = useCallback(
    (index: number, weightInput?: boolean) => {
      if (index < 0 || index >= group.items.length) return null;
      const focused = weightInput
        ? weightInputs.current[group.items[index].id]
        : valueInputs.current[group.items[index].id];
      focused?.focus();
      return focused;
    },
    [group.items],
  );

  // create a new item at the specified index, or the end if not provided
  const createItem = useCallback(
    (index?: number) => {
      editor
        .create(
          {
            promptId,
            sectionId,
            groupId: group.id,
          },
          index !== undefined ? index + 1 : undefined,
        )
        .then((item) => {
          setFocusItemId(item.id);
        })
        .catch((e) => toast.error("Failed to create new item", e));
    },
    [editor, promptId, sectionId, group.id],
  );

  // make sure we focus new items
  if (focusItemId) {
    valueInputs.current[focusItemId]?.focus();
    setFocusItemId(null);
  }

  // remove the item at the specified input if it is empty
  const removeIfEmpty = useCallback(
    (index: number) => {
      // get the input ref
      const input = valueInputs.current[group.items[index].id];
      // do nothing if there is no input, the input is not empty, or there are no other inputs
      if (!input || input.value.length > 0 || group.items.length <= 1)
        return false;
      console.debug("removeItem @", index);
      editor
        .delete(
          {
            promptId,
            sectionId,
            groupId: group.id,
          },
          index,
        )
        .catch((e) => toast.error("Failed to delete item", e));
      return true;
    },
    [group.items, editor, promptId, sectionId, group.id],
  );

  // focus an input with extra validation (no empty fields, correct cursor placement)
  const shiftInputFocus = useCallback(
    (refIndex: number, direction: number) => {
      // get the target index clamped to the bounds of the array
      const target = refIndex + direction;
      // change the focused element
      console.debug(
        "shiftInputFocus @",
        refIndex,
        direction > 0 ? "right" : direction < 0 ? "left" : "actual",
        "->",
        target,
      );
      // focus the input
      const focused = setFocusedInput(target);
      if (!focused) return;

      // move the cursor in the focused input depending on where we're coming from
      if (direction < 0) {
        // if moving left, go to the end of the input
        focused.setSelectionRange(focused.value.length, focused.value.length);
      } else if (direction > 0) {
        // if moving right go to the start of the input
        focused.setSelectionRange(0, 0);
      }
    },
    [setFocusedInput],
  );

  // wacky hacky to unify the separate inputs (attempts to pretend they are 1 input)
  const keydownHandler = useCallback(
    (
      event: KeyboardEvent<HTMLInputElement>,
      index: number,
      isWeightInput?: boolean,
    ) => {
      event.stopPropagation(); // we control the input. always.
      switch (event.key) {
        case "Home":
          // focus the first input
          shiftInputFocus(0, 0);
          // allow default behavior (moves cursor to start of input)
          break;
        case "End":
          // focus the new item input
          shiftInputFocus(group.items.length - 1, 0);
          // allow default behavior (moves cursor to end of input)
          break;
        case "ArrowLeft":
        case "Backspace":
          // no special behavior if we aren't at the start of the input
          if (event.currentTarget.selectionStart !== 0) break;
          // prevent deleting more characters from the next focused input
          event.preventDefault();
          // move to the previous input
          if (isWeightInput) {
            setFocusedInput(index);
          } else {
            shiftInputFocus(index, -1);
          }
          // can't go anywhere
          if (index === 0) break;
          removeIfEmpty(index);
          break;
        case "ArrowRight":
        case "Delete":
          // no special behavior if we aren't at the end of the input
          if (
            event.currentTarget.selectionStart !==
            event.currentTarget.value.length
          )
            break;
          // prevent deleting more characters from the next focused input
          event.preventDefault();
          // move to the next input
          shiftInputFocus(index, 1);
          if (index === group.items.length - 1) break;
          removeIfEmpty(index);
          break;
        case ":":
          event.preventDefault();
          if (isWeightInput) {
            // do nothing?
          } else {
            setFocusedInput(index, true);
          }
          break;
        case ",":
        case "Enter":
          // prevent registering characters
          event.preventDefault();
          // unnecessary if there is nothing in this input
          if (event.currentTarget.value.length === 0) break;
          // create the new item
          if (isWeightInput && event.key === "Enter") {
            setFocusedInput(index);
          } else {
            createItem(index);
          }
          break;
        case " ":
          if (event.currentTarget.value.length === 0) event.preventDefault();
          break;
        default:
          break;
      }
    },
    [
      shiftInputFocus,
      group.items.length,
      removeIfEmpty,
      createItem,
      setFocusedInput,
    ],
  );

  return {
    keydownHandler,
    createItem,
    valueInputsRef: valueInputs.current,
    weightInputsRef: weightInputs.current,
    autofocusInputId: focusItemId,
  };
}
