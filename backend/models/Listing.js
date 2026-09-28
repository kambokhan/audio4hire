const mongoose = require('mongoose')

const listingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: 'User'
        },
        title: {
            type: String,
            require: true
        },
        description: {
            type: String,
            require: true
        },
        images: [{
            type: String,
            require: true
        }],

        price: {
            type: String,
            require: true
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    },
    {
        timestamps: true
    }
)
module.exports = mongoose.model('Listing', listingSchema)