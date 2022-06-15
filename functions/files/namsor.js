const functions = require('firebase-functions');
const namsorAPIKEY = 'c60078a2447c732d5ceadbab9b6d8229';
var cors = require('cors');
exports.getCountrySuggestionByName = functions.https.onRequest((req, res) => {
  var request = require("request");
  const corsFn = cors({ origin: true });
  const resBody = req.body;
  const name = resBody.name? resBody.name:'jamil';

  var url = `https://v2.namsor.com/NamSorAPIv2/api2/json/country/${name}`;

  return corsFn(req, res, () => {
    const optionMethod = req.method;
    const option = {
      // 'method': optionMethod,
      'method': 'GET',
      'url': url,
      'headers': {
        'accept': 'application/json',
        'X-API-KEY': namsorAPIKEY
      }   
    };

    request(option, function (error, response) {
      // res.contentType('application/json');
      
      console.log('theoptions: ', option);
      console.log('theresponse: ', response);
      res.status(200).send({
            success:true,
            response:response.body? JSON.parse((response.body)):'no response',
            option: option? option:'no option',
            error:error? error:'no error message'
          });
        
    });
  });
});

// test get name suggestion (from namsor)
exports.getGenderSuggestionByName = functions.https.onRequest((req, res) => {
 
  var request = require("request");
  const corsFn = cors({ origin: true });

  const resBody = req.body;
  const firstName = resBody.firstName? resBody.firstName:'test';
  const lastName = resBody.lastName? resBody.lastName:'lastName';

  var url = `https://v2.namsor.com/NamSorAPIv2/api2/json/gender/${firstName}/${lastName}`;

  return corsFn(req, res, () => {
    const optionMethod = req.method;
    const option = {
      // 'method': optionMethod,
      'method': 'GET',
      'url': url,
      'headers': {
        'accept': 'application/json',
        'X-API-KEY': namsorAPIKEY
      }   
    };

    request(option, function (error, response) {
      // res.contentType('application/json');
      
      console.log('theoptions: ', option);
      console.log('theresponse: ', response);
      if (error){
        res.status(200).send({
          error
        })
      }
      res.status(200).send({
            success:true,
            response:response.body? JSON.parse((response.body)):'no response',
            option: option? option:'no option',
            error:error? error:'no error message'
          });
        
    });
  });
});