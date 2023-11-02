const jwt = require("jsonwebtoken");
const codeAndMessage = require("../error-code-message/error-code-message");
require("dotenv").env;
const {Token}=require('../../model/index')

exports.checkToken = async (req, res, next) => {
  jwt.verify(
    req.headers.authtoken,
    process.env.JWTPASS,
    async function (err, decoded) {
      if (err) {
        return res.status(codeAndMessage.badRequestHttpCode).json({
          httpCode: codeAndMessage.badRequestHttpCode,
          code: codeAndMessage.badRequestHttpCode,
          message: codeAndMessage.badRequestHttpCode,
        });
      } else {
        req.userId = decoded.data;

        try {
          const revokeCheck=await Token.findOne({
            $and: [
                { userId: req.userId },
                { token:{$in:[req.headers.authtoken]}}
            ]
        })
          if (revokeCheck) {
            return res.status(codeAndMessage.badRequestHttpCode).json({
              httpCode: codeAndMessage.badRequestHttpCode,
              code: codeAndMessage.badRequestHttpCode,
              message: codeAndMessage.invalidTokenMessage,
            });
          } else {
            next();
          }
        } catch (error) {
          return res.status(codeAndMessage.badRequestHttpCode).json({
            httpCode: codeAndMessage.badRequestHttpCode,
            code: codeAndMessage.badRequestHttpCode,
            message: codeAndMessage.badRequestHttpCode,
          });
        }
      }
    }
  );
};

