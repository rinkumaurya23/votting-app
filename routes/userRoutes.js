const express = require('express');
const router = express.Router();
const User = require('../models/user')
const {jwtAutMiddleware,generateToken,
} = require('./../jwt')



router.post('/signup', async (req, res) => {
    try {
        const data = req.body
        const newUser = new User(data);

        const response = await newUser.save();
        console.log(`data saved!!`);

        const payload = {
            id: response.id,
            }
        console.log(JSON.stringify(payload));
        const token = generateToken(payload);
        console.log("Token id : ", token)
        res.status(200).json({ Response: response, Token: token });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error !!" })
    }
});
// Login Route
router.post('/login', async (req, res) => {
    try {
        const { aadharCardNumber, password } = req.body;
        const user = await User.findOne({ aadharCardNumber: aadharCardNumber });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ error: 'Invalid user name and  password' });
        }
        //   generate token
        const payload = {
            id: user.id,
            
        }
        const token = generateToken(payload);

        //  resturn token as response 
        res.json({ token })


    } catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
// Profile router
router.get('/profile', jwtAutMiddleware, async (req, res) => {
    try {

        const userData = req.user;

        const userId = userData.id;
        const user = await User.findById(userId);

        res.status(200).json({ user });

    } catch (err) {
        console.log("ERROR : ", err);
        res.status(500).json({ error: "Internal Server Error" });


    }
});



router.put('/profile/password', jwtAutMiddleware,async (req, res) => {
    try {
        const userId = req.user;
        const { currentPassword, newPassword } = req.body
       
        

        const user = await User.findById(userId);

        if (!(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid user name and  password' });
        }
        user.pasword = newPassword;
        await user.save();


        
        console.log('Password Updated');
        res.status(200).json({message:"Passsword Updated"});

    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error !!" })
    }
});



module.exports = router;