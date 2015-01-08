angular.module('app.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('AuthCtrl', ["$scope", "$firebase", "Auth", function($scope, $firebase, Auth) {
  $scope.auth = Auth;
  $scope.FacebookLogin = function () {   
    $scope.auth.$authWithOAuthRedirect('facebook',{remember: "sessionOnly",scope: "email,user_likes"});
    console.log(user.facebook.displayName);
    window.location.href = "explore.html";
  };
}])

.controller('IdeaCtrl', function($scope, Ideas) {
  $scope.ideas = Ideas.all();
  $scope.remove = function(idea) {
    Ideas.remove(idea);
  };
})

.controller('IdeaDetailCtrl', function($scope, $stateParams, Ideas) {
  $scope.idea = Ideas.get($stateParams.ideaId);
})

.controller('LikeCtrl', function($scope, $stateParams, Ideas) {
  $scope.like = Ideas.get($stateParams.ideaId);
})

.controller('FloatCtrl', function($scope, $stateParams, Ideas) {
  $scope.cfFloat = Ideas.get($stateParams.ideaId);
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});