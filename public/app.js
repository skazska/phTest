angular.module('testApp', [
  'ngResource',
  'ui.router',
//  'testApp.common',
  'testApp.login',
  'testApp.work',
//  'testApp.report'
])
  .config(['$locationProvider',
    function( $locationProvider) {
      $locationProvider.hashPrefix('!');
  //    $locationProvider.html5Mode(true);
    }]
  )

