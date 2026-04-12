import Handlebars from 'handlebars';

export abstract class Block {
  private _element: HTMLElement;
  protected refs: Record<string, HTMLElement> = {};
  protected props: any = {};

  constructor(props: any = {}) {
    this.props = this.makeProps(props);
    this.mount();
    this.onMount();
  }

  private makeProps(props: any) {
    const self = this;

    return new Proxy(props, {
      set(target, prop, value) {
        target[prop] = value;

        if (props !== self.props) {
          self.mount();
        }

        return true;
      },
    });
  }

  public setProps(newProps: any) {
    if (!newProps) {
      return;
    }

    Object.assign(this.props, newProps);
  }

  get element() {
    if (!this._element) {
      this.mount();
    }

    return this._element;
  }

  private mount() {
    const templateElement = document.createElement('template');
    templateElement.innerHTML = Handlebars.compile(this.render())(this.props);

    const nextRootElement = templateElement.content
      .firstElementChild as HTMLElement;
    const elementsWithRef = nextRootElement.querySelectorAll('[ref]');

    elementsWithRef.forEach((refNode) => {
      const refName = refNode.getAttribute('ref');

      if (!refName) {
        return;
      }

      this.refs[refName] = refNode as HTMLElement;
      refNode.removeAttribute('ref');
    });

    if (this._element) {
      this.clearEvents(this._element);
      this._element.replaceWith(nextRootElement);
    }

    this._element = nextRootElement;
    this.mountChildren();
    this.mountEvents();
  }

  protected onMount() {}

  protected children(): Record<string, Block> {
    return {};
  }

  protected events(): Record<string, EventListener> {
    return {};
  }

  remove() {
    if (!this._element) {
      return;
    }

    this.clearEvents(this._element);
    this._element.remove();
  }

  private mountEvents() {
    for (const [eventDescriptor, eventHandler] of Object.entries(
      this.events(),
    )) {
      if (eventDescriptor.includes(' ')) {
        const separatorIndex = eventDescriptor.indexOf(' ');
        const selector = eventDescriptor.substring(separatorIndex + 1);
        const targetElement = this._element.querySelector(selector);

        if (!targetElement) {
          continue;
        }

        targetElement.addEventListener(
          eventDescriptor.substring(0, separatorIndex),
          eventHandler,
        );
      } else {
        this._element.addEventListener(eventDescriptor, eventHandler);
      }
    }
  }

  private mountChildren() {
    for (const [refName, childBlock] of Object.entries(this.children())) {
      const childContainer = this.refs[refName];

      if (!childContainer || !childBlock) {
        continue;
      }

      childContainer.replaceWith(childBlock.element);
    }
  }

  private clearEvents(mountedElement: HTMLElement) {
    for (const [eventName, eventHandler] of Object.entries(this.events())) {
      mountedElement.removeEventListener(eventName, eventHandler);
    }
  }

  protected abstract render(): string;
}
