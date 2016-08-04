/**
 * Created by ska on 8/3/16.
 */
angular.module('testApp.login', ['ui.router'])
  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$provide',
    function($stateProvider, $urlRouterProvider, $httpProvider, $provide) {
      $urlRouterProvider.otherwise('/login');

      $stateProvider
        .state('login', {
          url: '/login',
          templateUrl: 'login/login.html',
          data: {
            needAuth: false
          }
        });

      //http
      $provide.factory('WorksHttpInterceptor1', ['Auth', function(Auth) {
        return {
          // optional method
          'request': function(config) {
            // do something on success
            var auth = Auth.auth();
            if (auth) config.headers['x-token'] = auth.token;
            return config;
          }
        };
      }]);
      $httpProvider.interceptors.push('WorksHttpInterceptor1');

    }]
  )

  .run(['$rootScope', '$state',  'Auth',
    function($rootScope, $state,  Auth){
      $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams, options)
      {
        if ( toState.data && toState.data.needAuth ) {
          if (!Auth.auth()){
            event.preventDefault();
            $state.go("login");
          }
        }
      });
    }
  ])

  .factory('User', ['$resource',
    function($resource) {
      return $resource('api/users/:userId', { userId: '@userId' }, {
        login:{method:'GET', headers: { 'x-secret': ':xSecret' }  }
      });
    }
  ])

  .factory('Login', ['$resource',
    function($resource) {
      return function (credentials){
        return $resource('api/users/:userId', { userId: credentials.userId }, {
          query:{method:'GET', headers: { 'x-secret': credentials.xSecret }  }
        })
      };
    }
  ])

  .factory('Auth', [
    function() {
      var Auth;
      return {
        setAuth: function(auth) {
          Auth = auth;
        },
        auth: function() {
          return Auth;
        }
      }
    }
  ])

  .controller('LoginCtrl', ['$scope', 'Login', 'User', 'Auth', function(scope, Login, User, Auth) {
    scope.init = function(){
      scope.authenticated = Auth.auth();
    }
    scope.login = function(){
      Login(scope.credentials).query(
        {},
        function(res) {
          scope.authenticated = res;
          Auth.setAuth(res);
        },
        function(res){
          scope.msg = res.message;
        }
      );
      return false;
    };
    scope.register = function(){
      User.save(
        scope.user,
        function(res) {
          scope.authenticated = res;
          Auth.setAuth(res);
        },
        function(res){
          scope.msg = res.message;
        }
      );
    };
    scope.credentials = {};
    scope.user = {};

  }]);