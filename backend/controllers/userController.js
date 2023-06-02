const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require('../middleware/catchAsyncError');
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail =  require('../utils/sendEmail')
const crypto = require('crypto')


//Register a User
exports.registerUser = catchAsyncErrors(async(req,res,next)=>{


    const {name,email,password} = req.body;

    const user = await User.create({
        name,
        email,
        password
    })

    sendToken(user,200,res)
})


//login user
exports.loginUser = catchAsyncErrors (async(req,res,next)=>{
    const {email,password} = req.body;

    //checking if user has given password and email both

    if(!email || !password){
        return next(new ErrorHandler("please Enter Email && password",400));
    }

    const user = await User.findOne({email}).select("+password");

    if(!user){
        return next(new ErrorHandler('Invalid email or Password',401))
    }

    const isPasswordMatched  = await user.comparePassword(password);

    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalid email or password",401));
    }

    sendToken(user,200,res)
  
})


// LogOut User
exports.logout = catchAsyncErrors(async(req,res,nex)=>{

    res.cookie("token",null,{
        expires: new Date(Date.now()),
        httpOnly:true
    })

    res.status(200).json({
        success:true,
        message:" Logged Out",
    })
})



// Forgot password

exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findOne({email:req.body.email});

    if(!user){
        return next(new ErrorHandler("User not found",404));
    }

    //Get ResetPassword Token
    const restToken = user.getResetPasswordToken();
    user.resetPasswordExpire = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    await user.save({validateBeforeSave:false})

   //const restPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${restToken}`
   const restPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${restToken}`

    const message = `Click on the Link to change your Password :- \n\n ${restPasswordUrl} \n\n If you have not requested this email then please ignore it.`

    try {
        await sendEmail({
            email:user.email,
            subject: `Password Recovery`,
            message
        });

        res.status(200).json({
            success:true,
            message: `Email sent to ${user.email} successfully`
        })
        
    } catch (error) {
        user.resetPasswordToken= undefined;
        user.resetPasswordExpire = undefined

        await user.save({validateBeforeSave:false})

        return next(new ErrorHandler(error.message,500))
    }
})


//reset password

exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{
    
    //creating token hash

    const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire:{$gt:Date.now()}
    })

    if(!user){
        return next(new ErrorHandler("Reset Password Token is invalid or has been expired",404));
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler("password does not matched"),400)
    }

    user.password = req.body.password;
    user.resetPasswordToken= undefined;
    user.resetPasswordExpire = undefined;

    await user.save();
    sendToken(user,200,res)

})


//Get User Details

exports.getUserDetails = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id);
    res.status(200).json({
        success:true,
        user,
    })
   
})


//update User  password
exports.updatePassword = catchAsyncErrors(async(req,res,next)=>{

    const user = await User.findById(req.user.id).select("+password");

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

    if(!isPasswordMatched){
        return next(new ErrorHandler("OldPassword is incorrect",400));
    }

    if(req.body.newPassword != req.body.confirmPassword){
        return next(new ErrorHandler("OldPassword is incorrect",400));
    }

    user.password = req.body.newPassword;

    await user.save();

    sendToken(user,200,res)
})


//update User Profile
exports.updateProfile = catchAsyncErrors(async(req,res,next)=>{

    const newUserData ={
        name:req.body.name,
        email:req.body.email,  
    }

    // if(req.body.avatar !== ""){
    //     const user = await User.findById(req.user.id);

    //     const imageId = user.avatar.public_id;

    //     await cloudinary.v2.uploader.destroy(imageId)

    //     const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar,{
    //         folder: "avatars",
    //         width:150,
    //         crop:"scale",
    //     })
    
    //     newUserData.avatar ={
    //             public_id:myCloud.public_id,
    //             url:myCloud.secure_url,
    //     }
    // }

    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })

        const message = `User profile updated succesfully`
        res.status(200).json({
        success:true,
        message,
        
    })
})

//Get all Users (admin)
exports.getAllUser = catchAsyncErrors(async (req,res,next)=>{
    const users = await User.find();

    res.status(200).json({
        success:true,
        users,
    })
})


//Get Single User (admin)
exports.getSingleUser = catchAsyncErrors(async (req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new ErrorHandler(`user does not exist with Id: ${req.params.id}`))
    }

    res.status(200).json({
        success:true,
        user
    })
})


//update User Role --Admin
exports.updateUserRole = catchAsyncErrors(async(req,res,next)=>{

    const newUserData ={
        name:req.body.name,
        email:req.body.email, 
        role:req.body.role,
    }


    const user = await User.findByIdAndUpdate(req.user.id,newUserData,{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })

        const message = `User profile updated succesfully`
        res.status(200).json({
        success:true,
        message,
        
    })
})


//Delete User --- Admin
exports.deleteUser = catchAsyncErrors(async(req,res,next)=>{


    const user = await User.findById(req.params.id);

    //I will remove cloudinary later

    if(!user){
        return next(new ErrorHandler(`user does not exist with Id: ${req.params.id}`))
    }

  
    await User.findByIdAndRemove(req.params.id);

        res.status(200).json({
        success:true,
        message:"User deleted successfully"
    })
})