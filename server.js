let express = require("express");
let cors = require("cors");
var session = require("express-session");
let app = express();

const sequelize = require("./config/db.config");
var corsOptions = {
  origin: "https://ticket.seinksansdoozebank.engineer",
  // origin: "http://localhost:4200",
  credentials: true,
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(
  express.urlencoded({
    extended: true,
  })
);

//! Session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: true,
    },
    expires: new Date() + 60000,
  })
);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome on bde api",
  });
  res.end();
});

// set port, listen for requests
const PORT = process.env.PORT || 8081;

sequelize
  //.sync({force : true})
  .sync()
  .then(() => {
    app.listen(PORT);
    //pending set timezone
    console.log("App listening on port " + PORT);
  })
  .catch((err) => {
    console.log(err);
  });

require("./routes/auth.routes")(app);
require("./routes/event.routes")(app);
