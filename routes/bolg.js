const express = require('express');
const { createBlog, getBlogs, getBlogDetails, updateBlog, deleteBlog } = require('../controllers/bolg');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();


router.post("/", authMiddleware(["admin", "seller"]), createBlog);
router.get("/", getBlogs);
router.get("/:blogId", getBlogDetails);
router.patch("/:blogId", authMiddleware(["admin", "seller"]), updateBlog);
router.delete("/:blogId", authMiddleware(["admin", "seller"]), deleteBlog);


module.exports = router;