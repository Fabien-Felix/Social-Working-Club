const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
};

module.exports.userInfo = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    const docs = await UserModel.findById(req.params.id).select('-password');
    res.send(docs);
};

module.exports.updateUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);
    
    try {
        const docs = await UserModel.findOneAndUpdate(
            {_id: req.params.id},
            {
            $set: {
                bio: req.body.bio
            }
            },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        return res.send(docs);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        await UserModel.deleteOne({ _id: req.params.id }).exec();
        res.status(200).json({ message: "Succesfully deleted."});
       
    } catch (err) {
        return res.status(500).json({ message: err });
    }
};

//==== Follow ====//

module.exports.follow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow))
        return res.status(400).send('ID unknown : ' + req.params.id)
    
    try {
        // add to the follower list
        const follower = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow }},
            { new: true, upsert: true }
        ).exec();
        if (!follower) {
            return res.status(400).json({ message: 'Error updating follower list' });
        }
        res.status(201).json(follower);

        // add to following list
        const following = await UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers: req.params.id }},
            { new: true, upsert: true }
        ).exec();
        if (!following) {
            return res.status(400).json({ message: 'Error updating following list' });
        }
        res.status(201).json(following);
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

//==== Unfollow ====//

module.exports.unfollow = async (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow))
        return res.status(400).send('ID unknown : ' + req.params.id)
    
    try {
        const follower = await UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnfollow }},
            { new: true, upsert: true }
        ).exec();
        if (!follower) {
            return res.status(400).json({ message: 'Error updating follower list' });
        }
        res.status(201).json(follower);

        // add to following list
        const following = await UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            { $pull: { followers: req.params.id }},
            { new: true, upsert: true }
        ).exec();
        if (!following) {
            return res.status(400).json({ message: 'Error updating following list' });
        }
        res.status(201).json(following);

    } catch (err) {
        return res.status(500).json({ message: err });
    }
}