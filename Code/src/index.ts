import './styles/index.css';
import { ChatPage } from './pages/ChatPage/ChatPage';

const app = document.getElementById('app');
app.appendChild(new ChatPage().element);
