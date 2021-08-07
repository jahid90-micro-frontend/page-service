const axios = require('axios');

const { traceAsync } = require('@jahiduls/lib-tracing');

const uris = require('../config/uris');

const fetchSlotContent = (pageId, slotId) => {
    return axios.post(`http://${uris.CONTENT_SERVICE_URI}`, { pageId, slotId });
};

module.exports = {
    get: fetchSlotContent,
    tracedGet: traceAsync(fetchSlotContent, 'content-service--slot-content--get')
};
