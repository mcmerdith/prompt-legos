import type { NodeId } from "@/utils/shims";

import { api } from "./shims";

/** Wraps all properties in {@link CustomEvent}. */
declare type AsCustomEvents<T> = {
  readonly [K in keyof T]: CustomEvent<T[K]>;
};

export type EventTypes = {
  PromptCreatorReady: undefined;
  PromptCreatorClosed: undefined;
  PromptCreatorOpenTab: { nodeId: NodeId };
  PromptCreatorUpdatePrompt: { nodeId: NodeId; prompt: string };
};

export type EventName = keyof EventTypes;

export type Events = AsCustomEvents<EventTypes>;

/** Wrap the API event methods to add our custom events */
export const events = {
  /** Add a listener to an event. Returns a function to remove the listener */
  addListener<TEvent extends EventName>(
    eventName: TEvent,
    callback: (event: Events[TEvent]) => void,
    options?: AddEventListenerOptions,
  ) {
    // @ts-expect-error custom event types are not recognized by the API
    api.addEventListener(eventName, callback, options);
    return () => this.removeListener(eventName, callback, options);
  },
  /** Remove a listener from an event */
  removeListener<TEvent extends EventName>(
    eventName: TEvent,
    callback: (event: Events[TEvent]) => void,
    options?: EventListenerOptions,
  ) {
    // @ts-expect-error custom event types are not recognized by the API
    api.removeEventListener(eventName, callback, options);
  },
  /** Add a listener that is removed after the first event is dispatched */
  singleShotListener<TEvent extends EventName>(
    eventName: TEvent,
    callback: (event: Events[TEvent]) => void,
    options?: EventListenerOptions,
    timeout?: number,
  ) {
    const removeListener = () => {
      this.removeListener(eventName, wrapper, options);
    };
    const timeoutId = timeout
      ? setTimeout(() => {
          console.warn(`Timeout reached waiting for event ${eventName}`);
          removeListener();
        }, timeout)
      : undefined;
    const wrapper = (event: Events[TEvent]) => {
      this.removeListener(eventName, wrapper, options);
      callback(event);
      clearTimeout(timeoutId);
    };
    this.addListener(eventName, wrapper, options);
  },
  /** Dispatch an event */
  dispatch<T extends EventName>(eventName: T, event: EventTypes[T]) {
    // @ts-expect-error custom event types are not recognized by the API
    api.dispatchCustomEvent(eventName, event);
  },
};
