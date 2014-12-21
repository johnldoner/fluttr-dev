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

app.factory("IdeasComments", ["$firebase", "Ref", function($firebase, Ref) {
  var childRef = Ref.child('idea-comments');
  return $firebase(childRef).$asArray();
}]);

app.factory("IdeasObject", ["$firebase", function($firebase) {
  var Ref = new Firebase('https://crowdfluttr.firebaseio.com/');
  var childRef = Ref.child('ideas');
  return $firebase(childRef).$asObject();
}]);

app.factory("Messages", ["$firebase", "Ref", function($firebase, Ref) {
  var childRef = Ref.child('messages');
  return $firebase(childRef).$asArray();
}]);

app.factory("Proposals", ["$firebase", "Ref", function($firebase, Ref) {
  var childRef = Ref.child('proposals');
  return $firebase(childRef).$asArray();
}]);

app.factory("ProposalsComments", ["$firebase", "Ref", function($firebase, Ref) {
  var childRef = Ref.child('pr-comments');
  return $firebase(childRef).$asArray();
}]);

app.factory("Workplans", ["$firebase", "Ref", function($firebase, Ref) {
  var childRef = Ref.child('workplans');
  return $firebase(childRef).$asArray();
}]);

app.factory("WorkplansComments", ["$firebase", "Ref", function($firebase, Ref) {
  var childRef = Ref.child('wp-comments');
  return $firebase(childRef).$asArray();
}]);

app.factory("cfFloat", ["$firebase", "Ref", function($firebase, Ref) {
  var childRef = Ref.child('float');
  return $firebase(childRef).$asArray();
}]);

app.factory("User", ["$firebase", "Ref", function($firebase, Ref) {
         return function(userid) {
            var childRef = Ref.child('users').child(userid);
            return $firebase(childRef).$asObject();
         }
}]);

app.controller("ctrl", ["$scope","$firebase","cfFloat","Ideas","IdeasComments","Auth","IdeasObject","Messages","Proposals","ProposalsComments","Workplans","WorkplansComments","User", function($scope,$firebase,cfFloat,Ideas,IdeasComments,Auth,IdeasObject,Messages,Proposals,ProposalsComments,Workplans,WorkplansComments,User) {
  
  $scope.user_profile_update = User($scope.user.facebook.id);
  $scope.ideas = Ideas;
  $scope.ideas_comments = IdeasComments;
  $scope.ideas_object = IdeasObject; 
  $scope.auth = Auth;
  $scope.messages = Messages;
  $scope.proposals = Proposals;
  $scope.prcomments = ProposalsComments;
  $scope.workplans = Workplans;
  $scope.wpcomments = WorkplansComments;
  $scope.cfFloat = cfFloat;
  $scope.idea = "";
    $.urlParam = function(name, url) {
      if (!url) {
       url = window.location.href;
      }
      var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
      if (!results) { 
          return undefined;
      }
      return results[1] || undefined;
    };

  var ideaID = $.urlParam('id');
  var proposalID = $.urlParam('pid');
  var wpID = $.urlParam('wid');
/*
  ideaID = ideaID.split("#")[0];
  proposalID = proposalID.split("#")[0];
  wpID = wpID.split("#")[0];
  */

  $scope.ideaID = ideaID;
  $scope.proposalID = proposalID;
  $scope.wpID = wpID;

  $scope.GoogleLogin = function () {   
    window.location.href = "explore.html";
    $scope.auth.$authWithOAuthPopup('google')();
    console.log(user.google.displayName);
  };

  $scope.FacebookLogin = function () {   
    // window.location.href = "explore.html";
    $scope.auth.$authWithOAuthPopup('facebook')();
    console.log(user.facebook.displayName);
  };

  $scope.TwitterLogin = function () {   
    window.location.href = "explore.html";
    $scope.auth.$authWithOAuthPopup('twitter')();
    console.log(user.twitter.displayName);
  };


  $scope.UpdateFirebaseWithString = function () {   
    $scope.ideas.$add({
          idea: $scope.idea,
          userId: $scope.user.facebook.id,
          userName: $scope.user.facebook.displayName,
          timestamp: Date.now()
    }).then(function(Ref) {
      clearIdea();
    });
  };

  $scope.addCommentonIdea = function () { 
    var addCommentRef = new Firebase('https://crowdfluttr.firebaseio.com/');
    addCommentRef.child('idea-comments').push({
        ideaID: $scope.ideaID,
        ic_body: $scope.newComment,
        userID: $scope.user.facebook.id,
        userName: $scope.user.facebook.displayName,
        timestamp: Date.now()
    });
      $scope.newComment = "";
  };

  $scope.addProposal = function () { 
    var addRevRef = new Firebase('https://crowdfluttr.firebaseio.com/');
    addRevRef.child('proposals').push({
        ideaID: $scope.ideaID,
        ptitle: $scope.ptitle,
        pbody: $scope.value,
        userID: $scope.user.facebook.id,
        userName: $scope.user.facebook.displayName,
        timestamp: Date.now()
    });
      $('#myModal').modal('hide');
  };

  $scope.addCommentonProject = function () { 
    var addCommentRef = new Firebase('https://crowdfluttr.firebaseio.com/');
    addCommentRef.child('pr-comments').push({
        pID: $scope.projectID,
        pr_body: $scope.newComment,
        userID: $scope.user.facebook.id,
        userName: $scope.user.facebook.displayName,
        timestamp: Date.now()
    });
      $scope.newComment = "";
  };

  $scope.addCommentonWorkProduct = function () { 
    var addCommentRef = new Firebase('https://crowdfluttr.firebaseio.com/');
    addCommentRef.child('wp-comments').push({
        wID: $scope.workplanID,
        wc_body: $scope.newComment,
        userID: $scope.user.facebook.id,
        userName: $scope.user.facebook.displayName,
        timestamp: Date.now()
    });
      $scope.newComment = "";
  };

  $scope.LikeIdea = function (likeVar,id) {
    var FBURL = "https://crowdfluttr.firebaseio.com/ideas/"+id;
    var IdeaRef = new Firebase(FBURL + "/" + likeVar);
    var IdeaData = $firebase(IdeaRef);
    $scope.IdeaAttributes = IdeaData.$asArray();
    $scope.IdeaAttributes.$add({
        userId: $scope.user.facebook.id,
        userName: $scope.user.facebook.displayName,
        timestamp: Date.now()
      });

    var likeRef = new Firebase(FBURL + "/likes");
    likeRef.transaction(function(current_val) {
        if( !current_val ) {
            current_val = {like: 0, dislike: 0};
        }
        current_val[likeVar]++;
        return current_val;
      });
    };

// FLOAT
  $scope.shareIdea = function () {
    var arr = $( "#tags_1" ).val().split(',');
    jQuery.each( arr, function( i, val ) {
      // will change this to to dynamic ideaID once templating and permalinking is integrated
        $scope.val = val;
        $scope.cfFloat.$add({
            ideaID: $scope.ideaID,
            recipientEmail: $scope.val,
            senderName: $scope.user.facebook.displayName,
            senderID: $scope.user.facebook.id
        }).then(function() {
          console.log('Idea added: ' + val);
        });
      return;
    });
      $('#floatModal').modal('hide');
      };

//


  $scope.DeleteIdea = function (item) {
        $scope.ideas.$remove(item);
    };

  function clearIdea() {
    $scope.idea = "";
  }

// BEGIN: PERMALINKS =========================================================
  // GET Idea IDs
    var idearef = new Firebase("https://crowdfluttr.firebaseio.com/ideas/" + ideaID);
    /*
    var ideasync = $firebase(idearef);
    var ideasyncObject = ideasync.$asObject();
    ideasyncObject.$bindTo($scope, "data");
    */

  // GET Proposal IDs
    var propref = new Firebase("https://crowdfluttr.firebaseio.com/proposals/" + proposalID);
    /*
    var propsync = $firebase(propref);
    var propsyncObject = propsync.$asObject();
    propsyncObject.$bindTo($scope, "data");
    */

  // GET Workplan IDs
    var wpref = new Firebase("https://crowdfluttr.firebaseio.com/workplans/" + wpID);
    /*
    var wpsync = $firebase(wpref);
    var wpsyncObject = wpsync.$asObject();
    wpsyncObject.$bindTo($scope, "data");
    */

    // GET Information from Idea IDs
  idearef.on("value", function(snapshot) {
    var entries = snapshot.val();
    $scope.ideaTitle = entries.idea;
    var ideaTitle = entries.idea;
    $scope.ideaDesc = entries.description;
    $scope.ideaAuthor = entries.userName;
    $scope.createTime = entries.timestamp;
    var karma = item.child("likes");
    $scope.ideaLikes = entries.likes.like;
    $scope.ideaDislikes = entries.likes.dislike;
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

    // GET Information from Proposal IDs
  propref.on("value", function(snapshot) {
    var entries = snapshot.val();
    $scope.proposalTitle = entries.ptitle;
    var proposalTitle = entries.ptitle;
    $scope.proposalBody = entries.pbody;
    $scope.proposalAuthor = entries.userName;
    $scope.createTime = entries.timestamp;
    var karma = item.child("likes");
    $scope.proposalLikes = entries.likes.like;
    $scope.proposalDislikes = entries.likes.dislike;
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

      // GET Information from Workplan IDs
  wpref.on("value", function(snapshot) {
    var entries = snapshot.val();
    $scope.wptitle = entries.wptitle;
    var wpTitle = entries.wptitle;
    $scope.wpBody = entries.wpBody;
    $scope.wpAuthor = entries.userName;
    $scope.createTime = entries.timestamp;
    var karma = item.child("likes");
    $scope.wpLikes = entries.likes.like;
    $scope.wpDislikes = entries.likes.dislike;
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });


// END: PERMALINKS =========================================================

}]);

app.run(["$rootScope", "Auth", function($rootScope, Auth) {
  $rootScope.user = Auth.$getAuth();
}]);