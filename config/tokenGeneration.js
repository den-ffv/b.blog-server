import jwt from "jsonwebtoken";

export default function tokenGeneration(data) {
  const token = jwt.sign(
    {
      id: data.rows[0].id,
      username: data.rows[0].username,
      email: data.rows[0].email,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "24d",
    }
  );
  return token;
};
