const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const port = 3000;

app.use(cors());
app.use(express.static(path.join(__dirname, '../my-app/build')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../my-app/build'));
});

// app.get('/', (req, res) => {
//     res.send('hello');
// });

app.listen(port, () => {
    console.log(`Server listening on the port::${port}`);
});