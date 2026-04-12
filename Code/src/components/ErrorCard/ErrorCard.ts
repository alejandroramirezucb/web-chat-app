import { Block } from '../../core/Block';
import template from './ErrorCard.hbs?raw';

export interface ErrorCardProps {
  code: string;
  title: string;
  message?: string;
  btnText?: string;
}

export class ErrorCard extends Block {
  declare protected props: ErrorCardProps;

  constructor(props: ErrorCardProps) {
    super(props);
  }

  protected render(): string {
    return template;
  }
}
