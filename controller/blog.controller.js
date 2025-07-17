import Blog from "../models/blog.model.js";

export const createBlog = async (req, res) => {
  try {
    const { blogName, blogImage, blogDescription } = req.body;
    if (!blogName && !blogImage) {
      return res.status(400).json({ message: "Şəkil və ya ad təyin edin" });
    }

    const newBlog = await Blog({
      blogName,
      blogImage,
      blogDescription,
    });

    const savedBlog = newBlog.save();
    res.status(201).json({ message: "Blog yaradıldı", savedBlog });
  } catch (error) {
    res.status(500).json({ message: "Blog yaradıla bilmədi", error });
  }
};

export const getAllBlog = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Blog tapılmadı", error });
  }
};
