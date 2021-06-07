const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Message = require('../modals/Message');

router.post('/getMessage', async (req, res) => {
    const { sender, reciver } = req.body;
    jwt.verify(req.headers.token, 'doodleCloudKey', async (err, authData) => {
        if (err) {
            res.send({ success: false, message: 'Session out please login' });
        } else {
            await Message.find({ room: { $in: [`${sender}-${reciver}`, `${reciver}-${sender}`] }, active: true },
                (err, response) => {
                    if (response) {
                        return res.send(
                            {
                                message: 'Successfully get the message.',
                                success: true,
                                data: response
                            }
                        );
                    } else {
                        return res.send(
                            {
                                message: 'No message found',
                                success: false
                            }
                        );
                    }
                }

            );
        }
    })
});

router.get('/retriveMsg', async (req, res) => {
    jwt.verify(req.headers.token, 'doodleCloudKey', async (err, authData) => {
        if (err) {
            res.send({ success: false, message: 'Session out please login' });
        }
        else {
            await Message.updateMany({}, { $set: { active: true } },
                (err, response) => {
                    if (response) {
                        return res.send(
                            {
                                message: 'Successfully retrived the message.',
                                success: true,
                                data: response
                            }
                        );
                    } else {
                        return res.send(
                            {
                                message: "message can't be retrived.",
                                success: false
                            }
                        );
                    }
                }
            );
        }
    })
});

module.exports = router;
