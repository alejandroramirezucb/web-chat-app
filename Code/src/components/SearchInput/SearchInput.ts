import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import template from './SearchInput.hbs?raw';

export class SearchInput extends Block {
  protected render() {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      'input input[name=search]': ((event: Event) =>
        eventBus.emit(
          'search:input',
          (event.target as HTMLInputElement).value,
        )) as EventListener,
    };
  }
}
