const axios = require('axios');
const express = require('express');

const app = express();

app.get('/', async (req, res) => {
    const layoutContent = await axios.get('http://layout.service');

    res.send(`
        This is the page service!

        I pulled the following content fror the layout

        ${JSON.stringify(layoutContent.data, null, 2)}
    `);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.info(`server is up and running on port: ${port}`);
});

