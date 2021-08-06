const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const uris = require('./config/uris');

// Create the server
const app = express();

// Configurations
app.use(morgan('tiny'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.post('/', async (req, res) => {

    try {

        // Extract the page identifier from the request
        const pageId = req.body.pageId;

        const lResp = await axios.post(`http://${uris.LAYOUT_SERVICE_URI}`, { pageId });
        const { title, layout, slots } = lResp.data.page;

        const slotsPromises = slots.map((slot) => {
            return axios.post(`http://${uris.CONTENT_SERVICE_URI}`, { pageId, slotId: slot.id })
                .then(({ data: { widget: widgetId } }) => axios.post(`http://${uris.WIDGET_SERVICE_URI}`, { widgetId }))
                .then(({ data: { widget }}) => {
                    widget = widget || {};
                    widget.id = widget.id || 'unknown';
                    slot.widget = widget;

                    return slot;
                })
                .catch((err) => console.error(err.message));
        });

        const enrichedSlots = await Promise.all(slotsPromises);

        const response = {
            title,
            layout,
            slots: enrichedSlots
        };

        console.debug(`Request: {pageId: ${pageId}}`);
        console.debug(`Response: ${JSON.stringify(response)}`);

        res.json(response);

    } catch(err) {
        
        console.error(err.message);

        res.sendStatus(500);
    }
});

app.get('/ping', (req, res) => {
    res.send('OK');
});

module.exports = app;
