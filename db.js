const mongoose = require('mongoose')
require('dotenv').config();

const mongoURL = process.env.MONGODB_URL_LOCAL;
// const mongoURL = process.env.MONOGODB_URL;


mongoose.connect(mongoURL, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
})
const db = mongoose.connection;
db.on("connected", () => {
    console.log(`Connected to MongoDB Server`);
})
db.on("error", () => {
    console.log(`MongoDb  Connection Error`);
})
db.on("disConnected", () => {
    console.log(`MongoDB disconnected`)
});
module.exports = db;