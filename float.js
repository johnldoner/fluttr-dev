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

app.factory("cfFloat", ["$firebase", "Ref", function($firebase, Ref) {
  var childRef = Ref.child('float');
  return $firebase(childRef).$asArray();
}]);

app.factory("Messages", ["$firebase", "Ref", function($firebase, Ref) {
  var childRef = Ref.child('messages');
  return $firebase(childRef).$asArray();
}]);

function increment(value) {
  return value + 1;
}

app.controller("ctrl", ["$scope","Ideas","Users","Auth","Messages","cfFloat", function($scope,Ideas,Users,Auth,Messages,cfFloat) {
  $scope.users = Users;
  $scope.ideas = Ideas;
  $scope.auth = Auth;
  $scope.messages = Messages;
  $scope.cfFloat = cfFloat;
  $scope.idea = "";


  $scope.FacebookLogin = function () {   
 //   window.location.href = "http://flut.site44.com/" + "explore.html";
    $scope.auth.$authWithOAuthPopup('facebook')();
    $scope.username = $scope.auth.facebook.displayName;
  };


  $scope.shareIdea = function () {
    var arr = $( "input" ).val().split(',');
    jQuery.each( arr, function( i, val ) {
      // will change this to to dynamic ideaID once templating and permalinking is integrated
    $scope.ideaID = "-JcXFk3iWiDxisvWllLx"; 

    //Increments the counter for number of idea shares
    var origRef = new Firebase(FBURL);
    var userPath = origRef.child("users").child($scope.user.facebook.id);
    var shareCountPath = userPath.child("shareCount");
    shareCountPath.transaction(increment(count));


            // Get a reference to our posts
    var ref = new Firebase("https://crowdfluttr.firebaseio.com/ideas/" + $scope.ideaID);
    // Attach an asynchronous callback to read the data at our posts reference
    ref.on("value", function(snapshot) {
      console.log(snapshot.val());
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

        $scope.val = val;
        $scope.cfFloat.$add({
            ideaID: $scope.ideaID,
            recipientEmail: $scope.val,
            senderName: $scope.user.facebook.displayName,
            senderID: $scope.user.facebook.id
        }).then(function() {


              var  str = $( "form" ).serialize();
             // $( "#tags_1" ).text( str );
              console.log(str);

          /*
          $.post( "test.php", function( val ) {
            $("tags_1").serialize();
            console.log(val);
          });
          */
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