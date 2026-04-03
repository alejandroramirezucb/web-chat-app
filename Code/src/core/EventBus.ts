type Callback = (props: {}) => void;

export class EventBus {
  events: Record<string, Callback[]> = {};

  on(event: string, callback: Callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }

    this.events[event].push(callback);
  }

  off(event: string, callback: Callback) {
    if (!this.events[event]) {
      return;
    }

    this.events[event] = this.events[event].filter(
      (_callback) => _callback !== callback,
    );
  }

  emit(event: string, props: {}) {
    if (!this.events[event]) {
      return;
    }

    this.events[event].forEach((_callback) => _callback(props));
  }
}
