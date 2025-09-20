const express= require("express");
const mongoose = require("mongoose");

const path=require("path");
const {handlernewcreatedsortid, handleranlytic }=require("./controlers/url");
const{ handlecreatesignup,handlecreateloginup }=require("./controlers/user");
const url=require("./models/url");
const checkauth=require("./service/auth");
const checkrole=require("./service/role");
const session = require("express-session");
const app=express();



//middlewares

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(session({
  secret:"my_secret_key",
  resave:false,
  saveUninitialized:false,
  cookie: {
      maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

app.set("view engine","ejs");
app.set("views",path.resolve("./views"));



mongoose.connect("mongodb://127.0.0.1:27017/urlShortener")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));
 
  app.post("/url",checkauth,handlernewcreatedsortid);
  app.post("/user",handlecreatesignup);
  app.post("/loginpage",handlecreateloginup);
   app.get("/login",(req,res)=>{

    return res.render("login");
  })
  app.get("/signup",(req,res)=>{
    return res.render("signup");
  })

  app.get("/",checkauth,async (req,res)=>{
    const allurls=await url.find({userId: req.session.user._id});
    return res.render("home",{
      urls:allurls,
      user:req.session.user,
    });
  })

  app.get("/admin",checkauth,checkrole("admin"),async (req,res)=>{
    const allurls = await url.find({}).populate("userId", "email name");

    return res.render("adminuser",{
      urls:allurls,
      user:req.session.user,
    })
  })
  app.get("/analytic/:shortid",handleranlytic);

app.get("/url/:shortid", async (req, res) => {
  const shortID = req.params.shortid;

  const entry = await url.findOneAndUpdate(
    { shortid: shortID }, // find by shortid
    {
      $push: { vistedHistory: { timestamp: Date.now() } } // track visit
    },
    {
     $inc: { clicks: 1 }},

    { new: true } // return updated doc
  );

  // Agar shortid mila hi nahi
  if (!entry) {
    return res.status(404).send("URL not found");
  }

  // Browser ko redirect karo original url pe
  res.redirect(entry.givenid);
});



app.listen(8000,()=>{
    console.log("server is started ");
})



