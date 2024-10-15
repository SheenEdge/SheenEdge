const cookieParser = require("cookie-parser");
const express = require("express")
const session = require("express-session");
const app = express();
const cors = require('cors');
const dotenv = require("dotenv").config();
const errorHandler = require("./Middelware/errorHandler")
const connectDb = require('./config/dbConnection');
const MongoStore = require("connect-mongo");
//const passport = require("passport");
const passport = require("./strategies/local-startegy");
const { default: mongoose } = require("mongoose");
const { isAuthenticated } = require("./Middelware/isAuthenticated");
const { isAdmin} = require("./Middelware/isAdmin");

// Connecting to the database 
connectDb();
// Defining port
const port =process.env.PORT || 5000;

// Using middelwares
app.use(express.json());
app.use(errorHandler) 
app.use(cors({
	origin: process.env.BASE_URL,
    	credentials: true,
    	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    	allowedHeaders: ['Content-Type', 'Authorization'],
  }));

app.options('*', cors());
app.set('trust proxy', 1); // Ensures secure cookies are properly set behind a proxy

// Handling cookies and sessions 

app.use(cookieParser("helloworld"));
app.use(
    session({
        secret: process.env.SESSION_SECRET || "Edunex", // Use an environment variable for the secret
        saveUninitialized: false, // Don't create sessions for unauthenticated users
        resave: false,
        cookie: {
            maxAge: 60000 * 60 * 24 * 30, // 30 days
            httpOnly: true, // Prevents JavaScript access to cookies
            secure: true, // Set to true in production
            sameSite: 'None', // Necessary for cross-origin requests
        },
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
        }),
    })
);

// Using passport 
app.use(passport.initialize());
app.use(passport.session());

// Defining the routes
app.use("/api/user" , require('./routes/userRoutes'));
app.use("/api/rodo" , require('./routes/rodoRoute'));
app.use("/api/codes", isAuthenticated ,require('./routes/codeRoutes'))
app.use("/api/post", isAdmin ,require('./routes/postRoutes'))

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
  })
