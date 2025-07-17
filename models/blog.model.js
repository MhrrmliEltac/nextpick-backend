import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    blogName: { type: String, required: true },
    blogImage: { type: String, required: true },
    blogDescription: { type: String },
  },
  {
    timestamps: true,
  }
);

const Blog = mongoose.model("Blog", blogSchema);
export default Blog;
