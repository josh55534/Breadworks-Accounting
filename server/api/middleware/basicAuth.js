const jwt = require("jsonwebtoken");
const config = require("config");

//Checks if there is a token and verifys if the token is valid
function authUser(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ errors: "Token not found." });
  }

  if (!token.startsWith("Bearer ")) {
    return res.status(401).json({ errors: "Token not valid." });
  }

  const tokenValue = token.slice(7, token.length);

  try {
    const verified = jwt.verify(tokenValue, config.get("jwtpass"));

    req.user = verified.user;

    next();
  } catch (error) {
    res.status(401).json({ errors: "token not valid" });
  }
}

//Checks if the role of the user == the role passed into the authRole function
function authRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      res.status(401);
      return res.send("Not allowed need admin role");
    }
    next();
  };
}


module.exports = {
  authUser,
  authRole
};
