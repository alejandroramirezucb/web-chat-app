import './styles/index.css';
import { eventBus } from './core/EventBus';
import { Block } from './core/Block';
import { LoginPage } from './pages/LoginPage/LoginPage';
import { RegisterPage } from './pages/RegisterPage/RegisterPage';
import { ChatPage } from './pages/ChatPage/ChatPage';
import { ProfilePage } from './pages/ProfilePage/ProfilePage';
import { NotFoundPage } from './pages/ErrorPages/NotFoundPage/NotFoundPage';
import { ServerErrorPage } from './pages/ErrorPages/ServerErrorPage/ServerErrorPage';
import { findUserById, setCurrentUserId } from './props/User';

const app = document.getElementById('app');
let currentUserId: number | null = null;
let currentPage: Block | null = null;

function showPage(page: Block): void {
  if (!app) {
    return;
  }

  currentPage?.remove();
  app.innerHTML = '';
  app.appendChild(page.element);
  currentPage = page;
}

eventBus.on('nav:register', () => showPage(new RegisterPage()));
eventBus.on('nav:login', () => showPage(new LoginPage()));

eventBus.on('user:logged-in', (userId: unknown) => {
  if (typeof userId !== 'number') {
    return;
  }

  currentUserId = userId;
  setCurrentUserId(currentUserId);
  showPage(new ChatPage(currentUserId));
});

eventBus.on('user:registered', (userId: unknown) => {
  if (typeof userId !== 'number') {
    return;
  }

  currentUserId = userId;
  setCurrentUserId(currentUserId);
  showPage(new ChatPage(currentUserId));
});

eventBus.on('nav:profile', () => {
  if (currentUserId === null) {
    return;
  }

  const user = findUserById(currentUserId);

  if (!user) {
    return;
  }

  showPage(new ProfilePage(user));
});

eventBus.on('nav:chat', () => {
  if (currentUserId === null) {
    return;
  }

  showPage(new ChatPage(currentUserId));
});

eventBus.on('user:logout', () => {
  currentUserId = null;
  showPage(new LoginPage());
});

eventBus.on('nav:404', () => showPage(new NotFoundPage()));
eventBus.on('nav:500', () => showPage(new ServerErrorPage()));

showPage(new LoginPage());
