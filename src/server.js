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

    // Extract the page identifier
    const pageId = identifiers['/'];

    // Get the layout of the page
    const content = await axios.post('http://layout.service', { pageId });
    const { title, layout, slots } = content.data.page;

    await Promise.all(slots.map(async (slot) => {

        const cResp = await axios.post('http://content.service', { pageId, slotId: slot.id });
        const { widget: widgetId } = cResp.data;

        const wResp = await axios.post('http://widget.service', { widgetId });
        let { widget } = wResp.data;
        widget = widget || {};
        widget.id = widget.id || widgetId;
        slot.widget = widget;
    }));

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
