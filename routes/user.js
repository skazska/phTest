var express = require('express');
var router = express.Router();


module.exports = function(controller){
  /* GET home page. */
  router.get('/users/:itemId', controller.get);
  router.post('/users', controller.post);

  return router;

};
