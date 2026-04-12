type Callback = (...args: unknown[]) => void;

export class EventBus {
  private listeners: Record<string, Callback[]> = {};

  on(event: string, callback: Callback) {
    if (!this.listeners[event]){
      this.listeners[event] = [];
    }

    this.listeners[event].push(callback);
  }

  off(event: string, callback: Callback) {
    if (!this.listeners[event]) {
      return;
    }
    
    this.listeners[event] = this.listeners[event].filter(
      (_callback) => _callback !== callback,
    );
  }

  emit(event: string, ...args: unknown[]) {
    if (!this.listeners[event]) {
      return;
    }

    this.listeners[event].forEach((callback) => callback(...args));
  }
}

export const eventBus = new EventBus();
