import { useEffect, useRef, useState } from 'react';
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
      <StopWatch />
      <TodoInput setTodo={setTodo} />
      <TodoList todo={todo} setTodo={setTodo} />
    </>
  );
}

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setTime(new Date());
    }, 1000);
  }, []);

  return <div>{time.toLocaleTimeString()}</div>;
};

const formatTime = (seconds) => {
  // 00 : 00 : 00
  // 1시간 : 3600
  // 1분 : 60초
  // 12345
  // 12345 / 3600(절대값) -> 시간
  // (12345 % 3600) / 60 (절대값) -> 분
  // 12345% 60 -> 초

  const timeString = `${String(Math.floor(seconds / 3600)).padStart(2, '0')} : ${String(Math.floor((seconds % 3600) / 60)).padStart(2, '0')} : ${String(seconds % 60).padStart(2, '0')}`;
  return timeString;
};

const StopWatch = () => {
  const [time, setTime] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const timerRef = useRef(null);
  // console.log(timerRef);
  useEffect(() => {
    if (isOn === true) {
      const timerId = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
      timerRef.current = timerId;
    } else {
      clearInterval(timerRef.current);
    }
  }, [isOn]);

  return (
    <>
      <div>
        {formatTime(time)}
        <button onClick={() => setIsOn((prev) => !prev)}>{isOn ? '끄기' : '켜기'}</button>
        <button
          onClick={() => {
            setTime(0);
            setIsOn(false);
          }}
        >
          리셋
        </button>
      </div>
    </>
  );
};

const TodoInput = ({ setTodo }) => {
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
    </>
  );
};

const TodoList = ({ todo, setTodo }) => {
  return (
    <>
      <ul>
        {todo.map((el) => (
          <Todo key={todo.id} todo={el} setTodo={setTodo} />
        ))}
      </ul>
    </>
  );
};

const Todo = ({ todo, setTodo }) => {
  return (
    <li>
      {todo.content}
      <button
        onClick={() => {
          setTodo((prev) => prev.filter((el) => el.id !== todo.id));
        }}
      >
        삭제
      </button>
    </li>
  );
};

export default App;
