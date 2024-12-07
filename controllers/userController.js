// register
const users = require('../models/userModels')
const jwt = require('jsonwebtoken')


// exports.registerController = async (req,res)=>{
//     console.log("inside registerController");
//     const {username,email,password}=req.body
//     console.log(username,email,password);
//     try{
//         const existingUser = await users.findOne({email})
//         if(existingUser){
//             res.status(406).json("User Already exist...Please Login")

//         }else{
//             const newUser = new users({
//                 username,email,password
//             })
//             await newUser.save()
//             res.status(200).json(newUser)

//         }

//     }catch(err){
//     res.status(401).json(err)
// }
// }

exports.registerController = async (req,res)=>{
    console.log("Inside Register Controller");
    console.log(req.body);
    const {firstName, lastName, email, password, phone} = req.body
    try {
        const existingUser = await users.findOne({email})
        if(existingUser)
        {
            res.status(406).json('Already existing user... Please Login!!!') 
        }
        else
        {
            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create and save the new user
            const newUser = new users({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phone,
            });

            await newUser.save();

            // Send response back to client
            res.status(200).json(newUser);
        }
    } catch (err) {
        res.status(401).json(err)
    }   
}

exports.loginController = async (req,res)=>{
    console.log(`Inside loginController`);
    console.log(req.body);
    const {email, password} = req.body
    try{
        const existingUser = await users.findOne({email})
        if(!existingUser)
        {
            res.status(404).json("Incorrect Email / password!!!")
        }

         // Compare the provided password with the hashed password
         const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
         
         if(!isPasswordCorrect)
        {
            res.status(404).json("Incorrect Email / password!!!")
        }

        // token generation
        const token = jwt.sign({userId:existingUser._id},process.env.JWTPASSWORD)

        res.status(200).json({
            user:existingUser,token
        })
        
    }
    catch(err)
    {
        res.status(401).json(err)
    }
}

// need authorization
exports.getAllUserListController = async (req,res)=> {
    console.log(`Inside getAllUserListController`);
    try
    {
        const allUsers = await users.find().select('-password')
        res.status(200).json(allUsers)
    }
    catch(err)
    {
        res.status(401).json(err)
    }
}

exports.getCurrentUserDetailsController = async (req,res)=>{
    console.log(`Inside getCurrentUserDetailsController`);
    const userId = req.userId
    try
    {
        const currentUserDetails = await users.find({userId}).select('-password')
        res.status(200).json(currentUserDetails)
    }
    catch(err)
    {
        res.status(401).json(err)
    }
}