import Handlebars from "handlebars";

export abstract class Block {
  private _element!: HTMLElement;
  private _mounted = false;
  protected refs: Record<string, HTMLElement> = {};
  protected props: any;

  constructor(props: any = {}) {
    this.props = this.makeReactiveProps(props);
  }

  private makeReactiveProps(props: any): any {
    const self = this;

    return new Proxy(props, {
      set(target: Record<string, unknown>, prop: string, value: unknown) {
        target[prop] = value;

        if (props !== self.props) {
          self.mount();
        }

        return true;
      },
    });
  }

  public setProps(newProps: any): void {
    if (!newProps) {
      return;
    }

    Object.assign(this.props, newProps);
  }

  get element(): HTMLElement {
    if (!this._element) {
      this.mount();
    }

    return this._element;
  }

  private mount(): void {
    const tempElement = document.createElement("template");
    tempElement.innerHTML = Handlebars.compile(this.render())(this.props);

    const newElement = tempElement.content.firstElementChild as HTMLElement;
    const refElements = newElement.querySelectorAll("[ref]");

    this.refs = {};

    refElements.forEach((ref) => {
      const name = ref.getAttribute("ref");

      if (name) {
        this.refs[name] = ref as HTMLElement;
      }

      ref.removeAttribute("ref");
    });

    if (this._element) {
      this.clearEvents(this._element);
      this._element.replaceWith(newElement);
    }

    this._element = newElement;
    this.mountChildren();
    this.mountEvents();
    this.onRender();

    if (!this._mounted) {
      this._mounted = true;
      this.onMount();
    }
  }

  protected onMount(): void {}

  protected onRender(): void {}

  protected children(): Record<string, Block> {
    return {};
  }

  protected events(): Record<string, EventListener> {
    return {};
  }

  remove(): void {
    if (!this._element) {
      return;
    }

    this.clearEvents(this._element);
    this._element.remove();
  }

  private mountEvents(): void {
    for (const [name, event] of Object.entries(this.events())) {
      if (name.includes(" ")) {
        const index = name.indexOf(" ");
        const query = name.substring(index + 1);
        const queryElement = this._element.querySelector(query);

        if (!queryElement) {
          continue;
        }

        queryElement.addEventListener(name.substring(0, index), event);
      } else {
        this._element.addEventListener(name, event);
      }
    }
  }

  private mountChildren(): void {
    for (const [name, child] of Object.entries(this.children())) {
      const refElement = this.refs[name];

      if (!refElement || !child) {
        continue;
      }

      refElement.replaceWith(child.element);
    }
  }

  private clearEvents(element: HTMLElement): void {
    for (const [name, event] of Object.entries(this.events())) {
      if (name.includes(" ")) {
        const index = name.indexOf(" ");
        const query = name.substring(index + 1);
        const queryElement = element.querySelector(query);

        if (!queryElement) {
          continue;
        }

        queryElement.removeEventListener(name.substring(0, index), event);
      } else {
        element.removeEventListener(name, event);
      }
    }
  }

  protected abstract render(): string;
}
