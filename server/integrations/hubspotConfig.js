const axios = require('axios');
require('dotenv').config();

if (!process.env.HUBSPOT_OAUTH_TOKEN) {
    console.error('HUBSPOT_OAUTH_TOKEN is missing in environment variables');
    process.exit(1);
}

const axiosInstance = axios.create({
    baseURL: 'https://api.hubapi.com',
    headers: {
        'Authorization': `Bearer ${process.env.HUBSPOT_OAUTH_TOKEN}`,
        'Content-Type': 'application/json'
    }
});

// Add logging for debugging
axiosInstance.interceptors.request.use(request => {
    console.log('Making request to HubSpot:', request.url);
    return request;
});

axiosInstance.interceptors.response.use(
    response => {
        console.log('Received response from HubSpot:', response.status);
        return response;
    },
    error => {
        console.error('HubSpot API Error:', {
            url: error.config?.url,
            status: error.response?.status,
            data: error.response?.data
        });
        return Promise.reject(error);
    }
);

module.exports = axiosInstance;
