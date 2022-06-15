const functions = require('firebase-functions');
var cors = require('cors');
// for facebook (official node SDK from FB)
const {FB, FacebookApiException} = require('fb');
// fb test
exports.getCurrentFBUser = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  const fbAccessToken = getFBAccessToken2();
  console.log('fbAccessToken: ', fbAccessToken);
  var accessToken = '476078559432892|s0aiE6xbk19tiUITLh-XHJsI1hM';
  return corsFn(req, res, () => {
    FB.api('/me', 'GET', {fields:"id,name,email", access_token:accessToken},
    function(response){
      return res.status(200).send({
        response
      })
    });
  });
});


// We would like to use 'pages_read_engagement' to:
// 1. Get post content from the Page
// 2. Get list of facebook users/followers of the page for analytic and marketing purposes
// 3. get post content performance (get likes count, view count, etc) 
// get 
exports.getFBTest2 = functions.https.onRequest((req, res) => {
  var accessToken = '476078559432892|s0aiE6xbk19tiUITLh-XHJsI1hM';
  console.log('accessToken: ', accessToken);

  return FB.api('4', {access_token:accessToken}, function (response) {
    if(!response || response.error) {
     console.log(!res ? 'error occurred' : response.error);
     return res.status(200).send({error:response.error});
    }
    else{
      console.log(response.id);
      console.log(response.name);
      return res.status(200).send({response, req});
    }
  });
});

// exports.getFBLoginStatus = functions.https.onRequest((req, res)=>{
//   return FB.getLo
// });

function getFBAccessToken2(){
  var accessToken = null;
  FB.api('oauth/access_token', {
    client_id:'476078559432892',
    client_secret:'c6f681053e043166c32bb3b301db729c',
    grant_type:'client_credentials'
  }, function (response) {
    console.log('getFBAccessToken2: ', response);
    if(!response || response.error) {
     console.log(!response ? 'error occurred' : response.error);
     return accessToken;
    }
    else{
      accessToken = response.access_token;
      return accessToken;
      // console.log('responseId:', response.id);
      // console.log('responseName:', response.name);
    }
  });
}

// get FB access token
exports.getFBAccessToken = functions.https.onRequest((req, res) => {
  return FB.api('oauth/access_token', {
    client_id:'476078559432892',
    client_secret:'c6f681053e043166c32bb3b301db729c',
    grant_type:'client_credentials'
  }, function (response) {
    if(!response || response.error) {
     console.log(!res ? 'error occurred' : response.error);
     return res.status(200).send({error:response.error});
    }
    else{
      // console.log('responseId:', response.id);
      // console.log('responseName:', response.name);
      return res.status(200).send({response});
    }
  });
});