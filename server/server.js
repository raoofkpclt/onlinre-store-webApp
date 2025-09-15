import express from 'express'
const app=express()
import dotenv from 'dotenv'
dotenv.config()
import connectDB from './src/config/connectDB/db.js'
connectDB()
import cors from 'cors'


app.use(cors())



const port=process.env.PORT
app.listen(port,()=>{
    console.log(`Server running on http://localhost:${port}`)
})