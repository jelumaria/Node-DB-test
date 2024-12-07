require('dotenv').config()
const express = require('express')
const cors = require('cors')
const router = require('./routes/router')


const ndServer = express()
ndServer.use(cors())
ndServer.use(express.json())
ndServer.use(router)

const PORT = 3000 || process.env.PORT
ndServer.listen(PORT,()=>{
    console.log(`Node Db Test server Started at port : ${PORT} and waiting for client request!!!`);
})

// http://localhost:3000/

ndServer.get('/',(req,res)=>{
    res.status(200).send(`<h1 style = "color:red">Node Db Test server Started  and waiting for client request</h1>`)

})



