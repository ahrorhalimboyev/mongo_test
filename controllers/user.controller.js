const { errorHandler } = require("../helpers/error_handler");
const User = require("../models/user");

const addUser = async (req, res) => {
  try {
    // AddUser
    const { name, email, password } = req.body;
    if (name == "" || email == "" || password == "") {
      return res.status(400).send({
        message: "Ma'lumotlarni to'liq kiriting",
      });
    }
    const user = await User.findOne({ email: email });
    console.log(user);
    if (user) {
      return res.status(400).send({
        message: "Bunday user mavjud",
      });
    }
    const newUser = await User({
      name: name,
      email: email,
      password: password,
    });
    await newUser.save();
    res.status(200).send({ message: "Foydalanuvchi qo'shildi" });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getUsers = async (req, res) => {
  try {
    // getUsers
    const users = await User.find();
    if (users.length == 0) {
      return res.status(400).send({ message: "Foydalanuvchilar topilmadi" });
    }
    res.json({ users });
  } catch (error) {
    errorHandler(res, error);
  }
};

const getUserById = async (req, res) => {
  try {
    // getUserById
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).send({ message: "Foydalanuvchi topilmadi" });
    }
    res.json({ user });
  } catch (error) {
    errorHandler(res, error);
  }
};

const updateUser = async (req, res) => {
  try {
    // UpdateUser
    const { name, email, password } = req.body;
    const user = await User.updateOne(
      { _id: req.params.id },
      { name: name, email: email, password: password }
    );
    if (user.modifiedCount == 0) {
      res.status(404).send({ message: "User is already updated" });
    } else {
      console.log(user);
      res.status(200).send({ message: "Foydalanuvchi yangilandi" });
    }
  } catch (error) {
    errorHandler(res, error);
  }
};

const deleteUser = async (req, res) => {
  try {
    // deleteUser
    const userId = req.params.id;
    const user = await User.findById({ _id: userId });
    if (!user) {
      res.status(404).send({ message: "User is not found" });
    }
    const deleteduser = await User.deleteOne({ _id: userId });
    console.log(user);
    if (deleteduser.deletedCount == 1) {
      res.status(200).send({ message: "Foydalanuvchi o'chirildi" });
    } else {
      console.log(user);
      res.status(404).send({ message: "User is not deleted" });
    }
  } catch (error) {
    errorHandler(res, error);
  }
};

const loginUser = async (req, res) => {
  try {
    // loginUser
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).send({ message: "Email is wrong" });
    }
    if (user.password == password) {
      return res.json({ message: "Tizimga kirdingiz" });
    }
    res.status(404).send({ message: "Password is wrong" });
  } catch (error) {
    errorHandler(res, error);
  }
};

module.exports = {
  addUser,
  getUsers,
  getUserById,
  loginUser,
  updateUser,
  deleteUser,
};
