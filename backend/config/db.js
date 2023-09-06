// Mongoose
const mongoose = require("mongoose");

mongoose
 .connect("mongodb+srv://" + process.env.DB_USER_PASS + "@projet-wsc.u9rlnfi.mongodb.net/projet-SWC-DB",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
 )
 .then(() => console.log("Connected to MongoDB"))
 .catch((err) => console.log("Failed to connect to MongoDB", err)); 