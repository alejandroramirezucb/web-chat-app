import Handlebars from 'handlebars';

export abstract class Block {
  readonly element: HTMLElement = document.createElement('div');
  protected props: Record<string, unknown> = {};
  private _events: Array<[string, EventListener]> = [];
  private _mounted = false;

  constructor(props: Record<string, unknown> = {}) {
    Object.assign(this.props, props);
    Object.assign(this, props);

    queueMicrotask(() => {
      if (this._mounted) {
        return;
      }

      this.mount();
      this.onMount();
      this._mounted = true;
    });
  }

  mount() {
    this._clearEvents();
    this.element.innerHTML = Handlebars.compile(this.render())(this.props);
    this.mountChildren();
    this.mountEvents();
  }

  private _clearEvents() {
    this._events.forEach(([event, callback]) =>
      this.element.removeEventListener(event, callback),
    );
    this._events = [];
  }

  protected mountChildren() {
    for (const [name, child] of Object.entries(this.children())) {
      const _child = this.element.querySelector(`[data-child="${name}"]`);

      if (_child) {
        _child.replaceWith(child.element);
      }
    }
  }

  protected mountEvents() {
    for (const [key, callback] of Object.entries(this.events())) {
      const i = key.indexOf(' ');

      if (i === -1) {
        this.element.addEventListener(key, callback);
        this._events.push([key, callback]);
      } else {
        const _element = this.element.querySelector(key.substring(i + 1));

        if (_element) {
          _element.addEventListener(key.substring(0, i), callback);
        }
      }
    }
  }

  update(props: Record<string, unknown>) {
    Object.assign(this.props, props);
    Object.assign(this, props);
    this.mount();
  }

  remove() {
    this._clearEvents();
    this.element.remove();
  }

  protected abstract render(): string;

  protected onMount(): void {}

  protected events(): Record<string, EventListener> {
    return {};
  }

  protected children(): Record<string, Block> {
    return {};
  }
}
