const mongoose = require('mongoose');

const unique_validate = (field) => {
    const fieldCapitalized = field.charAt(0).toUpperCase() + field.slice(1).toLowerCase();
    return {
        validator: async (data) => {
            const fieldCount = await mongoose.models.user.countDocuments({ [field]: data });
            return !fieldCount;
        }, message: `${fieldCapitalized} Already exist`
    }
}

const user = new mongoose.Schema({
    userName: {
        type: String,
        validate: [unique_validate('userName')]
    },
    email: {
        type: String,
        validate: [unique_validate('email')]
    },
    password: {
        type: String
    }
});

module.exports = User = mongoose.model('user', user);