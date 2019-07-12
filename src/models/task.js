const mongoose = require("mongoose")

const Task = mongoose.model("Task",{
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        defult: false
    }

})

module.exports = Task