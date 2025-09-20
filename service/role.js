function checkrole(role){
      return (req, res, next) => {
    if (req.session.user && req.session.user.role === role) {
      return next();
    }
    return res.status(403).send("Forbidden: You don't have access");
  };
}


module.exports=checkrole;