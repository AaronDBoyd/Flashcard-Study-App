const mongoose = require('mongoose')

const Schema = mongoose.Schema

const categorySchema = new Schema({
    title: {
        type: String,
        required: true
    },
    created_by: {
        type: String,
        required: true
    },
    private: {
        type: Boolean,
        required: true,
        default: false
    },
    color: {
        type: String
    }
}, { timestamps: true })

module.exports = mongoose.model('Category', categorySchema)