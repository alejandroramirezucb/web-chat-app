import { Block } from '../../core/Block';

export abstract class AuthForm extends Block {
  protected inputValue(refName: string): string {
    const inputElement = this.refs[refName];

    if (!(inputElement instanceof HTMLInputElement)) {
      return '';
    }

    return inputElement.value.trim();
  }

  protected rawInputValue(refName: string): string {
    const inputElement = this.refs[refName];

    if (!(inputElement instanceof HTMLInputElement)) {
      return '';
    }

    return inputElement.value;
  }

  protected showGeneralError(message: string): void {
    const generalErrorElement = this.refs.generalError;

    if (!generalErrorElement) {
      return;
    }

    generalErrorElement.textContent = message;
    generalErrorElement.classList.toggle(
      'auth-form__error--visible',
      message !== '',
    );
  }
}
