const axios = require('axios');
const express = require('express');

// Create the server
const app = express();

// Configurations
app.set('view engine', 'pug');

const pages = {
    'single-column-with-nav': 'home'
};

// Routes
app.get('/', async (req, res) => {
    
    const content = await axios.get('http://layout.service');
    const { title, layout, slots } = content.data.page;

    res.render(pages[layout], { title, slots });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.info(`server is up and running on port: ${port}`);
});

