const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Post = require('../../models/Post.js');
const Profile = require('../../models/Profile.js');

const validatePostInput = require('../../validation/post');

//@route GET api/posts/test
//@desc Test Post route
//@access Public

router.get('/test', (req, res) => res.json({ msg: "Post Works" }));




//@route GET api/posts
//@desc Get post
//@access Public



router.get('/', (req, res) => {

    Post.find()
        //Sort by date in mangoose

        .sort({ date: -1 })
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ nopostfound: 'No posts found with that ID' }));
});

//@route GET api/posts/:id
//@desc Get post by id
//@access Public



router.get('/:id', (req, res) => {

    Post.findById(req.params.id)
        //Sort by date in mangoose

        .then(post => res.json(post))
        .catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});





//@route POST api/posts
//@desc Create post
//@access Private

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //Check Validation
    //if errors send 400 with errors object
    if (!isValid) {
        return res.status(400).json(errors);
    }


    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id,
    });

    newPost.save().then(post => res.json(post));


});



//@route DELETE api/posts/:id
//@desc Delete post by id
//@access Private


router.delete('/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile =>
            Post.findById(req.params.id)
                .then(post => {
                    //Check for post owner
                    if (post.user.toString() !== req.user.id) {
                        return res.status(401).json({ notauthorized: 'User not authoraized' });
                    }
                    //Delete
                    post.remove().then(() => res.json({ success: true }));
                })
                .catch(err => res.status(404).json({ postnotfound: 'Post not found' }))
        )
});
//@route POST api/posts/like/:id
//@desc Like post 
//@access Private


router.post('/like/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile =>
            Post.findById(req.params.id)
                .then(post => {
                    //check  if the user id is there, if there will give an error
                    if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                        return res.status(400).json({ alreadyliked: 'User already liked this post' });
                    }
                    //Add user id to likes array
                    post.likes.unshift({ user: req.user.id });
                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({ postnotfound: 'Post not found' }))
        )
});
//@route POST api/posts/unlike/:id
//@desc Like post 
//@access Private


router.post('/unlike/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    Profile.findOne({ user: req.user.id })
        .then(profile =>
            Post.findById(req.params.id)
                .then(post => {

                    if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                        return res.status(400).json({ notliked: 'You have not yet liked this post' });
                    }
                    //Get remove index
                    const removeIndex = post.likes

                        .map(item => item.user.toString())
                        .indexOf(req.user.id);
                    //Splice oput of array
                    post.likes.splice(removeIndex, 1);


                    post.save().then(post => res.json(post));
                })
                .catch(err => res.status(404).json({ postnotfound: 'Post not found' }))
        )
});



//Comments routes

//@route POST api/posts/comment/:id
//@desc Add comment to post
//@access Private


router.post('/comment/:id', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //Check Validation
    //if errors send 400 with errors object
    if (!isValid) {
        return res.status(400).json(errors);
    }
    Post.findById(req.params.id)
        .then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }

            //Add to comments array
            post.comments.unshift(newComment);
            //save
            post.save().then(post => res.json(post))
        })
        .catch(err => res.status(404).json({ postnotfound: 'No comment found' }))
});




//@route DELETE api/posts/comment/:id/:comment_id
//@desc Delete comment from post
//@access Private


router.delete('/comment/:id/:comment_id', passport.authenticate('jwt', { session: false }), (req, res) => {

    Post.findById(req.params.id)
        .then(post => {
            //Check to see if comment exists
            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({ commentnotexists: 'Comment does not exists' });
            }
            //Get remove index
            const removeIndex = post.comments
                .map(item => item._id.toString())
                .indexOf(req.params.comment_id);
            //Then splice from array
            post.comments.splice(removeIndex, 1);
            //save
            post.save().then(post => res.json(post));

        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }))
});


module.exports = router;