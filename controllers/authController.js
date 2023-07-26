import userModal from "../model/userModal.js";
import { hashPassword, comparePassword } from "../helper/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
  try {
    console.log(req.body);
    const {
      name,
      email,
      password,
      mobile,
      address,
      securityQuestion,
      securityAnswer,
      role,
    } = req.body;

    //validation
    if (!name) {
      console.log("Name is required");
      return res.status(204).send({ error: "Name is required" });
    }
    if (!email) {
      console.log("Email is required");
      return res.status(204).send({ error: "Email is required" });
    }
    if (!password) {
      console.log("Password is required");
      return res.status(204).send({ error: "Password is required" });
    }
    if (!mobile) {
      console.log("Phone is required");
      return res.status(204).send({ error: "Phone is required" });
    }
    if (!address) {
      console.log("Address is required");
      return res.status(204).send({ error: "Address is required" });
    }
    if (!securityQuestion) {
      console.log("Security Question is required");
      return res.status(204).send({ error: "Security Question is required" });
    }
    if (!securityAnswer) {
      console.log("Security Answer is required");
      return res.status(204).send({ error: "Security Answer is required" });
    }
    if (!role) {
      console.log("Role is required");
      return res.status(204).send({ error: "Role is required" });
    }

    console.log("I am hashing");

    //existing user checking
    const existingUser = await userModal.findOne({ email });
    if (existingUser) {
      return re.status(200).send({
        success: true,
        message: "Already registered please login",
      });
    }

    console.log("I am hashing");

    //Register user

    //Hashing password
    const hashedPassword = await hashPassword(password);

    //saving to databse
    const user = await new userModal({
      name,
      email,
      mobile,
      role,
      securityQuestion,
      securityAnswer,
      address,
      password: hashedPassword,
    }).save();

    user.password = undefined;

    //sending response to API
    res.status(201).send({
      success: true,
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

export const loginController = async (req, res) => {
  try {
    //getting data
    const { email, password } = req.body;

    //validation
    if (!email) {
      return res.status(204).send({ error: "Email is required" });
    }
    if (!password) {
      return res.status(204).send({ error: "Password is required" });
    }

    //Getting user with email
    const user = await userModal.findOne({ email });
    console.log(user);

    //Checking if the user exist with the email or not
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found for the email",
      });
    }

    //If user exist then checking password
    const match = await comparePassword(password, user.password);
    if (match == true) {
      //token
      const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({
        success: true,
        message: "login successfull",
        user: {
          _id:user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          address: user.address,
        },
        token,
      });
      console.log(token);
    } else {
      return res.status(401).send({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Login",
      error,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    console.log(req.body);
    const { email, securityQuestion, securityAnswer } = req.body;
    if (!email) {
      console.log("Email is required");
      return res.status(204).send({ error: "Email is required" });
    }
    if (!securityQuestion) {
      console.log("Security Question is required");
      return res.status(204).send({ error: "Security Question is required" });
    }
    if (!securityAnswer) {
      console.log("Security Answer is required");
      return res.status(204).send({ error: "Security Answer is required" });
    }

    const user = await userModal.findOne({ email });
    if (!user) {
      console.log("E-mail is not registered with us");
      return res
        .status(404)
        .send({ error: "E-mail is not registered with us" });
    }
    //check for the answer of Security question
    if (securityQuestion === user.securityQuestion) {
      if (securityAnswer === user.securityAnswer) {
        res.status(200).send({
          message: "Security verification Successfull",
          success: true,
        });
      } else {
        console.log("Wrong Answer");
        return res.status(403).send({ error: "Wrong Answer" });
      }
    } else {
      console.log("Wrong Question");
      return res.status(403).send({ error: "Wrong Question" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Login",
      error,
    });
  }
};

export const changePasswordController = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email) {
      return res.status(204).send({ error: "Email is required" });
    }
    if (!password) {
      return res.status(204).send({ error: "Password is required" });
    }

    const hashedPassword = await hashPassword(password);

    console.log(hashedPassword);
    console.log(email);
    const user = await userModal.updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );
    if (!user) {
      return res.status(403).send({ error: "Bad Request" });
    }
    console.log(user);

    res.status(200).send({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while Login",
      error,
    });
  }
};
