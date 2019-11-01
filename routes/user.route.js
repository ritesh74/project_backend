const express = require('express');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');
const {User, ValidateUser} = require('../models/user.model');

const route = express.Router();


router.get('/user', auth, async (req, res) => {
 const user = await User.findById(req.user._id).select('-password');
 res.send(user);
})
