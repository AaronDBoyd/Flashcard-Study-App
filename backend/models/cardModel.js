const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cardSchema = new Schema({
    question: {
        type: String,
        required: true
    }, 
    answer: {
        type: String,
        required: true
    },
    category_id: {
        type: String,
        required: true
    },
    created_by: {
        type: String,
        required: true
    },
    multiple_choice: {
        type: Boolean,
        required: true,
        default: false
    },
    tags: {
        type: [String]
    }
}, { timestamps: true })

module.exports = mongoose.model('Card', cardSchema)