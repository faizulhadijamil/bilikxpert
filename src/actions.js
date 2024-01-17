import {Map} from 'immutable';
import { push, goBack } from 'react-router-redux';
import moment from 'moment-timezone';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/functions';
// import { getAuth, signInWithCustomToken } from "firebase/auth";
// import 'firebase/analytics';
// const cors = require('cors')({ origin: true });

// project ID
const roomExpertId = "faizroom-36b74";

// const projectId = devProjectId;
// const projectId = demoProjectId;
// const projectId = prodProjectId;
const projectId = roomExpertId;
// const projectId = euphoriaId;

let messageTimer;

let unsubscribeUserIdBookings;
let unsubscribeParticularUserIdBookings;
let unsubscribeEmailBookings;
let unsubscribeBookings;
let unsubscribeAdmins;
let unsubscribeMembershipConsultants;
let unsubscribeStaffs;
let unsubscribeActiveMembers;
let unsubscribeExpiredMembers;
let unsubscribeProspects;
let unsubscribeGantnerLogs;
let unsubscribeUserGantnerLogs;
let unsubscribeCardToRegister;
let unsubscribePackages;
let unsubscribeBranches;
let unsubscribeRooms;
let unsubscribePayments;
let unsubscribeFreezePayments;
let unsubscribeUserPayments;
let unsubscribeUsers;
let unsubscribeTrainers;
let unsubscribeCurrentUser;
let unsubscribeVendSales;
let unsubscribeVendProduct;
let unsubscribeReferralCny;

// Required for side-effects
// require("firebase/firestore");
// for babelAsiaId
var config = {
  apiKey: "AIzaSyCnQXnlRIFlIZ0tQooH5PW-I54MsHVbxow",
  authDomain: "faizroom-36b74.firebaseapp.com",
  databaseURL: "https://faizroom-36b74.firebaseio.com",
  projectId: "faizroom-36b74",
  storageBucket: "faizroom-36b74.appspot.com",
  messagingSenderId: "669544874882",
  appId: "1:669544874882:web:44a141df4ce90436b9859b",
  measurementId: "G-CJ5Z1077NM"
};

// initialize firebase
firebase.initializeApp(config);
// firebase.analytics();
// console.log(window.location.href);
if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
  // Additional state parameters can also be passed via URL.
  // This can be used to continue the user's intended action before triggering
  // the sign-in operation.
  // Get the email if available. This should be available if the user completes
  // the flow on the same device where they started it.
  var email = window.localStorage.getItem('emailForSignIn');
  if (!email) {
    // User opened the link on a different device. To prevent session fixation
    // attacks, ask the user to provide the associated email again. For example:
    email = window.prompt('Please provide your email for confirmation');
  }
  // The client SDK will parse the code from the link for you.
  firebase.auth().signInWithEmailLink(email, window.location.href)
    .then(function(result) {
      // Clear email from storage.
      //console.log(email, result);
      window.localStorage.removeItem('emailForSignIn');
      // You can access the new user via result.user
      // Additional user info profile not available via:
      // result.additionalUserInfo.profile == null
      // You can check if the user is new or existing:
      // result.additionalUserInfo.isNewUser
    }).catch(function(error) {
      // Some error occurred, you can inspect the code: error.code
      // Common errors could be invalid email and invalid or expired OTPs.
    });
}

// Get a reference to the database service

var firestore;

var bootstraped = false;

var bookbabelexclusiveclassPathName = 'babelexclusive';

export function bootstrap(){
  return function action(dispatch, getState) {
    if(!bootstraped){
      bootstraped = true;

      // console.log(' cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED: ', firebase.firestore.CACHE_SIZE_UNLIMITED);

      // firebase.firestore().settings({
      //   // cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
      //   cacheSizeBytes: firebase.firestore.CACHE_SIZE_UNLIMITED
      // });
      // const settings = {timestampsInSnapshots: true};
      // firebase.firestore().settings(settings);

      // dispatch(checkIfNative());
      // console.log('getState(): ', getState());
      // const pathname =   ;
      // // console.log('pathname: ', pathname);
      // if(pathname.indexOf('/payments/') !== -1 || pathname.indexOf('/paymentsPB/') !== -1){
      //   const pathToReplace = pathname.indexOf('/payments/') !== -1 ? '/payments/' : '/paymentsPB/'
      //   const invoiceId = pathname.replace(pathToReplace, '');
      //   dispatch(getInvoiceAndDataById(invoiceId));
      //   dispatch(verifyAuth());
      // }else if(pathname.indexOf('/buy/') !== -1 || pathname.indexOf('/buypromo/') !== -1){
      //   const pathToReplace = pathname.indexOf('/buy/') !== -1 ? '/buy/' : '/buypromo/'
      //   const vendProductId = pathname.replace(pathToReplace, '');
      //   dispatch(getVendProductId(vendProductId));
      // }
      // else if (pathname.indexOf('/CNYangpow') !== -1){
      //   console.log('pathname CNY');
      //   dispatch(getCnyreferral());
      //   dispatch(getUsers())
      // }
      // else if (pathname.indexOf('/paymentreport') !== -1){
      //   console.log('pathname payment report');
      //   dispatch(getPayments());
      //   dispatch(getUsers());
      // }
      // // else if (pathname.indexOf('/report') !== -1){
      // //   console.log('pathname report');
      // //   dispatch(getCnyreferral());
      // // }
      // else{
      //   dispatch(verifyAuth());
      // }
      // dispatch(getClasses());
      // dispatch(getTrainers());
      // dispatch(getMembershipConsultants());
      // dispatch(getSessions());

      // const settings = {timestampsInSnapshots: true};
      // firebase.firestore().settings(settings);

      firebase.firestore().enablePersistence()
        .then(() => {
            // Initialize Cloud Firestore through firebase
            //console.log('enablepersistence')
            firestore = firebase.firestore();
        })
        .catch(err => {
            firestore = firebase.firestore();
            //console.log('firestore persistence error: ', err);
            // if (err.code == 'failed-precondition') {
            //     // Multiple tabs open, persistence can only be enabled
            //     // in one tab at a a time.
            //     // ...
            // } else if (err.code == 'unimplemented') {
            //     // The current browser does not support all of the
            //     // features required to enable persistence
            //     // ...
            // }
        }).then(()=>{
          dispatch(checkIfNative());
          const pathname = getState().router.location.pathname;
          //console.log('pathname: ', pathname);
          const strArray = pathname.split("/");
          //console.log('strArray: ', strArray);
          const qty = strArray && strArray.length === 4? strArray[3]:1 // default
          //console.log('theQty: ', qty);

          // console.log('pathname.indexOf: ', pathname.indexOf(`/${bookbabelexclusiveclassPathName}`));

          if(pathname.indexOf('/payments/') !== -1 || pathname.indexOf('/paymentsPB/') !== -1 || pathname.indexOf('/PaymentsAdyenDropIn/') !== -1 || pathname.indexOf('/paymentsadyendropin/') !== -1){
            const pathToReplace = pathname.indexOf('/payments/') !== -1 ? '/payments/' : '/PaymentsAdyenDropIn/'
            //console.log('pathToReplace: ', pathToReplace);
            const invoiceId = pathname.replace(pathToReplace, '');
            dispatch(getInvoiceAndDataById(invoiceId));
            // dispatch(verifyAuth()); //commented on 31/1/2020;
          }
          else if (pathname.indexOf('/buypt') !== -1){
            //console.log('buyPT path');
            dispatch(verifyAuth());
          }
          
          else if(pathname.indexOf('/buy/') !== -1 || (pathname.indexOf('/buy') !== -1) || pathname.indexOf('/buypromo/') !== -1 || pathname.indexOf('/buypromo') !== -1){
            const pathToReplace = pathname.indexOf('/buy/') !== -1 ? '/buy/' : '/buypromo/'
            //console.log('pathToReplace: ', pathToReplace);
            var vendProductId = pathname.replace(pathToReplace, '');
            var vendProductQty = 1; //default
            //console.log('vendProductId: ', vendProductId);
            const vendStrSplit = vendProductId.split("/");
            //console.log('vendStrSplit: ', vendStrSplit);
            if (vendStrSplit && vendStrSplit.length === 2){
              vendProductId = vendStrSplit[0];
              vendProductQty = vendStrSplit[1];
            }
            dispatch(getVendProductId(vendProductId, vendProductQty));
            // dispatch(getAllVendProducts());
          }
          else if (pathname.indexOf('/angpau') !== -1){
            //console.log('pathname CNY');
            // dispatch(getCnyreferral());
            // dispatch(getUsers())
          }
          else if (pathname.indexOf('/klccexperience') !== -1){
            //console.log('pathname klccexperience');
            // dispatch(getCnyreferral());
            // dispatch(getUsers())
          }
          else if (pathname.indexOf('/CNYangpow') !== -1){
            //console.log('pathname CNY');
            dispatch(getCnyreferral());
            dispatch(getUsers())
          }
          else if (pathname.indexOf('/registrationwhatsapp') !== -1){
            //.log('registrationwhatsapp');
            dispatch(viewWhatsappRegistration());
          }
          else if (pathname.indexOf('/registration') !== -1){
           // console.log('self registration');
            dispatch(viewSelfRegistration());
            // viewSelfRegistration();
            // viewLogin();
          }
          else if (pathname.indexOf('/paymentreport') !== -1){
            //console.log('pathname payment report');
            dispatch(getPayments());
            dispatch(getUsers());
          }
          else if (pathname.indexOf('/testPage') !== -1 || pathname.indexOf('/join') !== -1 || pathname.indexOf('/vidconf') !== -1 || pathname.indexOf('/zoom') !== -1 || pathname.indexOf('/verifyzoom') !== -1 || pathname.indexOf('/fblogin') !== -1){
            //.log('pathname test Page');
            // dispatch(getUser());
          }
          else if ((pathname.indexOf('/report') !== -1)||(pathname.indexOf('/userreport') !== -1)){
            //console.log('pathname report');
            // dispatch(getCnyreferral());
            dispatch(getPackages());
            dispatch(getFreezePayments());
            dispatch(getUsers());
          }
          else if (pathname.indexOf('/renewmembership') !== -1 || pathname.indexOf('/renewmembership/') !== -1){
            //console.log('renewmembership path');
          }
          else if (pathname.indexOf('/createInvoice') !== -1 || pathname.indexOf('/viewinvoices') !== -1){
            console.log('createInvoice path');
            dispatch(getRooms);
            dispatch(getBranches());
            dispatch(getUsers());
          }
          else{
            //console.log('verifyAuth...')
            dispatch(verifyAuth());
          }
          dispatch(getBranches());
          dispatch(getRooms());
          dispatch(getClasses());
          dispatch(getTrainers());
          dispatch(getMembershipConsultants());
          dispatch(getStaffs());
          dispatch(getSessions());
        });
    }
  }
}

export function login(email, password, handleLoginFailed){
  return function action(dispatch, getState) {
    dispatch(showMessage("Logging in..."));
    //console.log('try to login....')
    firebase.auth().signInWithEmailAndPassword(email, password)
    .then(function(user) {
        dispatch(showMessage("Logged in!"));
        const userId = user.user.uid;
        // console.log("Logged in!", user);
        // console.log('userId: ', user.user.uid);
        // dispatch(viewNext());
        dispatch(viewNext(userId));
        // dispatch(setUser(user));
        // dispatch(setLoginUser(user));
    }).catch(function(error) {
        // handleLoginFailed
        // var errorCode = error.code;
        // if(errorCode === 'auth/user-not-found'){
        //   if(handleLoginFailed){
        //     handleLoginFailed();
        //   }else{
        //     dispatch(setNeedsSignUp(true));
        //   }
        // }
        dispatch(showMessage(error.message));
        // console.log("Sign in failed: ", error);
    });
  }
}

export function whLogin(uid, userData, customToken, handleResponse){
  return function action(dispatch, getState) {
    dispatch(showMessage("whatsapp Logging in..."));
    // console.log('actionUserData: ', userData);
    // console.log('customToken: ', customToken)
    
    if(unsubscribeCurrentUser){
      unsubscribeCurrentUser();
    }
    if (uid){
      unsubscribeCurrentUser = firestore && firestore.collection("users").doc(uid).onSnapshot(doc => {
        if(!doc.exists){
          //console.log('userDoc missing', uid);
        }else{
          //console.log('!!!exists', doc.data());
          firebase.auth().signInWithCustomToken(customToken).then((userCredential)=>{
            //console.log('userCredential: ', userCredential);
          }).catch(error=>{
            var errorMessage = error.message;
            handleResponse({error:errorMessage});
          });
          handleResponse(doc.data());
          dispatch(setUser(doc));
        }
      });
    }
    else{
      dispatch(showMessage('user not exist!!!'))
    }

    // dispatch(setUser(Map(userData)));
    // handleResponse({success:true});
  }
};

// FB login / signup
export function FBLogin(email, handleResponse){
  return function action(dispatch, getState) {
    
    var theEmail = email || null;
    const timestamp = firebase.firestore.FieldValue.serverTimestamp()

    dispatch(showMessage(`login via FB, email: ${theEmail}`));
    const usersRef = firestore.collection("users");
    var userDoc = null;
    var userData = {};

    var provider = new firebase.auth.FacebookAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        const credential = result.credential;

        // The signed-in user info.
        const user = result.user;
        const additionalUserInfo = result.additionalUserInfo;
        const isNewUser = result.additionalUserInfo.isNewUser;
        const name = additionalUserInfo.profile.name;
        const firstName = additionalUserInfo.profile.first_name;
        const lastName = additionalUserInfo.profile.last_name;

        //console.log('theresult: ', result);
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        const accessToken = credential.accessToken;
        const userEmail = user.email;

        // if member not exist in firebase auth
        if (isNewUser){
          return usersRef.where("email", "==", userEmail).get().then(function(querySnapshot){
            if(querySnapshot.size !== 0){
    
            userDoc = querySnapshot.docs[0];
            userData = userDoc.data();

           // console.log('userData: ', userData);
            //   if(name){
            //     userData.name = name;
            //   }
            //   if(userEmail){
            //     userData.email = userEmail;
            //   }
    
            //   if(phone){
            //     userData.phone = phone;
            //   }
    
            //   userData.tempUserId = userDoc.id;
            //   userData.updatedAt = timestamp;

            }
            else{
             //console.log('user is not exist, create user in DB');
              userData = {
                email:userEmail,
                fbPhotoURL: `https://graph.facebook.com/${additionalUserInfo.profile.id}/picture?type=large`,
                name, firstName, 
                createdAt: timestamp,
                membershipStarts:null,
                membershipEnds:null,
                createdFrom: 'FBLogin'
              };
              return firestore.collection('users').doc(user.uid).set(userData);
            }
            //else{
            //   userData.email = userEmail;
            // }
    
            // if(!userData.membershipStarts){
            //   userData.membershipStarts = null;
            // }
            // if(!userData.membershipEnds){
            //   userData.membershipEnds = null;
            // }
            // if(!userData.gantnerCardNumber){
            //   userData.gantnerCardNumber = null;
            // }
    
            return Promise.resolve(user);
          })
          

        }
        else{
          //console.log('member already sign in n grant access using FB')
        }

        handleResponse({success:true, accessToken:accessToken, user, result});
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;

        var errorMessage = error.message;
        
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;

        if (error.code === 'auth/account-exists-with-different-credential') {
          // The pending Facebook credential.
          var pendingCred = error.credential;
           // Get sign-in methods for this email.
           firebase.auth().fetchSignInMethodsForEmail(email).then(function(methods) {
            // Step 3.
            // If the user has several sign-in methods,
            // the first method in the list will be the "recommended" method to use.
            if (methods[0] === 'password') {
              // Asks the user their password.
              // In real scenario, you should handle this asynchronously.
              var password = '123456'; // test only
              firebase.auth().signInWithEmailAndPassword(email, password).then(function(result) {
                // Step 4a.
                return result.user.linkWithCredential(pendingCred);
              }).then(function() {
                // Facebook account successfully linked to the existing Firebase user.
                // goToApp();
               // console.log('go to app')
              });
              return;
            }

          });
        }
        handleResponse({success:false, error:errorMessage, errorCode});
        // ...
      });
    
  }
}

// FB login / signup v2
// export function FBLoginv2(email, handleResponse){
//   return function action(dispatch, getState) {
//     dispatch(showMessage(`Signing up using facebook email ${email}`));
//     FB.getLoginStatus(function(response) {
//       console.log('theresponse: ', response);
//       // statusChangeCallback(response);
//   });
//     handleResponse({success:true, data:'test'});
//   }
// }

export function signUp(email, password, name, phone, mcId, referralSource, image, imagePath, postcode, fromcv19 = false){
  return function action(dispatch, getState) {

    // if(!name || name.length === 0 || !phone || phone.length === 0){
    //   dispatch(showMessage("Please enter your details before signing up!"));
    //   return;
    // }

    dispatch(showMessage(`Signing up ${name || email || ''}...`));
    dispatch(setSigningUp(true));

    const timestamp = firebase.firestore.FieldValue.serverTimestamp()
    const usersRef = firestore.collection("users");

    var userDoc = null;
    var userData = {};
    userData = {name:name, email:email, phone:phone, createdAt:timestamp, updatedAt:timestamp, mcId: mcId || null, referralSource:referralSource || null, image:image || null, imagePath:imagePath || null, postcode:postcode || null}
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {

      const userEmail = user.user.email;
      // const userUID = user.user.uid;
      // console.log("Create User", userEmail, userUID);
      return usersRef.where("email", "==", userEmail).get().then(function(querySnapshot){
        if(querySnapshot.size !== 0){

          userDoc = querySnapshot.docs[0];
          userData = userDoc.data();
          if(name){
            userData.name = name;
          }
          if(userEmail){
            userData.email = userEmail;
          }

          if(phone){
            userData.phone = phone;
          }

          userData.tempUserId = userDoc.id;
          userData.updatedAt = timestamp;

        }else{
          userData.email = userEmail;
        }

        if(!userData.membershipStarts){
          userData.membershipStarts = null;
        }
        if(!userData.membershipEnds){
          userData.membershipEnds = null;
        }
        if(!userData.gantnerCardNumber){
          userData.gantnerCardNumber = null;
        }

        return Promise.resolve(user);
      })

    }).then(function(user){

      // console.log("Saving User", user.uid, user.user.uid, userData);

      return firestore.collection('users').doc(user.uid || user.user.uid).set(userData);

    }).then(function(){

      // console.log(userDoc, userDoc.ref);
      if(userDoc){
        return userDoc.ref.delete();
      }else{
        return Promise.resolve();
      }

    }).then(function(user){

      //console.log('signup userId: ', user);
      dispatch(setSigningUp(false));
      dispatch(showMessage("Signed Up!"));
      
      dispatch(viewNext());
      return Promise.resolve();

    }).catch(function(error) {
      dispatch(setSigningUp(false));
      dispatch(showMessage(error.message));
    });
  }
}

// check if member email if its already in the app - similar to fetchMethodsForEmail
export function fetchUserDataByEmail(email, handleResponse){
  return function action(dispatch, getState) {
    dispatch(setFetchingEmail(true));
    const fetchSignInMethodsPromise = firebase.auth().fetchSignInMethodsForEmail(email);
    const fetchUserForEmailPromise = firestore.collection('users').where('email', '==', email).limit(1).get();

    Promise.all([fetchSignInMethodsPromise, fetchUserForEmailPromise]).then(results=>{
      //console.log('result: ', results);
      const methods = results[0];
      const userDoc = results[1] && results[1].docs && results[1].docs[0];
      const user = userDoc && results[1].docs[0].data();
      //console.log(methods, userDoc && userDoc.id);
      // existing user
      if(methods && methods.length > 0 && (methods.includes('password') || methods.includes('facebook.com')) && user){
        handleResponse({success:true, user});
      }
      else{
        handleResponse({success:false, message: 'user doesnt exist yet'})
      }
      dispatch(setFetchingEmail(false));
      return;
    }).catch(error=>{
      handleResponse({success:false, message:error});
      return;
    });
  }
}

export function getUserDataByEmail(email, handleResponse){
  return function action(dispatch, getState) {
    const fetchUserForEmailPromise = firestore.collection('users').where('email', '==', email).limit(1).get();

    Promise.all([fetchUserForEmailPromise]).then(results=>{
      //console.log('result: ', results);
      const userDoc = results[0] && results[0].docs && results[0].docs[0];
      const user = userDoc && results[0].docs[0].data();
      // existing user
      if(user){
        handleResponse({success:true, user});
      }
      else{
        handleResponse({success:false, message: 'user doesnt exist yet'})
      }
      return;
    }).catch(error=>{
      handleResponse({success:false, message:error});
      return;
    });
  }
}

export function getUsernRefDataByEmail(email, refEmail, handleResponse){
  return function action(dispatch, getState) {
    const fetchUserForEmailPromise = firestore.collection('users').where('email', '==', email).limit(1).get();
    const fetchRefUserForEmailPromise = firestore.collection('users').where('email', '==', refEmail).limit(1).get();

    Promise.all([fetchUserForEmailPromise, fetchRefUserForEmailPromise]).then(results=>{
      //console.log('result: ', results);
      const userDoc = results[0] && results[0].docs && results[0].docs[0];
      const user = userDoc && results[0].docs[0].data();
      const userRefDoc = results[1] && results[1].docs && results[1].docs[0];
      const userRef = userRefDoc && results[1].docs[0].data();
      // existing user
      if(user){
        // check if referral user is member or not exist
        if (userRef){
          const refMembershipStart = (userRef && userRef.autoMembershipStarts)? userRef.autoMembershipStarts: (userRef && userRef.membershipStarts) ? userRef.membershipStarts:null;
          const refMembershipEnd = (userRef && userRef.autoMembershipEnds)? userRef.autoMembershipEnds: (userRef && userRef.membershipEnds)? userRef.membershipEnds:null;
          const refPackageId = userRef && userRef.packageId? userRef.packageId:null;
          const refIsMember = refPackageId && refMembershipEnd && refMembershipStart;
          const refIsValidMember = refIsMember && moment(getTheDate(refMembershipEnd)).isSameOrAfter(moment().subtract(1, 'day'));
          if (refIsValidMember){
            handleResponse({success:true, userRefIsMember:true, user, userRef});
          }
          else {
            handleResponse({success:false, user, userRef, message: 'referrer is not a valid member'});
          }
        }
        else{
          handleResponse({success:false, message: 'referral email doesnt exist'})
        }
  
      }
      else{
        // create new user
        handleResponse({success:true, message: 'user doesnt exist yet', userRef, user})
      }
      return;
    }).catch(error=>{
      handleResponse({success:false, message:error});
      return;
    });
  }
}

// need to generate the tac at the backend instead of front end
export function generateTAC(whatsappNumber, handleResponse){
  return function action (dispatch, getState){
    // todo: to identify if the number is exist or not
    // let tacNumber = Math.round(Math.random()*1000000+1);
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    var tacRef = firestore.collection("tacs");
    // define
    const sendTACviaMessageBird = firebase.functions().httpsCallable('messageBird-sendTACtoGuest');
    // add tac to tac collection
    // tacRef.add({
    //   createdAt:timestamp,
    //   tacNumber, whatsappNumber
    // });

    return sendTACviaMessageBird({whatsappNumber}).then(result=>{
      //console.log('theresult: ', result);
      //console.log('whatsapp number: ', whatsappNumber);
      const data = result.data;
      const tacNumber = data && data.tacNumber;
      // dispatch(showMessage(result));
      // const invoiceId = invoiceRef.data;
      // console.log('invoiceId: ', invoiceId);
      // if(invoiceId){
      //   dispatch(getInvoiceAndDataById(invoiceId));
      //   handleResponse(invoiceRef.data);
      //   const newPath = `/payments/${invoiceId}`;
      //   if(getState().router.location.pathname !== newPath){
      //     dispatch(push(newPath));
      //   }
      // }
      // dispatch(setAddingInvoice(false));
      if (whatsappNumber){
        handleResponse({result, tacNumber});
      }
    }).catch(error=>{
      // dispatch(setAddingInvoice(false));
      // dispatch(showMessage(error));
      //console.log('error creating the tac')
      handleResponse({error});
    });

   
   
  }
}

export function verifyTAC(tacNumberFromApp, whatsappNumber, handleResponse){
  
  return function action (dispatch, getState){
    const fetchPhoneTacPromise = firestore.collection('tacs').where('whatsappNumber', '==', whatsappNumber).get();
    const fetchPhoneUserPromise = firestore.collection('users').where('whatsappNumber', '==', whatsappNumber).limit(1).get();
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    Promise.all([fetchPhoneTacPromise, fetchPhoneUserPromise]).then(result=>{
      const phoneTacRes = result[0];
      const userRes = result[1];

      var userMap = {};
      var userData, userId;
      userRes && userRes.forEach(doc=>{
        const data = doc.data();
        userId = doc.id;
        userMap[doc.id]=data;
        userData = data;
      });

      if (userData){
        //console.log('existing member: ', userData);
        // if existing, still need to show tac? need to reconfirm with boon

      }
      else{
        //console.log('new member, send tac number');
        // save it to user collection
        firestore.collection('users').add({
          whatsappNumber, // todo add +60 (country code)
          createdAt:timestamp
        }).then((user)=>{
          userId = user.id;
          //console.log('the saved user: ', userId);
          let token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTYzMDMxMjI3OCwiZXhwIjoxNjMwMzE1ODc4LCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay1pbDd5NEBldXBob3JpYS03OGIyYy5pYW0uZ3NlcnZpY2VhY2NvdW50LmNvbSIsInN1YiI6ImZpcmViYXNlLWFkbWluc2RrLWlsN3k0QGV1cGhvcmlhLTc4YjJjLmlhbS5nc2VydmljZWFjY291bnQuY29tIiwidWlkIjoiaGpha3NoZGtzamFkZmFpenVsMTIzNDU2In0.UnFi7GFzdt4dVJL9hlS6HSDNg9BerLkvdykJ_Aye7o2xb0mK-vxzi2mja3FUuMHbDeePMR_8bbz3uwY6E9Q-COhMkfRMvtdBuU7e79lVWVLgVlnKs2MLz10eZZNqaXk4r4EbX0DtxQPGZZpEtUW2poOFudhy7wZnj7IDGE4QyB_0OZ2lVHbgojq2YSge9bkXR2AIr4GOlzzKBOz1ftmUV2BTJGQMCxHH9-SuAsYoIL7SP99A4lfvGcbBNg8XWkrzqqVVzjgc8puq8IfTME6jEbpZhVHU_3gn2491Nkr4PCMBtYOqD9GZPFVyqydRJp41BR6tvRwhxxYu3UytguKFkg';
          dispatch(showMessage("Logging in..."));
          firebase.auth().signInWithCustomToken(token)
          .then((userCredential) => {
            dispatch(showMessage("Logged in!"));
            //console.log('userCredential: ', userCredential);
            // Signed in
            var user = userCredential.user;

            // dispatch(viewNext(userId));
            // ...
          })
          .catch((error) => {
            //console.log('error: ', error);
            var errorCode = error.code;
            var errorMessage = error.message;
            // ...
          });
          // const customAuth = getAuth();
          // signInWithCustomToken(customAuth, token)
          //   .then((userCredential) => {
          //     console.log('token: ', token);
          //     console.log('userCredential: ', userCredential);
          //     // Signed in
          //     const user = userCredential.user;
          //     // ...
          //   })
          //   .catch((error) => {
          //     const errorCode = error.code;
          //     const errorMessage = error.message;
          //     // ...
          //   });
          // firebase.auth().createCustomToken(userId).then(customToken=>{
          //   // send token to uid
          //   console.log('custom token: ', customToken);
          // }).catch((error)=>{
          //   console.log('Error creating custom token:', error);
          // });
        })
      }

      var matchedTAC;
      var tacArray = [];
      phoneTacRes && phoneTacRes.forEach(doc=>{
        const data = doc.data();
        const tacNumber = data && data.tacNumber;
        const createdAt = data && data.createdAt;
        //console.log('tacData: ', data);
        //console.log('tacNumberFromApp: ', tacNumberFromApp.toString());
        if (tacNumber && (parseInt(tacNumber) === parseInt(tacNumberFromApp)) && createdAt 
            && moment(getTheDate(createdAt)).isSameOrAfter(moment().subtract(1, 'minutes'))
            ){
          //console.log('matchedTAC: ', tacNumber);
          tacArray.push(tacNumber);
        }
      });

      if (tacArray && tacArray.length>=1){
        //console.log('userId: ', userId);
        if (userId){
          firebase.auth().createCustomToken(userId).then(customToken=>{
            // send token to uid
            //console.log('custom token: ', customToken);
          }).catch((error)=>{
           // console.log('Error creating custom token:', error);
          });
        }
       
        // const fetchUserForEmailPromise = firestore.collection('users').where('email', '==', email).limit(1).get();

        handleResponse({success:true, tacArray, message:'tac number and phone number are correct', userIsExist:userData?'existing member':'new member'});
      }
      else{
        handleResponse({success:false, message:'tac not matched'})
      }
    });
  }
}

export function fetchMethodsForEmail(email, handleCompletion){
  return function action(dispatch, getState) {
    dispatch(setFetchingEmail(true));
    //console.log('fetchMethodsForEmail...: ', email);
    // setTimeout(()=>{
    //   dispatch(setNeedsSignUp(false));
    //   dispatch(setFetchingEmail(false));
    // }, 5000);
    // return;
    const fetchSignInMethodsPromise = firebase.auth().fetchSignInMethodsForEmail(email);
    const fetchUserForEmailPromise = firestore.collection('users').where('email', '==', email).limit(1).get();

    Promise.all([fetchSignInMethodsPromise, fetchUserForEmailPromise]).then(results=>{
      //console.log('result: ', results);
      const methods = results[0];
      const userDoc = results[1] && results[1].docs && results[1].docs[0];
      const user = userDoc && results[1].docs[0].data();
      //console.log(methods, userDoc && userDoc.id);
      // existing user
      if(methods && methods.length > 0 && methods.includes('password')){
        if(user){
          dispatch(setNeedsSignUp(false));
        }else{
          dispatch(setNeedsUserDetails(true));
        }
      }
      // new user
      else{
        if(user){
          //.log('user dont need to sign up details: ', user);
          dispatch(setNeedsSignUpDetails(false));
        }else{
          //console.log('user need to sign up details: ', user);
          dispatch(setNeedsSignUpDetails(true));
        }
        dispatch(setNeedsSignUp(true));
      }
      dispatch(setFetchingEmail(false));
      // console.log(methods);
      handleCompletion(true);

      return;

      // /

    }).catch(error=>{
      dispatch(setNeedsSignUp(false));
      dispatch(setNeedsSignUpDetails(false));
      dispatch(setFetchingEmail(false));
      dispatch(showMessage(error.message));
      handleCompletion(false);
    });
  }
}

export function uploadImage(imageFile, handleUpload){
  return function action(dispatch, getState) {
    dispatch(setUploadingImage(true));

    const storageRef = firebase.storage().ref();
    var imagesRef = storageRef.child('images');
    var imageRef = imagesRef.child(firestore.collection("users").doc().id);
    var imagePath = null;

    var uploadPromise = null;
    if('base64' in imageFile){
      const base64 = `data:image/jpeg;base64, ${imageFile.base64}`;
      uploadPromise = imageRef.putString(base64, 'data_url');
    }else{
      uploadPromise = imageRef.put(imageFile);
    }

    return uploadPromise.then( snapshot => {
      dispatch(setUploadingImage(false));
      imagePath = snapshot.ref.fullPath;
      return snapshot.ref.getDownloadURL();
    }).then(url=>{
      if(handleUpload){
        handleUpload(url, imagePath);
      }else{
        dispatch(setUploadedImage(url, imagePath));
      }
      dispatch(setUploadingImage(false));
      return Promise.resolve();
    }).catch((error)=>{
      // alert(error.message);
      dispatch(showMessage(error.message))
      dispatch(setUploadingImage(false));
      return Promise.resolve();
    });
  }
}

export function uploadInvoiceImage(imageFile,handleUpload){
  return function action(dispatch, getState) {
    dispatch(setUploadingImage(true));

    const storageRef = firebase.storage().ref();
    var imagesRef = storageRef.child('resits');
    var imageRef = imagesRef.child(firestore.collection("invoices").doc().id);
    var imagePath = null;

    var uploadPromise = null;
    if('base64' in imageFile){
      const base64 = `data:image/jpeg;base64, ${imageFile.base64}`;
      uploadPromise = imageRef.putString(base64, 'data_url');
    }else{
      uploadPromise = imageRef.put(imageFile);
    }

    return uploadPromise.then( snapshot => {
      dispatch(setUploadingImage(false));
      imagePath = snapshot.ref.fullPath;
      return snapshot.ref.getDownloadURL();
    }).then(url=>{
      if(handleUpload){
        handleUpload(url, imagePath);
      }else{
        dispatch(setUploadedImage(url, imagePath));
      }
      dispatch(setUploadingImage(false));
      return Promise.resolve();
    }).catch((error)=>{
      alert(error.message);
      dispatch(showMessage(error.message))
      dispatch(setUploadingImage(false));
      return Promise.resolve();
    });
  }
}

export function uploadClassImage(imageFile, handleUpload){
  return function action(dispatch, getState) {
    const storageRef = firebase.storage().ref();
    var imagesRef = storageRef.child('classImages');
    imagesRef.put(imageFile).then(function(snapshot) {
      handleUpload(snapshot.downloadURL);
    });
  }
}

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

function checkOnlineOffline(){
  var isOnline = true
	window.ononline = (event) => {
    	//console.log("Back Online");
      isOnline=true;
	};
  
	window.onoffline = (event) => {
   		//console.log("Connection Lost");
       isOnline=false;
	};
  return isOnline;
}

export function saveUserData(userId, userData, BeforeuserData=null, currentLoginUserEmail=null, currentLoginUserId=null){
  return function action(dispatch, getState) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    var userRef, logRef, paymentRef, roomRef;
    // console.log('thecurrentLoginUserEmail: ', currentLoginUserEmail);
    // console.log('beforeUserData: ', BeforeuserData);
    //console.log('userData: ', userData);
    //console.log('saveUserData action....');
    const isOnline = checkOnlineOffline();
    //console.log('isOnline faizul?: ', isOnline);
    window.ononline = (event) => {
    	//console.log("internet Back Online")
	  };
  
    window.onoffline = (event) => {
        //console.log("internet Connection Lost")
    };
    // window.addEventListener("offline", () => {
    //   console.log('save userdata OFFLINE.....');

    //   // setOnlineStatus(false);
    // });
    // window.addEventListener("online", () => {
    //   console.log('saveuserdata ONLINE.....')
    // });

    if(userId === 'NEW' || userId === 'NEW_REG'){
      dispatch(showMessage(userId === 'NEW' ? "Saving New User..." : 'Saving...'));
      userRef = firestore.collection("users").doc();
      // var newUserData = {};
      // newUserData.roles = null;
      // newUserData.membershipStarts = null;
      // newUserData.membershipEnds = null;
      // newUserData.gantnerCardNumber = null;
      return userRef.set({
      // ...newUserData,
        ...userData,
        updatedAt:timestamp,
        createdAt:timestamp
      })
      .then(function() {
          if(userId === 'NEW'){
            dispatch(showMessage("New user saved!"));
            // dispatch(viewPerson(userRef.id));
            // dispatch(viewNext(userRef.id));
            dispatch(viewPeople());
            if (userData && userData.currentRoomId){
              roomRef = firestore.collection("rooms").doc(userData.currentRoomId);
              roomRef.update({isAvailable:false});
            }
          }else{
            const currentUser = getState().state.has('user') ? getState().state.get('user') : null;
            const currentUserEmail = currentUser && currentUser.has('email') ? currentUser.get('email') : null;
            // during registration, only member with klcc@babel.fit member will check-in the member as 'App - Registration (KLCC)'
            // const currentUserIsKLCC = currentUserEmail && currentUserEmail.indexOf('+klcc@babel.fit') !== -1 ? true : false;
            // default is TTDI change on 11/9/2020 - faizul
            // const currentStaffBranch = currentUser && currentUser.has('staffBranch')? currentUser.get('staffBranch'):'TTDI';
            // const appCheckInRegistration = (currentStaffBranch === 'KLCC')? 'App - Registration (KLCC)':'App - Registration';
            // const appCheckInRegistration = userData.firstJoinVisit? (userData.firstJoinVisit === 'KLCC')? 'App - Registration (KLCC)' : 'App - Registration':'App - Registration';
            // dispatch(addCheckIn(userRef.id, appCheckInRegistration));
            // dispatch(addCheckIn(userRef.id, currentUserIsKLCC ? 'App - Registration (KLCC)' : 'App - Registration'));
          }
      })
      .catch(function(error) {
          dispatch(showMessage(error.message));
      });
    }else{
      dispatch(showMessage("Saving User Updates..."));
      userRef = firestore.collection("users").doc(userId);
      logRef = firestore.collection("logs");
      paymentRef = firestore.collection("payments");
      if(Object.keys(userData).includes('tempCardNumber')){
        userData.tempCardAddedAt = timestamp;
      }
      // if(Object.keys(userData).includes('referredByUserId')){
      //   if (userData.referredByUserId){
      //     paymentRef.add({
      //       referredUserId:userId,
      //       createdAt:timestamp,
      //       source:'refer',
      //       totalPrice:0,
      //       type:'membership',
      //       userId:userData.referredByUserId,
      //       referralFromApp:true
      //     });
      //   }
      //   else{
      //     // delete the ref
      //     paymentRef.where('referredUserId', '==', userId).get().then(function(querySnapshot){
      //       querySnapshot.forEach(function(doc){
      //         doc.ref.delete().then(function(){
      //          // console.log('referral data deleted');
      //         });
      //       });
      //     });
      //   }
      // }

      if(userData.packageId){
        userData.packageLocked = true;
        var packageHistory = [];
        userRef.get().then(doc=>{
          // console.log('thedata: ', doc.data());
          const data = doc.data();
          const existingPackageId = data && data.packageId;
          const existingPackageHistory = data && data.packageHistory;
          if (!existingPackageHistory){
            packageHistory.push({updatedAt:timestamp, existingPackageId})
          }
         
        })
        // userData.packageHistory = 
      }

      // add user cancellation createdDate
      if(userData.cancellationDate){
        userData.cancellationCreatedAt = timestamp;
      }

      console.log('beforeUserData: ', BeforeuserData);
      console.log('userData: ', userData);
      return userRef.update({
      ...userData,
      updatedAt:timestamp
      })
      .then(function() {dispatch(showMessage("User updates saved!"))})
      .then(function(){
        // if (BeforeuserData.cancellationDate && !isValidDate(BeforeuserData.cancellationDate)){
        //   BeforeuserData.cancellationDate = null; // replace the value so the invalid message will not come out
        // }
        // if (BeforeuserData.membershipStarts && !isValidDate(BeforeuserData.membershipStarts)){
        //   BeforeuserData.membershipStarts = null; // replace the value so the invalid message will not come out
        // }
        const logData = {
          executerId: currentLoginUserId,
          executerEmail: currentLoginUserEmail,
          userId,
          BeforeuserData: BeforeuserData,
          afterUserData: userData,
          time:timestamp,
        }
        // if (BeforeuserData.packageId || userData.packageId){
        //   logData.beforePackageId = BeforeuserData.packageId;
        //   logData.afterPackageId = userData.packageId;
        // }
        logRef.add(logData)
      })
      .catch(function(error) {
          //console.log('error: ', error);
          dispatch(showMessage(error.message));
          logRef.add({
            executerId: currentLoginUserId,
            errorMessage: error.message,
            time:timestamp,
            type: 'system Error'
          })
      });
    }
  }
}

export function unTerminate(userId, userData, BeforeuserData=null, currentLoginUserEmail=null, currentLoginUserId=null){

  return function action(dispatch, getState) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    var userRef, logRef, paymentRef;
    //console.log('thecurrentLoginUserEmail: ', currentLoginUserEmail);
   // console.log('beforeUserData: ', BeforeuserData);
   // console.log('userData: ', userData);

    dispatch(showMessage("Unterminate the user"));
    userRef = firestore.collection("users").doc(userId);
    logRef = firestore.collection("logs");
    
    return userRef.update({
      cancellationDate : firebase.firestore.FieldValue.delete(),
      cancellationReason : firebase.firestore.FieldValue.delete(),
      cancellationCreatedAt : firebase.firestore.FieldValue.delete(),
    }).then(()=>{
      //console.log('User unterminated!')
      dispatch(showMessage("User unterminated!"));
    }).then(function(){
      const logData = {
        executerId: currentLoginUserId,
        executerEmail: currentLoginUserEmail,
        userId,
        BeforeuserData: BeforeuserData,
        afterUserData: userData,
        time:timestamp,
        action:'unterminated'
      }
      // if (BeforeuserData.packageId || userData.packageId){
      //   logData.beforePackageId = BeforeuserData.packageId;
      //   logData.afterPackageId = userData.packageId;
      // }
      logRef.add(logData)
    }).catch((e)=>{
      dispatch(showMessage(e.message));
      //console.log('unterminated error')
    })
  }
}

export function addReferralReward(userId, referredUserId){
  return function action(dispatch, getState) {

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    dispatch(showMessage("add referral reward to the user"));
    
    const paymentData = {
      source:'refer',
      type:'membership',
      userId,
      totalPrice:0,
      createdAt:timestamp,
      referredUserId,
      manualAdd:true,
    }
    firestore.collection("payments").add(paymentData);
  }
}

export function saveClassData(classId, classData){
  return function action(dispatch, getState) {
      dispatch(showMessage("Saving Class Updates..."));
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    var classRef = firestore.collection("classes").doc(classId);
    return classRef.update({
    ...classData,
    updatedAt:timestamp
    })
    .then(function() {
        // console.log("Document successfully updated!");
        dispatch(showMessage("Class updates saved!"));
    })
    .catch(function(error) {
        // The document probably doesn't exist.
        dispatch(showMessage(error.message));
        // console.error("Error updating document: ", error);
    });
  }
}


export function updateSession(sessionId, updates){
  return function action(dispatch, getState) {
    if(sessionId && updates){
      dispatch(showMessage('Updating class session...'));
      return firestore.collection('sessions').doc(sessionId).update({...updates}).then(()=>{
        dispatch(showMessage('Class session updated!'));
      }).catch(error=>{
        dispatch(showMessage('Failed to update session!'));
      });
    }

  }
}

export function setEditSession(sessionId) {
  return {
    type: 'SET_EDIT_SESSION',
    sessionId
  };
}

export function adminMakeBooking(classId, sessionId, trainerId, seat, userId, bookerId){
  return function action(dispatch, getState) {

    dispatch(showMessage("Booking place..."), 10000);

    const sessionsRef = firestore.collection('sessions');
    const sessionRef = sessionsRef.doc(sessionId);
    const bookingsRef = firestore.collection('bookings');
    var bookingRef = bookingsRef.doc();

    const selectedUser = userId && getState().state.has('users') ? getState().state.getIn(['users', 'usersById', userId]) : null;
    const name = selectedUser && selectedUser.has('name') ? selectedUser.get('name') : null;
    const email = selectedUser && selectedUser.has('email') ? selectedUser.get('email') : null;
    const phone = selectedUser && selectedUser.has('phone') ? selectedUser.get('phone') : null;

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    var bookingData = {type:'class', classId : classId, sessionId:sessionId, trainerId:trainerId, name:name, email:email, phone:phone, seat:seat, createdAt: timestamp, updatedAt: timestamp, userId:userId, cancelledAt:null, cancelledBy:null, bookerId:bookerId};

    return firestore.runTransaction(function(transaction) {
    // This code may get re-run multiple times if there are conflicts.
      return transaction.get(sessionRef).then(function(sessionDoc) {

          const sessionData = sessionDoc.data();
          var bookings = sessionData.bookings ? sessionData.bookings : {};
          if(bookings[seat]){
            //boking exists
            return Promise.reject(new Error('Booking Failed! Looks like someone has already booked that place!'));
          }else{
            bookings[seat] = bookingRef.id;
            sessionData.bookings = bookings;
            transaction.set(bookingRef, bookingData);
            transaction.set(sessionRef, sessionData);

            return Promise.resolve(bookingData);
          }
      });
    }).then(function(){
        dispatch(showMessage("Added booking!"));
    }).catch(function(error) {
          dispatch(showMessage(error.message));
          // console.log("Transaction failed: ", error);
    });

  }
}

export function adminMakePTBooking(trainerId, userId, bookerId, startsAt, endsAt, duration){
  return function action(dispatch, getState) {

    const currentUserData = getState().state.get('user');
    const packageId = currentUserData && currentUserData.get('packageId');
    const roles = currentUserData && currentUserData.get('roles');
    const isAdmin = roles && roles.get('admin') === true;
    const isOps = roles && roles.get('ops') === true;
    const isTrainer = roles && roles.get('trainer') === true;
    const isTeam = roles && roles.get('team') === true;

    const canBook = packageId || isAdmin || isOps || isTrainer || isTeam;
    if(!canBook){
      dispatch(showMessage("Sorry, only members can make bookings."), 5000);
      return;
    }

    dispatch(showMessage("Booking training..."), 10000);

    const bookingsRef = firestore.collection('bookings');
    var bookingRef = bookingsRef.doc();

    const selectedUser = userId && getState().state.has('users') ? getState().state.getIn(['users', 'usersById', userId]) : null;
    const name = selectedUser && selectedUser.has('name') ? selectedUser.get('name') : null;
    const email = selectedUser && selectedUser.has('email') ? selectedUser.get('email') : null;
    const phone = selectedUser && selectedUser.has('phone') ? selectedUser.get('phone') : null;

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    var bookingData = {type:'pt', trainerId:trainerId, name:name, email:email, phone:phone, createdAt: timestamp, updatedAt: timestamp, userId:userId, cancelledAt:null, cancelledBy:null, bookerId:bookerId, startsAt:startsAt, endsAt:endsAt, duration:duration};
    // console.log(bookingRef.id, bookingData);
    return bookingRef.set({...bookingData}).then(function(){
        dispatch(showMessage("Added booking!"));
    }).catch(function(error) {
        dispatch(showMessage(error.message));
        // console.log("Transaction failed: ", error);
    });

  }
}

export function makeClassBooking(classId, sessionId, trainerId, userId, bookerId, seat){
  return function action(dispatch, getState) {

    const currentUserData = getState().state.get('user');
    const packageId = currentUserData && currentUserData.get('packageId');
    const roles = currentUserData && currentUserData.get('roles');
    const isAdmin = roles && roles.get('admin') === true;
    const isOps = roles && roles.get('ops') === true;
    const isTrainer = roles && roles.get('trainer') === true;
    const isTeam = roles && roles.get('team') === true;

    const canBook = packageId || isAdmin || isOps || isTrainer || isTeam;
    if(!canBook){
      dispatch(showMessage("Sorry, only members can make bookings."), 5000);
      return;
    }

    dispatch(showMessage("Booking your place..."), 5000);

    const sessionRef = firestore.collection('sessions').doc(sessionId);
    const bookingRef = firestore.collection('bookings').doc();
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const bookingData = {type:'class', seat:seat, classId:classId, sessionId:sessionId, trainerId:trainerId, userId:userId, bookerId:bookerId, createdAt:timestamp, updatedAt:timestamp};

    return firestore.runTransaction((transaction) => {
      return transaction.get(sessionRef).then((sessionDoc) => {
          const sessionData = sessionDoc.data();
          var bookings = sessionData.bookings ? sessionData.bookings : {};
          if(bookings[seat]){
            return Promise.reject(new Error("Booking Failed! Looks like someone beat you to that place =`("));
          }else{
            bookings[seat] = bookingRef.id;
            sessionData.bookings = bookings;
            transaction.set(bookingRef, bookingData);
            transaction.set(sessionRef, sessionData);
            return Promise.resolve();
          }
      });
    }).then(()=>{
      dispatch(showMessage("We've booked your place. See you soon!"));
    }).catch(error=>{
      dispatch(showMessage(error.message), 5000);
    });
  }
}
// export function makeBooking(classId = 'fldnTfM70G0JMeG88Qi3', sessionId='SnhnD7mKsKbgNkB5UBkC', trainerId="yZyCVecg9kpyKmoOT8sK", name='Shara', email='shara@shara.com', phone='012345678', seat='1'){
export function makeBooking(classId, sessionId, trainerId, name, email, phone, seat, longBookingLabel, uid=null){
  return function action(dispatch, getState) {

    if((!email || email.length < 4) || (!name || name.length === 0) || (!phone || phone.length < 8)){
      dispatch(showMessage("Please enter your details to make a booking..."));
      return;
    }

    dispatch(showMessage("Booking your place..."), 10000);

    const sessionsRef = firestore.collection('sessions');
    const sessionRef = sessionsRef.doc(sessionId);
    const bookingsRef = firestore.collection('bookings');

    var bookingRef = bookingsRef.doc();

    const usersRef = firestore.collection("users");
    var userRef;

    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    var bookingData = {classId : classId, sessionId:sessionId, trainerId:trainerId, name:name, email:email, phone:phone, seat:seat, createdAt: timestamp, updatedAt: timestamp, userId:null, cancelledAt:null, cancelledBy:null, absent:null, bookerId:uid};


    usersRef.where("email", "==", email).get()
      .then(function(querySnapshot) {
          // console.log(querySnapshot, querySnapshot.docs);

          if(querySnapshot.size === 0){
            userRef = usersRef.doc();
            // console.log(userRef.id);
            return Promise.resolve(userRef);
          }else{
            userRef = querySnapshot.docs[0];
            // querySnapshot.forEach(function(doc) {
            //   userRef = doc.id;
            //   console.log(doc.id, " => ", doc.data());
            // });
            return Promise.resolve(userRef);
          }


      }).then(function(userRef){

          const bookingsRef = firestore.collection('bookings');
          return bookingsRef.where("userId", "==", userRef.id).where("sessionId", "==", sessionId).where("cancelledAt", "==", null)
          .get()

      }).then(function(querySnapshot){

            // console.log("Bookings for user for session",querySnapshot.size);
            if(querySnapshot.size > 0){
              return Promise.reject(new Error(`${email} has already booked a place for this session`));
            }else{
              return Promise.resolve();
            }

      }).then(function(){

            return bookingsRef.where("userId", "==", userRef.id).where("cancelledAt", "==", null)
            .get()

      }).then(function(querySnapshot) {
          // console.log("Bookings", querySnapshot.size);
          if(querySnapshot.size > 0 && userRef.exists && userRef.data().membershipEnds && userRef.data().membershipEnds){
            const nowDateValue = moment().valueOf();
            const membershipValid = (moment(userRef.data().membershipStarts).valueOf() < nowDateValue) && (nowDateValue < moment(userRef.data().membershipEnds).valueOf());

            if(membershipValid){
              //make Booking
              return Promise.resolve(userRef);
            }else{
              //error too many bookings
              return Promise.reject(new Error("Sorry, you've already made a booking. Only Babel members can join more than one class."));
            }
          }else if(querySnapshot.size > 0){
            //error too many bookings
            return Promise.reject(new Error("Sorry, you've already made a booking. Only Babel members can join more than one class."));

          }else{
            //make booking
            return Promise.resolve(userRef);
          }
      }).then(function(userRef){

              // if(!userId)

              // console.log("Making Booking", userRef.userId);



              // console.log("Making Booking", bookingData, user);

              bookingData.userId = userRef.id;

              // console.log("Making Booking", bookingData);

              return firestore.runTransaction(function(transaction) {
              // This code may get re-run multiple times if there are conflicts.
                return transaction.get(sessionRef).then(function(sessionDoc) {

                    const sessionData = sessionDoc.data();
                    var bookings = sessionData.bookings ? sessionData.bookings : {};
                    // for (var booking in bookings) {
                    //   if (booking.userId === bookingData.userId) {
                    //
                    //   }
                    // }
                    // console.log("bookings transact", bookings, seat);
                    if(bookings[seat]){
                      //boking exists
                      return Promise.reject(new Error('Booking Failed! Looks like someone beat you to that place!'));
                    }else{
                      bookings[seat] = bookingRef.id;
                      sessionData.bookings = bookings;

                      var userUpdates = {};
                      if(userRef.exists){
                        if(!userRef.data().name && name){
                          userUpdates.name = name;
                        }
                        if(!userRef.data().email && email){
                          userUpdates.email = email;
                        }
                        if(!userRef.data().phone && phone){
                          userUpdates.phone = phone;
                        }
                        if(!userRef.data().roles){
                          userUpdates.roles = null;
                        }
                        if(!userRef.data().membershipStarts){
                          userUpdates.membershipStarts = null;
                        }
                        if(!userRef.data().membershipEnds){
                          userUpdates.membershipEnds = null;
                        }
                        if(!userRef.data().gantnerCardNumber){
                          userUpdates.gantnerCardNumber = null
                        }
                        transaction.update(usersRef.doc(userRef.id), userUpdates);
                      }else{
                        userUpdates.name = name;
                        userUpdates.email = email;
                        userUpdates.phone = phone;
                        userUpdates.roles = null;
                        userUpdates.membershipStarts = null;
                        userUpdates.membershipEnds = null;
                        userUpdates.gantnerCardNumber = null
                        transaction.set(usersRef.doc(userRef.id), userUpdates);
                      }

                      // transaction.update(userRef, userUpdates);
                      transaction.set(bookingRef, bookingData);
                      transaction.set(sessionRef, sessionData);

                      return Promise.resolve(bookingData);
                    }

                    // trainer.get('name').charAt(0).toUpperCase() + trainer.get('name').slice(1);
                });
              });

        }).then(function(bookingData) {
                  // dispatch({
                  //   type: 'DONE_BOOKING',
                  //   bookingData:{seat:seat},
                  //   longBookingLabel
                  // })
                  if(getState().state.get('user').isEmpty()){
                    dispatch(setUser(Map({id:bookingData.userId, name:bookingData.name, email:bookingData.email, phone:bookingData.phone})))
                  }
                  dispatch(getBookingsByUserId(bookingData.userId));
                  dispatch(showMessage("We've booked your place. See you soon!"));
                  // console.log("Transaction successfully committed!", getState().state.get('user'), bookingData);
        }).catch(function(error) {
              dispatch(showMessage(error.message));
              // console.log("Transaction failed: ", error);
        });



          // })
          // usersRef.doc
  }
}

export function cancelBooking(bookingId){
  return function action(dispatch, getState) {

    dispatch(showMessage("Cancelling your booking..."), 10000);


    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const userId = getState().state.getIn(['user', 'id']);
    const booking = getState().state.getIn(['bookings', 'bookingsById', bookingId]).toJS();
    booking.cancelledAt = timestamp;
    booking.cancelledBy = userId;

    // console.log(booking);

    const sessionsRef = firestore.collection('sessions');
    const sessionRef = booking.sessionId && sessionsRef.doc(booking.sessionId);
    const bookingsRef = firestore.collection('bookings');
    const bookingRef = bookingsRef.doc(bookingId);

    if(booking.type === 'class'){
      return firestore.runTransaction(function(transaction) {
        return transaction.get(sessionRef).then(function(sessionDoc) {
          const sessionData = sessionDoc.data();
          var bookings = sessionData.bookings;
          if(!bookings[booking.seat]){
            //boking exists
            return Promise.reject(new Error('Cancel Booking Failed!'));
          }else{
            delete bookings[booking.seat];
            sessionData.bookings = bookings;
            // transaction.set(usersRef.doc(userRef.id), {name:name, email:email, phone:phone});
            transaction.set(bookingRef, booking);
            transaction.set(sessionRef, sessionData);

            // console.log("Booking cancelled", booking);

            dispatch(showMessage("Your booking has been cancelled"));

            return Promise.resolve(booking);
          }
        });
      });
    }else if(booking.type === 'pt'){
      return firestore.runTransaction(function(transaction) {
        return transaction.get(bookingRef).then(function(sessionDoc) {
            transaction.set(bookingRef, booking);

            dispatch(showMessage("Your booking has been cancelled"));

            return Promise.resolve(booking);
        });
      });
    }

  }
}

export function getClasses(){
  return function action(dispatch, getState) {
    // dispatch(getClassesNotification());
    firestore.collection("classes").onSnapshot(function(querySnapshot) {
      var classes = {};
      querySnapshot.forEach(function(doc) {
        classes[doc.id] = doc.data();
      });
      dispatch(setClasses(classes));
    });
  }
}

export function setClasses(classes) {
  return {
    type: 'SET_CLASSES',
    classes
  };
}

export function getUsers(){
  return function action(dispatch, getState) {
    if(unsubscribeUsers){
      unsubscribeUsers();
    }
    unsubscribeUsers = firestore.collection("users").onSnapshot(querySnapshot => {
      var users = {};
      querySnapshot.forEach(doc=>{
        users[doc.id] = doc.data();
      });
      dispatch(setUsers(users));
    });
  }
}

export function getAllVendProducts(){
  return function action(dispatch, getState) {
    if(unsubscribeVendProduct){
      unsubscribeVendProduct();
    }
    unsubscribeVendProduct = firestore.collection("vendProducts").onSnapshot(querySnapshot => {
      var vendProducts = {};
      querySnapshot.forEach(doc=>{
        vendProducts[doc.id] = doc.data();
      });
      dispatch(setVendProducts(vendProducts));
    });
  }
}

export function getUser(uid, handleResponse){
  return function action(dispatch, getState) {
    if(unsubscribeCurrentUser){
      unsubscribeCurrentUser();
    }
    if (uid){
      unsubscribeCurrentUser = firestore && firestore.collection("users").doc(uid).onSnapshot(doc => {
        if(!doc.exists){
          //console.log('userDoc missing', uid);
        }else{
         // console.log('!!!exists', doc.data());
          handleResponse(doc.data());
          // dispatch(setUser(doc));
        }
      });
    }
  }
}

export function setUserByUserId(uid, handleResponse){
  return function action(dispatch, getState) {
    if(unsubscribeCurrentUser){
      unsubscribeCurrentUser();
    }
    if (uid){
      unsubscribeCurrentUser = firestore && firestore.collection("users").doc(uid).onSnapshot(doc => {
        if(!doc.exists){
         // console.log('userDoc missing', uid);
        }else{
         // console.log('!!!exists', doc.data());
          handleResponse(doc.data());
          dispatch(setUser(doc));
        }
      });
    }
    else{
      dispatch(showMessage('user not exist!!!'))
    }
  }
}

export function getUserByEmail(email, handleResponse){
  return function action(dispatch, getState) {
    if(unsubscribeCurrentUser){
      unsubscribeCurrentUser();
    }
    unsubscribeCurrentUser = firestore.collection("users").where('email', '==', email).onSnapshot(function(querySnapshot) {
      if (querySnapshot.empty){
        //console.log('querySnapshot is empty');
        handleResponse({error:true, message:'no member found'});
      }
      else{
        querySnapshot.forEach(function(doc) {
          //console.log(doc.id, doc.data());
          if (doc.data()){
            handleResponse(doc.data());
            dispatch(setUser(doc));
          }
          else{
            handleResponse({error:true, message:'no member found'});
          }
          // trainers[doc.id] = doc.data();
        });
        // if(!doc.exists){
        //   console.log('userDoc missing', email);
        // }else{
        //   console.log('!!!exists email', doc.data());
        //   dispatch(setUser(doc));
        // }
  
      }
      
    });
  }
}

// get user by phone
export function getUserByPhone(phone, handleResponse){
  return function action(dispatch, getState) {
    if(unsubscribeCurrentUser){
      unsubscribeCurrentUser();
    }
    unsubscribeCurrentUser = firestore.collection("users").where('phone', '==', phone).onSnapshot(function(querySnapshot) {
      if (querySnapshot.empty){
        //console.log('querySnapshot is empty');
        handleResponse({error:true, message:'no member found'});
      }
      else{
        querySnapshot.forEach(function(doc) {
         // console.log('phone exist...', doc.id, doc.data());
          if (doc.data()){
            handleResponse(doc.data());
            dispatch(setUser(doc));
          }
          else{
            handleResponse({error:true, message:'no member found'});
          }
        });
        // if(!doc.exists){
        //   console.log('userDoc missing', email);
        // }else{
        //   console.log('!!!exists email', doc.data());
        //   dispatch(setUser(doc));
        // }
  
      }
      
    });
  }
}

// export function getReferralList (){
//   return function action(dispatch, getstate) {
//     if(unsubscribeReferral){
//       unsubscribeReferral();
//     }
//     firestore.collection("cnyReferralList").onSnapshot(function(querySnapshot) {
//       var referral = {};
//       querySnapshot.forEach(function(doc) {
//         // console.log(doc.id, doc.data().name);
//         referral[doc.id] = doc.data();
//       });
//       // console.log(trainers);
//       dispatch(set(referral));
//     });
//   }
// }

export function getTrainers(){
  return function action(dispatch, getState) {
    if(unsubscribeTrainers){
      unsubscribeTrainers();
    }
    // firestore.collection("users").where('roles.trainer', '==', true).onSnapshot(function(querySnapshot) {
    firestore.collection("users").where('staffRole', '==', 'trainer').onSnapshot(function(querySnapshot) {
      var trainers = {};
      querySnapshot.forEach(function(doc) {
        // console.log(doc.id, doc.data().name);
        trainers[doc.id] = doc.data();
      });
      // console.log(trainers);
      dispatch(setTrainers(trainers));
    });
  }
}

export function setTrainers(trainers) {
  return {
    type: 'SET_TRAINERS',
    trainers
  };
}

export function setTrainer(trainer) {
  return {
    type: 'SET_TRAINER',
    trainer
  };
}

export function getAdmins(){
  return function action(dispatch, getState) {
    if(unsubscribeAdmins){
      unsubscribeAdmins()
    }
    // unsubscribeAdmins = firestore.collection("users").where('roles.admin', '==', true).onSnapshot(function(querySnapshot) {
    unsubscribeAdmins = firestore.collection("users").where('staffRole', '==', 'admin').onSnapshot(function(querySnapshot) {  
      var admins = {};
      querySnapshot.forEach(function(doc) {
        // console.log(doc.id, doc.data().name);
        admins[doc.id] = doc.data();
      });
      dispatch(setAdmins(admins));
    });
  }
}

export function setAdmins(admins) {
  return {
    type: 'SET_ADMINS',
    admins
  };
}

export function getMembershipConsultants(){
  return function action(dispatch, getState) {
    if(unsubscribeMembershipConsultants){
      unsubscribeMembershipConsultants()
    }
    // unsubscribeMembershipConsultants = firestore.collection("users").where('roles.mc', '==', true).onSnapshot(function(querySnapshot) {
    unsubscribeMembershipConsultants = firestore.collection("users").where('isStaff', '==', true).onSnapshot(function(querySnapshot) {
      var membershipConsultants = {};
      querySnapshot.forEach(function(doc) {
        // console.log(doc.id, doc.data().name);
        membershipConsultants[doc.id] = doc.data();
      });
      // console.log(membershipConsultants);
      dispatch(setMembershipConsultants(membershipConsultants));
    });
  }
}

export function setMembershipConsultants(membershipConsultants) {
  return {
    type: 'SET_MEMBERSHIP_CONSULTANTS',
    membershipConsultants
  };
}

export function getStaffs(){
  return function action(dispatch, getState) {
    if(unsubscribeStaffs){
      unsubscribeStaffs()
    }
    unsubscribeStaffs = firestore.collection("users").where('isStaff', '==', true).onSnapshot(function(querySnapshot) {
      var staffs = {};
      querySnapshot.forEach(function(doc) {
        //console.log(doc.id, doc.data().name);
        staffs[doc.id] = doc.data();
      });
      // console.log(membershipConsultants);
      dispatch(setStaffs(staffs));
    });
  }
}

export function setStaffs(staffs) {
  return {
    type: 'SET_STAFFS',
    staffs
  };
}

export function getActiveMembers(){
  return function action(dispatch, getState) {
    if(unsubscribeActiveMembers){
      unsubscribeActiveMembers();
    }
    // console.log('getactivemember: ', );
    unsubscribeActiveMembers = firestore.collection("users").where('membershipStarts', '<', moment().toDate()).onSnapshot(function(querySnapshot) {
      var activeMembers = {};
      querySnapshot.forEach(function(doc) {
        // console.log(doc.id, doc.data().name);
        activeMembers[doc.id] = doc.data();
      });
      dispatch(setActiveMembers(activeMembers));
    });
  }
}

export function setActiveMembers(activeMembers) {
  return {
    type: 'SET_ACTIVE_MEMBERS',
    activeMembers
  };
}

export function getTheDate(theDate){
  if (theDate === null){
    return;
  }
  // for timestamp firebase
  if (typeof(theDate)==='object'){
    return theDate.toDate();
  }
  // for string date format
  else if (typeof(theDate)==='string'){
    return new Date(theDate);
  }
}

// if membership package, return true
export function getMembershipPackage(packageId){
  if (packageId 
    // && 
    // (
    // packageId==='89THMCx0BybpSVJ1J8oz' // 6 month term (all clubs)
    // || packageId==='BKcaoWGrWKYihS40MpGd' // CP290
    // || packageId==='DjeVJskpeZDdEGlcUlB1' // 6M term renewal
    // || packageId==='L6sJtsKG68LpEUH3QeD4' // complimentaryPromo
    // || packageId==='LNGWNSdm6kf4rz1ihj0i' // 3M Jan2020 Promo All Clubs
    // || packageId==='TJ7Fiqgrt6EHUhR5Sb2q' // monthly all clubs
    // || packageId==='VWEHvdhNVW0zL8ZAeXJX' // 12M Term renewal club
    // || packageId==='WmcQo1XVXehGaxhSNCKa' // yearly
    // || packageId==='ZEDcEHZp3fKeQOkDxCH8' // CP180
    // || packageId==='aTHIgscCxbwjDD8flTi3' // 3 term all clubs
    // || packageId==='duz1AkLuin8nOUd7r66L' // 6 month
    // || packageId==='dz8SAwq99GWdEvHCKST2' // CP210
    // || packageId==='eRMTW6cQen6mcTJgKEvy' // CP310
    // || packageId==='k7As68CqGsFbKZh1Imo4' // 3M Jan2020
    // || packageId==='q7SXXNKv83MkkJs8Ql0n' // 12M term all clubs
    // || packageId==='vf2jCUOEeDDiIQ0S42BJ' // monthly 250
    // || packageId==='w12J3n9Qs6LTViI6HaEY' // 3M Jan2020 promo
    // || packageId==='wpUO5vxWmme7KITqSITo' // CP230
    // || packageId==='yKLfNYOPzXHoAiknAT24' //complimentary
    // || packageId==='yQFACCzpS4DKcDyYftBx' // 3M Term Membership
    // )
    ){
      return true
    }
    else{
      return false
    }
}

export function getExpiredMembers(){
  return function action(dispatch, getState) {
    if(unsubscribeExpiredMembers){
      unsubscribeExpiredMembers();
    };
    unsubscribeExpiredMembers = firestore.collection("users").where('membershipEnds', '<', moment().toDate()).onSnapshot(function(querySnapshot) {
      var expiredMembers = {};
      querySnapshot.forEach(function(doc) {
        // console.log(doc.id, doc.data().name);
        expiredMembers[doc.id] = doc.data();
      });
      dispatch(setExpiredMembers(expiredMembers));
    });
  }
}

export function setExpiredMembers(expiredMembers) {
  // console.log('setExpiredMembers: ', expiredMembers);
  return {
    type: 'SET_EXPIRED_MEMBERS',
    expiredMembers
  };
}

export function setCancelledMembers(cancelledMembers) {
  return {
    type: 'SET_CANCELLED_MEMBERS',
    cancelledMembers
  };
}

export function getProspects(){
  return function action(dispatch, getState) {
    if(unsubscribeProspects){
      unsubscribeProspects();
    }
    // unsubscribeProspects = firestore.collection("users").where('roles', '==', null).where('membershipStarts', '==', null).onSnapshot(function(querySnapshot) {
    unsubscribeProspects = firestore.collection("users").where('isStaff', '==', false).where('membershipStarts', '==', null).onSnapshot(function(querySnapshot) {  
      var prospects = {};
      querySnapshot.forEach(function(doc) {
        // console.log(doc.id, doc.data().name);
        const data = doc.data();
        const isStaff = data && data.isStaff;
        const staffRole = data && data.staffRole;
        if (!isStaff || !staffRole){
          prospects[doc.id] = doc.data();
        }
      });
      dispatch(setProspects(prospects));
    });
  }
}

export function setProspects(prospects) {
  return {
    type: 'SET_PROSPECTS',
    prospects
  };
}

export function getSessions(){
  return function action(dispatch, getState) {
    firestore.collection("sessions").where('startsAt', '<=', moment().add(30, 'd').toDate()).where('startsAt', '>=', moment().toDate()).onSnapshot(function(querySnapshot) {
      var sessions = {};
      querySnapshot.forEach(function(doc) {
        const data = doc.data();
        if(data && !data.cancelled){
          sessions[doc.id] = data;
        }
      });
      dispatch(setSessions(sessions));
    });
  }
}

export function setSessions(sessions) {
  return {
    type: 'SET_SESSIONS',
    sessions
  };
}

// for branch
export function getBranches(){
  return function action(dispatch, getState) {
    if(unsubscribeBranches){
      unsubscribeBranches();
    }
    unsubscribeBranches = firestore.collection("branches").onSnapshot(function(querySnapshot) {
      var branches = {};
      querySnapshot.forEach(function(doc) {
        branches[doc.id] = doc.data();
      });
      dispatch(setBranches(branches));
    });
  }
}

export function setBranches(branches) {
  //console.log('setting the branches...', branches);
  return {
    type: 'SET_BRANCHES',
    branches
  };
}

// for rooms
export function getRooms(){
  return function action(dispatch, getState) {
    if(unsubscribeRooms){
      unsubscribeRooms();
    }
    unsubscribeRooms = firestore.collection("rooms").onSnapshot(function(querySnapshot) {
      var rooms = {};
      querySnapshot.forEach(function(doc) {
        rooms[doc.id] = doc.data();
      });
      dispatch(setRooms(rooms));
    });
  }
}

export function setRooms(rooms) {
 // console.log('setting the rooms...', rooms);
  return {
    type: 'SET_ROOMS',
    rooms
  };
}

export function getPackages(){
  return function action(dispatch, getState) {
    if(unsubscribePackages){
      unsubscribePackages();
    }
    unsubscribePackages = firestore.collection("packages").onSnapshot(function(querySnapshot) {
      var packages = {};
      querySnapshot.forEach(function(doc) {
        packages[doc.id] = doc.data();
      });
      dispatch(setPackages(packages));
    });
  }
}

export function setPackages(packages) {
  return {
    type: 'SET_PACKAGES',
    packages
  };
}

export function getGantnerLogs(){
  return function action(dispatch, getState) {
    if(unsubscribeGantnerLogs){
      unsubscribeGantnerLogs();
    }
    unsubscribeGantnerLogs = firestore.collection("gantnerLogs").where('createdAt', '>=', moment().startOf('day').toDate()).onSnapshot(function(querySnapshot) {
    // unsubscribeGantnerLogs = firestore.collection("gantnerLogs").onSnapshot(function(querySnapshot) {
      var gantnerLogs = {};
      querySnapshot.forEach(function(doc) {
        gantnerLogs[doc.id] = doc.data();
      });
      dispatch(setGantnerLogs(gantnerLogs));
    });
  }
}

export function getGantnerMthLogs(){
  return function action(dispatch, getState) {
    if(unsubscribeGantnerLogs){
      unsubscribeGantnerLogs();
    }
    unsubscribeGantnerLogs = firestore.collection("gantnerLogs").where('createdAt', '>=', moment('20200101').startOf('day').toDate()).onSnapshot(function(querySnapshot) {
    // unsubscribeGantnerLogs = firestore.collection("gantnerLogs").onSnapshot(function(querySnapshot) {
      var gantnerLogs = {};
      querySnapshot.forEach(function(doc) {
        gantnerLogs[doc.id] = doc.data();
      });
      dispatch(setGantnerLogs(gantnerLogs));
    });
  }
}

export function setGantnerLogs(gantnerLogs) {
  return {
    type: 'SET_GANTNER_LOGS',
    gantnerLogs
  };
}

export function getGantnerLogsByUId(userId){
  // return function action(dispatch, getState) {
    // var gantnerLogs = {};
    // if(userId && userId.length>0){
    //   console.log('getGantnerLogsByUserId: ', userId);
    //   const uidGantnerLogs = firestore.collection("gantnerLogs").where("userId", "==", userId);
    //   uidGantnerLogs.get().then(function (querySnapshot) {
    //     querySnapshot.forEach(function(doc) {
    //       // doc.data() is never undefined for query doc snapshots
    //       console.log(doc.id, " => ", doc.data());
          
    //     });
      // .then((doc=>{
      //   if (doc.exists) {
      //     console.log("Document data:", doc.data());
      //   } else {
      //       // doc.data() will be undefined in this case
      //       console.log("No such document!");
      //   }
      // }))
      // console.log('uidGantnerLogs: ', uidGantnerLogs);

      //firestore.collection("gantnerLogs").where('userId', '==', userId).onSnapshot(function(querySnapshot) {
        // var gantnerLogs = {};
        // console.log('unsubscribeUserGantnerLogs');
        // querySnapshot.forEach(function(doc) {
        //     // doc.data() is never undefined for query doc snapshots
        //     gantnerLogs[doc.id] = doc.data();
        //     console.log(doc.id, " => ", doc.data());
        // });
        // dispatch(setGantnerLogsByUserId(gantnerLogs, userId));
      //});
  //  }
  //}
  //return gantnerLogs;
}

// export function getUserByUserEmail(email){
//   return function action(dispatch, getState) {
//     firestore.collection("users").where('email', '==', email).onSnapshot(function(querySnapshot) {
//         var userData = {};
//         //console.log('unsubscribeUserGantnerLogs');
//         querySnapshot.forEach(function(doc) {
//             // doc.data() is never undefined for query doc snapshots
//             userData[doc.id] = doc.data();
//             console.log('theusers: ', userData);
//             // console.log(doc.id, " => ", doc.data());
//         });
//         // dispatch(setGantnerLogsByUserId(gantnerLogs, userId));
//       });
//     }

  // const userQuery = firestore.collection("users").where('email', '==', email).onSnapshot(function(querySnapshot) {
  //   var userData = {};
  // });

  // console.log('userQuery: ', userQuery);
// }

export function getGantnerLogsByUserId(userId){
  return function action(dispatch, getState) {
    // console.log('getGantnerLogsByUserId: ', userId);
    if(unsubscribeUserGantnerLogs){
      // console.log('unsubscribeUserGantnerLogs');
      unsubscribeUserGantnerLogs();
    }
    if(userId && userId.length>0){
      // console.log('getGantnerLogsByUserId: ', userId);
      //  unsubscribeUserGantnerLogs = firestore.collection("gantnerLogs").where('userId', '==', userId).orderBy('createdAt', 'desc')
      //  .onSnapshot(function(querySnapshot) {
         
        unsubscribeUserGantnerLogs = firestore.collection("gantnerLogs").where('userId', '==', userId)
        .onSnapshot(function(querySnapshot) {
        var gantnerLogs = {};
        //console.log('unsubscribeUserGantnerLogs');
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            gantnerLogs[doc.id] = doc.data();
            // console.log(doc.id, " => ", doc.data());
        });
        dispatch(setGantnerLogsByUserId(gantnerLogs, userId));
      });
    }
  }
}

export function setGantnerLogsByUserId(gantnerLogs, userId) {
  return {
    type: 'SET_GANTNER_LOGS_BY_USER_ID',
    gantnerLogs,
    userId
  };
}

export function addCheckInOut(userId){
  return function action(dispatch, getState) {
 
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();

    if(userId && userId.length > 0){
      const user = getState().state.has('users') ? getState().state.getIn(['users', 'usersById', userId]) : null;
      if(user && user.get('currentRoomId')){ // to check out
        const currentRoomId = (user && user.get('currentRoomId'))
        firestore.collection("users").doc(userId).update({
          currentRoomId : null,
          cancellationDate:timestamp,
          currentBranch: null,
          branch:null,
          roomId:null
        }).then(()=>{
          firestore.collection('rooms').doc(currentRoomId).update({
            isAvailable:true
          })
        }).then(()=>{
          dispatch(showMessage("User has been checked out"));
        }).catch(error=>{
          dispatch(showMessage(`Error check out member: ${error}`));
        })
        
      }
      else{
        //todo:   to check in
      }
    }
  }
}

export function addCheckOut(userId, deviceId = 'App - Manual'){
  return function action(dispatch, getState) {
    var summaryCheckInMap = {};
    var gantnerLogsByUserIdObj = {};
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const gantnerDate = moment().tz('Asia/Kuala_Lumpur').format('YYYYMMDD');
    const gantnerTime = moment().tz('Asia/Kuala_Lumpur').format('HH:mm:ss');
    var roomRef,userData;

    if(userId && userId.length > 0){
      const checkInData = {
        cardNumber:null,
        deviceId:deviceId,
        createdAt:timestamp,
        // localCreatedAt: new Date(),
        authorized:true,
        registered:true,
        userId:userId
      }

      if (userData && userData.currentRoomId){
        roomRef = firestore.collection("rooms").doc(userData.currentRoomId);
        roomRef.update({isAvailable:true});
      }
    }
  }
}

export function getCardToRegister(userId){
  return function action(dispatch, getState) {
   // console.log('getting card');
    if(unsubscribeCardToRegister){
      unsubscribeCardToRegister();
    }
    const currentUser = getState().state.has('user') ? getState().state.get('user') : null;
    const currentUserRoles = currentUser && currentUser.has('roles')? currentUser.get('roles') : null;
    const isKlccCRO = (currentUserRoles && currentUserRoles.branch === 'KLCC')? true:false;
    const currentUserEmail = currentUser && currentUser.has('email') ? currentUser.get('email') : null;
    // uncomment on 18/8/2020 - both account should be able to do add membership card
    // const currentUserIsKLCC = (currentUserEmail && (currentUserEmail.indexOf('+klcc@babel.fit') !== -1) || currentUserEmail === 'faizul.j@boontan.net' || currentUserEmail === 'lycheelye@gmail.com' || isKlccCRO) ? true : false;
    // const deviceId = currentUserIsKLCC ? 'Check In - KLCC' : 'Check In';
    // console.log('deviceId', deviceId);
    // const selectedUser = getState().state.has('users') ? getState().state.getIn(['users', 'usersById', userId]) : null;
    //
    unsubscribeCardToRegister = firestore.collection("gantnerLogs")
      .where('registered', '==', false)
      // .where('deviceId', '==', deviceId)
      .where('createdAt', '>=', moment().startOf('day').toDate())
      .orderBy('createdAt', 'desc').limit(1)
      .onSnapshot(function(querySnapshot) {

        //  querySnapshot.forEach(function(doc) {
        //   console.log("Add Card Log", doc.id, doc.data());
          
        //   const data = doc.data();
        //   const createdAt = data.createdAt||null;
        //   console.log('createdAtTime: ', moment(getTheDate(createdAt)).format('hh:mm'));
        //   console.log('createdAtDate: ', moment(getTheDate(createdAt)).format('DD-MM-YYYY'));

        //   // console.log(doc.data().cardNumber, doc.id, doc.data());
        //   // dispatch(setCardToRegister(doc.data().cardNumber));
        // });

    // unsubscribeCardToRegister = firestore.collection("gantnerLogs").where('registered', '==', false).orderBy('createdAt', 'desc').limit(1).onSnapshot(function(querySnapshot) {
    // firestore.collection("gantnerLogs").onSnapshot(function(querySnapshot) {
      // console.log('gotten card'); // get data from cache
      if(getState().state.has('cardToRegister') === false){
        //add cardToRegister to state
       //console.log('no card yet card');
        dispatch(setCardToRegister(null));
      }else{
        //console.log('found card');
        
        // console.log('querySnapShot: ', querySnapshot);
        querySnapshot.forEach(function(doc) {
         // console.log("Add Card Log", doc.id, doc.data());
          // console.log(doc.data().cardNumber, doc.id, doc.data());
          dispatch(setCardToRegister(doc.data().cardNumber));
        });
        unsubscribeCardToRegister();
      }
    });
  }
}

export function removeMemberGantnerCard(userId){
  return function action(dispatch, getState) {
    dispatch(setCardToRegister(null));
    setTimeout(()=>{
      dispatch(setCardToRegister('111111'));
    }, 1000)
  }
}

export function getCardToRegisterTest(){
  return function action(dispatch, getState) {
    dispatch(setCardToRegister(null));
    setTimeout(()=>{
      dispatch(setCardToRegister('111111'));
    }, 1000)
    // console.log('getting card');
    // if(unsubscribeCardToRegister){
    //   console.log('unsub card');
    //   unsubscribeCardToRegister();
    // }
    // unsubscribeCardToRegister = firestore.collection("gantnerLogs").where('registered', '==', false).orderBy('createdAt', 'desc').limit(1).onSnapshot(function(querySnapshot) {
    // // firestore.collection("gantnerLogs").onSnapshot(function(querySnapshot) {
    //   console.log('gotten card');
    //   if(getState().state.has('cardToRegister') === false){
    //     //add cardToRegister to state
    //     console.log('no card yet card');
    //     dispatch(setCardToRegister(null));
    //   }else{
    //     console.log('found card');
    //     querySnapshot.forEach(function(doc) {
    //       console.log(doc.data().cardNumber, doc.id, doc.data());
    //       dispatch(setCardToRegister(doc.data().cardNumber));
    //     });
    //     unsubscribeCardToRegister();
    //   }
    // });
  }
}

export function setCardToRegister(cardNumber) {
  //console.log('setting the card to register: ', cardNumber);
  return {
    type: 'SET_CARD_TO_REGISTER',
    cardNumber
  };
}

export function removeCardToRegister() {
  if(unsubscribeCardToRegister){
    unsubscribeCardToRegister();
  }
  return {
    type: 'REMOVE_CARD_TO_REGISTER'
  };
}

export function removeGantnerCard(userId) {
  return function action(dispatch, getState) {
    if(userId){
      dispatch(showMessage("Removing userData.."));
      return firestore.collection('users').doc(userId).update({gantnerCardNumber:firebase.firestore.FieldValue.delete()})
      .then(()=>{
       // console.log('Gantner Card Removed!')
        dispatch(showMessage("Gantner Card Removed!"));
      }).catch((e)=>{
        dispatch(showMessage(e.message));
      })
    }
  }
}

// copy the payment data from currentUserId to the transferUserId
export function transferPayment (currentUserId, transferUserId){
  return function action(dispatch, getState) {

    if(currentUserId && transferUserId){
      const batch = firestore.batch();
      const paymentsQuery = firestore.collection('payments').where('userId', '==', currentUserId);

      paymentsQuery.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
           // console.log(doc.id, " => ", doc.data());
            // Build doc ref from doc.id
            firestore.collection("payments").doc(doc.id).update({userId: transferUserId});
        })
      }).then(()=>{
        dispatch(showMessage("successfully transfer the payments"));
      })
    }
    else{
      dispatch(showMessage("invalid user id"));
    }
  }
}

// copy the gantner data from currentUserId to the transferUserId
export function transferGantner (currentUserId, transferUserId){
  return function action(dispatch, getState) {

    if(currentUserId && transferUserId){
      const batch = firestore.batch();
      const paymentsQuery = firestore.collection('gantnerLogs').where('userId', '==', currentUserId);

      paymentsQuery.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            //console.log(doc.id, " => ", doc.data());
            // Build doc ref from doc.id
            firestore.collection("gantnerLogs").doc(doc.id).update({userId: transferUserId});
        })
      }).then(()=>{
        dispatch(showMessage("successfully transfer the gantnerLogs"));
      })
    }
    else{
      dispatch(showMessage("invalid user id"));
    }
  }
}

export function removeUser(userId){
  return function action(dispatch, getState) {
    if(userId){
      dispatch(showMessage("Removing userData.."));
      return firestore.collection('users').doc(userId).delete().then(()=>{
        dispatch(showMessage("Removed User!"));
      });
    }
  }
}

// send referral email
export function sendreferralEmail (currentUserEmail, currentUserName, selectedAvatar, referralUsers){
  return function action(dispatch, getState) {
    if (currentUserEmail && currentUserName && referralUsers){
      dispatch(showMessage("test sendreferralEmail"));
      dispatch(showMessage(currentUserEmail));
    }
  }
}

export function getCnyreferral(){
  return function action(dispatch, getState) {
    if (unsubscribeReferralCny) {
      unsubscribeReferralCny();
    }
    const user = getState().state.get('user');
    unsubscribeReferralCny = firestore.collection("cnyReferralList").onSnapshot(function(querySnapshot) {
      var referralList = {};
      querySnapshot.forEach(function(doc) {
        referralList[doc.id] = doc.data();
      });
      dispatch(setCnyReferral(referralList));
    });
  }
}

export function addFreeze(userId, freezeDate, freezeQuantity = 1, terminatedUser = false, currentLoginUserEmail=" ", currentLoginUserId=" ", specialFreeze = false){
  return function action(dispatch, getState) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const logRef = firestore.collection("logs");
    const batch = firestore.batch();
    if(userId && userId.length > 0 && freezeDate && freezeQuantity >= 1 && freezeQuantity < 12){
      !terminatedUser? dispatch(showMessage("Adding Freeze..")):dispatch(showMessage("Adding Terminated Freeze.."));
      // const batch = firestore.batch();
      for (var i = 0; i < freezeQuantity; i++) {
        const freezePayment = {
          createdAt : timestamp,
          totalPrice : 0,
          type : 'membership',
          userId : userId,
          source : !terminatedUser? 'freeze':'freezeTerminate',
          freezeFor : moment(freezeDate).add(i, 'months').toDate(),
        }
        if (specialFreeze){
          freezePayment.freezeType = 'specialFreeze'
        }
        batch.set(firestore.collection('payments').doc(),freezePayment);
      }
      return batch.commit().then(()=>{
        !terminatedUser? dispatch(showMessage("Added Freeze!")):dispatch(showMessage("Added Terminated Freeze!"));
      }).then(()=>{
       // console.log('adding freeze log!');
        logRef.add({
          executerId: currentLoginUserId,
          executerEmail: currentLoginUserEmail,
          userId,
          freezeFor : moment(freezeDate).add(i, 'months').toDate(),
          source : !terminatedUser? 'freeze':'freezeTerminate',
          freezeQuantity,
          // BeforeuserData: BeforeuserData,
          // afterUserData: userData,
          time:timestamp,
        })
      });
    }
    else if (userId && userId.length > 0 && freezeDate && freezeQuantity <= 1){
      const freezePayment = {
        createdAt : timestamp,
        totalPrice : 0,
        type : 'membership',
        userId : userId,
        source : 'freeze',
        freezeQuantity,
        freezeFor : moment(freezeDate).toDate(),
        freezeEnd : moment(freezeDate).add(13, 'days').toDate(),
      }
      batch.set(firestore.collection('payments').doc(),freezePayment);
      return batch.commit().then(()=>{
        dispatch(showMessage("Added 14 days Freeze!"));
      }).then(()=>{
       // console.log('adding freeze log!');
        logRef.add({
          executerId: currentLoginUserId,
          executerEmail: currentLoginUserEmail,
          userId,
          freezeFor : moment(freezeDate).toDate(),
          source : 'freeze',
          freezeQuantity,
          freezeEnd : moment(freezeDate).add(13, 'days').toDate(),
          // BeforeuserData: BeforeuserData,
          // afterUserData: userData,
          time:timestamp,
        })
      });
    }
    else{
      dispatch(showMessage("invalid Freeze date"));
    }
  }
}

export function addSpecialFreeze(userId, freezeDate, freezeQuantity = 1, dayQty = 14, currentLoginUserEmail=" ", currentLoginUserId=" "){
  return function action(dispatch, getState) {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    const logRef = firestore.collection("logs");
    //console.log('dayQty: ', dayQty);
    if(userId && userId.length > 0 && freezeDate && freezeQuantity > 0 && freezeQuantity < 12){
      dispatch(showMessage("Adding Freeze.."));
      const batch = firestore.batch();
      for (var i = 0; i < freezeQuantity; i++) {
        const freezePayment = {
          createdAt : moment(freezeDate).add(i, 'months').toDate(),
          totalPrice : 0,
          type : 'membership',
          userId : userId,
          source : 'freeze',
          freezeFor : moment(freezeDate).add(i, 'months').toDate(),
          freezeEnd : moment(freezeDate).add(i, 'months').add(dayQty, 'days').toDate(),
          type: 'freezeSpecial'
        }
        batch.set(firestore.collection('payments').doc(),freezePayment);
      }
      return batch.commit().then(()=>{
        dispatch(showMessage("Added Freeze!"));
      }).then(()=>{
        //console.log('adding freeze log!');
        logRef.add({
          executerId: currentLoginUserId,
          executerEmail: currentLoginUserEmail,
          userId,
          freezeFor : moment(freezeDate).add(i, 'months').toDate(),
          // freezeEnd : moment(freezeDate).add(i, 'months').add(dayQty, 'days').toDate(),
          source : 'freeze',
          freezeQuantity,
          time:timestamp,
          type: 'freezeSpecial'
        })
      });
    }
    else{
      dispatch(showMessage("invalid Freeze date"));
    }
  }
}

export function removeFreeze(freezeId, userId, freezeStartMoment = null, executorId = null, executorEmail = null){
  return function action(dispatch, getState) {
    const logRef = firestore.collection("logs");
    const timestamp = firebase.firestore.FieldValue.serverTimestamp();
    if(freezeId){
      dispatch(showMessage("Removing Freeze.."));
      return firestore.collection('payments').doc(freezeId).delete().then(()=>{
        dispatch(showMessage("Removed Freeze!"));
      })
      .then(()=>{
        //console.log('adding freeze log!');

        if (freezeStartMoment && executorId && executorEmail && userId){
          logRef.add({
            userId:userId,
            executerId: executorId,
            executerEmail: executorEmail,
            action:'freezeRemoved',
            time:timestamp,
            freezeForRemoved:freezeStartMoment.tz('Asia/Kuala_Lumpur').format('YYYY-MM-DD'),
          });
        }
      });
    }
  }
}

export function updateAppoinmentCredit(paymentId, number){
  return function action(dispatch, getState) {
    if(number>0){
      dispatch(showMessage("updating appoinment credit"));
      return firestore.collection('payments').doc(paymentId).update({
        credit:number
      }).then(()=>{
        dispatch(showMessage("appoinment credit updated"));
      });
    }
  }
}

export function getBookingsByUserId(userId){
  return function action(dispatch, getState) {
    if (unsubscribeUserIdBookings) {
      unsubscribeUserIdBookings();
    }
    const user = getState().state.get('user');
    const roles = user && user.get('roles');
    const isTrainer = roles && roles.get('trainer') === true;
    const isAdmin = roles && roles.get('admin') === true;
    const queryProperty = isAdmin || isTrainer ? 'trainerId' : 'userId';
    // console.log(queryProperty, user && user.toJS(), roles, isTrainer);
    unsubscribeUserIdBookings = firestore.collection("bookings").where(queryProperty, "==", userId).onSnapshot(function(querySnapshot) {
      var bookings = {};
      querySnapshot.forEach(function(doc) {
        bookings[doc.id] = doc.data();
      });
      dispatch(setBookings(bookings));
    });
  }
}

export function getBookingsByTrainerId(userId){
  return function action(dispatch, getState) {
    if (unsubscribeParticularUserIdBookings) {
      unsubscribeParticularUserIdBookings();
    }
    //console.log('get booking by trainer id...');
    // const user = getState().state.get('user');
    // const roles = user && user.get('roles');
    // const isTrainer = roles && roles.get('trainer') === true;
    // const isAdmin = roles && roles.get('admin') === true;
    // const queryProperty = isAdmin || isTrainer ? 'trainerId' : 'userId';
    // console.log(queryProperty, user && user.toJS(), roles, isTrainer);
    unsubscribeParticularUserIdBookings = firestore && firestore.collection("bookings").where('trainerId', "==", userId).onSnapshot(function(querySnapshot) {
      var bookings = {};
      querySnapshot.forEach(function(doc) {
        bookings[doc.id] = doc.data();
      });
      // console.log(bookings);
      dispatch(setBookingsByUserId(bookings, userId));
    });
  }
}

export function getBookingsByEmail(email){
  return function action(dispatch, getState) {
    if(unsubscribeEmailBookings){
      unsubscribeEmailBookings();
    }
    unsubscribeEmailBookings = firestore.collection("bookings").where("email", "==", email).onSnapshot(function(querySnapshot) {
      var bookings = {};
      querySnapshot.forEach(function(doc) {
        bookings[doc.id] = doc.data();
      });
      dispatch(setBookings(bookings));
    });
  }
}

export function getBookings(){
  return function action(dispatch, getState) {
    if(unsubscribeBookings){
      unsubscribeBookings()
    }
    unsubscribeBookings = firestore.collection("bookings").onSnapshot(function(querySnapshot) {
      var bookings = {};
      querySnapshot.forEach(function(doc) {
        bookings[doc.id] = doc.data();
      });
      dispatch(setBookings(bookings));
    });
  }
}

export function setBookings(bookings) {
  return {
    type: 'SET_BOOKINGS',
    bookings
  };
}

export function setBookingsByUserId(bookings, userId) {
  return {
    type: 'SET_BOOKINGS_BY_USER_ID',
    bookings,
    userId
  };
}

export function getVendSales(){
  return function action(dispatch, getState) {
    if(unsubscribeVendSales){
      unsubscribeVendSales()
    }
    var startTime = new Date().getTime();
    // var endTime;
    unsubscribeVendSales = firestore.collection("vendSales").onSnapshot(function(querySnapshot) {
      var vendSales = {};
      // endTime = new Date().getTime() - startTime;
      //console.log('endTime1: ', endTime);
      startTime = new Date().getTime();
      // console.log('thevendsales: ', querySnapshot);

      querySnapshot.forEach(function(doc) {
        vendSales[doc.id] = doc.data();
      });
      // endTime = new Date().getTime() - startTime;
      // console.log('endTime2: ', endTime);
      // console.log('vendSale: ', vendSales);
      dispatch(setVendSales(vendSales));
    });
  }
}

export function getVendProductId2(){
  return function action(dispatch, getState) {
    if(unsubscribeVendProduct){
      unsubscribeVendProduct()
    }
    var startTime = new Date().getTime();
    // var endTime;
    unsubscribeVendProduct = firestore.collection("vendProducts").onSnapshot(function(querySnapshot) {
      var vendProduct = {};
      // endTime = new Date().getTime() - startTime;
      //console.log('endTime1: ', endTime);
      startTime = new Date().getTime();
      // console.log('thevendsales: ', querySnapshot);

      querySnapshot.forEach(function(doc) {
        vendProduct[doc.id] = doc.data();
      });
      // endTime = new Date().getTime() - startTime;
      // console.log('endTime2: ', endTime);
      // console.log('vendSale: ', vendSales);
      dispatch(setVendProducts(vendProduct));
    });
  }
}

export function getPayments(){
  return function action(dispatch, getState) {
    var startTime = new Date().getTime();
    var endTime;
    if(unsubscribePayments){
      unsubscribePayments()
    }
    unsubscribePayments = firestore.collection("payments").onSnapshot(function(querySnapshot) {
      var payments = {};

      endTime = new Date().getTime() - startTime;
      startTime = new Date().getTime();
      // console.log(endTime);
      querySnapshot.forEach(function(doc) {
        payments[doc.id] = doc.data();
      });
      endTime = new Date().getTime() - startTime;
      // console.log(endTime);
  
      dispatch(setPayments(payments));

      // var immutablePayments = fromJS(payments);
      // var packCount = 0;
      // var vendCount = 0;
      // var packNoVend = 0;
      // var vendNoPack = 0;
      // var packVend = 0;
      // var vendPack = 0;
      // var packNoPayments = 0;
      // const usersById = getState().state.get('users').get('usersById').toKeyedSeq().forEach((v, k)=>{
      //   if(v.get('packageId')){
      //     packCount += 1;
      //     if(!v.get('vendCustomerId')){
      //       packNoVend +=1;
      //     }else{
      //       packVend += 1;
      //     }
      //     const userPayments = immutablePayments.filter(x=>x.get('userId') === k);
      //     if(userPayments.size === 0){
      //
      //       packNoPayments += 1;
      //       // console.log(userPayments.size, v);
      //     }
      //     var dupChecker = {};
      //     userPayments.toKeyedSeq().forEach((v2, k2)=>{
      //       const vendSaleId = v2.get('vendSaleId');
      //       if(vendSaleId){
      //         if(dupChecker[vendSaleId]){
      //           console.log("Possible dup for user and vendsaleId", v.get('name'), k2, vendSaleId);
      //         }else{
      //           dupChecker[vendSaleId] = true;
      //         }
      //       }
      //
      //     });
      //
      //   }
      //   if(v.get('vendCustomerId')){
      //     vendCount += 1;
      //     if(!v.get('packageId')){
      //       vendNoPack +=1;
      //     }else{
      //       vendPack +=1;
      //     }
      //     // console.log(k, v);
      //   }
      // });
      // console.log("pack", packCount);
      // console.log("packVend", packVend);
      // console.log("vend", vendCount);
      // console.log("vendPack", vendPack);
      // console.log("packNoVend", packNoVend);
      // console.log("vendNoPack", vendNoPack);
      // console.log('packNoPayments', packNoPayments);

    });
  }
}

export function setPayments(payments) {
  return {
    type: 'SET_PAYMENTS',
    payments
  };
}

export function setVendSales(vendSales) {
  return {
    type: 'SET_VENDSALES',
    vendSales
  };
}

export function getFreezePayments(){
  return function action(dispatch, getState) {
    if(unsubscribeFreezePayments){
      unsubscribeFreezePayments()
    }
    // unsubscribeFreezePayments = firestore.collection("payments").where('source', '==', 'freeze').where('freezeFor', '>=', moment().startOf('day').subtract(1, 'months').toDate()).onSnapshot(function(querySnapshot) {
    unsubscribeFreezePayments = firestore.collection("payments").where('source', '==', 'freeze').onSnapshot(function(querySnapshot) {  
      var freezePayments = {};
      querySnapshot.forEach((doc)=>{
        // console.log('theDoc: ',doc.data());
        const data = doc.data();
        const freezeFor = data && data.freezeFor;
        const userId = data && data.userId;
        // console.log('freezeFor: ', freezeFor);
        // moment(getTheDate(freezeFor))
        // if (userId === 'LvmQB3hgz8xcu5gA0MLR' && freezeFor){
        if (userId && moment(getTheDate(freezeFor)).isSameOrAfter(moment().startOf('day').subtract(1, 'months'))){
          freezePayments[doc.id] = doc.data();
        }
      });

      dispatch(setFreezePayments(freezePayments));

      // var immutablePayments = fromJS(payments);
      // var packCount = 0;
      // var vendCount = 0;
      // var packNoVend = 0;
      // var vendNoPack = 0;
      // var packVend = 0;
      // var vendPack = 0;
      // var packNoPayments = 0;
      // const usersById = getState().state.get('users').get('usersById').toKeyedSeq().forEach((v, k)=>{
      //   if(v.get('packageId')){
      //     packCount += 1;
      //     if(!v.get('vendCustomerId')){
      //       packNoVend +=1;
      //     }else{
      //       packVend += 1;
      //     }
      //     const userPayments = immutablePayments.filter(x=>x.get('userId') === k);
      //     if(userPayments.size === 0){
      //
      //       packNoPayments += 1;
      //       // console.log(userPayments.size, v);
      //     }
      //     var dupChecker = {};
      //     userPayments.toKeyedSeq().forEach((v2, k2)=>{
      //       const vendSaleId = v2.get('vendSaleId');
      //       if(vendSaleId){
      //         if(dupChecker[vendSaleId]){
      //           console.log("Possible dup for user and vendsaleId", v.get('name'), k2, vendSaleId);
      //         }else{
      //           dupChecker[vendSaleId] = true;
      //         }
      //       }
      //
      //     });
      //
      //   }
      //   if(v.get('vendCustomerId')){
      //     vendCount += 1;
      //     if(!v.get('packageId')){
      //       vendNoPack +=1;
      //     }else{
      //       vendPack +=1;
      //     }
      //     // console.log(k, v);
      //   }
      // });
      // console.log("pack", packCount);
      // console.log("packVend", packVend);
      // console.log("vend", vendCount);
      // console.log("vendPack", vendPack);
      // console.log("packNoVend", packNoVend);
      // console.log("vendNoPack", vendNoPack);
      // console.log('packNoPayments', packNoPayments);

    });
  }
}

export function setFreezePayments(payments) {
  return {
    type: 'SET_FREEZE_PAYMENTS',
    payments
  };
}

export function getPaymentsByUserId(userId){
  return function action(dispatch, getState) {
    // console.log('getPaymentsByUserId: ', userId)
    if(unsubscribeUserPayments){
      unsubscribeUserPayments()
    }
    if(userId && userId.length>0){
      // console.log('Getting payments');
      unsubscribeUserPayments = firestore.collection("payments").where('userId', '==', userId).
        // where('type', '==', 'membership').
        onSnapshot(function(querySnapshot) {
        var payments = {};
        querySnapshot.forEach(function(doc) {
            const data = doc.data();
            // console.log('thedata: ', data);
            if (!data){
              return;
            }
            // if(data.type !== 'membership' || (data.source === 'vend' || data.source === 'pbonline') && (data.status === 'FAILED' || data.status === 'VOIDED')){
            //   return;
            // }
            payments[doc.id] = data;
            // dispatch(setPaymentsByUserId(doc.id, doc.data().userId));
            // console.log(doc.id, " => ", doc.data());
        });
        dispatch(setPaymentsByUserId(payments, userId));
      });
    }
  }
}

// without redux
export function getPaymentsByUserIdv2(userId){
  // return function action(dispatch, getState) {
  //   if(unsubscribeUserPayments){
  //     unsubscribeUserPayments()
  //   }
    var payments = {};
    if(userId){
      // console.log('call getPaymentsByUserIdv2');
      firestore.collection("payments").where('userId', '==', userId).where('type', '==', 'membership').onSnapshot(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            const data = doc.data();
            //console.log('thePaymentData: ', doc.data());
            if((data.source === 'vend' || data.source === 'pbonline') && (data.status === 'FAILED' || data.status === 'VOIDED')){
              return;
            }
            payments[doc.id] = data;
            // dispatch(setPaymentsByUserId(doc.id, doc.data().userId));
            // console.log(doc.id, " => ", doc.data());
        });
        // console.log('thepayments: ', payments);
        // dispatch(setPaymentsByUserId(payments, userId));
        return payments
      });
      // console.log('getPaymentsByUserIdv2 payments: ', payments);
    }
  // return payments;
  // }
}

export function setPaymentsByUserId(payments, userId) {
  // console.log('setPaymentsByUserId: ', payments);
  return {
    type: 'SET_PAYMENTS_BY_USER_ID',
    payments,
    userId
  };
}

export function getInvoiceAndDataById(invoiceId){
  return function action(dispatch, getState) {
    if(invoiceId && invoiceId.length>0){
      firestore.collection("invoices").doc(invoiceId).onSnapshot(doc => {
        if(doc.exists){

          const data = doc.data();

          var invoices = {};
          invoices[invoiceId] = data;

          dispatch(setInvoices(invoices));

          const userId = data.userId && data.userId.length > 0 ? data.userId : null;
          const packageId = data.packageId && data.packageId.length > 0 ? data.packageId : null;
          const paid = data.paid || false;
          // console.log(data);
          if(userId){

            const userQuery = firestore.collection('users').doc(userId).get();
            var queries = [userQuery];
            if(packageId){
              const packageQuery = firestore.collection('packages').doc(packageId).get();
              queries.push(packageQuery);
            }



            if(!paid){

              const paymentsQuery = firestore.collection('payments').where('userId', '==', userId).where('type', '==', 'membership').get();
              queries.push(paymentsQuery)
            }

            Promise.all(queries).then(results=>{
              const userDoc = results[0];
              var users = {};
              users[userDoc.id] = userDoc.data();
              // console.log(users);
              dispatch(addUsers(users));

              if(packageId){
                const packageDoc = results[1];
                var packages = {};
                packages[packageId] = packageDoc.data();
              }

              dispatch(setPackages(packages));

              if(results.length > 2){
                const paymentsResults = results[2];
                var payments = {};

                var userIdsToGet = [];
                paymentsResults.forEach(doc=>{
                  const data = doc.data();
                  if((data.source === 'vend' || data.source === 'pbonline') && (data.status === 'FAILED' || data.status === 'VOIDED')){
                    return;
                  }
                  payments[doc.id] = data;
                  if(data.referredUserId){
                    userIdsToGet.push(firestore.collection('users').doc(data.referredUserId).get());
                  }
                });

                if(userIdsToGet.length > 0){
                  Promise.all(userIdsToGet).then(results=>{
                    results.forEach(result=>{
                      const name = result.data()? result.data().name? result.data().name:'':'';
                      users[result.id] = {name};
                    });
                    dispatch(addUsers(users));
                  });
                }
                // console.log(payments);
                dispatch(setPaymentsByUserId(payments, userId));
              }

            });
          }

        }else{
          dispatch(setInvoiceNotFound());
        }
      });
    }
  }
}

export function setInvoices(invoices) {
  return {
    type: 'SET_INVOICES',
    invoices
  };
}

export function setInvoiceNotFound() {
  return {
    type: 'SET_INVOICE_NOT_FOUND'
  };
}

export function getInvoicesByUserId(userId){
  return function action(dispatch, getState) {
    if(userId && userId.length>0){
      firestore.collection("invoices").where('userId', '==', userId).where('paid', '==', false).orderBy('createdAt', 'desc').limit(1).get().then(function(querySnapshot) {
        var invoices = {};
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            invoices[doc.id] = doc.data();
            dispatch(setInvoicesByUserId(doc.id, doc.data().userId));
            // console.log(doc.id, " => ", doc.data());
        });
        dispatch(setInvoices(invoices));
      });
    }
  }
}

export function getAllInvoicesByUserId(userId){
  return function action(dispatch, getState) {
    if(userId && userId.length>0){
      firestore.collection("invoices").where('userId', '==', userId).orderBy('createdAt', 'desc').get().then(function(querySnapshot) {
        var invoices = {};
        querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            invoices[doc.id] = doc.data();
            // dispatch(setInvoicesByUserId(doc.id, doc.data().userId));
            // console.log(doc.id, " => ", doc.data());
        });
        dispatch(setInvoicesByUserId(invoices, userId));
      });
    }
  }
}

export function setInvoicesByUserId(invoices, userId) {
  return {
    type: 'SET_INVOICES_BY_USER_ID',
    invoices,
    userId
  };
}

export function setUsers(users) {
  return {
    type: 'SET_USERS',
    users
  };
}

export function addUsers(users) {
  return {
    type: 'ADD_USERS',
    users
  };
}

// for user invoice rental
// package = 'monthly'/weekly/daily
export function addInvoiceRental (userId, branchId, roomId, packages, monthlyDeposit, roomPrice, startDate, endDate, transDate, mcId, paymentType, paymentStatus, remark = null, imgURL, imgPath,  handleResponse){
  // console.log('paymentStatus: ', paymentStatus);
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
    const addInvoiceForRental = firebase.functions().httpsCallable('addInvoiceForRental');
    return addInvoiceForRental({userId, branchId, roomId, packages, monthlyDeposit, roomPrice, startDate, endDate, transDate, mcId, paymentType, paymentStatus, remark, imgURL, imgPath}).then(invoiceRef=>{
      const invoiceId = invoiceRef.data;
     // console.log('invoiceId: ', invoiceId);
      if(invoiceId){
        // console.log('invoiceId: ', invoiceId)
        dispatch(getInvoiceAndDataById(invoiceId));
        handleResponse(invoiceRef.data);
        // const newPath = `/payments/${invoiceId}`;
        // if(getState().router.location.pathname !== newPath){
        //   dispatch(push(newPath));
        // }
        dispatch(showMessage('INVOICE CREATED'));
        dispatch(viewPeople());
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      console.log('error adding invoice');
      dispatch(setAddingInvoice(false));
    });
  }
}

// for angpau
export function addInvoiceForAngpau(email, name, phone, nric, refSource, achieveTargetSource, selectedPkgId, refererEmail, refererName, handleResponse){
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
    const addInvoiceForAngpau2022 = firebase.functions().httpsCallable('addInvoiceForAngpau');
    return addInvoiceForAngpau2022({email, name, phone, nric, refSource, achieveTargetSource, selectedPkgId, refererEmail, refererName}).then(invoiceRef=>{
      const invoiceId = invoiceRef.data;
     // console.log('invoiceId: ', invoiceId);
      if(invoiceId){
        dispatch(getInvoiceAndDataById(invoiceId));
        handleResponse(invoiceRef.data);
        const newPath = `/payments/${invoiceId}`;
        if(getState().router.location.pathname !== newPath){
          dispatch(push(newPath));
        }
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      dispatch(setAddingInvoice(false));
    });
  }
}

// for babel flx
export function addInvoiceForFLX(email, name, phone, nric, refSource, achieveTargetSource, selectedVendPkgId, handleResponse){
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
    const addInvoiceForProductFLX = firebase.functions().httpsCallable('addInvoiceForFLX');
    return addInvoiceForProductFLX({email, name, phone, nric, refSource, achieveTargetSource, selectedVendPkgId}).then(invoiceRef=>{
      const invoiceId = invoiceRef.data;
     // console.log('invoiceId: ', invoiceId);
      if(invoiceId){
        dispatch(getInvoiceAndDataById(invoiceId));
        handleResponse(invoiceRef.data);
        const newPath = `/payments/${invoiceId}`;
        if(getState().router.location.pathname !== newPath){
          dispatch(push(newPath));
        }
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      dispatch(setAddingInvoice(false));
    });
  }
}

// for personal training 
export function addInvoiceForPT(name, email, phone, vendProductId, selectedAppointType, selectedTime, handleResponse){
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
    const addInvoiceForProductPT = firebase.functions().httpsCallable('addInvoiceForProductPT');
    return addInvoiceForProductPT({name, email, phone, vendProductId, selectedAppointType, selectedTime,}).then(invoiceRef=>{
      const invoiceId = invoiceRef.data;
    //  console.log('invoiceId: ', invoiceId);
      if(invoiceId){
        dispatch(getInvoiceAndDataById(invoiceId));
        handleResponse(invoiceRef.data);
        const newPath = `/payments/${invoiceId}`;
        if(getState().router.location.pathname !== newPath){
          dispatch(push(newPath));
        }
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      dispatch(setAddingInvoice(false));
    });
  }
}

// add invoice for spin bike class
export function addInvoiceForSpinBikeRental(firstName, lastName, email, icNumber, qty=1, deliveryAddress, deliveryCity, deliveryCountry, phone, landedOrCondo, deliveryNotes, vendProductId, handleResponse){
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
    const addInvoiceForProductSpinBikeRental = firebase.functions().httpsCallable('addInvoiceForSpinBikeRental');
   // console.log('theInput: ', firstName, lastName, email, icNumber, qty, deliveryAddress, deliveryCity, deliveryCountry, phone, landedOrCondo, deliveryNotes, vendProductId);
    return addInvoiceForProductSpinBikeRental({firstName, lastName, email, icNumber, qty, deliveryAddress, deliveryCity, deliveryCountry, phone, landedOrCondo, deliveryNotes, vendProductId}).then(invoiceRef=>{
      const invoiceId = invoiceRef.data;
      //console.log('invoiceId: ', invoiceId);
      if(invoiceId){
        dispatch(getInvoiceAndDataById(invoiceId));
        handleResponse({success:true, invoiceId: invoiceRef.data});
        const newPath = `/payments/${invoiceId}`;
        if(getState().router.location.pathname !== newPath){
          dispatch(push(newPath));
        }
      }
      else{
        handleResponse({success:false, error:'error creating invoice'});
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      dispatch(setAddingInvoice(false));
    });
  }
}

// add invoice for virtual class
export function addInvoiceForVClass(name, email, phone, vendProductId, selectedClass, trainerName, selectedAMPM, selectedDay, handleResponse){
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
    const addInvoiceForProductVClass = firebase.functions().httpsCallable('addInvoiceForVClass');
    //console.log('theInput: ', name, email, phone, vendProductId, selectedClass, trainerName, selectedAMPM, selectedDay);
    return addInvoiceForProductVClass({name, email, phone, vendProductId, selectedClass, trainerName, selectedAMPM, selectedDay}).then(invoiceRef=>{
      const invoiceId = invoiceRef.data;
     // console.log('invoiceId: ', invoiceId);
      if(invoiceId){
        dispatch(getInvoiceAndDataById(invoiceId));
        handleResponse({success:true, invoiceId: invoiceRef.data});
        const newPath = `/payments/${invoiceId}`;
        if(getState().router.location.pathname !== newPath){
          dispatch(push(newPath));
        }
      }
      else{
        handleResponse({success:false, error:'error creating invoice'});
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      dispatch(setAddingInvoice(false));
    });
  }
}

// add invoice for babel at home
export function addInvoiceForVWellness(selectedTrainer, selectedCoach, email, name, phone, ighandlename, selectedAMPM, selectedDay, vendProductId, handleResponse){
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
    const addInvoiceForVWellness = firebase.functions().httpsCallable('addInvoiceForVWellness');
    return addInvoiceForVWellness({selectedTrainer, selectedCoach, email, name, phone, ighandlename, selectedAMPM, selectedDay, vendProductId}).then(invoiceRef=>{
      const invoiceId = invoiceRef.data;
     // console.log('invoiceId: ', invoiceId);
      if(invoiceId){
        dispatch(getInvoiceAndDataById(invoiceId));
        handleResponse({success:true, invoiceId: invoiceRef.data});
        const newPath = `/payments/${invoiceId}`;
        if(getState().router.location.pathname !== newPath){
          dispatch(push(newPath));
        }
      }
      else{
        handleResponse({success:false, error:'error creating invoice'});
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      dispatch(setAddingInvoice(false));
    });
  }
}

// add invoice for babel dance
export function addInvoiceForBabelDance(name, email, phone, vendProductId, classDate, classTime, quantity, classRemark, ighandleName, instructorName, city, selectedMemberOption, classId, classType='virtual', handleResponse){
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
    const addInvoiceForBabelDance = firebase.functions().httpsCallable('addInvoiceForBabelDance');
    return addInvoiceForBabelDance({name, email, phone, vendProductId, classDate, classTime, quantity, classRemark, ighandleName, instructorName, city, selectedMemberOption, classId, classType}).then(invoiceRef=>{
      const invoiceId = invoiceRef.data;
     // console.log('invoiceIdBabelDance: ', invoiceId);
      if(invoiceId){
        dispatch(getInvoiceAndDataById(invoiceId));
        handleResponse({success:true, invoiceId: invoiceRef.data});
        const newPath = `/payments/${invoiceId}`;
        if(getState().router.location.pathname !== newPath){
          dispatch(push(newPath));
        }
      }
      else{
        handleResponse({success:false, error:'error creating invoice'});
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      dispatch(setAddingInvoice(false));
    });
  }
}

export function addInvoiceForPTv2(name, email, phone, quantity, vendProductId, trainerName, selectedAMPM, selectedDay, handleResponse){
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
    const addInvoiceForProductVT = firebase.functions().httpsCallable('addInvoiceForProductVT');
    return addInvoiceForProductVT({name, email, phone, quantity, vendProductId, trainerName, selectedAMPM, selectedDay}).then(invoiceRef=>{
      const invoiceId = invoiceRef.data;
     // console.log('invoiceId: ', invoiceId);
      if(invoiceId){
        dispatch(getInvoiceAndDataById(invoiceId));
        handleResponse(invoiceRef.data);
        const newPath = `/payments/${invoiceId}`;
        if(getState().router.location.pathname !== newPath){
          dispatch(push(newPath));
        }
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      dispatch(setAddingInvoice(false));
    });
  }
}

export function addInvoiceForVT(name, email, phone, vendProductId, trainerName, selectedAMPM, selectedDay, handleResponse){
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
    const addInvoiceForProductVT = firebase.functions().httpsCallable('addInvoiceForProductVT');
    return addInvoiceForProductVT({name, email, phone, vendProductId, trainerName, selectedAMPM, selectedDay}).then(invoiceRef=>{
      const invoiceId = invoiceRef.data;
      //console.log('invoiceId: ', invoiceId);
      if(invoiceId){
        dispatch(getInvoiceAndDataById(invoiceId));
        handleResponse(invoiceRef.data);
        const newPath = `/payments/${invoiceId}`;
        if(getState().router.location.pathname !== newPath){
          dispatch(push(newPath));
        }
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      dispatch(setAddingInvoice(false));
    });
  }
}

export function addInvoiceForProduct(name, email, phone, vendProductId, className, classDate, quantity = 1, rm20DanceClassRemark, ighandlename = null){
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
    const addInvoiceForProductCF = firebase.functions().httpsCallable('addInvoiceForProduct');
    return addInvoiceForProductCF({name, email, phone, vendProductId, className, classDate, quantity, rm20DanceClassRemark, ighandlename}).then(invoiceRef=>{
      const invoiceId = invoiceRef.data;
      if(invoiceId){
        dispatch(getInvoiceAndDataById(invoiceId));
        const newPath = `/payments/${invoiceId}`;
        if(getState().router.location.pathname !== newPath){
          dispatch(push(newPath));
        }
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      dispatch(setAddingInvoice(false));
    });
  }
}

// add invoice with SSTs
export function addInvoiceForProductv2(name, email, phone, vendProductId, className, classDate, quantity = 1, rm20DanceClassRemark, ighandlename = null, matchedPromo = {}){
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
   // console.log('matchedPromo: ', matchedPromo);
    const addInvoiceForProductCF = firebase.functions().httpsCallable('addInvoiceForProductv2');
    return addInvoiceForProductCF({name, email, phone, vendProductId, className, classDate, quantity, rm20DanceClassRemark, ighandlename, matchedPromo}).then(invoiceRef=>{
      const invoiceId = invoiceRef.data;
      if(invoiceId){
        dispatch(getInvoiceAndDataById(invoiceId));
        const newPath = `/payments/${invoiceId}`;
        if(getState().router.location.pathname !== newPath){
          dispatch(push(newPath));
        }
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      dispatch(setAddingInvoice(false));
    });
  }
}

// add invoice with SSTs
export function addInvoiceForJoiningnMembershipProduct(name, email, phone, vendProductIds){
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
    const addInvoiceForProductCF = firebase.functions().httpsCallable('addInvoiceForJoiningnMembershipProduct');
    return addInvoiceForProductCF({name, email, phone, vendProductIds}).then(invoiceRef=>{
      const invoiceId = invoiceRef.data;
      if(invoiceId){
        dispatch(getInvoiceAndDataById(invoiceId));
        const newPath = `/payments/${invoiceId}`;
        if(getState().router.location.pathname !== newPath){
          dispatch(push(newPath));
        }
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      dispatch(setAddingInvoice(false));
    });
  }
}

export function addInvoiceForProducts(name, email, phone, vendProductIds){
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
    const addInvoiceForProductsCF = firebase.functions().httpsCallable('addInvoiceForProducts');
    return addInvoiceForProductsCF({name, email, phone, vendProductIds}).then(invoiceRef=>{
     // console.log('invoiceRef: ', invoiceRef);
      const invoiceId = invoiceRef.data;
      if(invoiceId){
        // console.log('inv', invoiceId);
        dispatch(getInvoiceAndDataById(invoiceId));
        const newPath = `/payments/${invoiceId}`;
        if(getState().router.location.pathname !== newPath){
          dispatch(push(newPath));
        }
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      dispatch(setAddingInvoice(false));
    });
  }
}

export function addInvoiceForMembership(name, email, phone, icnumber = null, refSource = null, postcode = null, mcId = null, vendProductIds){
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
    const addInvoiceForMembership = firebase.functions().httpsCallable('addInvoiceForMembership');
    return addInvoiceForMembership({name, email, phone, icnumber, refSource, postcode, mcId, vendProductIds}).then(invoiceRef=>{
     // console.log('invoiceRef: ', invoiceRef);
      const invoiceId = invoiceRef.data;
      if(invoiceId){
        // console.log('inv', invoiceId);
        dispatch(getInvoiceAndDataById(invoiceId));
        const newPath = `/payments/${invoiceId}`;
        if(getState().router.location.pathname !== newPath){
          dispatch(push(newPath));
        }
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      dispatch(setAddingInvoice(false));
    });
  }
}


// with SST
export function addInvoiceForMembershipv2(name, email, phone, icnumber = null, refSource = null, postcode = null, mcId = null, vendProductIds, promoType = null, achieveTarget=null){
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
    const addInvoiceForMembership = firebase.functions().httpsCallable('addInvoiceForMembershipv2');
    return addInvoiceForMembership({name, email, phone, icnumber, refSource, postcode, mcId, vendProductIds, promoType, achieveTarget}).then(invoiceRef=>{
     // console.log('invoiceRef: ', invoiceRef);
      const invoiceId = invoiceRef.data;
      if(invoiceId){
        // console.log('inv', invoiceId);
        dispatch(getInvoiceAndDataById(invoiceId));
        const newPath = `/payments/${invoiceId}`;
        if(getState().router.location.pathname !== newPath){
          dispatch(push(newPath));
        }
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      dispatch(setAddingInvoice(false));
    });
  }
}

// add freeze membership
export function addInvoiceForFreezeMembership(name, email, phone, icnumber = null, refSource = null, postcode = null, mcId = null, vendProductIds){
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
    const addInvoiceForMembership = firebase.functions().httpsCallable('addInvoiceForFreezeMembership');
    return addInvoiceForMembership({name, email, phone, icnumber, refSource, postcode, mcId, vendProductIds}).then(invoiceRef=>{
     // console.log('invoiceRef: ', invoiceRef);
      const invoiceId = invoiceRef.data;
      if(invoiceId){
        // console.log('inv', invoiceId);
        dispatch(getInvoiceAndDataById(invoiceId));
        const newPath = `/payments/${invoiceId}`;
        if(getState().router.location.pathname !== newPath){
          dispatch(push(newPath));
        }
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      dispatch(setAddingInvoice(false));
    });
  }
}

// add freeze membership v2
export function addInvoiceForFreezeMembershipv2(email, name, vendProductId, freezeDate){
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
    const addInvoiceForMembership = firebase.functions().httpsCallable('addInvoiceForFreezeMembershipv2');
    return addInvoiceForMembership({email, name, vendProductId, freezeDate}).then(invoiceRef=>{
    // console.log('invoiceRef: ', invoiceRef);
      const invoiceId = invoiceRef.data;
      if(invoiceId){
        // console.log('inv', invoiceId);
        dispatch(getInvoiceAndDataById(invoiceId));
        const newPath = `/payments/${invoiceId}`;
        if(getState().router.location.pathname !== newPath){
          dispatch(push(newPath));
        }
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      dispatch(setAddingInvoice(false));
    });
  }
}
export function addInvoiceForRecurring(name, email, phone, icnumber = null, refSource = null, postcode = null, mcId = null, vendProductIds, handleResponse){
  return function action(dispatch, getState) {
    dispatch(setAddingInvoice(true));
    const addInvoiceForProducts = firebase.functions().httpsCallable('addInvoiceForProducts');
    return addInvoiceForProducts({name, email, phone, icnumber, refSource, postcode, mcId, vendProductIds}).then(invoiceRef=>{
     // console.log('invoiceRef: ', invoiceRef);
      const invoiceId = invoiceRef.data;
      if(invoiceId){
        // console.log('inv', invoiceId);
        dispatch(getInvoiceAndDataById(invoiceId));


        // const newPath = `/payments/${invoiceId}`;
        // if(getState().router.location.pathname !== newPath){
        //   dispatch(push(newPath));
        // }
        handleResponse(invoiceRef.data);
      }
      dispatch(setAddingInvoice(false));
    }).catch(error=>{
      dispatch(setAddingInvoice(false));
    });
  }
}

// add class
export function addClass(name, description, instructorName, maxCapacity, venue, classDuration, availableDate, classDate, expiredDate, vendProductId, handleResponse){
  return function action(dispatch, getState) {
    dispatch(setAddingClass(true));
    const addClass = firebase.functions().httpsCallable('addClass');
    return addClass({name, description, instructorName, maxCapacity, venue, classDuration, availableDate, classDate, expiredDate, vendProductId}).then(classRef=>{
      const classId = classRef.data;
     //console.log('classId: ', classId);
      if(classId){
        // dispatch(getInvoiceAndDataById(invoiceId));
        handleResponse({success:true, classData: classRef.data, classId: classRef.id});
        // const newPath = `/payments/${invoiceId}`;
        // if(getState().router.location.pathname !== newPath){
        //   dispatch(push(newPath));
        // }
      }
      else{
        handleResponse({success:false, error:'error creating class'});
      }
      dispatch(setAddingClass(false));
    }).catch(error=>{
      dispatch(setAddingClass(false));
    });
  }
}

// add room
export function addRoom(roomNumber, branchId, monthlyDeposit, monthlyPrice, weeklyDeposit, weeklyPrice, dailyDeposit, dailyPrice, handleResponse){
  return function action(dispatch, getState) {
    dispatch(setAddingRoom(true));
    const addClass = firebase.functions().httpsCallable('addRoom');
    return addClass({roomNumber, branchId, monthlyDeposit, monthlyPrice, weeklyDeposit, weeklyPrice, dailyDeposit, dailyPrice}).then(roomRef=>{
      const roomId = roomRef.data;
     //console.log('classId: ', classId);
      if(roomId){
        // dispatch(getInvoiceAndDataById(invoiceId));
        handleResponse({success:true, roomData: roomRef.data, roomId: roomRef.id});
        // const newPath = `/payments/${invoiceId}`;
        // if(getState().router.location.pathname !== newPath){
        //   dispatch(push(newPath));
        // }
      }
      else{
        handleResponse({success:false, error:'error creating room'});
      }
      dispatch(setAddingRoom(false));
    }).catch(error=>{
      dispatch(setAddingRoom(false));
    });
  }
}

// manually add recurring to the users
export function addRecurring(userId){
  return function action(dispatch, getState) {
    var userRef;
    userRef = firestore.collection("users").doc(userId);
    return userRef.update({
      hasRecurring : true
    }).then(()=>{
      //console.log('added hasRecurring to the user')
    }).catch((e)=>{
      //console.log('error hasRecurring: ', e);
    })
  }
}

export function getPaymentSession(paymentSessionData, handleResponse){
  return function action(dispatch, getState) {
    //console.log('paymentSessionData: ', paymentSessionData);
    // var paymentData = {};
    const createPaymentSessionCF = firebase.functions().httpsCallable('createPaymentSession');
    return createPaymentSessionCF(paymentSessionData).then(response=>{
      //console.log('createPaymentSessionCFResponse:', response);
      // if (response && response.data && response.data.paymentSession){
      //   // firestore.collection("users").doc()
      // }
      //firestore.collection("logs").add(response);
      
      handleResponse(response);
    }).catch(error=>{
      //console.log('errorPaymentSession: ', error);
      handleResponse(error);
    });
  }
}

export function makeAdyenDropInPayment(paymentSessionData, handleResponse){
  return function action(dispatch, getState) {
    // console.log('paymentSessionData: ', paymentSessionData);
    // var paymentData = {};
    const createPaymentSessionCF = firebase.functions().httpsCallable('createPaymentSession');
    return createPaymentSessionCF(paymentSessionData).then(response=>{
      //console.log('createPaymentSessionCFResponse:', response);
      // if (response && response.data && response.data.paymentSession){
      //   // firestore.collection("users").doc()
      // }
      //firestore.collection("logs").add(response);
      
      handleResponse(response);
    }).catch(error=>{
      //console.log('errorPaymentSession: ', error);
    });
  }
}

// get zoom
export function getAllZoomUsers(handleResponse){
  return function action(dispatch, getState) {
    // console.log('paymentSessionData: ', paymentSessionData);
    // var paymentData = {};
    const getAllZoomUsersHttp = firebase.functions().httpsCallable('getAllZoomUsers');
    return getAllZoomUsersHttp().then(response=>{
     // console.log('getAdyenPaymentMethodResponse:', response);
      // if (response && response.data && response.data.paymentSession){
      //   // firestore.collection("users").doc()
      // }
      //firestore.collection("logs").add(response);
      
      handleResponse(response);
    }).catch(error=>{
     // console.log('errorgetAll users: ', error);
      handleResponse(error);
    });
  }
}

export function getPaymentMethod(handleResponse){
  return function action(dispatch, getState) {
    // console.log('paymentSessionData: ', paymentSessionData);
    // var paymentData = {};
    const getAdyenPaymentMethod = firebase.functions().httpsCallable('getAdyenPaymentMethods');
    return getAdyenPaymentMethod().then(response=>{
      //console.log('getAdyenPaymentMethodResponse:', response);
      // if (response && response.data && response.data.paymentSession){
      //   // firestore.collection("users").doc()
      // }
      //firestore.collection("logs").add(response);
      
      handleResponse(response);
    }).catch(error=>{
     // console.log('errorgetAdyenPaymentMethod: ', error);
    });
  }
}

export const getAdyenConfig = () => async dispatch => {
  const response = await fetch("/api/config");
  dispatch(config(await response.json()));
};

export function getRecurringList(paymentSessionData, handleResponse){
  return function action(dispatch, getState) {
    // console.log('paymentSessionData: ', paymentSessionData);
    // var paymentData = {};
    const listRecurringDetails = firebase.functions().httpsCallable('listRecurringDetails');
    return listRecurringDetails(paymentSessionData).then(response=>{
      // console.log('createPaymentSessionCFResponse:', response);
      // if (response && response.data && response.data.paymentSession){
      //   // firestore.collection("users").doc()
      // }
      //firestore.collection("logs").add(response);
      
      handleResponse(response);
    }).catch(error=>{
      //console.log('listRecurringDetailsError: ', error);
    });
  }
}

// get vendProduct details by the given vendproductid
export function getVendProductByProdId(vendProductId, handleResponse){
  if(unsubscribeVendProduct){
    unsubscribeVendProduct()
  }
  return function action(dispatch, getState) {
    if(vendProductId && vendProductId.length>0){
      var vId = vendProductId;
      unsubscribeVendProduct = firestore.collection("vendProducts").doc(vId).onSnapshot(doc => {
        if(doc.exists){
          var vendProducts = {};
          vendProducts[doc.id] = doc.data();
          handleResponse({success:true, vendProduct:doc.data()});
          // dispatch(setVendProducts(vendProducts, quantity));
        }
        else{
          //console.log('vend product does not exist');
          handleResponse({success:false, error: 'vend product does not exist'});
        }
      });
    }
    else{
     // console.log('no vendProductId');
    }
  }
}

export function getVendProductId(vendProductId, quantity=1){
  return function action(dispatch, getState) {
    if(vendProductId && vendProductId.length>0){
      var vId = vendProductId;
      if(vendProductId === 'daypass'){
        vId = '04de7e6c-409f-488c-e6d4-9df5cc745fff';
      }else if (vendProductId === 'nightpass'){
        vId = '51a1f440-45c3-d544-eba1-de1f28ed5e64';
      }else if (vendProductId === 'monthly'){
        vId = '0af7b240-aba0-11e7-eddc-dbd880e1f8d5';
      }else if (vendProductId === 'animalfloweb') {
        const isAvailable = moment().isBefore(moment('2019-02-18'));
        vId = isAvailable ? '90bb7eae-5cf8-c556-e147-d0b80192d03f' : '3b0740b8-dde5-1891-c0ff-d4f6d33d9086';
      }else if (vendProductId === 'animalflow') {
        vId = '3b0740b8-dde5-1891-c0ff-d4f6d33d9086';
      }
      firestore.collection("vendProducts").doc(vId).onSnapshot(doc => {
        if(doc.exists){
          var vendProducts = {};
          vendProducts[doc.id] = doc.data();
          dispatch(setVendProducts(vendProducts, quantity));
        }
        else{
         // console.log('vend product does not exist');
        }
      });
    }
    else{
      //console.log('no vendProductId');
    }
  }
}

export function setVendProducts(vendProducts, quantity) {
  return {
    type: 'SET_VEND_PRODUCTS',
    vendProducts, quantity
  };
}

export function viewVendItem(vendProductId, promo = false, email){
  return function action(dispatch, getState) {
    dispatch(getVendProductId(vendProductId));
    const emailString = email ? `?email=${email}` : ``
    var newPath = `/buy${promo? 'promo' : ''}/${vendProductId}${emailString?emailString:''}`;
    //console.log('newPath: ', newPath);
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
  }
}

export function viewRegister () {
  return function action(dispatch, getState) {
    var nextPath = `/userregistrationbycro`; // default
    dispatch(push(nextPath));
  }
}

export function viewNext(userId = null, bookingId = null){
  return function action(dispatch, getState) {
    // var nextPath = `/userprofile`;
    var nextPath = `/next`; // default

    //console.log('viewNextUserId: ', userId);
    if (userId){
      firestore.collection("users").doc(userId).onSnapshot(doc => {
        if(doc.exists){
          // console.log('theuserDetails: ', doc.data());
          const data = doc.data()||null;
          // const roles = data && data.roles;
          // console.log('theRoles: ', roles);
          const isStaff = data && data.isStaff;
          const staffRole = data && data.staffRole;
          const roles = data && data.roles;
          const isTrainer = (staffRole && staffRole === 'trainer') || (roles && roles.trainer);
        
          if (isStaff && !isTrainer){
            nextPath = `/people`;
          }
          else if (isStaff && isTrainer){
            nextPath = bookingId? `/${bookbabelexclusiveclassPathName}/${bookingId}`:`/${bookbabelexclusiveclassPathName}`;
          }
          else{
            nextPath = `/next`;
          }
          // nextPath = isStaff? `/people`: `/next`;
          // nextPath = roles? `/next`:`/userprofile`;
          // console.log('nextPath: ', nextPath);
          if(getState().router.location.pathname !== nextPath){
            dispatch(push(nextPath)); 
          }
        }
        else{
         // console.log('users doesnt exist');
        }
      });
    }
    else{
      if(getState().router.location.pathname !== nextPath){
        dispatch(push(nextPath));
      }
    }
      // if(getState().router.location.pathname !== nextPath){
      //   dispatch(push(nextPath));
      // }
  }
}

export function viewPeople(){
  return function action(dispatch, getState) {
    // const newPath = '';
    const newPath = `/people`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
  }
}

export function viewProfile(){
  return function action(dispatch, getState) {
    // const newPath = `/profile`;
    const newPath = `/userprofile`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
  }
}

export function viewBuyAug20Promo(){
  return function action(dispatch, getState) {
    const newPath = `/buyaug20promo`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
  }
}

export function viewBuySep20Promo(){
  return function action(dispatch, getState) {
    const newPath = `/buysep20promo`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
  }
}

export function viewbuymalaysiadaypromo(){
  return function action(dispatch, getState) {
    const newPath = `/buymalaysiadaypromo`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
  }
}

export function viewPerson(userId, bookingId){
  return function action(dispatch, getState) {
    const currentUserId = getState().state.getIn(['user', 'id']) || null;
    const showUserId = userId || currentUserId;
    if(!showUserId){
      return;
    }
    var newPath = `/profile/${showUserId}`;
    if(bookingId){
      newPath = `${newPath}?bid=${bookingId}`;
    }
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
  }
}

// view new invoice
export function viewNewInvoice(userId){
  return function action(dispatch, getState) {
    const currentUserId = getState().state.getIn(['user', 'id']) || null;
    const showUserId = userId || currentUserId;
    if(!showUserId){
      return;
    }
    const newPath = `/createinvoice/${showUserId}`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
  }
}

// view new invoice
export function viewInvoices(userId){
  return function action(dispatch, getState) {
    const currentUserId = getState().state.getIn(['user', 'id']) || null;
    const showUserId = userId || currentUserId;
    if(!showUserId){
      return;
    }
    const newPath = `/viewinvoices/${showUserId}`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
  }
}

export function viewPT(){
  return function action(dispatch, getState) {
    const newPath = `/buypt`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
  }
}

export function viewClasses(){
  return function action(dispatch, getState) {
    const newPath = `/classes`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
  }
}

export function viewRooms(){
  return function action(dispatch, getState) {
    const newPath = `/rooms`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
  }
}

export function viewClass(classSlug, sessionId=null){
  return function action(dispatch, getState) {
    var newPath = `/classes/${classSlug}`;
    if(sessionId && sessionId.length > 0){
      newPath = newPath + `?sid=${sessionId}`;
    }
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
  }
}

export function viewSettings(){
  return function action(dispatch, getState) {
    const newPath = `/settings`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
  }
}

export function viewHome(){
  return function action(dispatch, getState) {
    dispatch(goBack());

    // console.log(getState);
  }
}

// view registration by cro
export function viewRegistration(){
  return function action(dispatch, getState) {
    const newPath = `/registrationbycro`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
    // console.log(getState);
  }
}

// view self registration
export function viewSelfRegistration(){
  return function action(dispatch, getState) {
    const newPath = `/login`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
    // console.log(getState);
  }
}

// view whatsappregistration
export function viewWhatsappRegistration(){
  return function action(dispatch, getState) {
    const newPath = `/registrationwhatsapp`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
  }
}

export function viewPromo(){
  return function action(dispatch, getState) {
    const newPath = `/promo`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
    // console.log(getState);
  }
}

export function viewBuyPromo(email){
  return function action(dispatch, getState) {
    const newPath = `/buypromo?email=${email}`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
    // console.log(getState);
  }
}

export function viewJoin(email){
  return function action(dispatch, getState) {
    const newPath = `/join?email=${email}`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
    // console.log(getState);
  }
}

export function viewLogin(){
  return function action(dispatch, getState) {
    const newPath = `/login`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
    }
  }
}

export function viewTermsConditions(isSpecialTnC, link){
  return function action(dispatch, getState) {
    const newPath = isSpecialTnC ? `/tnc/special` : `/tnc`;
    // if (link){
    //   window.open(link);
    // }
    // else if(getState().router.location.pathname !== newPath){
    //   dispatch(push(newPath));
    // }
    window.open('https://www.babel.fit/terms-conditions')
  }
}

export function viewPrivacyPolicy(link){
  return function action(dispatch, getState) {
    // const newPath = `/privacy-policy`;
    // if (link){
    //   window.open(link);
    // }
    // else if(getState().router.location.pathname !== newPath){
    //   dispatch(push(newPath));
    // }
    window.open('https://www.babel.fit/terms-conditions')
  }
}

export function viewBetaPayments(invoiceId){
  return function action(dispatch, getState) {
    const newPath = `/payments/${invoiceId}`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
      window.location.reload();
    }
  }
}

export function viewBookExclusiveId(bookingId){
  return function action(dispatch, getState) {
    const newPath = `/${bookbabelexclusiveclassPathName}/${bookingId}`;
    if(getState().router.location.pathname !== newPath){
      dispatch(push(newPath));
      window.location.reload();
    }
  }
}


export function goBackOnce(){
  return function action(dispatch, getState) {
    dispatch(goBack());
  }
}

// export function verifyAuthPhone () {

// }

export function verifyAuth(bookingId = null) {
  return function action(dispatch, getState) {
      firebase.auth().onAuthStateChanged(user => {
       //console.log("auth",user);
        // dispatch(setUser(user));
        dispatch(unsubscribeAll());
        if(!user){
          dispatch(setUser(Map()));
          dispatch(getTrainers());
          dispatch(getMembershipConsultants());
          dispatch(getStaffs());
          // check the page that can be accessed without signin page
          if (getState().router.location.pathname.indexOf('babellive') === 1 ||
            getState().router.location.pathname.indexOf('babelathome') === 1 ||
            getState().router.location.pathname.indexOf('buyaug20promo') === 1 ||
            getState().router.location.pathname.indexOf(bookbabelexclusiveclassPathName) === 1
          ){
           // console.log('no user yet')
            return
          }
          else if(getState().router.location.pathname.indexOf('buy') === -1 && 
            getState().router.location.pathname.indexOf('payments') === -1 &&
            getState().router.location.pathname.indexOf('babellive') === -1 && 
            getState().router.location.pathname.indexOf('babelathome') === -1 &&   
            getState().router.location.pathname.indexOf('buyaug20promo') === -1 &&   
            getState().router.location.pathname.indexOf('paymentsdropin') === -1 && 
            getState().router.location.pathname.indexOf('join') === -1 && 
            getState().router.location.pathname.indexOf('referral') === -1 && 
            getState().router.location.pathname.indexOf('CNYangpow') === -1 &&
            getState().router.location.pathname.indexOf('registration') === -1 &&
            getState().router.location.pathname.indexOf('paymentreport') === -1 &&
            // todo: profile need to add login checking
            getState().router.location.pathname.indexOf('profile') === -1)
            {
             // console.log('view login page')
              dispatch(viewLogin());
            }
          return;
        }
        const uid = user.uid;
        unsubscribeCurrentUser = firestore.collection("users").doc(uid).onSnapshot(doc => {
          if(!doc.exists){
            // console.log('userDoc missing', user);
            // dispatch(logout());
            dispatch(viewLogin());
          }else{
            //console.log(user.uid, '!!!! exists', doc.data());
            const userData = doc.data();
            // const isAdmin = userData.roles ? userData.roles.admin : false;
            // const isMC = userData.roles ? userData.roles.mc : false;
            // const roles = userData.roles;
            // const isTrainer = userData.roles ? userData.roles.trainer : false;
            // const isSeniorCRO = userData.roles? userData.roles.seniorMc : false;
            // const isShared = userData.roles? userData.roles.shared:false;
            // const isSuperUser = userData.roles ? userData.roles.superUser : false;
            const isAdmin = userData.staffRole ? (userData.staffRole === 'admin') : false;
            const isMC = userData.staffRole ? (userData.staffRole === 'CRO') : false;
            const isTrainer = userData.staffRole ? (userData.staffRole === 'trainer')? true : (userData.roles && userData.roles.trainer)? true:false:false;
            const isSeniorCRO = userData.staffRole ? (userData.staffRole === 'seniorCRO') : false;
            const isShared = userData.staffRole ? (userData.staffRole === 'shared') : false;
            const isSuperUser = userData.staffRole ? (userData.staffRole === 'superUser') : false;
            const isterminatedStaff = userData.staffRole? (userData.staffRole === 'terminatedStaff') : false;
            const isStaff = userData && userData.isStaff;
            // console.log('im a trainer? : ', isTrainer);
            dispatch(setUser(doc));

            if(isStaff && !isterminatedStaff){
              // dispatch(setBookings(Map()));
              // dispatch(getBookings());
              dispatch(getUsers());
              // dispatch(getUser(uid));
              // dispatch(getAdmins());
              // dispatch(getMembershipConsultants());
              // dispatch(getActiveMembers());
              // dispatch(getExpiredMembers());
              // dispatch(getProspects());
              dispatch(getGantnerLogs());
              dispatch(getPackages());
              dispatch(getBranches());
              dispatch(getRooms());
              // dispatch(getPayments());
              // only superUser is allowed for now
              if (isSuperUser){
                //console.log('superUser: ', isSuperUser);
                // dispatch(getPayments());
                // dispatch(getCnyreferral());
                // dispatch(getPackages());
                // dispatch(getUsers());
                // dispatch(getVendSales());
                // dispatch(getVendProductId2());
                // dispatch(getGantnerMthLogs());
              }
              if(isMC || isAdmin){
                dispatch(getBookings());

              }else{
                dispatch(getBookingsByUserId(uid));
              }
              dispatch(getFreezePayments());

              // dispatch(getGantnerLogsByUserId(user.uid));
            }else{
              dispatch(setBookings(Map()));
              dispatch(getBookingsByUserId(uid));

              dispatch(getPaymentsByUserId(uid)); // to store the user payment
              // dispatch(getCnyreferral())
              // dispatch(getReferralList());
              // dispatch(getGantnerLogsByUserId(user.uid));
              // dispatch(getBookingsByEmail(doc.data().email));
            }

            const packageId = userData.packageId;
            const image = userData.image;
            const pathname = getState().router.location.pathname;
            // if ((packageId && !image) || (roles && isTrainer)) {
            // if (isStaff && isTrainer) {
            // if (isStaff && !isTrainer){  
            //   dispatch(viewLogin());
            // }
            // else if ((pathname.indexOf('buypt') === 1) || (pathname.indexOf('babellive')===1) || (pathname.indexOf('babelathome')===1) || (pathname.indexOf('buyaug20promo')===1)){
              // console.log('buyptTest');
            if ((pathname.indexOf('buypt') === 1) || (pathname.indexOf('babellive')===1) || (pathname.indexOf('babelathome')===1) || (pathname.indexOf('buyaug20promo')===1)){
              //console.log('buyptTest');
            }
            else if (pathname.indexOf(bookbabelexclusiveclassPathName) === 1){
              //console.log('user in book babel exclusive path: ', userData);
              // dispatch(getBookingsByUserId(uid));
              dispatch(getBookingsByTrainerId(uid));
              if (bookingId){
               // console.log('url contains bookingId: ', bookingId);
                dispatch(viewBookExclusiveId(bookingId));
              }
              // if (pathname.indexOf('trainer') === 1){
              //   // get the bookingId
              //   console.log('get the booking id: ', pathname.indexOf('trainer'));
              // }
            }
            else if (pathname.indexOf('join') === 1){
              // console.log('isjoining')
              const email = (userData && userData.email) || '';
              dispatch(viewJoin(email));
            }
            // else if(!packageId && !isStaff && pathname.indexOf('payments') === -1 && pathname.indexOf('buy') === -1){
            else if(!isStaff && pathname.indexOf('payments') === -1 && pathname.indexOf('buy') === -1){
              //console.log(pathname, 'true');
              const email = (userData && userData.email) || '';
              // dispatch(viewJoin(email));
             
              dispatch(viewNext(uid));
            }else if (pathname.indexOf('bfmreport') === 1){
             // console.log('pathname: ', pathname);
              // dispatch(viewNext());
            }
            else if (isStaff && pathname.indexOf('profile') === 1){
              console.log('profile page... ')
            }
            else{
            //  console.log('NEXTTTT');
              dispatch(viewNext(uid));
            }
          }
        });
      });
  }
}

export function setUser(user) {
  return {
    type: 'SET_USER',
    user
  };
}

export function unsubscribeAll() {
  return function action(dispatch, getState) {
    if (unsubscribeUserIdBookings){
      unsubscribeUserIdBookings();
    }
    if (unsubscribeParticularUserIdBookings){
      unsubscribeParticularUserIdBookings();
    }
    if (unsubscribeEmailBookings){
      unsubscribeEmailBookings();
    }
    if (unsubscribeBookings){
      unsubscribeBookings();
    }
    if (unsubscribeAdmins){
      unsubscribeAdmins();
    }
    if(unsubscribeMembershipConsultants){
      unsubscribeMembershipConsultants();
    }
    if(unsubscribeStaffs){
      unsubscribeStaffs();
    }
    if (unsubscribeActiveMembers){
      unsubscribeActiveMembers();
    }
    if (unsubscribeExpiredMembers){
      unsubscribeExpiredMembers();
    }
    if (unsubscribeProspects){
      unsubscribeProspects();
    }
    if(unsubscribePackages){
      unsubscribePackages();
    }
    if(unsubscribePayments){
      unsubscribePayments();
    }
    if(unsubscribeVendSales){
      unsubscribeVendSales();
    }
    if(unsubscribeFreezePayments){
      unsubscribeFreezePayments();
    }
    if(unsubscribeUserPayments){
      unsubscribeUserPayments();
    }
    if(unsubscribeGantnerLogs){
      unsubscribeGantnerLogs();
    }
    if(unsubscribeUserGantnerLogs){
      unsubscribeUserGantnerLogs();
    }
    if(unsubscribeCurrentUser){
      unsubscribeCurrentUser();
    }
    if (unsubscribeVendProduct){
      unsubscribeVendProduct();
    }
    if(unsubscribeTrainers){
      unsubscribeTrainers();
    }
    if (unsubscribeReferralCny){
      unsubscribeReferralCny();
    }
    if (unsubscribeBranches){
      unsubscribeBranches();
    }
  }
}

export function logout() {
  return function action(dispatch, getState) {
    dispatch(unsubscribeAll());
    dispatch(setUser(Map()));
    dispatch(setBookings(Map()));
    dispatch(setAdmins(Map()));
    dispatch(setMembershipConsultants(Map()));
    dispatch(setActiveMembers(Map()));
    dispatch(setExpiredMembers(Map()));
    dispatch(setProspects(Map()));
    dispatch(setGantnerLogs(Map()));
    dispatch(setUsers(Map()));
    // dispatch(setPackages(Map()));
    dispatch(setBranches(Map()));
    dispatch(setFreezePayments(Map()));

    firebase.auth().signOut();

    dispatch(showMessage("Logged out"));
  }
}

export function forgotPassword(email) {
  return function action(dispatch, getState) {
    firebase.auth().sendPasswordResetEmail(email).then(function(){
      dispatch(showMessage(`Password reset email sent to ${email}.`))
    }).catch(function(error){
      dispatch(showMessage(error.message));
    });
  }
}

export function showMessage(message, timeout = 5000) {
  return function action(dispatch, getState) {
    if(messageTimer){
      clearTimeout(messageTimer);
    }
    dispatch(setMessage(message));
    messageTimer = setTimeout(()=>{dispatch(clearMessage())}, timeout);
  }
}

export function checkIfNative(){
  return function action(dispatch, getState){
    // const timeoutTimer = setTimeout(()=>{
    //   dispatch(setNative(false));
    // }, 10000)
    window.webViewBridge && window.webViewBridge.send('isNative', "test", (res) => {
      // clearTimeout(timeoutTimer);
      dispatch(setNative(res));
      // dispatch(showMessage("Is Native"));

      window.webViewBridge && window.webViewBridge.send('getPaymentURL', "test", (res) => {
        if(res){
          const resArray = res.split('/');

          const invoiceId = resArray[resArray.length-1];
          if(invoiceId){
            // dispatch(showMessage(invoiceId));
            dispatch(getInvoiceAndDataById(invoiceId));
            const newPath = `/payments/${invoiceId}`;
            if(getState().router.location.pathname !== newPath){
              dispatch(push(newPath));
            }
          }
        }

      }, (err) => {

      });

    }, (err) => {
      // clearTimeout(timeoutTimer);
      dispatch(setNative(true));
      // dispatch(showMessage("Not Native"));
    });
  }
}

export function useNativeCamera(){
  return function action(dispatch, getState){
    window.webViewBridge && window.webViewBridge.send('useCameraHandler', "test", (res) => {
      if(!res.cancelled){
        dispatch(uploadImage(res));
      }
    }, (err) => {

    });
  }
}

export function useNativeLibrary(){
  return function action(dispatch, getState){
    window.webViewBridge && window.webViewBridge.send('useLibraryHandler', "test", (res) => {
      if(!res.cancelled){
        dispatch(uploadImage(res));
      }
    }, (err) => {

    });
  }
}

export function setMessage(message) {
  return {
    type: 'SET_MESSAGE',
    message
  };
}

export function clearMessage() {
  return {
    type: 'CLEAR_MESSAGE'
  };
}

export function setError(error) {
  return {
    type: 'SET_ERROR',
    error
  };
}

export function clearError() {
  return {
    type: 'CLEAR_ERROR'
  };
}

export function setNative(native){
  return {
    type: 'SET_NATIVE',
    native
  };
}

export function setCnyReferral(referrallist){
  return {
    type: 'SET_CNY_REFERRAL',
    referrallist
  };
}

export function setFetchingEmail(fetching){
  return {
    type: 'SET_FETCHING_EMAIL',
    fetching
  };
}

export function setNeedsSignUp(needed){
  return {
    type: 'SET_NEEDS_SIGNUP',
    needed
  };
}

export function setNeedsSignUpDetails(needed){
  return {
    type: 'SET_NEEDS_SIGNUP_DETAILS',
    needed
  };
}

export function setNeedsUserDetails(needed){
  return {
    type: 'SET_NEEDS_USER_DETAILS',
    needed
  };
}

export function setUploadingImage(uploading){
  return {
    type: 'SET_UPLOADING_IMAGE',
    uploading
  };
}

export function setUploadedImage(imageURL, imagePath){
  return {
    type: 'SET_UPLOADED_IMAGE',
    imageURL,
    imagePath
  };
}

export function setAddingInvoice(adding){
  return {
    type: 'SET_ADDING_INVOICE',
    adding
  };
}

export function setAddingClass(adding){
  return {
    type: 'SET_ADDING_CLASS',
    adding
  };
}

export function setAddingRoom(adding){
  return {
    type: 'SET_ADDING_ROOM',
    adding
  };
}

export function setSigningUp(signingUp){
  return {
    type: 'SET_SIGNING_UP',
    signingUp
  };
}
