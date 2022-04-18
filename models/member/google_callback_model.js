const client = require('../connection_db');
const config = require('../../config/development_config');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

var ObjectId = require('mongodb').ObjectId;

module.exports = async function getUser(id) {
    await client.connect();
    const db = client.db(config.mongo.database);
    const collection = db.collection(config.mongo.member);

    try {
        try {
            let code = req.query.code;
            let token_option = {
                url: "https://www.googleapis.com/oauth2/v4/token",
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                form: {
                    code: code,
                    client_id: google_client_id,
                    client_secret: google_secret_id,
                    grant_type: "authorization_code",
                    redirect_uri: "http://localhost:3000/google/callback"
                }
            };
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: config.mail.id
            });
            const payload = ticket.getPayload();
            const userid = payload['sub'];
            return result;
        } catch (err) {
            throw err;
        }
    } catch (err) {
        throw err;
    } finally {
        client.close();
    }
}