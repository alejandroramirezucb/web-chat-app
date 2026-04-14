import { Block } from '../../../core/Block';
import { eventBus } from '../../../core/EventBus';
import { ErrorCard } from '../../../components/ErrorCard/ErrorCard';
import template from './NotFoundPage.hbs?raw';

export class NotFoundPage extends Block {
  declare protected props: Record<string, never>;

  protected render(): string {
    return template;
  }

  protected children(): Record<string, Block> {
    return {
      errorCard: new ErrorCard({
        code: '404',
        title: 'Nos equivocamos de lugar',
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
