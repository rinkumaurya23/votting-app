const express = require('express');
const router = express.Router();
const User = require('../models/user')
const Candidate = require('../models/candidate')
const { jwtAutMiddleware, generateToken } = require('../jwt')

const checkAdminRole = async (userID) => {
    try {
        const user = await User.findById(userID);
        if (user.role === 'admin') {
            return true;

        }


    } catch (err) {
        return false;
    }
}

// post route to add a candidate
router.post('/', jwtAutMiddleware, async (req, res) => {
    try {
        if (! await checkAdminRole(req.user.id))
            return res.status(404).json({ message: "user has not admin role" });

        const data = req.body
        const newcandidate = new Candidate(data);

        const response = await newcandidate.save();
        console.log(`data saved!!`);


        res.status(200).json({ Response: response });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error !!" })
    }
});





router.put('/:candidateID', jwtAutMiddleware, async (req, res) => {
    try {
        if (! await checkAdminRole(req.user.id))
            return res.status(404).json({ message: "user has not admin role" });
        const candidateID = req.params.candidateID;
        const updatedCadidateData = req.body;

        const response = await User.findByIdAndUpdate(candidateID, updatedCadidateData, {
            new: true,
            runValidators: true

        })
        if (!response) {
            return res.status(404).json({ error: "Candidate not found" });
        }
        console.log("candidate updated");
        res.status(200).json(response)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error !!" })
    }
});
router.delete('/:candidateID', jwtAutMiddleware, async (req, res) => {
    try {
        if (!checkAdminRole(req.user.id))
            return res.status(403).json({ message: "user has not admin role" });
        const candidateID = req.params.candidateID;


        const response = await User.findByIdAndDelete(candidateID)
        if (!response) {
            return res.status(404).json({ error: "Candidate not found" });
        }
        console.log("candidate delete");
        res.status(200).json(response)
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Internal Server Error !!" })
    }
});
// let's start voting

router.post('/vote/:candidateID', jwtAutMiddleware, async (req, res) => {
    // no admin can vote
    // user can only vote once

    candidateID = req.params.candidateID;
    userId = req.user.id;
    try {
        //  Find the candidate document with the specified candidateId
        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        if (user.isVoted) {
            res.status(400).json({ message: "You have already voted" })
        }
        if (user.role == 'admin') {
            res.status(403).json({ message: "admin is not allowed " })
        }
        candidate.votes.push({ user: userId })
        candidate.voteCount++;
        await candidate.save();

        // update the user document
        user.isVoted = true
        await user.save();

        res.status(200).json({
            message: "vote recored  successfully"
        })

    } catch (err) {
        console.log("ERROR: ", err)
        res.status(500).json({ error: "Internal Server Error !!" })

    }

});
//  vote count
router.get('/vote/count', async (req, res) => {
    try {
        const candidate = await Candidate.find().sort({ voteCount: 'desc' });

        const voteRecord = candidate.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }
        });
        return res.status(200).json(voteRecord)


    } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Internal server is error " })
    }
})


module.exports = router;