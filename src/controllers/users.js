import UserModel from "../models/users.js";
import { v4 as uuidv4 } from "uuid";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

const SIGNUP = async (req, res) => {
  const data = req.body;

  if (!data.email.includes("@")) {
    return res.status(400).json({ message: "Bad email format" });
  }

  if (data.name[0] === data.name[0].toLowerCase()) {
    return res.status(400).json({
      message: "Name must start with an uppercase letter.",
    });
  }
  const passwordRegex = /^(?=.*[0-9]).{6,}$/;
  if (!passwordRegex.test(data.password)) {
    return res.status(400).json({
      message:
        "Password must be at least 6 characters long and contain at least one digit.",
    });
  }
  const salt = bcryptjs.genSaltSync(10);
  const passwordHash = bcryptjs.hashSync(data.password, salt);

  const user = {
    id: uuidv4(),
    email: data.email,
    name: data.name,
    password: passwordHash,
  };

  const respose = await new UserModel(user);
  const createdUser = await respose.save();

  const token = jwt.sign(
    { email: user.email, userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
  const refreshToken = jwt.sign(
    { email: user.email, userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "1d" }
  );
  res.status(200).json({
    message: "Sign in successfully",
    user: createdUser,
    jwt_token: token,
    jwt_refresh_token: refreshToken,
  });
};

const LOGIN = async (req, res) => {
  const data = req.body;

  const user = await UserModel.findOne({ email: data.email });

  if (!user) {
    console.log("User not found");
    return res.status(401).json({ message: "Bad email or password" });
  }

  const isPasswordMatch = bcryptjs.compareSync(data.password, user.password);

  if (!isPasswordMatch) {
    console.log("Password does not match");
    return res.status(401).json({ message: "Bad email or password" });
  }

  const token = jwt.sign(
    { email: user.email, userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );
  const refreshToken = jwt.sign(
    { email: user.email, userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "1d" }
  );

  res.status(200).json({
    message: "Logged in successfully",
    jwt_token: token,
    jwt_refresh_token: refreshToken,
  });
};

const GET_NEW_JWT_TOKEN = async (req, res) => {
  const { jwt_refresh_token } = req.body;

  if (!jwt_refresh_token) {
    return res.status(400).json({ message: "Refreshed JWT token is missing" });
  }

  try {
    const decoded = jwt.verify(
      jwt_refresh_token,
      process.env.JWT_REFRESH_SECRET
    );

    const new_jwt_token = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(200).json({
      message: "New JWT token have been created successfully",
      jwt_token: new_jwt_token,
      jwt_refresh_token,
    });
  } catch (err) {
    res.status(400).json({
      message: "You are not logged in. Try to log in again",
    });
  }
};
const GET_ALL_USERS = async (req, res) => {
  try {
    const response = await UserModel.find().sort("name");

    return res.status(200).json({
      users: response,
    });
  } catch (err) {
    console.log("We are having some technical difficulties");
    console.log(err);

    return res.status(400).json({
      message: "We are having some technical difficulties",
    });
  }
};

const GET_USERS_BY_ID = async (req, res) => {
  try {
    const user = await UserModel.findOne({ id: req.params.id });

    if (!user) {
      return res.status(404).json({
        message: `user ${req.params.id} does not exist`,
      });
    }

    const response = await UserModel.findOne({ id: req.params.id });

    if (!response) {
      return res.status(404).json({
        message: `Data with id: ${req.params.id} not exist`,
      });
    }

    return res.status(200).json({
      user: response,
    });
  } catch (err) {
    console.log("We are having some technical difficulties");
    console.log(err);

    return res.status(400).json({
      message: "We are having some technical difficulties",
    });
  }
};

const GET_ALL_USERS_WITH_TICKETS = async (req, res) => {
  try {
    const userAggregate = await UserModel.aggregate([
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "_id",
          as: "bought_tickets_details",
        },
      },
    ]);

    const filteredUsers = userAggregate.filter(
      (user) => user.bought_tickets.length > 0
    );

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("We are having some technical difficulties");
    console.log(err);

    return res.status(400).json({
      message: "We are having some technical difficulties",
    });
  }
};
const GET_USER_BY_ID_WITH_TICKETS = async (req, res) => {
  try {
    const user = req.params.id;

    const userAggregate = await UserModel.aggregate([
      {
        $match: { id: user },
      },
      {
        $lookup: {
          from: "tickets",
          localField: "bought_tickets",
          foreignField: "_id",
          as: "bought_tickets_details",
        },
      },
    ]);

    if (userAggregate.length === 0) {
      return res.status(404).json({
        message: `User with id: ${req.params.id} does not exist`,
      });
    }
    const filteredUser = userAggregate[0];
    if (filteredUser.bought_tickets.length === 0) {
      return res.status(404).json({
        message: `User with id: ${req.params.id} does not have any tickets`,
      });
    }
    res.status(200).json(userAggregate[0]);
  } catch (error) {
    console.log("We are having some technical difficulties");
    console.log(err);

    return res.status(400).json({
      message: "We are having some technical difficulties",
    });
  }
};
export {
  SIGNUP,
  LOGIN,
  GET_NEW_JWT_TOKEN,
  GET_ALL_USERS,
  GET_USERS_BY_ID,
  GET_ALL_USERS_WITH_TICKETS,
  GET_USER_BY_ID_WITH_TICKETS,
};
