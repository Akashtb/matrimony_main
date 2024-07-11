import jwt from 'jsonwebtoken'
import { createError } from '../utils/error.js'
import Profile from '../models/MatrimonyProfile.js'

export const verifyToken = (req,res,next)=>{
    const token = req.cookies.accessToken
    if(!token){
        return next(createError(401,"You are not authenticated"))
    }
    jwt.verify(token,process.env.JWT,(err,user)=>{
        if(err){
            return next(createError(403,'token is not vaild'))
        }
        req.user = user
        //this will go to next operation
        next()
    })
}

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.id === req.params.userId) {
        next()
      } else {
        return next(
          createError(403, 'You are not authorized user to access this resource.')
        )
      }
    })
  }

  export const verifyProfile = (req,res,next)=>{
    verifyToken(req,res,async()=>{
      const userRefId = req.user.id
      const profileId = req.params.id
      console.log(userRefId);
      const findProfileWithUserId = await Profile.findOne({
        $and: [
        {userId : userRefId},
        {_id : profileId}
        ]
      })
      console.log(findProfileWithUserId);
      if(findProfileWithUserId){
        next()
      }else{
        return next(
          createError(403,'your not have authorized to perform in the matrimonyProfile ')
        )
      }
    })
  }

  export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next()
      } else {
        return next(
          createError(403, 'You are not an admin to perform this operation.')
        )
      }
    })
  }