const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const User = require('../modals/Authentiaction');
const validationMsg = require('../helpers/validation-error');

router.post('/login', async (req, res) => {
    let { email, password } = req.body;
    await User.findOne(
        {
            email
        }, async (err, response) => {
            if (response) {
                const decryptPass = await bcrypt.compare(password, response.password);
                if (decryptPass) {
                    jwt.sign({ user: response.userName }, 'doodleCloudKey', { expiresIn: '1d' }, (err, token) => {
                        if (token) {
                            return res.status(200).send(
                                {
                                    message: 'Successfully logged in',
                                    success: true,
                                    data: {
                                        token: `${token}`,
                                        userDetail: { userName: response.userName, email: email, _id: response.id }
                                    }
                                }
                            );
                        }
                    })
                } else {
                    return res.send(
                        {
                            message: 'Password not matched',
                            success: false
                        }
                    );
                }
            }
            else {
                res.send(
                    {
                        message: 'user not found',
                        success: false
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
        async (err) => {
            if (err) {
                const msg = await validationMsg(err['errors']);
                res.send(
                    {
                        message: msg,
                        success: false
                    }
                )
            } else {
                res.send(
                    {
                        message: 'Successfully registered',
                        success: true
                    }
                )
            }
        }
    );
});

module.exports = router;
