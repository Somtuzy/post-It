const jwt = require('jsonwebtoken') 
require('dotenv').config()

// Getting the secret key and token duration from the .env file
const secretKey = process.env.JWT_SECRET_KEY
const duration = process.env.JWT_EXPIRES_IN

// Generates a token by signing a user's unique details against a secret key whenever they sign in.
const generateToken = (payload) => {
    return jwt.sign(payload, secretKey, {expiresIn: duration})  
}



module.exports = generateToken