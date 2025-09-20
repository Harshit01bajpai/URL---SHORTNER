const user = require("../models/user");

async function handlecreatesignup(req,res){
    const {name ,email,password,role}=req.body;
     await user.create({
    name,
    email,
    password,
    role,
 });
 return res.render("home");
}

async function handlecreateloginup(req,res){
    const {email,password}=req.body;
    const User= await user.findOne({email,password});
    if (User) {
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

}
}


module.exports={ handlecreatesignup,handlecreateloginup};  
