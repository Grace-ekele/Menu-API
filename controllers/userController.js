require('dotenv').config();
const userModel = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const transporter = require('../middleware/nodemailer');
const validator = require('../middleware/validator');

// USER ONBOARDING

// user sign up
const userSignUp = async (req, res) => {
  try {
    const { fullName, phoneNumber, email, password } = req.body;

    const validation = validator(email, phoneNumber, fullName);
    if (!validation.isValid) {
      return res.status(400).json({
        message: validation.message
      });
    }
    const emailExists = await userModel.findOne({ email });

    if (emailExists) {
      return res.status(400).json({
        message: `Email already exist.`
      })
    }

    // salt the password using bcrypt
    const salt = bcrypt.genSaltSync(10)
    // hash the salted password using bcrypt
    const hashedPassword = bcrypt.hashSync(password, salt)
    const data = {
      fullName: fullName.toUpperCase(),
      email: email.toLowerCase(),
      phoneNumber,
      password: hashedPassword
    }

    // create a user
    const user = await userModel.create(data);

    // create a token
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "30 mins" })

    // Assign the created token to the user's token field
    user.token = token

    // send verification email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Verify your account",
      html: `Please click on the link to verify your email: <a href="${req.protocol}://${req.get("host")}/api/users/verify-email/${token}">Verify Email</a>. This link expires in Thirty(30) minutes.`,
    };

    await transporter.sendMail(mailOptions);

    // save the user
    const savedUser = await user.save();

    // return a response
    res.status(201).json({
      message: `Check your email: ${savedUser.email} to verify your account.`,
      data: savedUser
    })

  } catch (error) {
    res.status(500).json({
      Error: error.message
    })
  }
}


// verify email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(404).json({
        error: "Token not found"
      })
    }

    // verify the token and extract the user's email
    const { email } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    // Check if user has already been verified
    if (user.isVerified) {
      return res.status(400).json({
        error: "User already verified"
      });
    }

    // update the user verification
    user.isVerified = true;

    // save the changes
    await user.save();

    // update the user's verification status
    const updatedUser = await userModel.findOneAndUpdate({ email: email.toLowerCase() }, user);

    res.status(200).json({
      message: "User verified successfully",
      data: updatedUser,
    })
    // res.status( 200 ).redirect( `${req.protocol}://${req.get("host")}/api/log-in` );

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
};


// resend verification
const resendVerificationEmail = async (req, res) => {
  try {
    // get user email from request body
    const { email } = req.body;

    // find user
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    // Check if user has already been verified
    if (user.isVerified) {
      return res.status(400).json({
        error: "User already verified"
      });
    }

    // create a token
    const token = await jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "30 mins" });

    // send verification email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Email Verification",
      html: `Please click on the link to verify your email: <a href="${req.protocol}://${req.get("host")}/api/users/verify-email/${token}">Verify Email</a>. This link expires in Thirty(30) minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: `Verification email sent successfully to your email: ${user.email}`
    });

  } catch (error) {
    res.status(500).json({
      message: error.message
    })
  }
}


// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the email exists in the userModel
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Generate a reset token
    const resetToken = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "30m" });

    // Send reset password email
    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: user.email,
      subject: "Password Reset",
      html: `Please click on the link to reset your password: <a href="${req.protocol}://${req.get("host")}/api/users/reset-password/${resetToken}">Reset Password</a>. This link expires in Thirty(30) minutes.`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Password reset email sent successfully"
    });
  } catch (error) {
    console.error("Something went wrong", error.message);
    res.status(500).json({
      message: error.message
    });
  }
};


// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Verify the user's token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Get the user's ID from the token
    const userId = decodedToken.userId;

    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Salt and hash the new password
    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltedRound);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password reset successful"
    });
  } catch (error) {
    console.error("Something went wrong", error.message);
    res.status(500).json({
      message: error.message
    });
  }
};


// User login
const userLogin = async (req, res) => {
  try {
    // Extract the user's email and password
    const { password, email } = req.body;

    // Find user by their registered email
    const checkUser = await userModel.findOne({ email: email.toLowerCase() })

    // Check if the user exists
    if (!checkUser) {
      return res.status(404).json({
        Failed: 'User not found'
      })
    }

    // Compare user's password with the saved password.
    const checkPassword = bcrypt.compareSync(password, checkUser.password)
    // Check for password error
    if (!checkPassword) {
      return res.status(404).json({
        Message: 'Login Unsuccessful',
        Failed: 'Invalid password'
      })
    }

    // Check if the user if verified
    if (!checkUser.isVerified) {
      return res.status(404).json({
        message: `User with this email: ${email} is not verified.`
      })
    }

    const token = jwt.sign({
      userId: checkUser._id,
      password: checkUser.password,
      isAdmin: checkUser.isAdmin,
      isSuperAdmin: checkUser.isSuperAdmin
    },
      process.env.JWT_SECRET, { expiresIn: "1 day" })

    checkUser.token = token

    checkUser.save()

    res.status(200).json({
      message: 'Login successful',
      data: {
        id: checkUser._id,
        fullName: checkUser.fullName,
        token: checkUser.token
      }
    })

  } catch (error) {
    res.status(500).json({
      Error: error.message
    })
  }
}

// Change Password
const changePassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, existingPassword } = req.body;

    // Verify the user's token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Get the user's Id from the token
    const userId = decodedToken.userId;

    // Find the user by ID
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    // Confirm the previous password
    const isPasswordMatch = await bcrypt.compare(existingPassword, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Existing password is incorrect."
      });
    }

    // Salt and hash the new password
    const saltedRound = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, saltedRound);

    // Update the user's password
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      message: "Password changed successful"
    });
  } catch (error) {
    console.error("Something went wrong", error.message);
    res.status(500).json({
      message: error.message
    });
  }
};


// User sign out
const signOut = async (req, res) => {
  try {
    const { userId } = req.user;

    // Update the user's token to null
    const user = await userModel.findByIdAndUpdate(userId, { token: null }, { new: true });

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    res.status(200).json({
      message: 'User logged out successfully',
    });
  } catch (error) {
    res.status(500).json({
      Error: error.message,
    });
  }
};

// USER CRUD




module.exports = {
  userSignUp,
  userLogin,
  signOut,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  changePassword,
  resetPassword
}