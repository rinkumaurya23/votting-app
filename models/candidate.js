const mongoose = require('mongoose')

// define the Candidate schema

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,

    },
    party: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            votedAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    voteCount: {
        type: Number,
        default: 0
    }



}, { timestamps: true });

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = Candidate;