import jwt from "jsonwebtoken";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next(); // icazə ver, davam et
  } catch (error) {
    return res.status(401).json({ message: "Invalid token", error });
  }
};
