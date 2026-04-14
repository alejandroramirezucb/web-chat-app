import { AuthForm } from '../AuthForm/AuthForm';
import { User } from '../../props/User';
import { validate, showFieldError } from '../../utils/validation';
import template from './ProfileEditForm.hbs?raw';

interface ProfileEditFormProps {
  user: User;
}

export class ProfileEditForm extends AuthForm {
  declare protected props: ProfileEditFormProps;

  private readonly onSaved: (updatedUser: User) => void;
  private readonly onCancelled: () => void;

  constructor(
    user: User,
    onSaved: (updatedUser: User) => void,
    onCancelled: () => void,
  ) {
    super({ user });
    this.onSaved = onSaved;
    this.onCancelled = onCancelled;
  }

  protected render(): string {
    return template;
  }

  protected events(): Record<string, EventListener> {
    return {
      'blur #pef-email': this.onEmailBlur,
      'blur #pef-login': this.onLoginBlur,
      'blur #pef-name': this.onNameBlur,
      'blur #pef-last-name': this.onLastNameBlur,
      'blur #pef-phone': this.onPhoneBlur,
    };
  }

  protected onMount(): void {
    this.refs.saveButton?.addEventListener('click', this.onSaveClick);
    this.refs.cancelButton?.addEventListener('click', this.onCancelClick);
    this.populateInputs();
  }

  protected onRender(): void {
    this.populateInputs();
  }

  remove(): void {
    this.refs.saveButton?.removeEventListener('click', this.onSaveClick);
    this.refs.cancelButton?.removeEventListener('click', this.onCancelClick);
    super.remove();
  }

  private populateInputs(): void {
    const { user } = this.props;
    const fields: Array<[string, string]> = [
      ['emailInput', user.email],
      ['loginInput', user.login],
      ['nameInput', user.name],
      ['lastNameInput', user.last_name],
      ['phoneInput', user.phone],
    ];

    for (const [refName, value] of fields) {
      const input = this.refs[refName];
      if (input instanceof HTMLInputElement && input.value === '') {
        input.value = value;
      }
    }
  }

  private onEmailBlur = (): void => {
    showFieldError(
      this.refs.emailError,
      validate('email', this.inputValue('emailInput')),
    );
  };

  private onLoginBlur = (): void => {
    showFieldError(
      this.refs.loginError,
      validate('login', this.inputValue('loginInput')),
    );
  };

  private onNameBlur = (): void => {
    showFieldError(
      this.refs.nameError,
      validate('name', this.inputValue('nameInput')),
    );
  };

  private onLastNameBlur = (): void => {
    showFieldError(
      this.refs.lastNameError,
      validate('last_name', this.inputValue('lastNameInput')),
    );
  };

  private onPhoneBlur = (): void => {
    showFieldError(
      this.refs.phoneError,
      validate('phone', this.inputValue('phoneInput')),
    );
  };

  private onSaveClick = (): void => {
    const email = this.inputValue('emailInput');
    const login = this.inputValue('loginInput');
    const name = this.inputValue('nameInput');
    const lastName = this.inputValue('lastNameInput');
    const phone = this.inputValue('phoneInput');

    const emailErr = validate('email', email);
    const loginErr = validate('login', login);
    const nameErr = validate('name', name);
    const lastNameErr = validate('last_name', lastName);
    const phoneErr = validate('phone', phone);

    showFieldError(this.refs.emailError, emailErr);
    showFieldError(this.refs.loginError, loginErr);
    showFieldError(this.refs.nameError, nameErr);
    showFieldError(this.refs.lastNameError, lastNameErr);
    showFieldError(this.refs.phoneError, phoneErr);

    if (emailErr || loginErr || nameErr || lastNameErr || phoneErr) {
      return;
    }

    const updatedUser: User = {
      ...this.props.user,
      email,
      login,
      name,
      last_name: lastName,
      phone,
    };

    console.log({
      email,
      login,
      first_name: name,
      second_name: lastName,
      phone,
    });

    this.onSaved(updatedUser);
  };

  private onCancelClick = (): void => {
    this.onCancelled();
  };
}
