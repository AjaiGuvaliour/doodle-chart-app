const express = require('express');
const router = express.Router();
const User = require('../modals/Authentiaction');

router.post('/save', async (req, res) => {
    const {firstName, lastName} = req.body;
    let userModel = new User({
        firstName,
        lastName
    })
    await userModel.save();
    res.send("successfully updated");
})

module.exports = router;
