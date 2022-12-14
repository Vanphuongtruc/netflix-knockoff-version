const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userModel = require('../models/User');

const updateUserAdmin = async(req, res) => {
    if (req.user.isAdmin) {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(req.body.password, salt);
            return req.body.password = hashPassword;
        }

        try {
            const updatedUser = await userModel.User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            return res.status(200).json(updatedUser);
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can not customer account!");
    }
};

const deleteUser = async(req, res) => {
    if (req.user._id === req.params.id || req.user.isAdmin) {
        try {
            await userModel.User.findByIdAndUpdate(req.params.id, { isDestroy: true });
            return res.status(200).json("User deleted");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You can delete only your account!");
    }
};

const findUser = async(req, res) => {
    try {
        const user = await userModel.User.findById(req.params.id);
        const { password, ...info } = user._doc;
        return res.status(200).json(info);
    } catch (err) {
        return res.status(500).json(err);
    }
};

const findAllUser = async(req, res) => {
    const query = req.query.new;
    if (req.user.isAdmin) {
        try {
            const users = query ?
                await userModel.User.find().sort({ _id: -1 }).limit(5) :
                await userModel.User.find();
            res.status(200).json(users);
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You are not alow to see all users!");
    }
};

const findNewTransaction = async(req, res) => {
    if (req.user.isAdmin) {
        try {
            const users = await userModel.User.find().sort({ updatedAt: -1 }).limit(6);
            res.status(200).json(users);
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You are not alow to see all users!");
    }
};

const findUserStats = async(req, res) => {
    const today = new Date();
    const lastYear = today.setFullYear(today.getFullYear() - 1);
    try {
        const data = await userModel.User.aggregate([{
                $project: {
                    month: { $month: '$createdAt' },
                }
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: 1 }
                }
            }
        ]);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json(error);
    }
}

const getAllUser = async(req, res) => {
    if (req.user.isAdmin) {
        try {
            const users = await userModel.User.find();
            res.status(200).json(users);
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You are not alow to see all users!");
    }
}

const removeUser = async(req, res) => {
    if (req.user.isAdmin) {
        try {
            await userModel.User.findByIdAndUpdate(req.params.id, { isDestroy: true });
            return res.status(200).json("User removed");
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("You are not alow to delete user!");
    }
}

const updateUser = async(req, res) => {
    try {
        const accessToken = req.body.accessToken;
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        const user = await userModel.User.findById(req.params.id);
        if (decoded._id === user._id.toString()) {
            const updatedUser = await userModel.User.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
            const { password, ...info } = updatedUser._doc;
            return res.status(200).json({...info, accessToken });
        } else {
            return res.status(403).json("You can update only your account!");
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json(err);
    }
}

module.exports = {
    updateUser,
    deleteUser,
    findUser,
    findAllUser,
    findNewTransaction,
    findUserStats,
    getAllUser,
    removeUser,
    updateUserAdmin
}