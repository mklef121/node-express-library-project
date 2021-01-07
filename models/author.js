var mongoose = require('mongoose');
const { DateTime } = require("luxon");

const { Schema, model } = mongoose;

var AuthorSchema = new Schema({
    fullname: {
        first_name: { type: String, required: true, maxlength: 100 },
        family_name: { type: String, required: true, maxlength: 100 }
    },
    date_of_birth: { type: Date },
    date_of_death: { type: Date },
});


// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return this.fullname.family_name + ', ' + this.fullname.first_name;
});


// Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get(function () {
  return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
});

AuthorSchema
.virtual('dob-format')
.get(function () {
  return this.date_of_birth ? DateTime.fromJSDate(this.date_of_birth).toLocaleString(DateTime.DATE_MED) : '';
});

AuthorSchema
.virtual('dod-format')
.get(function () {
  return this.date_of_death ? DateTime.fromJSDate(this.date_of_death).toLocaleString(DateTime.DATE_MED) : '';
});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});

//Export model
module.exports = model('Author', AuthorSchema);