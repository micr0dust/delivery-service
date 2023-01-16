const config = require('../config/development_config');
const NodeGeocoder = require('node-geocoder');

const options = {
    provider: 'google',
    apiKey: config.googleMap.key, // for Mapquest, OpenCage, Google Premier
    formatter: null // 'gpx', 'string', ...
};

const geocoder = NodeGeocoder(options);

module.exports = async(address) => {
    return await geocoder.geocode({
        address: address,
        country: 'TW'
    });
}