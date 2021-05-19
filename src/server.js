const axios = require('axios');
const express = require('express');
const path = require('path');

const { identifiers, layouts } = require('./pages');

// Create the server
const app = express();

// Configurations
app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

// Routes
app.get('/', async (req, res) => {
    
    const pageId = identifiers['/'];
    const content = await axios.post('http://layout.service', { pageId });
    const { title, layout, slots } = content.data.page;

    res.render(layouts[layout], { title, slots });
});

app.get('/ping', (req, res) => {
    res.send('OK');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.info(`server is up and running on port: ${port}`);
});

