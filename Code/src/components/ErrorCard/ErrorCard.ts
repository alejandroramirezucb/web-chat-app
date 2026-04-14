import { Block } from '../../core/Block';
import template from './ErrorCard.hbs?raw';

export class ErrorCard extends Block {
  declare protected props: {
    code: string;
    title: string;
    message?: string;
    btnText?: string;
  };

  constructor(props: {
    code: string;
    title: string;
    message?: string;
    btnText?: string;
  }) {
    super(props);
  }

  protected render(): string {
    return template;
  }
}
