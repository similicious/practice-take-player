import type { Readable, Subscriber, Unsubscriber } from "svelte/store";

export abstract class TonejsStoreBase<T> implements Readable<T> {
  // All currently subscribed subscribers
  private subscribers: Subscriber<T>[] = [];

  // emitValue function bound to this, to make removal of event listeners easy
  boundEmitValue: () => void = undefined;

  subscribe(run: Subscriber<T>): Unsubscriber {
    // Setup Tone events, when this is the first subscriber
    if (this.subscribers.length === 0) {
      this.boundEmitValue = this.emitValue.bind(this);
      this.setupEvents();
    }

    // Add subscriber to array
    this.subscribers.push(run);

    // Synchronously emit value
    run(this.getValue());

    // Return unsubscribe function
    return () => {
      // Remove this subscriber
      this.subscribers = this.subscribers.filter((s) => s !== run);

      // Remove events, when this was the last subscriber
      if (this.subscribers.length === 0) {
        this.subscribers = [];
        this.boundEmitValue = undefined;
        this.removeEvents();
      }
    };
  }

  emitValue() {
    this.subscribers.forEach((s) => s(this.getValue()));
  }

  abstract setupEvents(): void;
  abstract removeEvents(): void;
  abstract getValue(): T;
}
