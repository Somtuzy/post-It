const user = require("../services/user.service");
const { hashPassword, verifyPassword } = require("../services/bcrypt.service");
const { generateToken } = require("../services/jwt.service");
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

    // Signs a registered user in and gives them access to protected content with a token
    async login(req, res) {
      try {
        const { username, email, password } = req.body;
        let foundUser;

        // Makes sure the user provides their email/username and password
        if (!email && !username)
          return res.send("Please enter your email address or username");
        if (!password) return res.send("Please enter your password");

        // Makes sure a user isn't signing in with an email and username associated with a disabled user
        foundUser = await user.findWithDetails({
          $or: [{ username: username }, { email: email }],
        });

        if (foundUser && email && foundUser.deleted === true)
          return res.status(403).send({
            message: `This email is associated with a disabled account, please go to https://postit.onrender.com/users/recover to sign in and reactivate your account`,
            status: "failed",
          });

        if (foundUser && username && foundUser.deleted === true)
          return res.status(403).send({
            message: `This username is associated with a disabled account, please go to https://postit.onrender.com/users/recover to sign in and reactivate your account`,
            status: "failed",
          });

        // Returns a message if user doesn't exist
        if (!foundUser || foundUser === null) {
          return res.status(404).send({
            message: `User does not exist, would you like to sign up instead?`,
          });
        }

        // Checks if the password input by the client matches the protected password of the returned user
        const isValid = verifyPassword(password, foundUser.password);

        // Sends a message if the input password doesn't match
        if (!isValid) {
          return res.status(400).send({
            message: "Incorrect password, please retype your password",
            status: "failed",
          });
        }

        // Stores the returned user's unique id in an object to generate a token for the user
        const token = generateToken({ id: foundUser._id });

        // This saves the token as a cookie for the duration of its validity just to simulate how the request header works for the purpose of testing.
        res.cookie("token", token, { httpOnly: true });

        // Removes password from output
        foundUser = await user.find({
          $and: [
            { _id: foundUser._id },
            { username: foundUser.username },
            { email: foundUser.email },
          ],
        });

        // Sends success message on the console
        console.log(`Token successfully generated for ${foundUser}`);

        // Sends the token to the client side for it to be set as the request header using axios
        return res.json({
          token: token,
          user: foundUser,
          message: "User succesfully logged in!",
        });
      } catch (err) {
        return res.status(400).send({
          message: err,
          status: "failed",
        });
      }
    }

  // Updating a user
  async updateUser(req, res) {
    try {
      const { fullname, username, email, password, age } = req.body;
      const id = req.params.id;
      const reqUserId = req.user.id;

      // Checks if user already exists
      const existingUser = await user.find({ _id: id, deleted: false });

      // Sends a message if the specified user does not exist
      if (!existingUser) {
        return res.status(404).send({
          success: false,
          message: "This user does not exist",
        });
      }

      if (reqUserId.toString() !== existingUser._id.toString())
        return res.status(403).send({
          message: "you are not authorised to update this user",
          status: "failed",
        });

      // Updates the user based on what was provided
      let updatedUser;
      if (fullname) updatedUser = await user.update(id, { fullname: fullname });
      if (username) updatedUser = await user.update(id, { username: username });
      if (email) updatedUser = await user.update(id, { email: email });
      if (age) updatedUser = await user.update(id, { age: age });
      if (password) updatedUser = await user.update(id, { password: password });

      updatedUser = await user.find(
        { _id: updatedUser._id },
        "-password -replies -postits -deleted"
      );
      // Sends a success message and displays the updated user
      return res.status(200).send({
        success: true,
        message: "User updated successfully!",
        data: updatedUser,
      });
    } catch (err) {
      return res.send({
        error: err,
        message: err.message,
      });
    }
  }

  // Deleting a user
  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const reqUserId = req.user.id;

      const existingUser = await user.find(
        { _id: id, deleted: false },
        "-password"
      );

      // Sends a message if the specified user does not exist
      if (!existingUser)
        return res.status(404).send({
          success: false,
          message: "This user does not exist",
        });

      if (reqUserId.toString() !== existingUser._id.toString())
        return res.status(403).send({
          message: "you are not authorised to delete this user",
          status: "failed",
        });

      // This soft deletes a user
      existingUser.deleted = true;
      await existingUser.save();

      // // This also soft deletes all a user's postits
      // await postit.updateMany({author: existingUser._id}, {deleted: true});

      // // This also soft deletes all a user's replies
      // await comment.updateMany({author: existingUser._id}, {deleted: true});

      // Sends a success message and displays the deleted user
      return res.status(200).send({
        success: true,
        message: "User deleted successfully!",
        data: existingUser,
      });
    } catch (err) {
      return res.send({
        error: err,
        message: err.message,
      });
    }
  }

  // Getting a user by id
  async getUser(req, res) {
    try {
      let id = req.params.id;
      const existingUser = await user.find(
        { _id: id, deleted: false },
        "-password"
      );

      // Sends a message if the specified user does not exist
      if (!existingUser)
        return res.status(404).send({
          success: false,
          message: "This user does not exist",
        });

      // Sends a success message and displays user
      return res.status(200).send({
        success: true,
        message: "User fetched successfully!",
        data: existingUser,
      });
    } catch (err) {
      return res.send({
        error: err,
        message: err.message,
      });
    }
  }
}

module.exports = new UserController();
