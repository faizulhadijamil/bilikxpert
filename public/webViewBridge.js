/**
 * Created by Guy Blank on 3/9/17.
 * https://gist.github.com/blankg/d5537a458b55b9d15cb4fd78258ad840
 * Updated to support async in ReactNative by EvDevNinja on 2018.04.26
 * https://gist.github.com/EvDevNinja/f3979e00c5f0734297fae5ed79f850b8
 *
 *  This is a sample provides an API to send & receive messages to and from the React-Native WebView (using postMessage/onMessage WebView API).
 *
 *  webViewBridge.send('functionToInvoke', {mydata: 'test'}, function(){console.log('success')},function(){console.log('error')});
 *
 *  The API is designed to be similar to the Cordova exec API so migration to it should be almost seamless.
 *  The API also provides solution to a React-Native WebView bug in iOS which causes sending consecutive postMessage calls to override each other.
 *
 *  Handling message on the React-Native side:
 *   <WebView
 *       ref={webview => { this.myWebView = webview; }}
 *       onMessage={this.onWebViewMessage}
 *  />
 *
 async onWebViewMessage(event) {
   // post back reply as soon as possible to enable sending the next message
   this.myWebView.postMessage(event.nativeEvent.data);
   let msgData;
   try {
       msgData = JSON.parse(event.nativeEvent.data);
   }
   catch(err) {
       console.warn(err);
       msgData.isSuccessfull = false;
       msgData.args = [err];
       this.myWebView.postMessage(JSON.stringify(msgData))
       return;
   }
   // invoke target function
   try{
     const response = this[msgData.targetFunc].apply(this, [msgData]);
     if (response instanceof Promise){
       // trigger success callback
       msgData.isSuccessfull = true;
       const response2 = await response.catch((err)=>{msgData.isSuccessfull = false;return err;})
       msgData.args = [response2];
       this.myWebView.postMessage(JSON.stringify(msgData))
     }else{
       // trigger success callback
       msgData.isSuccessfull = true;
       msgData.args = [response];
       this.myWebView.postMessage(JSON.stringify(msgData))
     }
   }catch(e){
     msgData.isSuccessfull = false;
     msgData.args = [e];
     this.myWebView.postMessage(JSON.stringify(msgData))
     console.warn(e);
   }
 }
 *
 */
(function(){

    var promiseChain = Promise.resolve();


    var promises = {};
    var callbacks = {};

   var init = function() {

       const guid = function() {
           function s4() {
               return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
           }
           return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
       }

       window.webViewBridge = {
           /**
            * send message to the React-Native WebView onMessage handler
            * @param targetFunc - name of the function to invoke on the React-Native side
            * @param data - data to pass
            * @param success - success callback
            * @param error - error callback
            */
           send: function(targetFunc, data, success, error) {
               success = success || function(){};
               error = error || function () {};

               var msgObj = {
                   targetFunc: targetFunc,
                   data: data || {},
                   msgId: guid(),
               };

               var msg = JSON.stringify(msgObj);

               promiseChain = promiseChain.then(function () {
                   return new Promise(function (resolve, reject) {
                       console.log("sending message " + msgObj.targetFunc);

                       promises[msgObj.msgId] = {resolve: resolve, reject: reject};
                       callbacks[msgObj.msgId] = {
                           onsuccess: success,
                           onerror: error
                       };

                       window.postMessage(msg);
                   })
               }).catch(function (e) {
                   console.error('rnBridge send failed ' + e.message);
               });
           },


       };

       window.document.addEventListener('message', function(e) {
           console.log("message received from react native");

           var message;
           try {
               message = JSON.parse(e.data)
           }
           catch(err) {
               console.error("failed to parse message from react-native " + err);
               return;
           }

           //resolve promise - send next message if available
           if (promises[message.msgId]) {
               promises[message.msgId].resolve();
               delete promises[message.msgId];
           }

           //trigger callback
           if (message.args && callbacks[message.msgId]) {
               if (message.isSuccessfull) {
                   callbacks[message.msgId].onsuccess.apply(null, message.args);
               }
               else {
                   callbacks[message.msgId].onerror.apply(null, message.args);
               }
               delete callbacks[message.msgId];
           }

       });
   };

   init();
}());
