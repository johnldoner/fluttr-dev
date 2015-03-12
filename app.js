
/*
function increment(value) {
  return value + 1;
}
*/


// AUTOCOMPLETE RELIES ON NG-TOUCH AND ANGUCOMPLETE. STILL A WORK IN PROGRESS
// var app = angular.module("app", ["firebase", "ngTouch", "angucomplete"]);
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

app.factory("IdeasQuestions", ["$firebase", "Ref", function($firebase, Ref) {
  var childRef = Ref.child('idea-questions');
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

app.factory("Feedback", ["$firebase", "Ref", function($firebase, Ref) {
  var childRef = Ref.child('feedback');
  return $firebase(childRef).$asArray();
}]);

//purpose is to pull only the ideas under that users liked section
app.factory("LikedIdeas", ["$firebase","Ref", function($firebase,Ref) {
     return function(userId) {
        var ref = new Firebase(Ref).child("users").child("like").child(userId);
        return $firebase(ref).$asArray();
     };
}]);

app.controller("ctrl", ["$scope","$firebase","cfFloat","Ideas","IdeasComments","Auth","Messages","Proposals","ProposalsComments","Workplans","WorkplansComments","Projects","LikedIdeas","Feedback","IdeasQuestions", function($scope,$firebase,cfFloat,Ideas,IdeasComments,Auth,Messages,Proposals,ProposalsComments,Workplans,WorkplansComments,Projects,LikedIdeas,Feedback,IdeasQuestions) {

  $scope.ideas = Ideas;
  $scope.ideas_comments = IdeasComments;
  $scope.ideas_questions = IdeasQuestions;
  $scope.auth = Auth;
  $scope.messages = Messages;
  $scope.proposals = Proposals;
  $scope.prcomments = ProposalsComments;
  $scope.workplans = Workplans;
  $scope.wpcomments = WorkplansComments;
  $scope.projects = Projects;
  $scope.cfFloat = cfFloat;
  $scope.feedback = Feedback;
  $scope.idea = "";
  $scope.FBURL = "https://crowdfluttr.firebase.com/";


  $scope.UpdateItem = function (id) {
    $scope.data.$save(id);
  }

  $scope.UpdateFirebaseWithString = function () {   
    $scope.ideas.$add({
      idea: $scope.idea,
      description: $scope.description,
      userId: $scope.user.facebook.id,
    }).then(function(ref) {
      clearIdea();
    });

  };
  
  function clearIdea() {
    $scope.description = "";
    $scope.idea = "";
    
  }

// used for home-B.html
  $scope.getRandom = function(){
  return Math.floor((Math.random()*6)+1);
};
  

  // $scope.likedIdeas = LikedIdeas($scope.user.facebook.id); //array is used in browse.html //causes error with user to be undefined

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

      function AuthHandler(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:" + authData);
        
          window.setTimeout(function(){
              window.location.reload();
                window.setTimeout(function(){
              }, 1000);
              window.location.href = "home.html";



              console.log(user.facebook.displayName);
              
          }, 2000);

      }
    }

  $scope.FacebookLogin = function () {  
    $scope.auth.$authWithOAuthRedirect('facebook', AuthHandler())();
   //Need to have empty parenthesis for login to be called
    console.log(user.facebook.displayName);
  };

  $scope.logout = function () {
    $scope.auth.$unauth();
    window.setTimeout(function(){
        // window.location.reload();
        window.location.href = "/";
    }, 500);

  };


  $scope.checkAuth = function () {
    if (!Auth.$getAuth()) {
    window.location.href = "/";
    }
  };


  $scope.homepageRedirect = function () {
    if (Auth.$getAuth()) {
    window.location.href = "/home.html";
    }
  };

  // use this function on newIdea.html
  $scope.newIdea = function () {   
    if($scope.privacy == null || $scope.privacy == undefined) {
      $scope.privacy = "false";
    }

    var randNum = Math.floor(Math.random() * 100000000);
    console.log(randNum);

    $scope.ideas.$add({
          idea: $scope.idea_title,
          // description: $scope.idea_desc,
          // category: $scope.idea_cat,
          // isPublic: $scope.privacy === false ? "false" : "true",
          // isPublic: $scope.privacy,
          // targetDate: $scope.idea_expected_launch,
          // ideaPic: $scope.idea_pic,
          userId: $scope.user.facebook.id,
          userName: $scope.user.facebook.displayName,
          timestamp: Date.now()
    }).then(function(Ref) {
      clearIdea();
      console.log("Success!");
      // window.location.href="explore.html";
      $( "#newIdea" ).hide( "slow" );
      $( "#newIdea-success" ).fadeIn( "slow" );
    //  $('#newIdeaModal').modal('hide');
     // ideaNumberIncrement();
    });
    ideaNumberIncrement();
  };

/*
   function ideaNumberIncrement() {
    var ref = new Firebase(FBURL);
    var userPath = ref.child("users").child($scope.user.facebook.id);
    var ideaCountPath = userPath.child("ideaCount");
    ideaCountPath.transaction(increment(count));
  }
*/

  // Quick add new idea on navbar
  $scope.qnewIdea = function (idea_title) {   
    $scope.ideas.$add({
          idea: idea_title,
          description: null,
          category: null,
          // targetDate: $scope.idea_expected_launch,
          ideaPic: null,
          userId: $scope.user.facebook.id,
          userName: $scope.user.facebook.displayName,
          timestamp: Date.now()
    }).then(function(Ref) {
      console.log("Success!");
      $scope.quickAdd = true;
      $( "#quickadd-success" ).fadeIn( "slow" );
      // ideaNumberIncrement();
    });
    ideaNumberIncrement();
  };


  // Feedback form
  $scope.newFeedback = function (feedback,rating) {   
    $scope.feedback.$add({
          feedback: feedback,
          rating: rating,
          userId: $scope.user.facebook.id,
          userName: $scope.user.facebook.displayName,
          userEmail: $scope.user.facebook.email,
          status: 'Unresolved',
          timestamp: Date.now()
    }).then(function(Ref) {
      console.log("Success!");
      $scope.feedbackAdd = true;
      $( "#feedback-success" ).fadeIn( "slow" );
      
    });
  };


  $scope.PrivateFloat = function () {
  var email = prompt("Who do you want to float your idea to?", "example@gmail.com");

      var arr = {
      'subject':'Check out the idea at Crowdfluttr',
      'body':'Check out the idea at Crowdfluttr: ' + "https://www.crowdfluttr.com/idea.html?id=" + ideaID,
      'email': email,
      'name': $scope.user.facebook.displayName
      };

      $.ajax({
          url: 'https://worker-aws-us-east-1.iron.io/2/projects/549f2940154782000900002f/tasks/webhook?code_name=mandrill_email&oauth=c1UTtUSXMOUu5LjRXtRk--zOmXQ',
          type: 'POST',
          data: JSON.stringify(arr),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          async: false,
          success: function () {
          alert('Idea Sent');
          }
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
    /*
    var ref = new Firebase(FBURL);
    var userPath = ref.child("users").child($scope.user.facebook.id);
    var projectCountPath = userPath.child("projectCount");
    projectCountPath.transaction(increment(count));
    */
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
  }

  $scope.deleteProject = function(item) {
    $scope.projects.$remove(item);
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
        user_email: $scope.user.facebook.email,
        timestamp: Date.now()
    });
      $scope.newComment = "";
  };


//add in plan part
  $scope.addQuestions = function () { 
    var addQuestionsRef = new Firebase('https://crowdfluttr.firebaseio.com/');
    addQuestionsRef.child('idea-questions').push({
        ideaID: $scope.ideaID,
       // ic_body: $scope.newComment,
        question_content: $scope.newQuestions,
        userID: $scope.user.facebook.id,
        userName: $scope.user.facebook.displayName,
        user_email: $scope.user.facebook.email,
        timestamp: Date.now()
    });
      $scope.newQuestions = "";
  };

  $scope.UpdateItem = function (id) {
    $scope.data.$save(id);
  }

  $scope.addQuestionComment = function (id,s) { 
    var addQuestionsRef = new Firebase('https://crowdfluttr.firebaseio.com/idea-questions/'+id);
    addQuestionsRef.child('questionComments').push({
        ideaID: $scope.ideaID,
       // ic_body: $scope.newComment,
        comment_content: s,
        userID: $scope.user.facebook.id,
        userName: $scope.user.facebook.displayName,
        user_email: $scope.user.facebook.email,
        timestamp: Date.now()
    });
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

  $scope.shareIdea = function () {
    var arr = $( "input" ).val().split(',');
    jQuery.each( arr, function( i, val ) {
        $scope.val = val;
        $scope.messages.$add({
            ideaID: $scope.ideaID,
            recipent: $scope.val,
            // sender: $scope.user.google.email
            ideaTitle: $scope.ideaTitle,
            recipientEmail: $scope.val,
            senderName: $scope.user.facebook.displayName,
            senderID: $scope.user.facebook.id,
            timestamp: Date.now()
        }).then(function() {
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
      $scope.emails = "";
      $( "#float-success" ).fadeIn( "slow" );
    });
  };



  $scope.DeleteIdea = function (item) {
        $scope.ideas.$remove(item);
    };

  $scope.DeleteFeedback = function (item) {
        $scope.feedback.$remove(item);
    };

  $scope.ApproveFloat = function () {
        // $scope.LikeIdea('like', item.$id);
        $scope.LikeIdea('like',item.idea,ideas.indexOf(item));
        $scope.cfFloat.$remove(item);
    };

  $scope.DeleteFloat = function (item) {
        $scope.cfFloat.$remove(item);
    };

  function clearIdea() {
    $scope.idea = "";
  }

  //Add User Profile 
  //Every time the user logs in, it's recorded into user profile node
  $scope.UserSessionSave = function () {
    var url = 'https://crowdfluttr.firebaseio.com/users/'+String($scope.user.facebook.id) + '/sessions'
    var user = new Firebase(url);
    user.push({
        user_displayName: $scope.user.facebook.displayName,
        user_id: $scope.user.facebook.id,
        timestamp: Date.now(),
        user_email: $scope.user.facebook.email,
        page:document.URL
       });
  }



// BEGIN: PERMALINKS =========================================================
  // GET Idea IDs
    var idearef = new Firebase("https://crowdfluttr.firebaseio.com/ideas/" + ideaID);
 /*
    var ideasync = $firebase(idearef);
    var ideasyncObject = ideasync.$asObject();
    ideasyncObject.$bindTo($scope, "data");

  // GET Proposal IDs
    var propref = new Firebase("https://crowdfluttr.firebaseio.com/proposals/" + proposalID);
    var propsync = $firebase(propref);
    var propsyncObject = propsync.$asObject();
    propsyncObject.$bindTo($scope, "data");

  // GET Workplan IDs
    var wpref = new Firebase("https://crowdfluttr.firebaseio.com/workplans/" + wpID);
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
/*
app.controller('ideaPrivacy', ['$scope', function($scope) {
      $scope.value2 = 'YES'
}]);
*/
app.run(["$rootScope", "Auth", function($rootScope, Auth) {
  $rootScope.user = Auth.$getAuth();
}]);



