const mongoose = require('mongoose');
const uri = "mongodb+srv://root:root@cluster0.m7bkp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const connectDB = async () => {
    await mongoose.connect(uri,
        { 
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    );
};

module.exports = connectDB;