const bcrypt = require('bcrypt');
require('dotenv').config()
const rounds = parseFloat(process.env.ROUNDS)

const hashPassword = async (passwordInput) => {
    return await bcrypt.hash(passwordInput, rounds)
}


module.exports = hashPassword;