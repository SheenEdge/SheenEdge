const express = require("express");
const router = express.Router();
const {createPost, updatePost, readPosts, readPost, deletePost} = require('../contoller/postController')

router.route("/").post(createPost).get(readPosts)
router.route("/:id").get(readPost).delete(deletePost).put(updatePost)

module.exports = router;