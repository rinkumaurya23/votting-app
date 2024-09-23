const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

// define the User schema

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,

    },
    age: {
        type: Number,
        required: true,
    },
    email: {
        type: String,

    },
    mobile: {
        type: String
    },
    address: {
        type: String,
        required: true,

    },
    aadharCardNumber: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter',
    },
    isVoted: {
        type: Boolean,
        default: false
    }

}, { timestamps: true });

userSchema.pre('save', async function (next) {
    const user = this;

    // Hash the password only if it has been modified (or is new)
    if (!user.isModified('password')) return next();


    try {
        // hash password generate
        const salt = await bcrypt.genSalt(10);

        //  hash password 

        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
        next(); // calback function 
    } catch (err) {
        console.log("ERROR", err)
        return next(err)

    }
})
userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        // user bcrypt to compare the provide password with the hashed password
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;

    } catch (err) {
        console.log(err)

    }
}
const User = mongoose.model('User', userSchema);

module.exports = User;