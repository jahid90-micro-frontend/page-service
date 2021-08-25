const axios = require('axios');

const { traceAsync } = require('@jahiduls/lib-tracing');

const uris = require('../config/uris');

const fetchSlotContent = (pageId, slotId) => {
    return axios.get(`http://${uris.CONTENT_SERVICE_URI}/widgets/${pageId}/${slotId}`);
};

const fetchModules = (pageId) => {
    return axios.get(`http://${uris.CONTENT_SERVICE_URI}/modules/${pageId}`);
};

module.exports = {
    getWidgets: fetchSlotContent,
    tracedGetWidgets: traceAsync(fetchSlotContent, 'content-service--slot-content--get'),
    getModules: fetchModules,
    tracedGetModules: traceAsync(fetchModules, 'content-service--page-modules--get'),
};
