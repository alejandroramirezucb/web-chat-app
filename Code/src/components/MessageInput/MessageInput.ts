import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import template from './MessageInput.hbs?raw';

export class MessageInput extends Block {
  protected render() {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      'submit form': this._submitMessage as EventListener,
    };
  }

  private _submitMessage(event: Event) {
    event.preventDefault();

    const input = (
      event.target as HTMLFormElement
    ).querySelector<HTMLInputElement>('input[name=message]');

    if (!input || !input.value.trim()) {
      return;
    }

    eventBus.emit('message:send', input.value.trim());
    input.value = '';
    input.focus();
  }
}
