import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import expressJwt from 'express-jwt'
import config from './../../config/config'
import bcrypt from "bcryptjs";

const signin = async (req, res) => {
  try {
    let user = await User.findOne({
      "email": req.body.email
    })
    if (!user)
      return res.status('401').json({
        error: "User not found"
      })

    if (!user.authenticate(req.body.password)) {
      return res.status('401').send({
        error: "Email and password don't match."
      })
    }

    const accessToken = jwt.sign({
      _id: user._id
    }, config.jwtSecret, { expiresIn: "5m" }) //access token expire in 5m

    // set refreshToken
    const refreshToken = jwt.sign({
      _id: user.id
    }, config.jwtSecret, { expiresIn: "7d" })// need to change the config jwtSecret to refresh token secret

    //update user model refreshToken field
    const salt = await bcrypt.genSalt();
    const hashRefreshToken = await bcrypt.hash(refreshToken, salt);
    console.log('hash', hashRefreshToken)
    user.refreshToken = hashRefreshToken
    await user.save()
    //

    res.cookie("t", accessToken, {
      httpOnly:true
    })

    return res.json({
      refreshToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    })

  } catch (err) {
    console.error(err)
    return res.status('401').json({
      error: "Could not sign in"
    })

  }
}

const signout = (req, res) => {
  res.clearCookie("t")
  return res.status('200').json({
    message: "signed out"
  })
}

const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: 'auth'
})

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id
  if (!(authorized)) {
    return res.status('403').json({
      error: "User is not authorized"
    })
  }
  next()
}

const getRefreshToken = async (req,res)=>{
  try {
    const id = jwt.decode(req.cookies.t)._id
    // check if user id is valid from database
    let user = await User.findById(id).exec()
    if(!user){
      return res.status('401').json({
        error: "User not found"
      })
    }else{
      //generate new access token
      const accessToken = jwt.sign({
        _id: user._id
      }, config.jwtSecret, { expiresIn: "5m" }) //access token expire in 5m
      //attach new access token with the cookie
      res.cookie("t", accessToken, {
        httpOnly:true
      })
      return res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      })

    }

  } catch (error) {
    console.error(error)
    return res.status('500').json({
      error: "Internal server error"
    })
  }
}

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
  getRefreshToken
}
