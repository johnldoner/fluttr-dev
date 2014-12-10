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

app.factory("Messages", ["$firebase", "Ref", function($firebase, Ref) {
  var childRef = Ref.child('messages');
  return $firebase(childRef).$asArray();
}]);

app.controller("ctrl", ["$scope","Ideas","Users","Auth","Messages", function($scope,Ideas,Users,Auth,Messages) {
  $scope.users = Users;
  $scope.ideas = Ideas;
  $scope.auth = Auth;
  $scope.messages = Messages;
  $scope.idea = "";


  $scope.GoogleLogin = function () {   
 //   window.location.href = "http://flut.site44.com/" + "explore.html";
    $scope.auth.$authWithOAuthPopup('google')();
    $scope.username = $scope.auth.google.displayName;
  };

  $scope.UpdateFirebaseWithString = function () {   
    $scope.ideas.$add({
      idea: $scope.idea,
          userId: $scope.user.google.id,
          userName: $scope.user.google.displayName,
          userEmail: $scope.user.google.email
    }).then(function() {
      clearIdea();
    });

    $scope.users.child($scope.user.google.id).$add({
      idea: $scope.idea,
    }).then(function() {
      clearIdea();
    });

  };


  $scope.shareIdea = function () {
    var arr = $( "input" ).val().split(',');
    jQuery.each( arr, function( i, val ) {
      // will change this to to dynamic ideaID once templating and permalinking is integrated
    $scope.ideaID = "-JbSSmv_rJufUKukdZ5c"; 
            // Get a reference to our posts
    var ref = new Firebase("https://crowdfluttr.firebaseio.com/ideas/" + $scope.ideaID);
    // Attach an asynchronous callback to read the data at our posts reference
    ref.on("value", function(snapshot) {
      console.log(snapshot.val());
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

        $scope.val = val;
        $scope.messages.$add({
            ideaID: $scope.ideaID,
            recipent: $scope.val,
            // sender: $scope.user.google.email
        }).then(function() {
          console.log('Idea added: ' + val);
        });
      return;
    });  };

  $scope.DeleteIdea = function (item) {
        $scope.ideas.$remove(item);
    };

  function clearIdea() {
    $scope.idea = "";
  }

  
}]);

app.run(["$rootScope", "Auth", function($rootScope, Auth) {
  $rootScope.user = Auth.$getAuth();
}]);