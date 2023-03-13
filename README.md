# post-It

Postit is a social media app where users can share and exchange thoughts in texts. Users need to sign in to be able to use the endpoints to create, update, delete and get postits and comments.

## Development Dependencies & Their Software Version
• Nodejs (v18.12.1) <br>
• Express (v4.18.2) <br> 
• Mongoose (v7.0.1) <br>
• Bcrypt (v5.1.0) <br>
• Jsonwebtoken (v9.0.0) <br>
• Joi (v17.8.3) <br>
• Cookie Parser (v1.4.6) <br>
• Dotenv (v16.0.3) <br>

## How to Install And Run Code
• Download the zip or clone repository and open terminal. <br>
• Use npm install to install all dependencies. <br>
• Download Postman, Swagger, Insomnia or use the Thunder Client extension on VS Code to simulate running the code as a user on the client side. <br>
• Check the contents of the .env.example to set up your .env file <br>
• Connect your MongoDb Atlas database with the url. <br>
• Use node app.js to run the program.


#### The link below contains a documentation on how to use this API below with samples of requests and responses:
 • [Postit API Documentation](https://postit-1rn8.onrender.com/api/v1/docs)

#### The link below contains a database model diagram showing the relationship between users, postits and comments (user replies):
 • [Postit Data Modelling](https://dbdesigner.page.link/5FAaVLnsH7uB8ned7)


 Soft deleted postits were stored on the database for security reasons and to keep track of all past user interactions in accordance with privacy laws for future references.
