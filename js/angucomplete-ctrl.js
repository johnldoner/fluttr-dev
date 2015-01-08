app.controller('MainController', ['$scope', '$firebase', '$http',
    function MainController($scope, $http, $firebase) {

      /*
        $scope.people = [
            {firstName: "Daryl", surname: "Rowland", twitter: "@darylrowland", pic: "https://graph.facebook.com/picture?type=normal"},
            {firstName: "Alan", surname: "Partridge", twitter: "@alangpartridge", pic: "img/alanp.jpg"},
            {firstName: "Annie", surname: "Rowland", twitter: "@anklesannie", pic: "img/annie.jpg"}
        ];
        */


      var ref = new Firebase("https://crowdfluttr.firebaseio.com/users");
      ref.once("child_added", function(snapshot) {
        // console.log(snapshot.val());
        var entries = snapshot.val();
            $scope.userName = entries.userName;
            $scope.people = [
                  { firstName: "hello", surname: "world", twitter:"@test", pic: "https://graph.facebook.com/picture?type=normal" }
                  ];




            console.log(entries.userName);
            console.log($scope.people);
        //$scope.people = snapshot.val(userName);
      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

    }
]);