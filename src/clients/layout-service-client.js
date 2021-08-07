const axios = require('axios');

const { traceAsync } = require('@jahiduls/lib-tracing');

const uris = require('../config/uris');

const fetchPageLayout = (pageId) => {
    return axios.post(`http://${uris.LAYOUT_SERVICE_URI}`, { pageId });
};

module.exports = {
    get: fetchPageLayout,
    tracedGet: traceAsync(fetchPageLayout, 'layout-service--page-layout--get')
};
