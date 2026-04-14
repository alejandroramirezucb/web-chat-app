import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { validate, showFieldError } from '../../utils/validation';
import template from './MessageInput.hbs?raw';

export class MessageInput extends Block {
  declare protected props: Record<string, never>;

  protected render(): string {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      'submit .message-input': this.onFormSubmit,
      'click .message-input__send': this.onSendClick,
    };
  }

  private onFormSubmit = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
    this.onSubmit();
  };

  private onSendClick = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
    this.onSubmit();
  };

  private onSubmit = (): void => {
    const input = this.refs.messageInput;

    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const text = input.value.trim();
    const err = validate('message', text);

    showFieldError(this.refs.messageError, err);

    if (err) {
      return;
    }

    eventBus.emit('message:send', text);
    input.value = '';
    input.focus();
    showFieldError(this.refs.messageError, '');
  };
}
