const dotenv = require('dotenv').config()
const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

function generateAccessToken(identifier, expiryTime) {
    return jwt.sign(identifier, process.env.TOKEN_SECRET, { expiresIn: expiryTime})
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {

      if (err) return res.status(403).send("Token invalid or expired")

      req.user = user

      next()
    })
}

app.post('/api/generateToken', (req, res) => {

    const token = generateAccessToken({ identifier: req.body.identifier}, '1800s')
    res.json(token);

})

app.get('/api/authenticateToken', authenticateToken, (req, res) => {
    console.log(req.user)
    res.json({
        "authenticated" : true
    })
})


app.listen(3001)
