var mongoose = require('mongoose');

var servicesSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    rate: { type: Number, required: true },
    quality: { type: String, required: true },
    guaranteed: { type: String, required: true },
});

module.exports = {
    schema: mongoose.Schema(servicesSchema),
    model: mongoose.model("service", servicesSchema)
};
// module.exports = mongoose.model("service", servicesSchema);