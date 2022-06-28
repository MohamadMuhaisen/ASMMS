var mongoose = require('mongoose'),
    services = require("./services");
const service = services.schema;
// mongoose.connect(process.env.DBCREDINTIALS, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     useFindAndModify: false
// })
//     .then(() => console.log('Connected to DB!'))
//     .catch(error => console.log(error.message));

var categoriesSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    name: { type: String, required: true },
    services: [service]
});

// var category = mongoose.model("category", categoriesSchema);
// var catg = new category({
//     id: 27,
//     name: "Likee"
// });
// catg.save();

module.exports = mongoose.model("category", categoriesSchema);