const user = require("../services/user.service");
const { hashPassword, verifyPassword } = require("../services/bcrypt.service");

class UserController {
  // Updating a user
  async updateUser(req, res) {
    try {
      const { fullname, username, email, password, newPassword, age } = req.body;
      const id = req.params.id;
      const reqUserId = req.user.id;

      // Checks if user already exists
      const existingUser = await user.findWithDetails({ _id: id, deleted: false });

      // Sends a message if the specified user does not exist
      if (!existingUser) {
        return res.status(404).json({
          message: `This user does not exist`,
          success: false
        });
      }

      if (reqUserId !== existingUser._id.toString())
        return res.status(403).json({
          message: `You cannot update this user`,
          success: false
        });

      // Updates the user based on what was provided
      const data = {}
      if (fullname) data.fullname = fullname
      if (username) data.username = username
      if (email) data.email = email
      if (age) data.age = age

      if (!password && newPassword) return res.status(401).json({
        message: `Please input your current password`,
        success: false
      })

      if (password && !newPassword) return res.status(401).json({
        message: `Please input your new password`,
        success: false
      })

      if(password && newPassword) {
        const isValid = await verifyPassword(password, existingUser.password)
        if(!isValid) return res.status(400).json({
            message: `Password is incorrect`,
            success: false
          })

        const updatedPassword = await hashPassword(newPassword)
        if(updatedPassword) data.password = updatedPassword;
      }

      let updatedUser;
      updatedUser = await user.update(id, data);
      updatedUser = await user.find({ _id: updatedUser._id }, "-password -replies -postits -deleted");

      // Sends a success message and displays the updated user
      const message = {}

      // Sends a success message and displays the updated user
      if(data.fullname) message.fullname = `Updated successfully!`;

      if(data.username) message.username = `Updated successfully!`;

      if(data.email) message.email = `Updated successfully!`;
      
      if(data.age) message.age = `Updated successfully!`;
    
      if(data.password) message.password = `Changed successfully!`;
    
      return res.status(200).json({
        message: message,
        success: true
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
        success: false
      });
    }
  }

  // Deleting a user
  async deleteUser(req, res) {
    try {
      const id = req.params.id;
      const reqUserId = req.user.id;

      const existingUser = await user.find({ _id: id, deleted: false }, "-password");

      // Sends a message if the specified user does not exist
      if (!existingUser)
        return res.status(404).json({
          message: `This user does not exist`,
          success: false
        });

      if (reqUserId !== existingUser._id.toString())
        return res.status(403).json({
          message: `You cannot delete this user`,
          success: false,
        });

      // This soft deletes a user
      existingUser.deleted = true;
      await existingUser.save();

      // // This also soft deletes all a user's postits
      // await postit.updateMany({author: existingUser._id}, {deleted: true});

      // // This also soft deletes all a user's replies
      // await comment.updateMany({author: existingUser._id}, {deleted: true});

      // Sends a success message and displays the deleted user
      return res.status(200).json({
        message: `User deleted successfully!`,
        success: true,
        data: existingUser,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
        success: false
      });
    }
  }

  // Getting a user by id
  async getUser(req, res) {
    try {
      let id = req.params.id;
      const existingUser = await user.find({ _id: id, deleted: false }, "-password");

      // Sends a message if the specified user does not exist
      if (!existingUser)
        return res.status(404).json({
          message: `This user does not exist`,
          success: false
        });

      // Sends a success message and displays user
      return res.status(200).json({
        message: `User fetched successfully!`,
        success: true,
        data: existingUser,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
        success: false
      });
    }
  }

  // Getting all users
  async getUsers(req, res) {
    try {
      const users = await user.findAll({ deleted: false });

      // Sends a message if no users exist
      if (!users)
        return res.status(404).json({
          message: `Oops, it seems like there are no users yet`,
          success: false,
        });

      // Sends a success message and displays users
      return res.status(200).json({
        message: `Users fetched successfully!`,
        success: true,
        data: users,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
        success: false
      });
    }
  }

  // Getting a user by handle
  async getUserByHandle(req, res) {
    try {
      let handle = req.params.handle;
      const existingUser = await user.find({username: handle, deleted: false});

      // Sends a message if the specified user does not exist
      if (!existingUser)
        return res.status(404).json({
          message: `This user does not exist`,
          success: false
        });

      // Sends a success message and displays user
      return res.status(200).json({
        message: `User fetched successfully!`,
        success: true,
        data: existingUser,
      });
    } catch (err) {
      return res.status(500).json({
        message: err.message,
        success: false
      });
    }
  }
}

module.exports = new UserController();
