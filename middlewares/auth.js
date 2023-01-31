const jwt = require("jsonwebtoken");

require("dotenv").config();

exports.isAuth = (req, res, next) => {
  const { authorization } = req.headers;

  if (authorization) {
    const token = authorization;
    jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
      if (err) {
        res.status(401).send({ status: false, message: "Invalid Token" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(402).send({ status: false, message: "No Token" });
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role > 0) {
    next();
  } else {
    res.status(401).send({ status: false, message: "User Not Authorized" });
  }
};

exports.isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role > 1) {
    next();
  } else {
    res.status(401).send({ status: false, message: "User Not Authorized" });
  }
};
