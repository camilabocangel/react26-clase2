import {createRoot} from 'react-dom/client';
import TicTacToe from './tic-tac-toe.jsx';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<TicTacToe />);