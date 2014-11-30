var app = angular.module("app", ["firebase"]);

app.constant("FBURL", "https://crowdfluttr.firebaseio.com/");

app.service("Ref", ["FBURL", Firebase]);

app.factory("Auth", ["$firebaseAuth", "Ref", function($firebaseAuth, Ref) {
  return $firebaseAuth(Ref);
}]);

app.factory("Ideas", ["$firebase", "Ref", function($firebase, Ref) {
  var childRef = Ref.child('ideas');
  return $firebase(childRef).$asArray();
}]);

app.factory("Users", ["$firebase", "Ref", function($firebase, Ref) {
  var childRef = Ref.child('users');
  return $firebase(childRef).$asArray();
}]);

app.controller("ctrl", ["$scope","Ideas","Users","Auth", function($scope,Ideas,Users,Auth) {
  $scope.users = Users;
  $scope.ideas = Ideas;
  $scope.auth = Auth;
  $scope.idea = "";


  $scope.GoogleLogin = function () {   
    window.location.href = "http://flut.site44.com/" + "explore.html";
    $scope.auth.$authWithOAuthPopup('google')()
  };


  $scope.UpdateFirebaseWithString = function () {   
    $scope.ideas.$add({
      idea: $scope.idea,
          userId: $scope.user.google.id,
          userName: $scope.user.google.displayName,
    }).then(function(ref) {
      clearIdea();
    });

    $scope.users.child($scope.user.google.id).$add({
      idea: $scope.idea,
    }).then(function(ref) {
      clearIdea();
    });

  };


  $scope.DeleteIdea = function (item) {
        $scope.ideas.$remove(item) 
    }

  function clearIdea() {
    $scope.idea = "";
  }
  
}]);

app.run(["$rootScope", "Auth", function($rootScope, Auth) {
  $rootScope.user = Auth.$getAuth();
}]);