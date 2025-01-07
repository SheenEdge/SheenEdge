const cookieParser = require("cookie-parser");
const express = require("express");
const cors = require('cors');
const dotenv = require("dotenv").config();
const connectDb = require('./config/dbConnection');
const morgan = require("morgan");
const { logger } = require('./utils/logger');
const { isAuthenticated } = require("./Middelware/isAuthenticated");
const { isAdmin } = require("./Middelware/isAdmin");
const morganFormat = ":method :url :status :response-time ms";

const app = express();

// Connecting to the database 
connectDb();

// Defining port
const port = process.env.PORT || 5000;

// Using middlewares
app.use(express.json());
app.use(cookieParser("helloworld"));

app.use(cors({
    origin: process.env.BASE_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());


// Logging middleware
app.use(
  morgan(morganFormat, {
      stream: {
          write: (message) => {
              const logObject = {
                  method: message.split(" ")[0],
                  url: message.split(" ")[1],
                  status: message.split(" ")[2],
                  responseTime: message.split(" ")[3],
              };
              logger.info(JSON.stringify(logObject)); // <-- This line is causing the error
          },
      },
  })
);

// Defining the routes
app.use("/api/user", require('./routes/userRoutes'));
app.use("/api/rodo", require('./routes/rodoRoute'));
app.use("/api/codes",isAuthenticated, require('./routes/codeRoutes'));
//app.use("/api/post", isAdmin, require('./routes/postRoutes'));

// Starting the server
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
