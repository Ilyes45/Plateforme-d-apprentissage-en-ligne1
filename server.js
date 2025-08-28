//5- require dotenv
require("dotenv").config();

//1- require express
const express = require("express");

//2- cerate instace 

const app = express();



//6- connect db 
const connectDB = require("./config/connectDB");
connectDB();

//7- creation du root global 
//middleware
app.use(express.json());

 
//middleware routes
app.use("/api/user",require("./routes/user"));
app.use("/api/course",require("./routes/course"));
app.use("/api/lesson",require("./routes/lesson"));
app.use("/api/quiz",require("./routes/quiz"));
app.use("/api/messages", require("./routes/message"));


//3- create port
const port = process.env.PORT

//4- cerate server
app.listen(port,(err)=>{
    err ? console.log(err) : console.log(`server is running on port ${port}..`)
})

