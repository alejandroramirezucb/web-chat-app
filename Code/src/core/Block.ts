import { EventBus } from './EventBus';

export abstract class Block {
  protected props: any;
  protected children: Block[] = [];
  private eventBus: EventBus;

  constructor(props: {} = {}) {
    this.props = this._makeProps(props);
    this.eventBus = new EventBus();
  }

  private _makeProps(props: any) {
    return new Proxy(props, {
      set: (target, prop, value) => {
        target[prop] = value;
        this.eventBus.emit('render', props);
        return true;
      },
    });
  }

  protected addChild(child: Block) {
    this.children.push(child);
  }

  protected removeChild(child: Block) {
    this.children = this.children.filter((_child) => _child !== child);
  }
}
