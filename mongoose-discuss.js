const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});


//EVERYTHING IS DEPENDEDNT ON SCHEMAS
const kittySchema = new mongoose.Schema({
    name: String
});

//We can even add methods to our schema that would allow us manipulate data with it.
// methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function() {
    const greeting = this.name ?
        "Meow name is " + this.name :
        "I don't have a name";
    console.log(greeting);
}

// next compile our schema into a model. The Collection in mongoDb will be the same name as the first argument here
// A model is a class with which we construct documents
const Kitten = mongoose.model('Kitten', kittySchema);


// Now we can Create a Document with the Model above

const fluf = new Kitten({ name: 'fluffy' });
console.log(fluf.name); // 'fluffy'

fluffy.speak(); // "Meow name is fluffy"


// To finally save to database, call the save method on the model

fluffy.save(function(err, fluffy) {
    if (err) return console.error(err);
    fluffy.speak();
});


//To search the DB call
//This will return all documents in the 'Kitten' collection
Kitten.find(function(err, kittens) {
    if (err) return console.error(err);
    console.log(kittens);
})


//to perform search with a name query, use

Kitten.find({ name: /^fluff/ }, callback);


///////////////More from MongoDB


//Schemas

// Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.

import mongoose from 'mongoose';
const { Schema } = mongoose;

const blogSchema = new Schema({
    title: String, // String is shorthand for {type: String}
    author: String,
    body: String,
    comments: [{ body: String, date: Date }],
    date: { type: Date, default: Date.now },
    hidden: Boolean,
    meta: {
        votes: Number,
        favs: Number
    }
});

/*
  Permitted Schemas are 
   1) String, 2) Number
   3) Date 4) Buffer
   5) Boolean 6) Mixed
   7) ObjectId 8) Array
   9) Decimal128 //from mongoose.ObjectId
   10) Map
*/


//   Creating a model

// To do so, we pass it into 
mongoose.model(modelName, schema);

// e.g
const Blog = mongoose.model('Blog', blogSchema);


// Auto Generated IDS 

// By default, Mongoose adds an _id property to your schemas.

const Model = mongoose.model('Test', schema);

const doc = new Model();
doc._id instanceof mongoose.Types.ObjectId;


// You can also overwrite Mongoose's default _id with your own _id

const schema = new Schema({ _id: Number });
const Model = mongoose.model('Test', schema);

const doc = new Model();
doc._id = 1;
await doc.save(); // works



//Query Helpers

//You can also add query helper functions, which are like instance methods but for mongoose queries.

blogSchema.query.byName = function(title) {
    return this.where({ title: new RegExp(title, 'i') })
};

const Animal = mongoose.model('Animal', animalSchema);

Animal.find().byName('fido').exec((err, animals) => {
    console.log(animals);
});


// Virtual properties

// Virtual properties are document properties that you can get and set but that do not get persisted to MongoDB.

const userSchema = mongoose.Schema({
    email: String
});
// Create a virtual property `domain` that's computed from `email`.
userSchema.virtual('domain').get(function() {
    return this.email.slice(this.email.indexOf('@') + 1);
});
const User = mongoose.model('User', userSchema);

let doc = await User.create({ email: 'test@gmail.com' });
// `domain` is now a property on User documents.
doc.domain;

//Setting and getting virtuals
personSchema.virtual('fullName').
  get(function() {
    return this.name.first + ' ' + this.name.last;
   }).
  set(function(v) {
    this.name.first = v.substr(0, v.indexOf(' '));
    this.name.last = v.substr(v.indexOf(' ') + 1);
  });

axl.fullName = 'William Rose'; 



//Connections

// You can connect to MongoDB with the mongoose.connect() method.

mongoose.connect('mongodb://localhost:27017/myapp', { useNewUrlParser: true }).then();



// Validation In Mongoose
var breakfastSchema = new Schema({
    eggs: {
        type: Number,
        min: [6, 'Too few eggs'], //minimum number and error throw if this fails
        max: 12,
        required: [true, 'Why no eggs?']
    },
    drink: {
        type: String,
        enum: ['Coffee', 'Tea', 'Water', ] //Creates a validator to make sure the value is in this array
    }
});




// Searching for records

var Athlete = mongoose.model('Athlete', yourSchema);

// find all athletes who play tennis, selecting the 'name' and 'age' fields
Athlete.find({ 'sport': 'Tennis' }, 'name age', function (err, athletes) {
  if (err) return handleError(err);
  // 'athletes' contains the list of athletes that match the criteria.
})


///NOTE: Once the system sees a call back, the query is executed immediately

// find all athletes that play tennis
var query = Athlete.find({ 'sport': 'Tennis' });

// selecting the 'name' and 'age' fields
query.select('name age');

// limit our results to 5 items
query.limit(5);

// sort by age
query.sort({ age: -1 });

// execute the query at a later time
query.exec(function (err, athletes) {
  if (err) return handleError(err);
  // athletes contains an ordered list of 5 athletes who play Tennis
})


Athlete.
  find()
  .where('sport').equals('Tennis')
  .where('age').gt(17).lt(50)  //Additional where query
  .limit(5)
  .sort({ age: -1 })
  .select('name age')
  .exec(callback); // where callback is the name of our callback function.


/*
	find() method gets all matching records,
    findById(): Finds the document with the specified id (every document has a unique id).
    findOne(): Finds a single document that matches the specified criteria.
    findByIdAndRemove(), findByIdAndUpdate(), 
    findOneAndRemove(), 
    findOneAndUpdate(): Finds a single document by id or criteria and either updates or removes it. 
    These are useful convenience functions for updating and removing records.

*/



// Working with related documents — population


/*You can create references from one document/model instance to another 
using the ObjectId schema field, or from one document to many using an array of ObjectIds
*/

var mongoose = require('mongoose'),
    Schema = mongoose.Schema

// Each author can have multiple stories, which we represent as an array of ObjectId
var authorSchema = Schema({
  name    : String,
  stories : [{ type: Schema.Types.ObjectId, ref: 'Story' }]
});

// Each story can have a single author.
var storySchema = Schema({
  author : { type: Schema.Types.ObjectId, ref: 'Author' },
  title    : String
});

// The "ref" above tells the schema which model can be assigned to this field.
var Story  = mongoose.model('Story', storySchema);
var Author = mongoose.model('Author', authorSchema);

//To save and establish this relationship, do the following
var bob = new Author({ name: 'Bob Smith' });

bob.save(function (err) {
  if (err) return handleError(err);

  //Bob now exists, so lets create a story
  var story = new Story({
    title: "Bob goes sledding",
    author: bob._id    // assign the _id from the our author Bob. This ID is created by default!
  });

  story.save(function (err) {
    if (err) return handleError(err);
    // Bob now has his story
  });
});


// To get the Story and it's Author we use the below style

Story
.findOne({ title: 'Bob goes sledding' })
.populate('author') //This populates the author id with actual author information!
.exec(function (err, story) {
  if (err) return handleError(err);
  console.log('The author is %s', story.author.name);
  // prints "The author is Bob Smith"
});



