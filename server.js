const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const cors = require("cors");

const db = require("knex")({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "yamna",
    password: process.env.USER.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
});

db.select('*').from("users").then(data => {console.log(data)});

database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
    },
    {
      id: "124",
      name: "Sally",
      email: "sally@gmail.com",
      password: "bananas",
      entries: 0,
    },
  ],
};

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send(database.users);
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;

  db.select("email", "hash")
    .from("login")
    .where('email', '=', req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
      if (!isValid) {
        db.select("*").from("users")
        .where("email", "=", email)
        .then(user => {
          res.json(user[0]);
        })
        .catch(err => res.status(400).json("unable to get user"));
      }
    })
      .catch(err => res.status(400).json("wrong credentials"));
    ;
});


app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
    db('users').insert({
      email: email,
      name: name,
      joined: new Date()
    }).then(user => {console.log(user)});
  res.json(user);
      
  });
  
  app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    let found = false;
    db.select("*").from("users").then(user => {
      console.log(user);
    });
      if(!found) {
        res.status(400).json("not found");
      }
    }
   );

app.put("/image", (req, res) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    res.json(entries[0]);
  })
  .catch(err => res.status(400).json('unable to get entries'));
  
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
