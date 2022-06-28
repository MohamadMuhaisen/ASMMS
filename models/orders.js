var mongoose = require('mongoose'),
    services = require("./services");
const middlewareObj = require('../middlewares');
const service = services.schema;

var ordersSchema = new mongoose.Schema({
    user: { type: String, required: true },
    category: { type: String, required: true },
    service: { type: service, required: true },
    quantity: { type: Number, required: true },
    link: { type: String, required: true },
    cost: { type: Number, required: true },
    status: { type: String, required: true },
    created: { type: Date, default: Date.now },
    token: { type: String, required: true},
});

module.exports = mongoose.model("order", ordersSchema);