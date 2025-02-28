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
      <Advice />
      <Timer />
      <TodoInput setTodo={setTodo} />
      <TodoList todo={todo} setTodo={setTodo} />
    </>
  );
}

const useFetch = (url) => {
  const [isLoading, setIsLoading] = useState(true); // 데이터를 받아오는 중인지
  const [data, setData] = useState(null); // 데이터를 받아올 공간
  // 에러를 받아오는 공간은 생략

  useEffect(() => {
    fetch(url) // 정해준 url 대신, 인자를 받아올 url로 요청 보내기
      .then((res) => res.json())
      .then((res) => {
        setData(res); // data는 setData로 보내주기
        setIsLoading(false); // 응답을 받았다면 Loading 은 False
      });
  }, [url]); // url에 따라 요청을 보내는 거니까
  return [isLoading, data];
};

const Advice = () => {
  const [isLoading, data] = useFetch('https://korean-advice-open-api.vercel.app/api/advice');
  /* // useState 대신 useFeatch 쓰고 useEffect가 필요 없어짐
   const [data, setData] = useState(null);
  useEffect(() => {
    fetch('https://korean-advice-open-api.vercel.app/api/advice')
      .then((res) => res.json())
      .then((res) => setData(res));
  }, []); */
  return (
    <>
      {!isLoading && (
        <>
          <div>{data.message}</div>
          <div>- {data.author}</div>
        </>
      )}
    </>
  );
};

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

const Timer = () => {
  const [startTime, setStartTime] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const [time, setTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isOn && time > 0) {
      const timerId = setInterval(() => {
        setTime((prev) => prev - 1);
        // setStartTime((prev) => prev - 1);
      }, 1000);
      timerRef.current = timerId;
    } else if (!isOn || time == 0) {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isOn, time]);

  return (
    <div>
      <div>
        {time ? formatTime(time) : formatTime(startTime)}
        <button
          onClick={() => {
            setIsOn(true);
            setTime(time ? time : startTime);
            setStartTime(0);
          }}
        >
          시작
        </button>
        <button onClick={() => setIsOn(false)}>멈춤</button>
        <button
          onClick={() => {
            setTime(0);
            setIsOn(false);
            setStartTime(0);
          }}
        >
          리셋
        </button>
      </div>
      <input
        type="range"
        value={time === 0 ? startTime : time}
        min="0"
        max="3600"
        step="30"
        onChange={(event) => setStartTime(event.target.value)}
      />
    </div>
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
          <Todo key={el.id} todo={el} setTodo={setTodo} />
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
