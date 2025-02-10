import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.connect(process.env.MONGO)
    .then(() => {
        console.log("MongoDB connected!")
    })
    .catch((err) => {
        console.log("MongoDB error: ", err)
    })
const app = express()


app.listen(3002, () => {
    console.log('Server is running on port 3000!')
})