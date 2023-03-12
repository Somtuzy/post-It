const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

// Connects to the database
const connect = (Uri) => {
    mongoose.connect(Uri, {
    dbName: "post-it",
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Database connection successful!'))
.catch(err => console.log(err,':', err.message))
}

module.exports = connect