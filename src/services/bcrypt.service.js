const bcrypt = require('bcrypt');
require('dotenv').config()
const rounds = parseFloat(process.env.ROUNDS) || Math.floor(Math.random() * 5)

const hashPassword = async (passwordInput) => {
    return await bcrypt.hash(passwordInput, rounds)
}
const verifyPassword = async (passwordInput, hashedPassword) => {
    return await bcrypt.compare(passwordInput, hashedPassword)
}

module.exports = { hashPassword, verifyPassword }