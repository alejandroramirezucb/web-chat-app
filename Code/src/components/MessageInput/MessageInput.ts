import { Block } from '../../core/Block';
import { eventBus } from '../../core/EventBus';
import { validate, showFieldError } from '../../utils/validation';
import template from './MessageInput.hbs?raw';

export class MessageInput extends Block {
  declare protected props: Record<string, never>;

  private attachMenuOpen = false;

  protected render(): string {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      'submit .message-input': this.onFormSubmit,
      'click .message-input__send': this.onSendClick,
      'blur .message-input__field': this.onMessageBlur,
      'click .message-input__attach': this.onAttachClick,
      'click [data-attach="photo"]': this.onPhotoOptionClick,
      'change .message-input__photo-input': this.onPhotoInputChange,
    };
  }

  protected onMount(): void {
    document.addEventListener('click', this.onDocumentClick);
  }

  protected onRender(): void {
    this.applyAttachMenuState();
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

  private onMessageBlur = (): void => {
    const input = this.refs.messageInput;
    if (!(input instanceof HTMLInputElement)) return;
    showFieldError(this.refs.messageError, validate('message', input.value.trim()));
  };

  private onAttachClick = (event: Event): void => {
    event.stopPropagation();
    this.attachMenuOpen = !this.attachMenuOpen;
    this.applyAttachMenuState();
  };

  private onPhotoOptionClick = (event: Event): void => {
    event.stopPropagation();
    const photoInput = this.refs.photoInput;
    if (photoInput instanceof HTMLInputElement) {
      photoInput.value = '';
      photoInput.click();
    }
    this.attachMenuOpen = false;
    this.applyAttachMenuState();
  };

  private onPhotoInputChange = (): void => {
    const photoInput = this.refs.photoInput;
    if (!(photoInput instanceof HTMLInputElement)) return;

    const file = photoInput.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result;
      if (typeof result !== 'string') return;
      eventBus.emit('message:send', { image: result });
    };
    reader.readAsDataURL(file);
  };

  private onDocumentClick = (): void => {
    if (this.attachMenuOpen) {
      this.attachMenuOpen = false;
      this.applyAttachMenuState();
    }
  };

  private applyAttachMenuState(): void {
    const menu = this.element.querySelector('.message-input__attach-menu');
    const icon = this.element.querySelector('.message-input__attach-icon');

    if (menu) {
      menu.classList.toggle('message-input__attach-menu--open', this.attachMenuOpen);
    }

    if (icon instanceof HTMLImageElement) {
      icon.src = this.attachMenuOpen ? '/Clip-Active.svg' : '/Clip.svg';
    }
  }

  private onSubmit = (): void => {
    const input = this.refs.messageInput;
    if (!(input instanceof HTMLInputElement)) return;

    const text = input.value.trim();
    const err = validate('message', text);

    showFieldError(this.refs.messageError, err);
    if (err) return;

    eventBus.emit('message:send', text);
    input.value = '';
    input.focus();
    showFieldError(this.refs.messageError, '');
  };

  remove(): void {
    document.removeEventListener('click', this.onDocumentClick);
    super.remove();
  }
}
