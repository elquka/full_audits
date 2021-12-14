import logo from './logo.svg';
import './App.css';
import { Button } from 'react-bootstrap';
import Categoria from './componentes/categoria'
import DraggableList from "react-draggable-list";

function App() {
  return (
    <div className="App">
      <Categoria />
      <Button>hola</Button>
    </div>
  );
}

export default App;
