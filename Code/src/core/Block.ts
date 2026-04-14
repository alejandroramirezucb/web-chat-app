import Handlebars from 'handlebars';

export abstract class Block {
  private _element: HTMLElement;
  private mountedEvents: Array<{
    element: Element;
    eventName: string;
    handler: EventListener;
  }> = [];
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
        const eventName = eventDescriptor.substring(0, separatorIndex);
        const selector = eventDescriptor.substring(separatorIndex + 1);
        const matchingElements: Element[] = [];

        if (this._element.matches(selector)) {
          matchingElements.push(this._element);
        }

        matchingElements.push(
          ...Array.from(this._element.querySelectorAll(selector)),
        );

        if (matchingElements.length === 0) {
          continue;
        }

        for (const targetElement of matchingElements) {
          targetElement.addEventListener(eventName, eventHandler);
          this.mountedEvents.push({
            element: targetElement,
            eventName,
            handler: eventHandler,
          });
        }
      } else {
        this._element.addEventListener(eventDescriptor, eventHandler);
        this.mountedEvents.push({
          element: this._element,
          eventName: eventDescriptor,
          handler: eventHandler,
        });
      }
    }
  }

  private mountChildren() {
    for (const [name, child] of Object.entries(this.children())) {
      const childContainer = this.refs[name];

      if (!childContainer || !child) {
        continue;
      }

      childContainer.replaceWith(child.element);
    }
  }

  private clearEvents(mountedElement: HTMLElement) {
    for (const { element, eventName, handler } of this.mountedEvents) {
      if (element === mountedElement || mountedElement.contains(element)) {
        element.removeEventListener(eventName, handler);
      }
    }

    this.mountedEvents = this.mountedEvents.filter(
      ({ element }) =>
        element !== mountedElement && !mountedElement.contains(element),
    );
  }

  protected abstract render(): string;
}
