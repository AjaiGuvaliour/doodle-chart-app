const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../modals/Authentiaction');

router.get('/userlist/:id', async (req, res) => {
    const id = req.params.id;
    jwt.verify(req.headers.token, 'doodleCloudKey', async (err, authData) => {
        if (err) {
            res.send({ success: false, message: 'Session Out Please Login' });
        } else {
            await User.find({ _id: { $ne: id } },
                {
                    password: false,
                }
                , (err, response) => {
                    if (response) {
                        return res.send(
                            {
                                message: 'Successfully get the user list.',
                                success: true,
                                data: response
                            }
                        );
                    } else {
                        return res.send(
                            {
                                message: 'No user Found',
                                success: false
                            }
                        );
                    }
                });
        }
    })
});

module.exports = router;
