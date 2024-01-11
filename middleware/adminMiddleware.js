import jwt from "jsonwebtoken";
import pool from "../data/db.js";

const adminMiddleware = (roles) => {
  return async function (req, res, next) {
    if (req.method === "OPTION") {
      next();
    }
    try {
      const token = req.header("Authorization").split(" ")[1];

      if (!token) {
        return res.status(401).json({ message: "The user is not authorized!" });
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

      const userId = decoded.id;

      const admin = await pool.query(
        "SELECT * FROM user_role WHERE role_id = 1"
      );

      admin.rows.map((candedat) => {
        if (candedat.user_id == userId) {
          return next();
        }
      });
    } catch (err) {
      console.error(err);
      return res.status(403).json({ message: "The user is not authorized." });
    }
  };
};
export default adminMiddleware;
