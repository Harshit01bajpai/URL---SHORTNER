const url = require("../models/url");
const shortid = require('shortid');

async function handlernewcreatedsortid(req,res){
  const body=req.body;
 const shortId=shortid.generate();
   if(!body.url) return res.status(400).json({error: "URL is required"});
 await url.create({
    shortid: shortId,
    givenid:body.url,
    vistedHistory:[],
    clicks:0,
    userId: req.session.user._id,
 });
return res.render("home",{id:shortId});

}

async function handleranlytic(req,res){
    const shortID=  req.params.shortid;
    const result= await url.findOne({shortid: shortID});
    return res.json({
      click:result.vistedHistory.length,
      analytic:result.vistedHistory
    });
}

module.exports={handlernewcreatedsortid,handleranlytic};