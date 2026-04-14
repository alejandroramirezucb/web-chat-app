import { Block } from '../../../core/Block';
import { eventBus } from '../../../core/EventBus';
import { ErrorCard } from '../../../components/ErrorCard/ErrorCard';
import template from './ServerErrorPage.hbs?raw';

export class ServerErrorPage extends Block {
  protected render(): string {
    return template;
  }

  protected children(): Record<string, Block> {
    return {
      errorCard: new ErrorCard({
        code: '500',
        title: 'Ya lo estamos solucionando',
      }),
    };
  }

  protected events(): Record<string, EventListener> {
    return {
      'click .error-card__btn': this.goChats,
    };
  }

  private goChats = (): void => {
    eventBus.emit('nav:login');
  };
}
