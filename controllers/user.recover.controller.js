const user = require('../services/user.service')
const { verifyPassword } = require('../services/bcrypt.service') 
const { generateToken } = require('../services/jwt.service') 

class RecoverController{
    async recover(req, res){
        try {
            const { username, email, password } = req.body
            let foundUser;
    
            // Makes sure the user provides their email/username and password
            if(!email && !username) return res.send('Please enter your email address or username')
            if(!password) return res.send('Please enter your password')

            // Makes sure a user isn't signing in with an email and username associated with a disabled user
            foundUser = await user.findWithDetails({ $or: [{ username: username }, { email: email }] })

            if(foundUser && email && foundUser.deleted === true) {
                foundUser.deleted = false
                await foundUser.save()
            }
        
            if(foundUser && username && foundUser.deleted === true) {
                foundUser.deleted = false
                await foundUser.save()
            }
                
            // Returns a message if user doesn't exist
            if(!foundUser || foundUser === null){
                    return res.status(404).send({
                        message: `User does not exist, would you like to sign up instead?`
                    })
                }
    
            // Checks if the password input by the client matches the protected password of the returned user
            const isValid = verifyPassword(password, foundUser.password)
    
            // Sends a message if the input password doesn't match
            if(!isValid){
                return res.status(400).send({
                    message: 'Incorrect password, please retype your password',
                    status: 'failed'
                })
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
            return res.json({
                token: token, 
                user: foundUser, 
                message: 'Account recovered successfully!'
            })
        } catch (err) {
            return res.status(400).send({
                message: err,
                status: 'failed'
            })
        }
    }
}

module.exports = new RecoverController()