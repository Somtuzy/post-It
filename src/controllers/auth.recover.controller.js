const user = require('../services/user.service')
const { verifyPassword } = require('../services/bcrypt.service') 
const { generateToken } = require('../services/jwt.service') 

class RecoverController{
    async recover(req, res){
        try {
            const { username, email, password } = req.body
            let foundUser;
    
            // Makes sure the user provides their email/username and password
            if(!email && !username) return res.status(400).json(`Please enter your email address or username to continue`)
            if(!password) return res.status(400).json(`Please enter your password to continue`)

            // Makes sure a user isn't signing in with an email and username associated with a disabled user
            foundUser = await user.findWithDetails({ $or: [{ username: username }, { email: email }] })

            // Returns a message if user doesn't exist
            if(!foundUser || foundUser === null){
                return res.status(404).json({
                    message: `User does not exist, would you like to sign up instead?`,
                    success: false
                })
            }

            // Checks if the password input by the client matches the protected password of the returned user
            const isValid = await verifyPassword(password, foundUser.password)
    
            // Sends a message if the input password doesn't match
            if(!isValid){
                return res.status(401).json({
                    message: `Incorrect password, please retype your password`,
                    success: false
                })
            }

            if(foundUser && username && foundUser.deleted === false) return res.status(403).json({
                message: `This username belongs to an active user, please sign in instead`,
                success: false
            })

            if(foundUser && email && foundUser.deleted === false) return res.status(403).json({
                message: `This email belongs to an active user, please sign in instead`,
                success: false
            })

            if(foundUser && email && foundUser.deleted === true) {
                foundUser.deleted = false
                await foundUser.save()
            }
        
            if(foundUser && username && foundUser.deleted === true) {
                foundUser.deleted = false
                await foundUser.save()
            }
    
            // Stores the returned user's unique id in an object to generate a token for the user 
            const token = generateToken({id: foundUser._id})
    
            // This saves the token as a cookie for the duration of its validity just to simulate how the request header works for the purpose of testing.
            res.cookie('token', token, {httpOnly: true})
    
            // Removes password from output
            foundUser = await user.find({username: foundUser.username})
    
            // Sends success message on the console
            console.log(`Token successfully generated for ${foundUser}`);
    
            // Sends the token to the client side for it to be set as the request header using axios
            return res.status(200).json({
                success: true,
                token: token, 
                user: foundUser, 
                message: `User account ${foundUser.username} recovered successfully!`
            })
        } catch (err) {
            return res.status(500).json({
                message: err.message,
                success: false
            })
        }
    }
}

module.exports = new RecoverController()