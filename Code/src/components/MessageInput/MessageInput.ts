import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import template from './MessageInput.hbs?raw';

export class MessageInput extends Block {
  protected render() {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      'submit form': this.submitMessage,
    };
  }

  private submitMessage = (event: Event) => {
    event.preventDefault();

    const ref = this.refs.messageInput;

    if (!(ref instanceof HTMLInputElement)) {
      return;
    }

    const input = ref;

    if (!input || !input.value.trim()) {
      return;
    }

    eventBus.emit('message:send', input.value.trim());
    input.value = '';
    input.focus();
  };
}
