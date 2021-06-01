const express = require('express');
const router = express.Router();
const User = require('../modals/Authentiaction');
const validationMsg = require('../helpers/validation-error');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

router.post('/login', async (req, res) => {
    let { email, password } = req.body;
    User.findOne(
        {
            email
        }, async (err, response) => {
            if (response) {
                const decryptPass = await bcrypt.compare(password, response.password);
                if (decryptPass) {
                    jwt.sign({ user: response.userName }, 'doodleCloudKey', { expiresIn: '1d' }, (err, token) => {
                        if (token) {
                            return res.json(
                                {
                                    message: 'Successfully logged in',
                                    success: true,
                                    data: {
                                        token: `${token}`,
                                        userDetail: { name: response.userName, email: email }
                                    },
                                    status: 200
                                }
                            );
                        }
                    })
                } else {
                    return res.json(
                        {
                            message: 'Password not matched',
                            success: false,
                            status: 400
                        }
                    );
                }
            }
            else {
                res.status(400).send(
                    {
                        message: 'user not found',
                        success: false,
                        status: 400
                    }
                )
            }
        });
});

router.post('/register', async (req, res) => {
    let { email, password, userName } = req.body;
    const salt = await bcrypt.genSalt(saltRounds);
    password = await bcrypt.hash(password, salt);
    let userModel = new User(
        {
            email,
            password,
            userName
        }
    );
    await userModel.save(
        async (err, resp) => {
            if (err) {
                const msg = await validationMsg(err['errors']);
                res.status(400).send(
                    {
                        message: msg,
                        success: false,
                        status: 400
                    }
                )
            } else {
                res.status(200).send(
                    {
                        message: 'Successfully registered',
                        success: true,
                        status: 200
                    }
                )
            }
        }
    );
});

module.exports = router;
