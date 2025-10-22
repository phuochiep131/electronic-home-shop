
const mongoose = require('mongoose')

async function connect() {
    try {
        const uri = "mongodb+srv://phhiep:phhieppass@cluster0.naxasg9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

        await mongoose.connect(uri)   
        console.log("Connected to DB Successfully!")
    } catch (err) {
        console.log("Connected to DB Failure!")
        console.log(err)
    }
}

module.exports = connect