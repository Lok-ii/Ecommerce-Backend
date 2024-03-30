const blogModel = require("../models/bolg.js");

const createBlog = async (req, res) => {
  const blogData = req.body;
  const newBlogData = {
    ...req.body,
    author: req.user._id,
  };
  try {
    const newBlog = await blogModel.create(newBlogData);
    if (!newBlog._id) throw "Error creating Blog";
    res
      .status(201)
      .json({ success: true, message: "Blog created!", data: newBlog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find();
    res
      .status(200)
      .json({ success: true, message: "Blogs retrieved!", data: blogs });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: error.message });
  }
};

const getBlogDetails = async (req, res) => {
  try {
    const blog = await blogModel
      .findById(req.params.blogId)
      .populate("author", ["firstname", "lastname"]);
    res
      .status(200)
      .json({ success: true, message: "Blog retrieved!", data: blog });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "No such blog!" });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const blog = await blogModel.findByIdAndDelete(req.params.blogId);
    if (!blog) throw "No such blog!";
    res.status(200).json({ success: true, message: "Blog deleted!" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "No such blog!" });
  }
};

const updateBlog = async (req, res) => {
  try {
    const blog = await blogModel.findByIdAndUpdate(
      req.params.blogId,
      req.body,
      { new: true }
    );
    if (!blog) throw "No such blog!";
    res.status(200).json({ success: true, message: "Blog updated!" });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "No such blog!" });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogDetails,
  deleteBlog,
  updateBlog
};
