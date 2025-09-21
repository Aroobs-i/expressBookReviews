const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());


app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the session contains an authorization token
    if (req.session.authorization && req.session.authorization.accessToken) {
      const accessToken = req.session.authorization.accessToken;
  
      // Verify the JWT token
      jwt.verify(accessToken, "access", (err, user) => {
        if (err) {
          return res.status(401).json({ message: "Unauthorized access: Invalid token" });
        } else {
          // Token is valid, proceed to next middleware or route handler
          req.user = user; // Optionally attach user info to the request
          next();
        }
      });
    } else {
      return res.status(403).json({ message: "Access denied: No token provided" });
    }
  });
 
const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
