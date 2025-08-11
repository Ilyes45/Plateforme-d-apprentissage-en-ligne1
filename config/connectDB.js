
//1- require mongoose
const mongoose = require('mongoose');
//2- creation databsae

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
            
        console.log('database connected...')
    } catch (error) {
        console.log("can't connect to database!!!",error)
    }
}

//3- export 
module.exports = connectDB 