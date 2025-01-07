const mongoose = require("mongoose");

// Making connection to the database with connection pooling
const connectDb = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI, {
            maxPoolSize: 10, // Set the connection pool size (adjust as per your app's needs)
        });

        console.log(
            `Database connected: Host - ${connect.connection.host}, Name - ${connect.connection.name}`
        );
    } catch (err) {
        console.error("Database connection error:", err.message);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDb;
