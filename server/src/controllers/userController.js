const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi"); // ✅ הוספת Joi לוולידציה

// יצירת טוקן (JWT) עם מידע אם המשתמש הוא מנהל
const generateToken = (id, isAdmin) => {
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// 📌 סכמת ולידציה לרישום משתמשים
const registerSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"))
    .messages({
      "string.pattern.base": "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.",
    })
    .required(),
});

// 📌 סכמת ולידציה להתחברות משתמשים
const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// 📌 סכמת ולידציה לעדכון סטטוס משתמש
const updateUserStatusSchema = Joi.object({
  isAdmin: Joi.boolean().required(),
});

// 📌 הרשמת משתמש חדש
const registerUser = async (req, res) => {
  console.log("Received registration data:", req.body); // ✅ Debugging data input
  
  const { error } = registerSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user.id, user.isAdmin),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 התחברות משתמש קיים
const loginUser = async (req, res) => {
  console.log("Received login data:", req.body); // ✅ Debugging data input
  
  const { error } = loginSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user.id, user.isAdmin),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 קבלת פרטי המשתמש (רק למשתמש מחובר)
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 קבלת כל המשתמשים (רק למנהלים)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// 📌 מחיקת משתמש (רק למנהלים)
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await user.deleteOne();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

// 📌 עדכון סטטוס משתמש (רק למנהלים)
const updateUserStatus = async (req, res) => {
  const { error } = updateUserStatusSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isAdmin = req.body.isAdmin;
    await user.save();
    res.json({ message: "User status updated", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user status" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  getUsers,
  deleteUser,
  updateUserStatus,
};