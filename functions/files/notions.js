const functions = require('firebase-functions');
var cors = require('cors');
const currentToken = '1958891b1949d84d4b6acdc3309e5c68a34dfb04c70b7bf5c6b48218b05c8ef247421516506544386ce0019cae6b6a6bc410cda3da97f1264eefecb3b694f9eadfb7dc3fbb84419e9c0d4628d646';
// for notions
const Notion = require("notion-api-js").default;
const notionAPiKeySecret = 'secret_bhGw3o8DkDH8nQfrszr0U4O964gqE4KE33KGNY6pYks';
const notionDbTest = 'be7372dad89f41e591b610927c7f9462';

// test notion post to db
exports.testPostNotionToTable = functions.https.onRequest((req, res) => {
  var url = `https://api.notion.com/v1/pages`;
  var request = require("request");
  const corsFn = cors({ origin: true });
  const resBody = req.body;
  console.log('resBody: ', resBody);

  return corsFn(req, res, () => {
    const optionBody = JSON.parse(JSON.stringify(req.body));
    const optionMethod = req.method;

    const option = {
        'url': url,
        'method': optionMethod,
         'headers': {
          'Authorization': `${notionAPiKeySecret}`,
          'Content-Type': 'application/json',
          'Notion-Version': '2021-05-13'
        },
        body:JSON.stringify(resBody)
    };

    request(option, function (error, response) {
      // res.contentType('application/json');
      
      console.log('theoptions: ', option);
      console.log('theresponse: ', response);
      res.status(200).send({
            success:true, 
            resBody:resBody? resBody:'no resbody',
            response:response? response.body? JSON.parse(JSON.stringify(response.body)):'no response':'no response',
            option: option? option:'no option',
            error:error? error:'no error message'
          });
        
        // if (response.statusCode === 200) {
        //   var responseBody = JSON.parse(response.body);
        //   console.log('resStatus:', response.statusCode, response.statusMessage);
        //   // console.log('theRes:')
        //   // to enable cors
         
        //   res.status(response.statusCode).send({
        //     success:true, 
        //     responseBody:responseBody,
        //     resBody,
        //     status: response.statusCode,
        //     // theRes: res,
        //   });
        // }
        // else {
        //     console.log('Status:', response.statusCode, response.statusMessage);
        //     console.log('Error:', error);
        //     res.status(response.statusCode).send({ data: 'Fail', 
        //     // error, 
        //       // resBody:resBody, statusMsg:response.statusCode 
        //     });
        // }
    });
  });
});

// test notion post to db
exports.getNotionDBTest = functions.https.onRequest((req, res) => {
  var url = `https://api.notion.com/v1/pages`;
  var request = require("request");
  const corsFn = cors({ origin: true });

  return corsFn(req, res, () => {
    const option = {
      'method': 'GET',
      'url': 'https://api.notion.com/v1/databases/be7372dad89f41e591b610927c7f9462',
      'headers': {
        'Authorization': 'Bearer secret_bhGw3o8DkDH8nQfrszr0U4O964gqE4KE33KGNY6pYks',
        'Notion-Version': '2021-05-13'
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

const notion = new Notion({
  token: currentToken,
  options: {
    colors: {
      red: 'tomato',
      blue: 'rgb(100, 149, 237)',
      purple: '#9933cc',
    },
    // pageUrl: 'https://www.notion.so/babelfit/Sales-Reporting-2721b3aa7b0a40009f7039a00b53cd85'
    pageUrl: 'https://www.notion.so/babelfit/Babel-s-Home-c35a7d4d578e4e918c30538dadaef871/'
  }
});

// to get all notion pages
exports.getNotionPages = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {

    return notion.getPages().then(pages => {
      // Your Code here
      // console.log('theNotionPage: ', pages);
      return res.status(200).send({
        success:true,
        pages: pages
      })
    });
  });
});

// to get all notion page by id
exports.getNotionPageById = functions.https.onRequest((req, res) => {
  const itemData = req.body;
  // console.log('itemData: ', itemData);
  const pageInput = (itemData && itemData.page)? itemData.page:'0b10f205-4afd-4b6f-898c-e771156a552d';

  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {

    return notion.getPageById(pageInput).then(page => {
      // Your Code here
      return res.status(200).send({
        success:true,
        page: page
      })
      // return Response.ok(page).build()
    });

  });
});

// to get all notion getallhtml
exports.getNotionAllHTML = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {

    return notion.getAllHTML().then(html => {
      // Your Ccode here
      return res.status(200).send({
        success:true,
        html
      })
    });
  });
});