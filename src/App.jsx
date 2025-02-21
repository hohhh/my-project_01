import { useState } from 'react';
import './App.css';

function App() {
  const [todo, setTodo] = useState([
    {
      id: Number(new Date()),
      content: '안녕하세요',
    },
  ]);

  return (
    <>
      <input />
      <button>추가</button>
      <ul>
        {todo.map((el) => (
          <li key={el.id}>{el.content}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
