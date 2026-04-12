import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { validate, showFieldError } from '../../utils/validation';
import template from './MessageInput.hbs?raw';

export class MessageInput extends Block {
  protected render(): string {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      'submit form': this.onSubmit,
    };
  }

  private onSubmit = (event: Event): void => {
    event.preventDefault();

    const input = this.refs.messageInput;
    if (!(input instanceof HTMLInputElement)) return;

    const text = input.value.trim();
    const err = validate('message', text);

    showFieldError(this.refs.messageError, err);
    if (err) return;

    console.log('MessageInput submit:', { message: text });

    eventBus.emit('message:send', text);
    input.value = '';
    input.focus();
    showFieldError(this.refs.messageError, '');
  };
}
