/**
 * Created by ska on 8/3/16.
 */
angular.module('testApp.work', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
      $urlRouterProvider.otherwise('/login');

      $stateProvider
        .state('work', {
          url: '/work',
          templateUrl: 'work/work.html',
          data: {
            needAuth: true
          }
        })

    }]
  )

  .factory('Item', ['$resource',
    function($resource) {
      return $resource('api/items/:itemId', { userId: '@itemId' }, {
      });
    }
  ])


  .controller('WorkCtrl', ['$scope', 'Item', function(scope, Item) {

    scope.load = function(){
      Item.query(
        {},
        function(res) {
          scope.items = res;
        },
        function(res){
          scope.msg = res.message;
        }
      )
    };

    scope.init = function(){
      scope.load();
    };

    scope.add = function(){
      Item.save(
        scope.item,
        function(res) {
          scope.load();
        },
        function(res){
          scope.msg = res.message;
        }
      );
    };

  }]);