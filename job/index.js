const axios = require('axios');
const { Client } = require('pg')

const client = new Client(
    {
        user: 'postgres', 
        password: 'secretpassword',
        host: process.env.NODE_ENV === 'production' ? 'postgres-svc' : 'localhost',
    }
);
client.connect().catch((err) => console.log(err));

const queryDb = (query, values) => client
    .query(query, values)
    .then(res => res.rows)
    .catch(e => console.error(e.stack));

const getTodoOfDay = async () => {
    const response = await axios.get('https://en.wikipedia.org/wiki/Special:Random');
    const newTodo = response.request.res.responseUrl;
    console.log('NEW TODO', newTodo);
    await queryDb('INSERT INTO todos (todo) VALUES ($1);', [`Read ${newTodo}`]);
    client.end();
};

getTodoOfDay();
