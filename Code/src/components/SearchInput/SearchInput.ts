import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import template from './SearchInput.hbs?raw';

export class SearchInput extends Block {
  protected render() {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      input: this.onInput,
    };
  }

  private onInput = () => {
    const searchInputElement = this.refs.searchInput;

    if (!(searchInputElement instanceof HTMLInputElement)) {
      return;
    }

    eventBus.emit('search:input', searchInputElement.value);
  };
}
