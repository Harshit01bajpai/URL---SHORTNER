const user = require("../models/user");
const bcrypt = require("bcrypt");

// Signup
async function handlecreatesignup(req, res) {
  const { name, email, password, role } = req.body;

  // Validation
  if (!name || !email || !password) {
    return res.status(400).send("All fields are required");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser =await user.create({
    name,
    email,
    password: hashedPassword,
    role,
  });
   req.session.user = {
  _id: newUser._id,
  name: newUser.name,
  email: newUser.email,
  role: newUser.role
};
  // Signup ke baad login page pe bhejna better hai
  return res.redirect("/");
}

// Login
async function handlecreateloginup(req, res) {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).send("Email and password required");
  }

  const User = await user.findOne({ email });
  if (!User) {
    return res.render("login", { error: "User not found" });
  }

  const isPasswordValid = await bcrypt.compare(password, User.password);
  if (!isPasswordValid) {
    return res.render("login", { error: "Invalid email or password" });
  }

  // sahi user mila → session set
  req.session.user = {
    _id: User._id,
    email: User.email,
    name: User.name,
    role: User.role,
  };

  return res.redirect("/");
}

module.exports = { handlecreatesignup, handlecreateloginup };
