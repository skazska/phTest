/**
 * Created by ska on 8/4/16.
 */
var _ = require("lodash");
var SHA256 = require("crypto-js/sha256");
var uuid = require('uuid');

module.exports = function(db, sessions){

  var col = db.collection('users');
  col.createIndex(
    {username:1}
    ,{unique:true, background:false, w:1}, function(err, indexName) {
      console.log("index created");
    }
  );

  return {
    get: function(req, res, next){
      col.find({username: req.params.itemId, password: SHA256(req.headers['x-secret']||"").toString()}).limit(1).next(function(err, value){
        if (err) return res.xSet(500, err);
        if (!(value)) return res.xSet(403, "no luck", next);
        value.token = uuid.v4();
        sessions.set(value.token, 'user', value);
        res.xSet(200, _.omit(value, ['password']), next);
      })
    },
    post: function(req, res, next){
      if (req.body.password) req.body.password = SHA256(req.body.password).toString();
      if (req.body.itemId) {
        var id = req.body.itemId;
        delete req.body.itemId;
        if (id != req.user._id) return res.xSet(403, "no luck", next);
        col.updateOne({_id:id.toString()}, {$set: req.body}, {  })
          .then(
            function(r) {
              res.xSet(202, r, next);
            },
            function(err) {
              res.xSet(501, err, next);
            }
          );
      } else {
        if (!(req.body.username && req.body.password)) return res.xSet(404, "bad request", next);
        col.insertOne( req.body, {  })
          .then(
            function(r) {
              col.find({_id: r.insertedId}).limit(1).next(function(err, value){
                if (err) return res.xSet(500, err, next);
                if (!(value)) return res.xSet(403, "no luck", next);
                value.token = uuid.v4();
                sessions.set(value.token, 'user', value);
                res.xSet(200, _.omit(value, ['password']), next);
              })
            },
            function(err) {
              res.xSet(500, err, next);
            }
          );

      }
    }
  }
};