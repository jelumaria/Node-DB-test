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

exports.registerController = async (req, res) => {
    console.log("Inside Register Controller");
    const { username, email, password } = req.body;

    try {
        // Check for existing user
        const existingUser = await users.findOne({ email });
        if (existingUser) {
            return res.status(406).json({ message: 'User already exists. Please login.' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save new user
        const newUser = new users({
            username,
            email,
            password: hashedPassword
        });

        await newUser.save();

        // Respond with user data (excluding password)
        const { password: _, ...userWithoutPassword } = newUser.toObject();
        res.status(200).json(userWithoutPassword);

    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

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
            user:existingUser,
            token
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