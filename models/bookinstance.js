/*
The BookInstance represents a specific copy of a book that someone might borrow 
and includes information about whether the copy is available, on what date it is 
expected back, and "imprint" (or version) details.
*/

var mongoose = require('mongoose');
const { DateTime } = require("luxon");

const { Schema, model } = mongoose;

var BookInstanceSchema = new Schema({
    book: {
        type: Schema.Types.ObjectId,
        ref: 'Book',
        required: true
    }, //reference to the associated book
    imprint: { type: String, required: true },
    status: {
        type: String,
        required: true,
        enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'],
        default: 'Maintenance'
    },
    due_back: { type: Date, default: Date.now }
});


// Virtual for bookinstance's URL
BookInstanceSchema
    .virtual('url')
    .get(function() {
        return '/catalog/bookinstance/' + this._id;
    });


BookInstanceSchema
    .virtual('due_back_formatted')
    .get(function() {
        return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
    });
//Export model
module.exports = model('BookInstance', BookInstanceSchema);


