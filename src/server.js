const axios = require('axios');
const bodyParser = require('body-parser');
const express = require('express');
const morgan = require('morgan');
const path = require('path');

const { traceAsync } = require('@jahiduls/lib-tracing');

const contentService = require('./clients/content-service-client');
const layoutService = require('./clients/layout-service-client');
const widgetService = require('./clients/widget-service-client');

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

        const layoutResponse = await layoutService.tracedGet(pageId);
        const { title, layout, slots } = layoutResponse.data.page;

        const tracedAll = traceAsync(async (promises) => Promise.all(promises), 'get-all-metadata');

        const slotsPromises = slots.map((slot) => {
            return contentService.tracedGetWidgets(pageId, slot.id)
                .then(({ data: { widget: widgetId } }) => widgetService.tracedGet(widgetId))
                .then(({ data: { widget }}) => {
                    widget = widget || {};
                    widget.id = widget.id || 'unknown';
                    slot.widget = widget;

                    return slot;
                })
                .catch((err) => console.error(err.message));
        });

        const enrichedSlots = await tracedAll(slotsPromises);
        const modulesResp = await contentService.tracedGetModules(pageId);
        const { modules } = modulesResp.data;

        console.log(modules);

        const response = {
            title,
            layout,
            slots: enrichedSlots,
            modules
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
