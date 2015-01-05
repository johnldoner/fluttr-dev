// Fluttr App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'app.services' is found in services.js
// 'app.controllers' is found in controllers.js
angular.module('app', ['firebase', 'app.controllers', 'app.services'])

/*
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
*/

.run(["$rootScope", "Auth", function($rootScope, Auth) {
  $rootScope.user = Auth.$getAuth();
}])

.config(function($stateProvider, $urlRouterProvider) {

  // Uses AngularUI Router, which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })

  // Each tab has its own nav history stack:

  // Login and logout + register
  .state('tab.auth', {
    url: '/login',
    views: {
      'tab-auth': {
          templateUrl: 'templates/tab-auth.html',
          controller: 'AuthCtrl'
        }
      }
    })

  // Fluttr Newsfeed
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  // Idea Swipe
  .state('tab.explore', {
      url: '/explore',
      views: {
        'tab-explore': {
          templateUrl: 'templates/tab-explore.html',
          controller: 'IdeaCtrl'
        }
      }
    })

    // Ideas Liked
    .state('tab.liked', {
        url: '/ideas/liked',
        views: {
          'tab-liked': {
            templateUrl: 'templates/tab-liked.html',
            controller: 'LikeCtrl'
          }
        }
      })

    // Idea Details
    .state('tab.idea-detail', {
      url: '/ideas/:ideaId',
      views: {
        'tab-ideas': {
          templateUrl: 'templates/idea-detail.html',
          controller: 'IdeaDetailCtrl'
        }
      }
    })

     // Float
    .state('tab.idea-float', {
      url: '/ideas/float/:ideaId',
      views: {
        'tab-float': {
          templateUrl: 'templates/idea-float.html',
          controller: 'FloatCtrl'
        }
      }
    })

  // Friends
  .state('tab.friends', {
      url: '/friends',
      views: {
        'tab-friends': {
          templateUrl: 'templates/tab-friends.html',
          controller: 'FriendsCtrl'
        }
      }
    })

    // Friends Detail
    .state('tab.friend-detail', {
      url: '/friend/:friendId',
      views: {
        'tab-friends': {
          templateUrl: 'templates/friend-detail.html',
          controller: 'FriendDetailCtrl'
        }
      }
    })

    // Account
  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});