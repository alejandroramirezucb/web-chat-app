import { AuthForm } from '../AuthForm/AuthForm';
import { validate, showFieldError } from '../../utils/validation';
import template from './PasswordChangeForm.hbs?raw';

export class PasswordChangeForm extends AuthForm {
  private readonly onSaved: () => void;
  private readonly onCancelled: () => void;

  constructor(onSaved: () => void, onCancelled: () => void) {
    super({});
    this.onSaved = onSaved;
    this.onCancelled = onCancelled;
  }

  protected render(): string {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      'blur #pcf-new': this.onNewPasswordBlur,
      'blur #pcf-repeat': this.onRepeatPasswordBlur,
    };
  }

  protected onMount(): void {
    this.refs.saveButton?.addEventListener('click', this.onSaveClick);
    this.refs.cancelButton?.addEventListener('click', this.onCancelClick);
  }

  remove(): void {
    this.refs.saveButton?.removeEventListener('click', this.onSaveClick);
    this.refs.cancelButton?.removeEventListener('click', this.onCancelClick);
    super.remove();
  }

  private onNewPasswordBlur = (): void => {
    showFieldError(
      this.refs.newPasswordError,
      validate('password', this.rawInputValue('newPasswordInput')),
    );
  };

  private onRepeatPasswordBlur = (): void => {
    const newPwd = this.rawInputValue('newPasswordInput');
    const repeatPwd = this.rawInputValue('repeatPasswordInput');
    const error = repeatPwd !== newPwd ? 'Las contraseñas no coinciden' : '';
    showFieldError(this.refs.repeatPasswordError, error);
  };

  private onSaveClick = (): void => {
    const oldPassword = this.rawInputValue('oldPasswordInput');
    const newPassword = this.rawInputValue('newPasswordInput');
    const repeatPassword = this.rawInputValue('repeatPasswordInput');

    const oldErr = oldPassword.trim() === '' ? 'El campo es obligatorio' : '';
    const newErr = validate('password', newPassword);
    const repeatErr = repeatPassword !== newPassword ? 'Las contraseñas no coinciden' : '';

    showFieldError(this.refs.oldPasswordError, oldErr);
    showFieldError(this.refs.newPasswordError, newErr);
    showFieldError(this.refs.repeatPasswordError, repeatErr);

    if (oldErr || newErr || repeatErr) {
      return;
    }

    console.log({ oldPassword, newPassword });
    this.onSaved();
  };

  private onCancelClick = (): void => {
    this.onCancelled();
  };
}
