/**
 * Created by ska on 8/4/16.
 */
var _ = require('lodash');

module.exports = function(db){

  var col = db.collection('items');

  return {
    list: function(req, res, next){
      var query = {};
      if (req.query.fromDt) query.dt = _.assign(query.dt||{}, {$gte: new Date(req.query.fromDt)});
      if (req.query.toDt) query.dt = _.assign(query.dt||{}, {$lt: new Date(req.query.toDt)});
      if (!req.query.limit) req.query.limit = 20;
      col.find(query).sort({date: -1}).skip(req.query.skip||0).limit(req.query.limit).toArray(function(err, values){
        if (err) return res.xSet(500, err, next);
        res.xSet(200, values, next);
      })
    },
    get: function(req, res, next){
      col.find({_id: req.params.requestId}).limit(1).next(function(err, value){
        res.xSet(200, value, next);
      })
    },
    post: function(req, res, next){
      if (req.body.requestId) {
        var id = req.body.requestId;
        delete req.body.requestId;
        col.updateOne({_id:id.toString()}, {$set: req.body}, { upsert : true })
          .then(
            function(r) {
              res.xSet(202, r, next);
            },
            function(err) {
              res.xSet(501, err, next);
            }
          );
      } else {
        col.insertOne( req.body, {  })
          .then(
            function(r) {
              col.find({_id: r.insertedId}).limit(1).next(function(err, value){
                if (err) return res.xSet(500, err, next);
                if (!(value)) return res.xSet(400, "no luck", next);
                res.xSet(200, value, next);
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