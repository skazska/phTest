var express = require('express');
var router = express.Router();
var common = require('../controllers/common.js');

module.exports = function(controller){

  router.get('/items', common.auth, controller.list);
  router.post('/items', common.auth, controller.post);
/*
  router.get('/:itemId', controller.getItem);
  router.delete('/', controller.delItem);
*/
  return router;

};
