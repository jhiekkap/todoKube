
const express = require("express");
const http = require("http");
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const { Client } = require('pg')

const port = process.env.PORT || 3001;
const app = express();
app.use(cors());
app.use(express.static('public'))
app.use(express.json());

let dbStatus = 'DB error';

const server = http.createServer(app);

const client = new Client(
    {
        user: 'postgres',
        password: 'secretpassword',
        host: process.env.NODE_ENV === 'production' ? 'postgres-svc' : 'localhost',
    }
);
client.connect().catch((err) => console.log('Connect to DB error', err));

const queryDb = (query, values) => client
    .query(query, values)
    .then(res => res.rows)
    .catch(e => console.error('DB query error', e.stack));

const initDB = async () => {
    client.query('SELECT $1::text as message', ['DB Working'], (err, res) => {
        console.log(err ? err.stack : res.rows[0].message);
        if (!err) {
            dbStatus = res.rows[0].message;
            console.log('DB init successfull');
        } else {
            console.log('DB init error', err);
        }
        //client.end();
    });

    client.query('CREATE TABLE IF NOT EXISTS todos (todo varchar(255));', (err, res) => {
        if (err) {
            console.log('Error creating table todos', err);
        } else {
            console.log('TABLE todos ok');
        };
        // client.end();
    });
    // await queryDb('INSERT INTO todos (todo) VALUES ($1);', ['TODO 1']);
    // await queryDb('INSERT INTO todos (todo) VALUES ($1);', ['TODO 2']);
}

// const directory = path.join('/', 'mydir', 'public', 'images')
// const filePath = path.join(directory, 'image.jpg')
const filePath = 'public/images/image.jpg'

const fetchPicOfDay = async () => {
    try {
        const response = await axios.get('https://picsum.photos/1200', { responseType: 'stream' })
        response.data.pipe(fs.createWriteStream(filePath))
    } catch (err) {
        console.log('Fetch pic of day error', err);
    }

}

const getAllTodos = async () => {
    const dbTodos = await queryDb('SELECT * FROM todos');
    return dbTodos.map(({ todo }) => todo);
}
app.get('/', async (_req, res) => {
    res.send('<div>Hellouta</div>')
});

app.get('/todos', async (_req, res) => {
    try {
        const allTodos = await getAllTodos();
        res.send(allTodos);
    } catch (err) {
        console.log('Get todos error', err);
    }
});

app.post('/todos', async (req, res, next) => {
    console.log('POST /todos req.body', req.body);
    const { newTodo } = req.body;
    console.log('NEW TODO', newTodo);
    try {
        if (newTodo.length > 140) {
            throw new Error('Todo max length 140 char');
        }
        await queryDb('INSERT INTO todos (todo) VALUES ($1);', [newTodo]);
        res.send(await getAllTodos());
    } catch (err) {
        console.log('Save todos error', err);
        next(err);
    }
});

const init = async () => {
    await fetchPicOfDay();

    const timer = setInterval(async () => {
        await fetchPicOfDay();
    }, 24 * 60 * 60 * 1000);

    server.listen(port, () => console.log(`Server started in port ${port}`));
}

initDB();

init();


