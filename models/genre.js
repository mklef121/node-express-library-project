var mongoose = require('mongoose');

const { Schema, model } = mongoose;
var GenSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100,
    }
})


// Virtual for author's URL
GenSchema
    .virtual('url')
    .get(function() {
        return '/catalog/genre/' + this._id;
    });

//Export model
module.exports = model('Genre', GenSchema);