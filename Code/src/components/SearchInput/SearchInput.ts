import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import template from './SearchInput.hbs?raw';

export class SearchInput extends Block {
  declare protected props: {
    value: string;
  };

  constructor(props: { value?: string } = {}) {
    super({ value: props.value ?? '' });
  }

  protected render() {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      keydown: this.onKeyDown,
      input: this.onInputChange,
    };
  }

  protected onMount(): void {
    const input = this.refs.searchInput;

    if (input instanceof HTMLInputElement) {
      input.value = this.props.value;
    }
  }

  protected onRender(): void {
    const input = this.refs.searchInput;

    if (input instanceof HTMLInputElement && input.value !== this.props.value) {
      input.value = this.props.value;
    }
  }

  private onKeyDown = (event: Event): void => {
    if (!(event instanceof KeyboardEvent) || event.key !== 'Enter') {
      return;
    }
    this.emitSearch();
  };

  private onInputChange = (): void => {
    this.emitSearch();
  };

  private emitSearch(): void {
    const searchInputElement = this.refs.searchInput;
    if (!(searchInputElement instanceof HTMLInputElement)) {
      return;
    }
    eventBus.emit('search:input', searchInputElement.value);
  }
}
