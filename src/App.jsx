import { useRef, useState } from 'react';
import './App.css';

function App() {
  const [todo, setTodo] = useState([
    {
      id: Number(new Date()),
      content: '안녕하세요',
    },
  ]);

  const inputRef = useRef(null);
  const addTodo = () => {
    const newTodo = {
      id: Number(new Date()),
      content: inputRef.current.value,
    };
    setTodo((prev) => [...prev, newTodo]);
  };

  return (
    <>
      <input ref={inputRef} />
      <button onClick={addTodo}>추가</button>
      <ul>
        {todo.map((el) => (
          <li key={el.id}>{el.content}</li>
        ))}
      </ul>
    </>
  );
}

export default App;
