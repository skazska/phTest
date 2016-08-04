/**
 * Created by ska on 8/4/16.
 */
module.exports = {
  auth: function(req,res,next){
    if (!req.user) return res.status(403).send({message: "not authorised"});
    next();
  }
}