const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const User = require("../models/User");
const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getUpload: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("upload.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getFavorites: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("favorites.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getEdit: async (req, res) => {
    try {
      const posts = await Post.findOne({ _id: req.params.id });
      res.render("edit.ejs", { posts });
    } catch (err) {
      console.log(err);
    }
  },
  
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts: posts });
    } catch (err) {
      console.log(err);
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({post: req.params.id}).sort({ createdAt: "asc" }).lean();
      res.render("post.ejs", { post: post, user: req.user, comments: comments });
    } catch (err) {
      console.log(err);
    }
  },

  updatePost: async (req, res) => {
    try {
      let post = await Post.findById(req.params.id).lean()
      
      //checks if there's no post
      if (!post) {
        return res.render('error/404')
      }
      
      //check if the post's creator matches the logged in user
      if (post.user != req.user.id) {
        res.redirect('/feed')
      } else {
        
       post = await Post.findOneAndUpdate({ _id: req.params.id }, req.body, {
          new: true,
          runValidators: true,
        })
  
        res.redirect('/feed')
      }
    } catch (err) {
      console.error(err)
      return res.render('error/500')
    }
  },
  // getFavorites: async (req, res) => {
  //   try{
  //     const user = await User.findById(req.user._id).populate('favorites');
  //     res.render('favorites', { favorites: user.favorites });
  //   } catch(err){
  //     console.log(err)
  //   }
  // },
  savePic: async (req, res) => {
    const postId = req.body.post
    const userId = req.body.user
    const postDoc = await Post.findById(postId)
    const userDoc = await User.findById(userId)

    if (postDoc.savedBy?.includes(userDoc._id)) {
        newSavedPosts = postDoc.savedBy.filter(x => x != String(userDoc._id))
        await postDoc.updateOne({
            savedBy: [...newSavedPosts]
        });
        res.json(`User id ${userId} removed from post ${postId}.`)
    } else {
        await postDoc.updateOne({
            savedBy: [...postDoc.savedBy, userDoc]
        }, { upsert: true });
        res.json(`User id ${userId} saved to post ${postId}.`)
    }
},


  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        name: req.body.name,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        age: req.body.age,
        gender: req.body.gender,
        breed: req.body.breed,
        color: req.body.color,
        bodySize: req.body.bodySize,
        hairLength: req.body.hairLength,
        spayedNeutered: req.body.spayedNeutered,
        vaccinations: req.body.vaccinations,
        specialNeeds: req.body.specialNeeds, 
        houseTrained: req.body.houseTrained,
        goodWithKids: req.body.goodWithKids, 
        goodWithAnimals: req.body.goodWithKids, 
        adoptionCenter: req.body.adoptionCenter,
        phoneNumber: req.body.phoneNumber,
        sellerEmail: req.body.sellerEmail,
        location: req.body.location,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },
  likePost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
  
      if (!post) {
        return res.status(404).send("Post not found");
      }
  
      // Toggle the 'likes' field between true and false
      post.likes = !post.likes;
  
      // Save the updated post
      await post.save();
  
      console.log(`Likes toggled to ${post.likes ? "true" : "false"}`);
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
      res.status(500).send("Internal Server Error");
    }
  },
  
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
};