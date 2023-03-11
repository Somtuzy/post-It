const user = require("../services/user.service");
const hashPassword = require("../services/bcrypt.service");
const generateToken = require("../services/jwt.service");
const generateRandomAvatar = require("../services/avatar.service");

class UserController {
  // Registers a user and gives them a token
  async signup(req, res) {
    try {
      const { fullname, username, email, password, age } = req.body;

      // Checks for existing user
      const existingUser = await user.findWithDetails({
        $or: [{ username: username }, { email: email }],
      });

      if (existingUser && existingUser.username === username) {
        // Gives forbidden message
        return res.status(403).send({
          message: "User already exists with this username",
          status: "failed",
        });
      }

      if (existingUser && existingUser.email === email) {
        // Gives forbidden message
        return res.status(403).send({
          message: "User already exists with this email",
          status: "failed",
        });
      }

      // Generates a random avatar for the user
      const avatarUrl = await generateRandomAvatar(email);
      const avatar = `<img src="${avatarUrl}" alt="An avatar used to represent ${username} generated with their personal email.">`;

      // Hashes the user password for extra protection
      const safePassword = await hashPassword(password);

      // Creates a new user
      let newUser = await user.create({
        fullname,
        username,
        email,
        password: safePassword,
        avatar,
        age,
      });

      // Stores the returned user's unique id and role in an object to generate a token for the user
      const token = generateToken({ id: newUser._id });

      // Saves the user
      await newUser.save();

      // This saves the token as a cookie for the duration of its validity just to simulate how the request header works for the purpose of testing.
      res.cookie("token", token, { httpOnly: true });

      // Sends success message on the console
      console.log(`Token successfully generated for ${newUser}`);

      newUser = await user.find({
        $and: [
          { _id: newUser._id },
          { username: newUser.username },
          { email: newUser.email },
        ],
      });

      // Sends the token to the client side for it to be set as the request header using axios
      return res.json({
        token: token,
        user: newUser,
        message: "User succesfully signed up!",
      });
    } catch (err) {
      return res.status(400).send({
        message: err,
        status: "failed",
      });
    }
  }
}

module.exports = new UserController();
