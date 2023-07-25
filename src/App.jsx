import { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import './App.css';

const socket = io('/');

function App() {
  const [message, setMessage] = useState('');
  const [msgs, setMsgs] = useState([]);
  const chatRef = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();

    const newMessage = {
      body: message,
      from: 'yo'
    }

    setMsgs([...msgs, newMessage]);
    socket.emit('message', message);

    // Limpia el input después de enviar el mensaje
    setMessage('');
  };

  useEffect(() => {
    socket.on('message', receiveMsg);

    return () => {
      socket.off('message', receiveMsg);
    }
  }, [])

  useEffect(() => {
    // Ajustar el scroll al enviar un nuevo mensaje
    chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs]);

  const receiveMsg = (message) => setMsgs((state) => [...state, message]);

  return (
    <div className='h-screen flex items-center justify-center'>
      <form onSubmit={handleSubmit} className='bg-zinc-800 p-10 flex flex-col '>
        <div className='header'>
          <h1 className='text-2xl font-bold my-2'>AppChat</h1>
        </div>
        <div className='chat flex-grow' ref={chatRef}>
          <ul>
            {msgs.map((msg, i) => (
              <li key={i} className={`my-2 p-2 table text-sm rounded-md ${msg.from === 'yo' ? 'bg-zinc-800 ml-auto' : 'bg-zinc-00'}`}>
                <b className='text-xs text-slate-500 block'>:{msg.from}</b> <p>{msg.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <input type="text" placeholder='mensaje...'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className='input'/>
        <button className='boton'>Enviar</button>
      </form>
    </div>
  )
};

export default App;
