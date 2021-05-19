const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('This is the page service!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.info(`server is up and running on port: ${port}`);
});

