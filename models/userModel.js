const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please provide the username"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"]
    },
    password: {
        type: String,
        required: [true, "Please add the user password"]
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model("User", userSchema)