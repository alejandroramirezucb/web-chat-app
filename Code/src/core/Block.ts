import Handlebars from 'handlebars';

export abstract class Block {
  private _element: HTMLElement;
  protected refs: Record<string, HTMLElement> = {};
  protected props: any = {};

  constructor(props: any = {}) {
    this.props = props;
    this.mount();
    this.onMount();
  }

  public get element(): HTMLElement {
    return this._element;
  }

  public setProps(newProps: any): void {
    if (!newProps) return;
    Object.assign(this.props, newProps);
    this.mount();
  }

  private mount(): void {
    const templateElement = document.createElement('template');
    templateElement.innerHTML = Handlebars.compile(this.render())(this.props);

    const nextRootElement = templateElement.content.firstElementChild as HTMLElement;
    const elementsWithRef = nextRootElement.querySelectorAll('[ref]');

    elementsWithRef.forEach((refNode) => {
      const refName = refNode.getAttribute('ref');
      if (!refName) return;
      this.refs[refName] = refNode as HTMLElement;
      refNode.removeAttribute('ref');
    });

    if (this._element) {
      this.clearEvents();
      this._element.replaceWith(nextRootElement);
    }

    this._element = nextRootElement;
    this.mountChildren();
    this.mountEvents();
  }

  protected onMount(): void {}

  protected children(): Record<string, Block> {
    return {};
  }

  protected events(): Record<string, EventListener> {
    return {};
  }

  public remove(): void {
    if (!this._element) return;
    this.clearEvents();
    this._element.remove();
  }

  private mountEvents(): void {
    for (const [eventDescriptor, eventHandler] of Object.entries(this.events())) {
      if (eventDescriptor.includes(' ')) {
        const separatorIndex = eventDescriptor.indexOf(' ');
        const eventName = eventDescriptor.substring(0, separatorIndex);
        const selector = eventDescriptor.substring(separatorIndex + 1);
        const matchingElements: Element[] = [];

        if (this._element.matches(selector)) {
          matchingElements.push(this._element);
        }

        matchingElements.push(...Array.from(this._element.querySelectorAll(selector)));

        matchingElements.forEach((targetElement) => {
          targetElement.addEventListener(eventName, eventHandler);
        });
      } else {
        this._element.addEventListener(eventDescriptor, eventHandler);
      }
    }
  }

  private mountChildren(): void {
    for (const [name, child] of Object.entries(this.children())) {
      const childContainer = this.refs[name];
      if (!childContainer || !child) continue;
      childContainer.replaceWith(child.element);
    }
  }

  private clearEvents(): void {
    for (const [eventDescriptor, eventHandler] of Object.entries(this.events())) {
      if (eventDescriptor.includes(' ')) {
        const separatorIndex = eventDescriptor.indexOf(' ');
        const eventName = eventDescriptor.substring(0, separatorIndex);
        const selector = eventDescriptor.substring(separatorIndex + 1);
        const matchingElements: Element[] = [];

        if (this._element.matches(selector)) {
          matchingElements.push(this._element);
        }

        matchingElements.push(...Array.from(this._element.querySelectorAll(selector)));

        matchingElements.forEach((targetElement) => {
          targetElement.removeEventListener(eventName, eventHandler);
        });
      } else {
        this._element.removeEventListener(eventDescriptor, eventHandler);
      }
    }
  }

  protected abstract render(): string;
}
