import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../data/db.js";
import UserService from "../services/UserService.js";

class UserController {
  async registration(req, res) {
    try {
      const { username, email, password, nickname } = req.body;

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isValidEmail = emailRegex.test(email);

      if (!isValidEmail) {
        return res.status(400).json({ massage: "Email is not valid" });
      }

      const { token, newUser } = await UserService.registration(
        username,
        email,
        password,
        nickname
      );

      return res.status(200).json({
        user: newUser.rows[0],
        token: token,
        message: "Registration successful.",
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const { token, user } = await UserService.login(email, password);

      return res.status(200).json({
        user: user.rows[0],
        token,
        message: "Authorization of success.",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }

  async getUsers(req, res) {
    try {
      const user = await pool.query("SELECT * FROM users ");

      if (user.rows.length === 0) {
        return res.status(404).json({ message: "No users found" });
      }

      return res.status(200).json({ users: user.rows });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to get users" });
    }
  }
  async getOneUser(req, res) {
    try {
      const userId = req.params.id;

      if (isNaN(userId)) {
        return res.status(400).json({ massage: "Invalid user ID" });
      }

      const user = await pool.query("SELECT * FROM users WHERE id = $1 ", [
        userId,
      ]);

      if (user.rows.length === 0) {
        return res.status(404).json({ massage: "User was not found" });
      }

      return res.status(200).json({ user: user.rows });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to get user" });
    }
  }
  async deleteUser(req, res) {
    try {
      const userId = req.params.id;

      if (isNaN(userId)) {
        return res.status(400).json({ massage: "Invalid user ID" });
      }

      const userToDelete = await pool.query(
        "SELECT * FROM users WHERE id = $1",
        [userId]
      );

      if (userToDelete.rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      await pool.query("DELETE FROM users WHERE id = $1", [userId]);

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to delete user" });
    }
  }
}

export default new UserController();
