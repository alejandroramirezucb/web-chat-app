import './styles/index.css';
import { eventBus } from './core/EventBus';
import { Block } from './core/Block';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { ChatPage } from './pages/ChatPage/ChatPage';

const app = document.getElementById('app');

function showPage(page: Block) {
  app.innerHTML = '';
  app.appendChild(page.element);
}

showPage(new LoginPage());

eventBus.on('nav:register', () => showPage(new RegisterPage()));
eventBus.on('nav:login', () => showPage(new LoginPage()));
eventBus.on('user:logged-in', (userId: unknown) =>
  showPage(new ChatPage(userId as number)),
);
eventBus.on('user:registered', (userId: unknown) =>
  showPage(new ChatPage(userId as number)),
);
