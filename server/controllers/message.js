const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Message = require('../modals/Message');

router.post('/getMessage', async (req, res) => {
    const { sender, reciver } = req.body;
    jwt.verify(req.headers.token, 'doodleCloudKey', async (err, authData) => {
        if (err) {
            res.send({ success: false, message: 'Session Out Please Login' });
        } else {
            await Message.find({ room: { $in: [`${sender}-${reciver}`, `${reciver}-${sender}`] } },
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
