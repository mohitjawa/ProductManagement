const {
  User,
  Token
} = require("../model/index");
const codeAndMessage = require("../helper/error-code-message/error-code-message");
const Utility = require("../helper/utilities/common");
require("dotenv").config();
var jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const axios=require('axios')

exports.signup = async (req, res) => {
  try {
    const {userName,password } = req.body;
    const existingUser = await User.findOne({userName})
      if (existingUser) {
        return res.status(400).json({
          message: "Username already registered",
        });
      } 
    const hashPassword = await Utility.encryptPassword(password);
    await User.create({userName,password:hashPassword})
    return res.status(codeAndMessage.successOk).json({
      code: codeAndMessage.successOk,
      httpCode: codeAndMessage.successOk,
      message: codeAndMessage.successOk,
    });
  }catch (error) {
    console.log(error)
    return res.status(codeAndMessage.badRequestCode).json({
      code: codeAndMessage.badRequestCode,
      httpCode: codeAndMessage.badRequestHttpCode,
      message: codeAndMessage.badRequestMessage,
    });
  }
};
exports.login = async (req, res) => {
  try {
    const { userName,password } = req.body;
    const UserExist = await User.findOne({ userName });
    if (UserExist == null) {
      return res.status(200).json({
        message: codeAndMessage.notFoundUserMessage,
      });
    }
    const hashPassword = await Utility.validatePassword(
      password,
      UserExist.password
    );
    if (!hashPassword) {
      return res.status(404).json({
        message: codeAndMessage.incorrectPass,
      });
    }
    const token = jwt.sign(
      {
        data: UserExist._id,
      },
      process.env.JWTPASS,
      {
        expiresIn: "23h",
      }
    );
    return res.status(codeAndMessage.successOk).json({
      message: codeAndMessage.successMessage,
      token: token,
      data: await User.findOne({ userName },{password:0,__v:0}),
    });
  } catch (error) {
    console.log(error)
    return res.status(codeAndMessage.badRequestCode).json({
      code: codeAndMessage.badRequestCode,
      httpCode: codeAndMessage.badRequestHttpCode,
      message: codeAndMessage.badRequestMessage,
    });
  }
};
exports.productList = async (req, res) => {
  try {
    const products=await axios.get("https://dummyjson.com/products");
    let dataArray={}
    for(let i=0;i<products.data.products.length;i++){
      let category=products.data.products[i].category;
      const {thumbnail,title,price}=products.data.products[i]
     if(!dataArray[category]){
      dataArray[category]=[]
     }else{
      dataArray[category].push({thumbnail,title,price})
     }
    }
    return res.status(codeAndMessage.successOk).json({
      code: codeAndMessage.successOk,
      httpCode: codeAndMessage.successOk,
      message: codeAndMessage.successOk,
      data:dataArray
    });
  } catch (error) {
    console.log(error)
    return res.status(codeAndMessage.successOk).json({
      code: codeAndMessage.badRequestCode,
      httpCode: codeAndMessage.badRequestHttpCode,
      message: codeAndMessage.badRequestMessage,
    });
  }
};
exports.logOut = async (req, res) => {
  try {
    await Token.findOneAndUpdate({userId:req.userId},
      { $push: { token: req.headers.authtoken },userId:req.userId },
      { upsert: true } 
  )
    return res.status(codeAndMessage.successOk).json({
      code: codeAndMessage.successOk,
      httpCode: codeAndMessage.successOk,
      message: codeAndMessage.successOk,
    });
  } catch (error) {
    console.log(error)
    return res.status(codeAndMessage.successOk).json({
      code: codeAndMessage.badRequestCode,
      httpCode: codeAndMessage.badRequestHttpCode,
      message: codeAndMessage.badRequestMessage,
    });
  }
};
