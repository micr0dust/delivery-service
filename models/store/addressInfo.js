const config = require('../../config/development_config');
const geocoderAPI = require('../geocoder');

module.exports = async function geocoder(data) {
    try {
        const result = await geocoderAPI(data.address);
        return result;
    } catch (err) {
        throw err;
    }
}