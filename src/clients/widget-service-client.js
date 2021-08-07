const axios = require('axios');

const { traceAsync } = require('@jahiduls/lib-tracing');

const uris = require('../config/uris');

const fetchWidgetMetadata = (widgetId) => {
    return axios.post(`http://${uris.WIDGET_SERVICE_URI}`, { widgetId });
};

module.exports = {
    get: fetchWidgetMetadata,
    tracedGet: traceAsync(fetchWidgetMetadata, 'widget-service--widget-metadata--get')
};
