const postModel = require('../models/post.model');
const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const { uploadErrors } = require('../utils/errors.utils');
const ObjectID = require('mongoose').Types.ObjectId;
const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);

// readPost
module.exports.readPost = async (req, res) => {
    try {
        const docs = await PostModel.find().sort({ createdAt: -1 });;
        res.send(docs);
    } catch (err) {
        console.log('Error to get data : ' + err);
    }
};

// createPost
module.exports.createPost = async (req, res) => {
    let fileName;

    if (req.file !== null ) {
        try {
            if (req.file.detectedMimeType !== "image/jpg" && 
                req.file.detectedMimeType !== "image/png" && 
                req.file.detectedMimeType !== "image/jpeg"
            )
                throw Error("invalid file");
            
            if (req.file.size > 500000) throw Error("max size");
        } catch (err) {
            const errors = uploadErrors(err)
            return res.status(201).json({ errors })
        }
    
        fileName = req.body.posterId + Date.now() + '.jpg';

        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../client/public/uploads/posts/${fileName}`
            )
        );
    }

    const newPost = new postModel({
        posterId: req.body.posterId,
        message: req.body.message,
        picture: req.file !== null ? "./uploads/posts" + fileName : "",
        video: req.body.video,
        likers: [],
        comments: [],
    });

    try {
        const post = await newPost.save();
        return res.status(201).json(post);
    } catch (err) {
        return res.status(400).send(err);
    }
};

// updatePost
module.exports.updatePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    const updatedRecord = {
        message: req.body.message
    }

    try {
        const docs = await PostModel.findByIdAndUpdate(
            req.params.id,
            { $set: updatedRecord },
            { new: true }
        );
        res.send(docs);
    } catch (err) {
        console.log("Update error : " + err);
    }
};

// deletePost
module.exports.deletePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        const docs = await PostModel.findByIdAndRemove(req.params.id);
        res.send(docs);
    } catch (err) {
        console.log("Delete error : " + err);
    }
};

// likePost
module.exports.likePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        const updatedPost = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likers: req.body.id },
            },
            { new: true }
        );
        res.send(updatedPost);
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $addToSet: { likes: req.params.id },
            },
            { new: true }
        );
        res.send(updatedUser);
    } catch (err) {
        return res.status(400).send(err);
    }
};

// unlikePost
module.exports.unlikePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        const updatedPost = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likers: req.body.id },
            },
            { new: true }
        );
        res.send(updatedPost);
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $pull: { likes: req.params.id },
            },
            { new: true }
        );
        res.send(updatedUser);
    } catch (err) {
        return res.status(400).send(err);
    }
};

module.exports.commentPost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        const docs = await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime()
                    }
                }
            },
            { new: true }
        );
        return res.send(docs);
    } catch (err) {
        return res.status(400).send(err);
    }
};


module.exports.editCommentPost = (req, res) => {

};


module.exports.deleteCommentPost = (req, res) => {

};