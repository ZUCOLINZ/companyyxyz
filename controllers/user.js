const userModel = require("../models/user");
const expressAsyncHandler = require("express-async-handler");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const { userSchema } = require("../utils/validatorSchema");

// Updating User Profile
exports.handleUpdate = async (req, res) => {
  const user = await userModel.findById(req.user.id);
  if (user) {
    user.email = user.email;
    user.fullName = req.body.fullName || user.fullName;
    user.mobile = req.body.mobile || user.mobile;

    if (req.body.password) {
      user.password = bcrypt.hashSync(req.body.password, 8);
    }

    const updatedUser = await user.save();
    res.status(201).send({
      _id: updatedUser._id,
      fullName: updatedUser.fullName,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404).send({ message: "User not found" });
  }
};

// Handle get User Profile
exports.handleGetUser = async (req, res) => {
  let userId = req.user.id;
  try {
    let user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ status: 404, message: "User not found" });
    }
    res.status(200).json({ status: 200, message: user });
  } catch (error) {
    res
      .status(500)
      .json({ status: 500, message: "Opps! something went wrong" });
  }
};

// userRouter.put(
//   "/profile",
//   isAuth,
//   expressAsyncHandler(async (req, res) => {
//     const user = await userModel.findById(req.user._id);
//     if (user) {
//       user.email = user.email;
//       user.fullName = req.body.fullName || user.fullName;
//       user.mobile = req.body.mobile || user.mobile;

//       if (req.body.password) {
//         user.password = bcrypt.hashSync(req.body.password, 8);
//       }

//       const updatedUser = await user.save();
//       res.status(201).send({
//         _id: updatedUser._id,
//         fullName: updatedUser.fullName,
//         email: updatedUser.email,
//         mobile: updatedUser.mobile,
//         isAdmin: updatedUser.isAdmin,
//       });
//     } else {
//       res.status(404).send({ message: "User not found" });
//     }
//   })
// );

exports.userSignup = async (req, res) => {
  let newUser;
  try {
    newUser = await userSchema.validateAsync(req.body);
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.details[0].message });
  }
  try {
    const userExist = await userModel.findOne({
      $or: [{ email: newUser.email }, { mobile: newUser.mobile }],
    });
    if (userExist) {
      res.status(400).json({
        status: false,
        message:
          "User already exists, consider changing your email or phone number",
      });
    } else {
      const hash = bcrypt.hashSync(newUser.password);
      newUser.password = hash;
      const user = await userModel.create(newUser);
      if (!user) {
        res
          .status(500)
          .json({ status: false, message: "internal server errror" });
      }
      res
        .status(201)
        .json({ status: true, message: "User created successfully" });
    }
  } catch (error) {
    return res
      .status(404)
      .json({ status: false, message: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  let { email_mobile, password } = req.body;

  if (!email_mobile || !password) {
    return res.status(404).json({
      status: false,
      message: "Please input email/mobile or password",
    });
  }

  let existingUser;

  try {
    existingUser = await userModel.findOne({
      $or: [{ email: email_mobile }, { mobile: email_mobile }],
    });
    if (!existingUser) {
      return res
        .status(404)
        .json({ status: false, message: "User does not exist" });
    }
    const isPasswordCorrect = bcrypt.compareSync(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res
        .status(400)
        .json({ status: false, message: "Email/password mismatched" });
    }

    // Create token
    const token = jwt.sign(
      {
        id: existingUser._id,
        email: existingUser.email,
        role: existingUser.role,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "2d",
      }
    );

    res
      .status(200)
      .json({ status: true, message: "User logged in successfully", token });
  } catch (err) {
    return res
      .status(500)
      .json({ status: false, message: "Opps! something went wrong" });
  }
};
