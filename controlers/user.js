const user = require("../models/user");
const bcrypt= require("bcrypt");

async function handlecreatesignup(req,res){
    const {name ,email,password,role}=req.body;

      const hasedpasword= await bcrypt.hash(password,10);
     await user.create({
    name,
    email,
    password:hasedpasword,
    role,
 });
 if (!name || !email || !password) {
    return res.status(400).send("All fields are required");
}
 return res.render("home");
}

async function handlecreateloginup(req,res){
    const {email,password}=req.body;
    const User= await user.findOne({email});
       if (!User) {
        return res.render("login", { error: "User not found" });
    }
    const ispasswordvalid= await bcrypt.compare(password, User.password);
    if (ispasswordvalid) {
    // sahi user mila
         req.session.user = {
            _id: User._id,
            email: User.email,
            name: User.name,
            role:User.role,
        };
    return res.redirect("/");
  } else {
    // galat credentials -> wapis login page par bhejna with error
    return res.render("login", {
      error: "Invalid email or password",
    });


    if (!email || !password) {
    return res.status(400).send("Email and password required");
}


}
}


module.exports={ handlecreatesignup,handlecreateloginup};  
