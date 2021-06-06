const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Message = require('../modals/Message');

router.post('/saveChat', async (req, res) => {
    const chatData = req.body.chatData;
    jwt.verify(req.headers.token, 'doodleCloudKey', async (err, authData) => {
        if (err) {
            res.send({ success: false, message: 'Session Out Please Login' });
        } else {
            let msgModel = new Message(chatData);
            await msgModel.save(
                (err) => {
                    if (err) {
                        return res.send(
                            {
                                message: '',
                                success: false
                            }
                        )
                    } else {
                        return res.send(
                            {
                                message: 'Message Saved',
                                success: true
                            }
                        )
                    }
                }
            );
        }
    })
});

router.post('/getMessage', async (req, res) => {
    const rooms  = req.body.rooms;
    jwt.verify(req.headers.token, 'doodleCloudKey', async (err, authData) => {
        if (err) {
            res.send({ success: false, message: 'Session Out Please Login' });
        } else {
            await Message.find({ room: {$in: rooms} },
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
                                message: 'No Message Found',
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
