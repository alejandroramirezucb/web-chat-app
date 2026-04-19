import { Block } from '../../core/Block';
import template from './AvatarModal.hbs?raw';

export type AvatarSelectedCallback = (dataUrl: string) => void;

export class AvatarModal extends Block {
  declare protected props: {
    onAvatarSelected: AvatarSelectedCallback;
  };

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
      'click .avatar-modal__preview': this.onPreviewClick,
      'change .avatar-modal__file-input': this.onFileChange,
    };
  }

  open(): void {
    this.element.classList.add('avatar-modal--open');
    this.element.setAttribute('aria-hidden', 'false');

    const input = this.refs.fileInput;
    if (input instanceof HTMLInputElement) {
      input.value = '';
    }

    this.resetPreview();
  }

  close = (): void => {
    this.element.classList.remove('avatar-modal--open');
    this.element.setAttribute('aria-hidden', 'true');
  };

  private resetPreview(): void {
    const preview = this.refs.previewImg;
    const label = this.refs.fileLabel;

    if (preview instanceof HTMLImageElement) {
      preview.src = '';
      preview.style.display = 'none';
    }

    if (label instanceof HTMLElement) {
      label.style.display = '';
    }
  }

  private onPreviewClick = (): void => {
    const input = this.refs.fileInput;
    if (input instanceof HTMLInputElement) {
      input.value = '';
      input.click();
    }
  };

  private onFileChange = (): void => {
    const input = this.refs.fileInput;
    if (!(input instanceof HTMLInputElement)) return;

    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result;
      if (typeof result !== 'string') return;

      const preview = this.refs.previewImg;
      const label = this.refs.fileLabel;

      if (preview instanceof HTMLImageElement) {
        preview.src = result;
        preview.style.display = 'block';
      }

      if (label instanceof HTMLElement) {
        label.style.display = 'none';
      }
    };

    reader.readAsDataURL(file);
  };

  private onSubmit = (): void => {
    const input = this.refs.fileInput;
    if (!(input instanceof HTMLInputElement)) return;

    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
      const result = event.target?.result;
      if (typeof result !== 'string') return;
      this.props.onAvatarSelected(result);
      this.close();
    };

    reader.readAsDataURL(file);
  };
}
