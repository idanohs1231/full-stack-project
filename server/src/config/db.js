const mongoose = require("mongoose");


const MONGO_URI =
    process.env.NODE_ENV === "production"
        ? process.env.MONGO_ATLAS_URI
        : process.env.MONGO_URI;

const connectDB = async () => {
    try {
        console.log(`🔗 Connecting to MongoDB with URI: ${MONGO_URI}`);
        const conn = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;
