import bcrypt from "bcrypt";

import pool from "../data/db.js";
import TokenGeneration from "../config/tokenGeneration.js";

class UserService {
  async registration(username, email, password, nickname) {
    const salt = await bcrypt.genSalt(2);
    const hash = await bcrypt.hash(password, salt);

    const candedat = await pool.query(
      "SELECT email FROM users WHERE email = $1",
      [email]
    );

    if (candedat.rows.length > 0) {
      throw new Error("User with such mail already exists.");
    }

    const userNikname = await pool.query(
      "SELECT nickname FROM users WHERE nickname = $1",
      [nickname]
    );

    if (userNikname.rows.length > 0) {
      throw new Error("The user with such nickname already exists.");
    }

    const newUser = await pool.query(
      `INSERT INTO users ("username", "email", "password", "nickname")  VALUES ($1, $2, $3, $4) RETURNING *`,
      [username, email, hash, nickname]
    );
    await pool.query("INSERT INTO user_role(user_id, role_id) VALUES ($1, 2)", [
      newUser.rows[0].id,
    ]);
    const token = TokenGeneration(newUser);

    if (!newUser) {
      throw new Error("Failed to register user.");
    }
    return { token, newUser };
  }
  async login(email, password) {
    const candedat = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (!candedat.rows.length > 0) {
      throw new Error("User was not found");
    }

    const isValidPassword = await bcrypt.compare(
      password,
      candedat.rows[0].password
    );

    if (!isValidPassword) {
      throw new Error("Not correct email or password.");
    }

    const token = TokenGeneration(candedat);

    return { token, user: candedat };
  }
}

export default new UserService();
