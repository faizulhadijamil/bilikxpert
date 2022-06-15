
const firebase = require("firebase");
// Required for side-effects
require("firebase/firestore");
var config = {
  apiKey: "AIzaSyCSyUNFkDC0SqRJz_NAcFxSGlgj9W_MtaA",
  authDomain: "babel-2c378.firebaseapp.com",
  databaseURL: "https://babel-2c378.firebaseio.com",
  projectId: "babel-2c378",
  storageBucket: 'babel-2c378.appspot.com'
};
firebase.initializeApp(config);
// Get a reference to the database service

var firestore = firebase.firestore();


var request = require("request");

getVend = (endpoint, otherOptions = {}, existingItems = {}) =>{
  var options = { method: 'GET',
    url: 'https://bfitness.vendhq.com/api/2.0/search',
    auth: {
      bearer: 'Kh7UKpuhyONGUU27i98Dx_LEuVfnESgZ1AojvyS9'
    },
    // qs:{
    //   type:'products',
    //   product_type_id:'0af7b240-aba0-11e7-eddc-dbd87e9eb14a'
    // }
    qs:{
      type:endpoint,
      ...otherOptions
    }
  };

  request(options, function (error, response, body) {
    // console.log('ran', response);
    if (error) {
      // console.log(error);
      throw new Error(error);
    }

    // console.log('error:', error); // Print the error if one occurred
    // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
    const parsedBody = JSON.parse(body);
    // console.log('body:', Object.entries(parsedBody.data)[0], Object.keys(parsedBody.data).length);
    // const version = parsedBody && parsedBody.version && parsedBody.version.max ? parsedBody.version.max : null;
    // JSON.parse(body).version && console.log('version:', JSON.parse(body).version, Object.keys(JSON.parse(body).version).length);

    var emailCount = 0;
    var count = 0;

    const vendDataRef = firestore.collection(`vend${endpoint[0].toUpperCase() + endpoint.substr(1).toLowerCase()}`);
    var updates = [];
    // console.log(Object.keys(existingItems).length);
    var existsCount = 0;
    JSON.parse(body).data.map(d=>{
      count += 1;
      // console.log(count, d.id, d.name, d.sku, d.variant_options.length, d.price_including_tax);

      // updates[d.id] = d;
      if(!existingItems[d.id]){
        console.log('doesnt exists');
        updates.push([d.id, d]);
      }else{
        existsCount += 1;
        // console.log('exists');
      }
      // console.log(count, d.id, `vend${endpoint[0].toUpperCase() + endpoint.substr(1).toLowerCase()}`);
      // Object.keys(d).map(key=>{
      //   // console.log(key);
      //   if(key === 'email'){
      //     const email = d[key];
      //     if(email && email.trim().length > 0 && email.trim() !== 'null' && email.indexOf('@babel.fit') === -1){
      //       emailCount += 1;
      //       console.log(emailCount, email);
      //     }
      //   }else{
      //     console.log(count, key, d[key]);
      //   }
      //
      //
      // });
      // console.log(d, Object.keys(d).length);
    });

    console.log(updates.length, existsCount);
    // batch.set(vendDataRef.doc(d.id), d);
    // batch.set(vendDataRef, updates);

    var batch;
    for (var i = 0; i < updates.length; i++) {
      const update = updates[i];
      if(!batch){
        batch = firestore.batch();
      }
      batch.set(vendDataRef.doc(update[0]), update[1], {merge:true});
      if((i+1) % 500 === 0 || i === updates.length-1){
        console.log("commit");
        // batch.commit().then(results=>{
        //   console.log('success');
        // }).catch(error=>{
        //   console.log('error',error);
        // });
        // batch = null;
      }
    }
    console.log('done');
    // batch.commit();
    // return Promise.resolve();
  });
}

const vendCustomersQuery = firestore.collection('vendCustomers').get();
const vendSalesQuery = firestore.collection('vendSales').get();

Promise.all([vendCustomersQuery, vendSalesQuery]).then(results=>{

  const customers = results[0];
  const sales = results[1];

  var custMap = {}
  customers.forEach(doc=>{
    custMap[doc.id] = doc.data();
  });

  var salesMap = {}
  sales.forEach(doc=>{
    salesMap[doc.id] = doc.data();
  });

  // console.log(custMap);
  // console.log(Object.keys(custMap).length);

  // getVend('sales', {page_size:10000}, salesMap);
  // getVend('customers', {page_size:10000}, custMap);
});




// // var levenshtein = require('fast-levenshtein');
// //
// //
// // const vendCustomersQuery = firestore.collection('vendCustomers').get();
// // const vendSalesQuery = firestore.collection('vendCustomers').get();
// // const usersQuery = firestore.collection('users').get();
// //
// // Promise.all([usersQuery, vendCustomersQuery, vendSalesQuery]).then((results=>{
// //   const users = results[0];
// //   const customers = results[1];
// //   const sales = results[2];
// //
// //   var emails = [];
// //   // var sortedEmails = [];
// //   var sortingMap = {};
// //   customers.forEach(doc=>{
// //     const data = doc.data();
// //     const email = data && data.email && typeof data.email === 'string' ? data.email.toLowerCase() : null;
// //     if(email){
// //       emails.push(email);
// //       // sortedEmails.push(email);
// //     }
// //   });
// //   users.forEach(doc=>{
// //     const data = doc.data();
// //     const email = data && data.email && typeof data.email === 'string' ? data.email.toLowerCase() : null;
// //     if(email){
// //       // emails.push(email);
// //       // sortedEmails.push(email);
// //       // console.log(doc.ref);
// //       sortingMap[doc.id] = email;
// //     }
// //   });
// //
// //   var sortedEmails = Object.entries(sortingMap);
// //   // console.log(sortedEmails);
// //   emails.sort((a,b)=>{
// //     if(a < b) return -1;
// //     if(a > b) return 1;
// //     return 0;
// //   });
// //
// //   const batch = firestore.batch();
// //   var skip = false;
// //   var match;
// //   var errCount = 0;
// //   var upCount = 0;
// //   var deleteIds = [];
// //   emails.map(email=>{
// //     // console.log(email)
// //     if(skip || match === email || email.indexOf('@babel.fit') !== -1){
// //       // console.log('skip');
// //       skip = false;
// //     }else{
// //       sortedEmails.sort((a,b)=>{
// //         const distanceA = levenshtein.get(email, a[1]);
// //         const distanceB = levenshtein.get(email, b[1]);
// //         if(distanceA < distanceB) return -1;
// //         if(distanceA > distanceB) return 1;
// //         return 0
// //       });
// //       const distance = levenshtein.get(email, sortedEmails[1][1]);
// //       if(distance > 4 && distance < 6){
// //         errCount += 1;
// //         // console.log(errCount +'. MML: '+email + ', Vend: ' + sortedEmails[0]);
// //         // console.log(errCount +'. ('+distance+') MML: '+email + ', Vend: ' + sortedEmails[0]);
// //         console.log(errCount +'. ('+distance+') User: '+sortedEmails[1] + ', Vend: ' + email);
// //
// //         const userNeedsUpdate = sortedEmails[1];
// //         const vendUserNeedsDelete = sortedEmails[0];
// //
// //
// //         users.forEach(doc=>{
// //           const data = doc.data();
// //           // if(deleteIds.includes(doc.id) && (doc.data().packageId || doc.data().gantnerCardNumber || doc.data().membershipStarts)){
// //           //   console.log(doc.id, doc.data().email);
// //           // }
// //           if(data && doc.id === sortedEmails[0][0]){
// //             if((doc.data().packageId || doc.data().gantnerCardNumber || doc.data().membershipStarts)){
// //               //can't delete
// //               // console.log('------------');
// //               // console.log(sortedEmails[1][0], sortedEmails[1][1]);
// //               deleteIds.push(sortedEmails[1][0]);
// //             }else{
// //               //can update and delete
// //               batch.update(firestore.collection('users').doc(sortedEmails[1][0]), {email:email});
// //               batch.delete(firestore.collection('users').doc(sortedEmails[0][0]));
// //               console.log('------------');
// //               console.log("Update: "+sortedEmails[1][0], {email:email});
// //               console.log("Delete: "+sortedEmails[0][0]);
// //               console.log('User: '+sortedEmails[1][1]);
// //               console.log('Vend: ' + email);
// //               upCount += 1;
// //             }
// //           }
// //           // const data = doc.data();
// //           // const email = data && data.email && typeof data.email === 'string' ? data.email.toLowerCase() : null;
// //           // if(email){
// //           //   // emails.push(email);
// //           //   // sortedEmails.push(email);
// //           //   // console.log(doc.ref);
// //           //   sortingMap[doc.id] = email;
// //           // }
// //         });
// //
// //         // deleteIds.push(sortedEmails[0][0]);
// //
// //         // console.log('------------');
// //         // console.log("Update: "+sortedEmails[1][0], {email:email});
// //         // console.log("Delete: "+sortedEmails[0][0]);
// //         // console.log(errCount +'. ('+distance+')'+sortedEmails[1][0]);
// //         // //sortedEmails[1][0] to update
// //         // //sortedEmails[0][0] to delete
// //         // // console.log(sortedEmails[0][0]); // to delete
// //         // console.log('User: '+sortedEmails[1][1]);
// //         // console.log('Vend: ' + email);
// //
// //
// //         // skip = true;
// //         match = sortedEmails[1];
// //       }else{
// //         // match = null;
// //       }
// //     }
// //   });
// //
// //   console.log(emails.length, errCount, upCount, customers.docs.length, users.docs.length);
// //
// //   users.forEach(doc=>{
// //     const data = doc.data();
// //     if(deleteIds.includes(doc.id)){
// //       if(!(doc.data().packageId || doc.data().gantnerCardNumber || doc.data().membershipStarts)){
// //         console.log('DELETE: ', doc.id, doc.data().email, doc.data().gantnerCardNumber, doc.data().membershipStarts, doc.data().packageId);
// //         batch.delete(firestore.collection('users').doc(doc.id));
// //       }else{
// //         console.log('DO NOTHING: ', doc.id, doc.data().email, doc.data().gantnerCardNumber, doc.data().membershipStarts, doc.data().packageId);
// //       }
// //     }
// //   });
//
//
//
//
//
//
//
//
//   // var dontDeleteCount = 0;
//   // users.forEach(doc=>{
//   //   if(deleteIds.includes(doc.id) && (doc.data().packageId || doc.data().gantnerCardNumber || doc.data().membershipStarts)){
//   //     console.log(doc.id, doc.data().email);
//   //     dontDeleteCount += 1;
//   //   }
//   //   // const data = doc.data();
//   //   // const email = data && data.email && typeof data.email === 'string' ? data.email.toLowerCase() : null;
//   //   // if(email){
//   //   //   // emails.push(email);
//   //   //   // sortedEmails.push(email);
//   //   //   // console.log(doc.ref);
//   //   //   sortingMap[doc.id] = email;
//   //   // }
//   // });
//   //
//   // console.log("Don't delete: "+dontDeleteCount);
//
//   // batch.commit();
//
//   // var customerEmails = [];
//   // customers.forEach(doc=>{
//   //   const data = doc.data();
//   //   const email = data && data.email && typeof data.email === 'string' ? data.email.toLowerCase() : null;
//   //   if(email){
//   //     customerEmails.push(email);
//   //     emails.sort((a,b)=>{
//   //       const distanceA = levenshtein.get(email, a);
//   //       const distanceB = levenshtein.get(email, b);
//   //       if(distanceA < distanceB) return -1;
//   //       if(distanceA > distanceB) return 1;
//   //       return 0
//   //     });
//   //     const distance = levenshtein.get(email, emails[0]);
//   //     if(distance > 0){
//   //       // console.log(distance, email, emails[0], data.id);
//   //     }
//   //   }
//   // });
//
//   // var distance = levenshtein.get('back', 'book');
//   // console.log(distance);
//   // customers.map(u=>{
//   //   console.log(u.name, u.email);
//   // });
// }));


// getVend('customers', {page_size:10000});
// getVend('sales', {page_size:10000});
// getVend('products', {page_size:10000});
// getVend('products', {page_size:10000, product_type_id:'0af7b240-aba0-11e7-eddc-dbd87e9eb14a'});
//
// const packagesQuery = firestore.collection('users').get();
// const vendCustomersQuery = firestore.collection('vendCustomers').get();
//
// Promise.all([packagesQuery, vendSalesQuery]).then((results) => {
//   console.log('results');
//   const packagesResults = results[0];
//   const vendSalesResults = results[1];
//
//   var productIdPackageMap = {};
//   packagesResults.forEach(doc=>{
//     const data = doc.data();
//     const vendProductIds = data && data.vendProductIds;
//
//     vendProductIds && vendProductIds.map(vendProductId=>{
//       productIdPackageMap[vendProductId] = doc.id;
//       return null;
//     });
//   });
//
//   console.log(productIdPackageMap);
//
//   var packageId;
//   vendSalesResults.forEach(doc=>{
//
//     const data = doc.data();
//     console.log('vendSale', doc.id);
//     const lineItems = data && data.register_sale_products;
//     lineItems && lineItems.map(lineItem=>{
//       const productId = lineItem.product_id;
//       console.log('lineItem', productId);
//       const pId = productIdPackageMap[productId];
//       if(pId){
//         console.log("package", pId);
//         packageId = pId;
//       }
//       return;
//     });
//
//     return;
//   });
//
//   if(packageId){
//     console.log("updating package", packageId);
//     return null;
//   }else{
//     return null;
//   }
// });

// const packagesQuery = firestore.collection('packages').get();
// const vendSalesQuery = firestore.collection('vendSales').where('customer_id', '==', '0af7b240-aba0-11e7-eddc-d5113bf37735').get();
//
// Promise.all([packagesQuery, vendSalesQuery]).then((results) => {
//   console.log('results');
//   const packagesResults = results[0];
//   const vendSalesResults = results[1];
//
//   var productIdPackageMap = {};
//   packagesResults.forEach(doc=>{
//     const data = doc.data();
//     const vendProductIds = data && data.vendProductIds;
//
//     vendProductIds && vendProductIds.map(vendProductId=>{
//       productIdPackageMap[vendProductId] = doc.id;
//       return null;
//     });
//   });
//
//   console.log(productIdPackageMap);
//
//   var packageId;
//   vendSalesResults.forEach(doc=>{
//
//     const data = doc.data();
//     console.log('vendSale', doc.id);
//     const lineItems = data && data.register_sale_products;
//     lineItems && lineItems.map(lineItem=>{
//       const productId = lineItem.product_id;
//       console.log('lineItem', productId);
//       const pId = productIdPackageMap[productId];
//       if(pId){
//         console.log("package", pId);
//         packageId = pId;
//       }
//       return;
//     });
//
//     return;
//   });
//
//   if(packageId){
//     console.log("updating package", packageId);
//     return null;
//   }else{
//     return null;
//   }
// });

// firestore.collection('vendSales').where('customer_id', '==', '0af7b240-aba0-11e7-eddc-d5113bf37735').get().then(querySnapshot=>{
//   querySnapshot.forEach(doc=>{
//     console.log(doc.data());
//   });
// });


// request.get('https://bfitness.vendhq.com/api/2.0/products', {
//   'auth': {
//     'bearer': 'Kh7UKpuhyONGUU27i98Dx_LEuVfnESgZ1AojvyS9'
//   }
// }).on('response', function(response) {
//     console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//     console.log('body:', response && response);
//     // console.log(response.headers['content-type']) // 'image/png'
//   }).on('error', function(err) {
//     console.log(err)
//   });
