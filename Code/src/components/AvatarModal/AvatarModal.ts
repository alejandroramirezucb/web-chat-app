import { Block } from '../../core/Block';
import template from './AvatarModal.hbs?raw';

export type AvatarSelectedCallback = (dataUrl: string) => void;

interface AvatarModalProps {
  onAvatarSelected: AvatarSelectedCallback;
}

export class AvatarModal extends Block {
  declare protected props: AvatarModalProps;

  constructor(onAvatarSelected: AvatarSelectedCallback) {
    super({ onAvatarSelected });
  }

  protected render(): string {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      'click .avatar-modal__overlay': this.close,
      'click .avatar-modal__submit': this.onSubmit,
    };
  }

  open(): void {
    this.element.classList.add('avatar-modal--open');
    this.element.setAttribute('aria-hidden', 'false');

    const input = this.refs.fileInput;
    
    if (input instanceof HTMLInputElement) {
      input.value = '';
    }
  }

  close = (): void => {
    this.element.classList.remove('avatar-modal--open');
    this.element.setAttribute('aria-hidden', 'true');
  };

  private onSubmit = (): void => {
    const input = this.refs.fileInput;

    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const result = e.target?.result;
      
      if (typeof result !== 'string') {
        return;
      }
      
      this.props.onAvatarSelected(result);
      this.close();
    };

    reader.readAsDataURL(file);
  };
}
