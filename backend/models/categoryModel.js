const mongoose = require('mongoose')

const Schema = mongoose.Schema

const categorySchema = new Schema({
    title: {
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
    },
    created_by_id: {
        type: String,
        required: true
    },
    created_by_email: {
        type: String
    },
    card_count: {
        type: Number,
        default: 0
    }
}, { timestamps: true })

module.exports = mongoose.model('Category', categorySchema)