const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://marcomigliavaccadev:${password}@fullstackopenp3.rhuvl.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=FullStackOpenP3`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
});

if (process.argv.length < 3) {
  console.log("give password as argument");
  process.exit(1);
} else if (process.argv.length === 3) {
  console.log("phonebook:");
  Person.find({}).then((result) => {
    result.forEach((person) => {
      console.log(person.name + " " + person.number);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log("provide password, name and number");
  process.exit(1);
}
