process.on('uncaughtException',(err)=>{
    console.log('erro',err);
})

import express from 'express'
import dotenv from 'dotenv'
import morgan from 'morgan'
import { dbconnection } from './databases/dbconnection.js'
import { init } from './src/index.routes.js'
dotenv.config()
import cors from 'cors'
const app = express()
const port = 3000




//middleware
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.static('uploads'))
init(app)
dbconnection()
app.listen(process.env.PORT || port, () => console.log(`Example app listening on port ${port}!`))
process.on('unhandledRejection',(err)=>{
console.log('errrrrrr',err)
})





