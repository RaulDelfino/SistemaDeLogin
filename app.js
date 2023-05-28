require('dotenv').config()

const express = require('express')
const app = express()
const userRouter = require('./routes/userRouter')
const mongoose = require('mongoose')
const adminRouter = require('./routes/adminRouter')


mongoose.connect(process.env.MONGO_CONECTION_URL)
.then(
    console.log('mongodb connected')
).catch(err => {
    console.log(err)
})


app.use('/user', express.json() , userRouter)

app.use("/admin",express.json(),adminRouter)

app.listen(process.env.PORT ,  () => console.log('listening on port ' + process.env.PORT))