const jsonWeb = require("jsonwebtoken");

exports.generateToken = async (id) => {
  let token = jsonWeb.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "24h", 
  });
  return token;
};
