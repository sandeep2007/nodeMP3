require('dotenv/config')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(cors())
app.use(bodyParser.json())

const audioRoutes = require('./app/audio')
app.use('/audio', audioRoutes)

//ROUTES
app.get('/', (req, res) => {
    res.send('Welcome to POSVAT services')
})

app.listen(80)
