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

app.factory("Messages", ["$firebase", "Ref", function($firebase, Ref) {
  var childRef = Ref.child('messages');
  return $firebase(childRef).$asArray();
}]);

app.factory("Projects", ["$firebase", "Ref", function($firebase, Ref) {
  var childRef = Ref.child('projects');
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

//purpose is to pull only the ideas under that users liked section
app.factory("LikedIdeas", ["$firebase","Ref", function($firebase,Ref) {
     return function(userId) {
        var ref = new Firebase(Ref).child("users").child("like").child(userId);
        return $firebase(ref).$asArray();
     }
}]);

app.controller("ctrl", ["$scope","$firebase","cfFloat","Ideas","IdeasComments","Auth","Messages","Proposals","ProposalsComments","Workplans","WorkplansComments","Projects","LikedIdeas", function($scope,$firebase,cfFloat,Ideas,IdeasComments,Auth,Messages,Proposals,ProposalsComments,Workplans,WorkplansComments,Projects,LikedIdeas) {
  $scope.ideas = Ideas;
  $scope.ideas_comments = IdeasComments;
  $scope.auth = Auth;
  $scope.messages = Messages;
  $scope.proposals = Proposals;
  $scope.prcomments = ProposalsComments;
  $scope.workplans = Workplans;
  $scope.wpcomments = WorkplansComments;
  $scope.projects = Projects;
  $scope.cfFloat = cfFloat;
  $scope.idea = "";
  $scope.likedIdeas = LikedIdeas($scope.user.facebook.id); //array is used in browse.html

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

  $scope.FacebookLogin = function () {   
    $scope.auth.$authWithOAuthRedirect('facebook',{remember: "sessionOnly",scope: "email,user_likes"});
    console.log(user.facebook.displayName);
    window.location.href = "explore.html";
  };

  $scope.newIdea = function () {   
    $scope.ideas.$add({
          idea: $scope.idea_title,
          description: $scope.idea_desc,
          category: $scope.idea_cat,
          // targetDate: $scope.idea_expected_launch,
          ideaPic: $scope.idea_pic,
          userId: $scope.user.facebook.id,
          userName: $scope.user.facebook.displayName,
          timestamp: Date.now()
    }).then(function(Ref) {
      console.log("Success!");
      window.location.href="explore.html";
    //  $('#newIdeaModal').modal('hide');
      
    });
  };

  //-------------------PROJECT CODE---------------------------//

  $scope.addProject = function() {
    var project = new Firebase('https://crowdfluttr.firebaseio.com/projects');
    project.push({
      ideaID: $scope.ideaID,
      projTitle: $scope.projTitle,
      projBody: $scope.projBody,
      timestamp: Date.now(),
      userID: $scope.user.facebook.id,
      username: $scope.user.facebook.displayName
    });
  };

  $scope.editProject = function(projID) {
    var newTitle = $scope.projTitle;
    var newBody = $scope.projBody;
    var project = new Firebase('https://crowdfluttr.firebaseio.com/projects');
    // Check for current user before editing
    project.child(projID).update({
      projTitle: newTitle,
      projBody: newBody
    });
  };

  $scope.deleteProject = function(item) {
    $scope.projects.$remove(item);
  };

  //----------------------------------------------------------//

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

  //The below does the following: 
  //add the userid to the idea address
  //adds the ideaId to the user address
  //adds to the counter 
  $scope.LikeIdea = function (LikeorDislike,ideaName,id) {
    var FBURL = "https://crowdfluttr.firebaseio.com/ideas/"+Ideas.$keyAt(id);
    var IdeaRef = new Firebase(FBURL + "/" + LikeorDislike);
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
        current_val[LikeorDislike]++;
        return current_val;
      });

    //adds the idea to the user trunk
    //LIMITATION: This essentially duplicates the idea in the user node
    var FBURL = "https://crowdfluttr.firebaseio.com/users/"+ String($scope.user.facebook.id);
    var IdeaRef = new Firebase(FBURL + "/" + likeVar);
    var IdeaData = $firebase(IdeaRef);
    $scope.IdeaAttributes = IdeaData.$asArray();
    $scope.IdeaAttributes.$add({
        ideaId: Ideas.$keyAt(id),
        idea: ideaName,
        timestamp: Date.now()
      });  

    };

// FLOAT
  $scope.shareIdea = function () {
    var ref = new Firebase("https://crowdfluttr.firebaseio.com/ideas"+ideaID);
    ref.on("value", function(snapshot) {
      var getTitle = snapshot.val();
      console.log("Idea Title: " + getTitle.idea);
      $scope.ideaTitle = getTitle.idea;
    });
    var arr = $( "#tags_1" ).val().split(',');
    jQuery.each( arr, function( i, val ) {
        $scope.val = val;
        $scope.cfFloat.$add({
            ideaID: $scope.ideaID,
            ideaTitle: $scope.ideaTitle,
            recipientEmail: $scope.val,
            senderName: $scope.user.facebook.displayName,
            senderID: $scope.user.facebook.id,
            timestamp: Date.now()
        }).then(function() {
          $scope.val = "";
          console.log('Idea added: ' + val);

            // Assign handlers immediately after making the request,
            // and remember the jqxhr object for this request
        $.post( "https://johnldoner.com/float/", {
                tags_1: val, 
                ideaID: $scope.ideaID,
                ideaTitle: $scope.ideaTitle,
                senderName: $scope.user.facebook.displayName
              }).
            success(function(data, status, headers, config) {
              // this callback will be called asynchronously
              // when the response is available
              console.log( "success: " + $scope.ideaID + "/" + $scope.ideaTitle + " sent to " + $scope.val);
            }).
            error(function(data, status, headers, config) {
              // called asynchronously if an error occurs
              // or server returns response with an error status.
            });   
        });
      return;
    });
      // $('#floatModal').modal('hide');
      $scope.emails = "";
      $( "#float-success" ).fadeIn( "slow" );
      };

//


  $scope.DeleteIdea = function (item) {
        $scope.ideas.$remove(item);
    };

  $scope.ApproveFloat = function (item) {
        $scope.LikeIdea('like', item.$id);
        $scope.cfFloat.$remove(item);
    };

  $scope.DeleteFloat = function (item) {
        $scope.cfFloat.$remove(item);
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
    /*
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
*/
      // GET Information from Workplan IDs
      /*
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
*/

// END: PERMALINKS =========================================================

}]);

app.run(["$rootScope", "Auth", function($rootScope, Auth) {
  $rootScope.user = Auth.$getAuth();
}]);