require("dotenv").config();
const Person = require("./models/person");
const express = require("express");
var morgan = require("morgan");
const app = express();
const cors = require("cors");
app.use(express.static("dist"));

app.use(express.json());
app.use(cors());

//

morgan.token("body", function (req, res) {
  if (req.method === "POST") {
    return JSON.stringify(req.body);
  } else {
    return "";
  }
});

app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

app.get("/api/people", (request, response) => {
  Person.find({}).then((people) => {
    response.json(people);
  });
});

app.get("/api/people/:id", (req, res) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/people/:id", (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post("/api/people", async (req, res) => {
  const body = req.body;

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  const existingPerson = await Person.findOne({ name: body.name });

  if (!body.name && !body.number) {
    return res.status(400).json({
      error: "content missing",
    });
  } else if (!body.name) {
    return res.status(400).json({
      error: "name missing",
    });
  } else if (!body.number) {
    return res.status(400).json({
      error: "number missing",
    });
  } else if (existingPerson) {
    return res.status(400).json({ error: "name must be unique" });
  }
  // else if (people.find((person) => person.name === body.name)) {
  //   return res.status(400).json({
  //     error: "name must be unique",
  //   });
  // }

  person.save().then((savedPerson) => {
    res.json(savedPerson);
  });
});

app.get("/info", (req, res) => {
  const date = new Date();
  res.send(
    `
    <p>Phonebook has info for ${people.length} people</p>
    <p>${date}</p>
    `
  );
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("server running");
});
