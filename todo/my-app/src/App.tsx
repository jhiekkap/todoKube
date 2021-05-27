import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

console.log('Ympäristö on', process.env.NODE_ENV);

const endpoint = process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'http://34.117.227.60';

function App() {
  const [newTodo, setNewTodo] = useState<string>('');
  const [todos, setTodos] = useState<string[]>([]);

  useEffect(() => {
    axios.get(endpoint + '/todos')
      .then((dbTodos: any) => setTodos(dbTodos.data))
      .catch((err) => console.log(err));
  }, [])

  const handleSubmit = async () => {
    console.log('Saving new todo: ', newTodo);
    try {
      const response = await axios.post(endpoint + '/todos', { newTodo });
      setTodos(response.data);
      setNewTodo('');
    } catch (err) {
      console.log('Save todo error: ', err);
    }

  };

  return (
    <div className="App">
      <img src={endpoint + '/images/image.jpg'} alt="pic of day" style={{ width: '50%', height: '50%' }} />
      <form onSubmit={(e) => {
        console.log('HELLOUTA')
        e.preventDefault();
        handleSubmit()
      }}>
        <span>
          <input
            value={newTodo}
            onChange={({ target }) => setNewTodo(target.value)}
            type='text'
            maxLength={140}
          />
          <button
            type="submit"
            disabled={newTodo === ''}>
            PUSH ME HARD
            </button>
        </span>
      </form>
      <ul>
        {todos.map((todo, i) => <li key={i}>{todo}</li>)}
      </ul>
    </div>
  );
}

export default App;
