const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/user")
const taskRouter = require("./routers/task")


const app = express()
const Port = process.env.PORT || 3000;

app.use((req,res,next) => {
    res.send("site is under maintanance, check back later BITCH")
})

app.use(express.json())
app.use(userRouter);
app.use(taskRouter);


app.listen(Port, () =>{
    console.log("app is up on port: " + Port);
}) 