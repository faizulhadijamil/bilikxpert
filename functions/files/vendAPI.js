const functions = require('firebase-functions');
var cors = require('cors');
// The Firebase Admin SDK to access the Firebase Realtime Database.
const admin = require('firebase-admin');
// To set the timestampsInSnapshots, to avoid the error/warning message from firestore (timestamp format changes);
// const settings = {/* your settings... */ timestampsInSnapshots: true};
// admin.firestore().settings(settings);
const moment = require('moment-timezone');
const vendPersonalToken = 'Kh7UKpuhyONGUU27i98Dx_s35IJmSWrSUH6mL1Sp';

// get all promotion
function vendGetPromotion(){
  var options = { method: 'GET',
    url: 'https://bfitness.vendhq.com/api/2.0/promotions',
    auth: {
      bearer: vendPersonalToken
    },
    json:true
  };
  return options;
}

// get all vend promotion
exports.getAllVendPromotion = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  return corsFn(req, res, () => {
    const optionBody = JSON.parse(JSON.stringify(req.body));
    const optionMethod = req.method;

    var rp2 = require('request-promise');
    var optionsEdit = vendGetPromotion();

    return rp2(optionsEdit).then(function (result){
      // console.log('getVendSaleresult: ', result);
      return res.status(200).send({success:true, result}); 
    });
  });
});

async function getVendProductByActionPromo (include, exclude){
  // console.log('getVendProductByActionPromoInclude: ', include);

  var vendProducts = {};
  if (!include || include === []){
    return vendProducts;
  }
  else if (include && include.length>0){
    var venProdMap = {};
    const vendProductQuery = await admin.firestore().collection('vendProducts').get();
    if (vendProductQuery.empty){
      return vendProducts;
    }
    vendProductQuery.forEach(doc=>{
      const data = doc.data();
      venProdMap[doc.id]=data;
    });

    
    // return Promise.all([vendProductQuery]).then(result=>{
    //   const vendProdData = result[0];
    //   vendProdData.forEach(doc=>{
    //     venProdMap[doc.id]=doc.data();
    //   });

    include && include.forEach(incdata=>{
      const field = incdata.field;
      const value = incdata.value;
      if(field && value && field === 'product_id'){
        // vendProducts[value] = venProdMap[value];
        // console.log('prodId: ', value);
        const vendData = venProdMap[value];
        const vendId = vendData.id;
        console.log('vendId: ', vendId);
        // console.log('vendData: ', vendData);
        vendProducts[value] = vendData
      }
    });
      
    return vendProducts;
    // });
  }
}

// write vend promos to FB
exports.writeVendPromosToFB = functions.https.onRequest((req, res) => {
  const corsFn = cors({ origin: true });
  var batch = admin.firestore().batch();
  
  var optionsEdit = vendGetPromotion();
  var rp2 = require('request-promise');
  var promosMap = {};

  return rp2(optionsEdit).then(function (result){
    const data = result && result.data;
    // const vendPromoId = data && data.id;
    var batchCount = 0;
    data && data.forEach(promoData=>{
      const id = promoData.id;
      promosMap[id] = promoData;

      batch.set(admin.firestore().collection('vendPromos').doc(id), promoData);
      if(batchCount >= 499){
        batch.commit();
        batchCount = 0
        batch = admin.firestore().batch();
      }
      batchCount += 1;
    });

    return batch.commit().then(()=>{
      return res.status(200).send({success:true, result, promosMap}); 
    }).catch(error=>{
      return res.status(200).send({success:false, error});
    });
  });

  // return corsFn(req, res, () => {

  // });
});

// todo: call app.babel.fit/buy/vendId/qty (24/6/2021)
exports.getVendPromoByVendId = functions.https.onRequest((req, res) => {
    const corsFn = cors({ origin: true });
    return corsFn(req, res, () => {
      const optionBody = JSON.parse(JSON.stringify(req.body));
      const optionMethod = req.method;
      const vendProductId = optionBody && optionBody.vendProductId;
      const quantity = optionBody.quantity || 1;
      // console.log('theQuantity: ', quantity);
      // console.log('optionBody: ', optionBody);
  
      const vendProductQuery = admin.firestore().collection('vendProducts')
        .where('active', '==', true)
        // .where('id', '==', vendProductId)
        .get();
      const vendPromosQuery = admin.firestore().collection('vendPromos').get();
  
      return Promise.all([vendProductQuery, vendPromosQuery]).then(result=>{
        const vendProductRes = result[0];
        const vendPromoRes = result[1];
  
        var productDetails = {};
        var productDetailsArray = [];
        var BuyProductDetails = {};
      
        // to store the categories
        var tagArray = [];
        var vendProdMap = {};
        var vendVariant_parent_idMap = {};
        var vendVariant_parent_idArray = [];
        var vendBrandIdMap = {};
        var vendBrandIdDataArray = []; 
        var vendSupplierArray = [];
        var vendSupplierIdMap = {};
        var vendTagArray = [];
        var vendTagIdMap = {};
        var vendTypeMap = {};
        var vendTypeArray = [];

        vendProductRes && vendProductRes.forEach(doc=>{
          const data = doc.data();
          vendProdMap[doc.id]=data;
          
          // for variant_parent_id
          const variant_parent_id = data && data.variant_parent_id;
          vendVariant_parent_idArray = vendVariant_parent_idMap[variant_parent_id]||[];
          vendVariant_parent_idArray.push(data);
          vendVariant_parent_idMap[variant_parent_id]=vendVariant_parent_idArray;

          // for brandId
          const brandId = data.brand && data.brand.id;
          vendBrandIdDataArray = vendBrandIdMap[brandId] || [];
          vendBrandIdDataArray.push(data);
          vendBrandIdMap[brandId] = vendBrandIdDataArray;

          // for supplierId
          const supplierId = data && data.supplier && data.supplier.id;
          vendSupplierArray = vendSupplierIdMap[supplierId]||[];
          vendSupplierArray.push(data);
          vendSupplierIdMap[supplierId]=vendSupplierArray;

          // for tagId - for categories
          const categories = data.categories;
          categories && categories.forEach(category=>{
            const tagId = category.id;
            vendTagArray = vendTagIdMap[tagId]||[];
            vendTagArray.push(data);
            vendTagIdMap[tagId] = vendTagArray;
          });
          // for type product_type
          const productTypeId = data.product_type && data.product_type.id;
          vendTypeArray = vendTypeMap[productTypeId]||[];
          vendTypeArray.push(data);
          vendTypeMap[productTypeId] = vendTypeArray;

          // if (variant_parent_id){
          //   vendVariant_parent_idArray.push(data);
          // }
          // vendVariant_parent_idMap[variant_parent_id]=vendVariant_parent_idArray;

          if (doc.id === vendProductId){
            const categories = data.categories;
            categories && categories.forEach(item=>{
              tagArray.push(item.id);
            });
            
            const vendSupplyPrice = data.supply_price;
            const vendPriceBookPrice = data.price_book_entries && data.price_book_entries.length > 0 && data.price_book_entries[0].price;
            const vendPriceAmount = vendSupplyPrice && parseFloat(vendSupplyPrice) > 0 ? vendSupplyPrice : vendPriceBookPrice;
            
            productDetails[doc.id] = data;
            // productDetails[doc.id].ids = [
            //   data.id, 
            //   data.brand? data.brand.id? data.brand.id:'':'',
            //   data.product_type? data.product_type.id? data.product_type.id:'':'',
            //   data.supplier? data.supplier.id? data.supplier.id:'':'',
            //   tagArray, // contains array of tagIds
            //   data.variant_parent_id? data.variant_parent_id:''
            // ];
    
            productDetailsArray = [
              data.id, 
              data.brand? data.brand.id? data.brand.id:'':'',
              data.product_type? data.product_type.id? data.product_type.id:'':'',
              data.supplier? data.supplier.id? data.supplier.id:'':'',
              // tagArray.join(),
              // tagArray,
              data.variant_parent_id? data.variant_parent_id:'',
            ];
    
            tagArray && tagArray.forEach(tagId=>{
              productDetailsArray.push(tagId);
            });
    
            BuyProductDetails = {
              id:data.id,
              brand: data.brand? data.brand.id? data.brand.id:null:null,
              product_typeId: data.product_type? data.product_type.id? data.product_type.id:null:null,
              supplierId: data.supplier? data.supplier.id? data.supplier.id:null:null,
              tagIds:tagArray,
              variant_parent_id:data.variant_parent_id? data.variant_parent_id:null,
              quantity: quantity||1,
              totalPrice: vendPriceAmount * quantity
            }
          }
        });
  
        // // contains all the necessary type of vendProdDetails
        // productDetails.ids = [
         
        // ];
  
        var validPromoMap = {}; // list all promo, filter by start/ennddate
        var matchedPromo = {};
        vendPromoRes && vendPromoRes.forEach(doc=>{
          const data = doc.data();
          const start_time = data && data.start_time;
          const end_time = data && data.end_time;
          const status = data && data.status;
          const action = data && data.action;
          const actionInclude = (action && action.include)? action.include:null;
          const actionExclude = (action && action.exclude)? action.exclude:null;
          // show all the vendproducts from include minus exclude;
          // var vendProdList = getVendProductByActionPromo(actionInclude, actionExclude);
          // console.log('vendProdList123: ', vendProdList);

          actionInclude && actionInclude.forEach(incdata=>{
            const field = incdata.field;
            const value = incdata.value;
            if(field && value && field === 'product_id'){
              // vendProducts[value] = venProdMap[value];
              // console.log('prodId: ', value);
              const vendData = vendProdMap[value];
              const vendId = vendData.id;
              // console.log('vendId: ', vendId);
              // console.log('vendData: ', vendData);
              // vendProdList[value] = vendData;
            }
          });

          // validPromoMap[doc.id]=data;
          // console.log('endtime format: ', moment(end_time).format('YYYYMMDD'));
          if ((end_time && moment(end_time).tz('Asia/Kuala_Lumpur').isSameOrAfter(moment().tz('Asia/Kuala_Lumpur')))
            // for promo with no end date
            // || (start_time && moment(start_time).isSameOrBefore(moment()) && status && status === 'active')
          ){
            // console.log('contains end time')
            validPromoMap[doc.id]=data;
            // validPromoMap[doc.id].vendProdList = vendProdList;
            // console.log('vendProdList: ', vendProdList);
            // console.log('validPromoMap[doc.id].vendProdList: ', validPromoMap[doc.id].vendProdList);
          }
          // no end time
          else if (end_time === null && status && status === 'active'){
            // console.log('contains null endtime: ', end_time);
            validPromoMap[doc.id]=data;
            // validPromoMap[doc.id].vendProdList = vendProdList;
          }
          // else if ((start_time && moment(start_time).isSameOrBefore(moment()) && status && status === 'active'))
        });
  
  
        var vendObjArrayData = [];
        // intialise object to store promo that matches Promotional conditions.
        var matchedpromo = {};
     
        Object.entries(validPromoMap).forEach(([key, value]) => {
          const exclude = value.condition && value.condition.exclude;
          exclude && exclude.forEach(exc=>{
            const excValue = exc.value;
            if (excValue && productDetailsArray.includes(excValue)){
              return;
            }
          });
  
          const include = value.condition && value.condition.include;
          const conditionType = value.condition && value.condition.type;
          const conditionQty = value.condition && value.condition.quantity;
          const conditionMinQty = value.condition && value.condition.min_quantity;
          const conditionMaxQty = value.condition && value.condition.max_quantity;
          const conditionMinPrice = value.condition && value.condition.min_price;
          // console.log('include: ', include);
          // console.log('conditionQty: ', conditionQty);
          const isPromoForAllProducts = conditionType && conditionType === 'product_set' && conditionQty === 1 && include && include.length === 0 && exclude && exclude.length === 0;
          const isProductSetFixQty = conditionType && conditionType === 'product_set' && conditionQty;
          const isProductSetMinMaxQty = conditionType && conditionType === 'product_set' && conditionMinQty && BuyProductDetails.quantity >= conditionMinQty && BuyProductDetails.quantity <= conditionMaxQty;
          const isSalePriceMoreThanMinPrice = conditionType && conditionType === 'sale_price' && BuyProductDetails.totalPrice > conditionMinPrice;
  
          console.log('isPromoForAllProducts: ', isPromoForAllProducts);
          console.log('isProductSetFixQty: ', isProductSetFixQty);
          console.log('isProductSetMinMaxQty: ', isProductSetMinMaxQty);
          console.log('isProductSetMinMaxQty: ', isProductSetMinMaxQty);

          const action = value && value.action;
          const actionInclude = (action && action.include)? action.include:null;
          const actionExclude = (action && action.exclude)? action.exclude:null;
          const actionType = (action && action.type)? action.type:null;
          // show all the vendproducts from include minus exclude;
          // var vendProdList = getVendProductByActionPromo(actionInclude, actionExclude);
          // console.log('vendProdList123: ', vendProdList);
  
          // for all products
          if (isPromoForAllProducts){
            matchedpromo[vendProductId]=value;
            // matchedpromo[vendProductId].vendProdList=vendProdList;
            return;
          }
          var vendProdList = {};
          include && include.forEach(inc=>{
            const incValue = inc.value;
            const field = inc.field;
            // console.log('productDetailsArray.includes(incValue): ', productDetailsArray.includes(incValue));
            if (incValue && productDetailsArray.includes(incValue)){
              if (isProductSetFixQty || isProductSetMinMaxQty || isSalePriceMoreThanMinPrice){
                matchedpromo[vendProductId]=value;
                
                actionInclude && actionInclude.forEach(incdata=>{
                  const field = incdata.field;
                  const value = incdata.value;
                  if(field && value && field === 'product_id' && actionType && actionType === 'percent_discount'){
                    // vendProducts[value] = venProdMap[value];
                    // console.log('prodId: ', value);
                    const vendData = vendProdMap[value];
                    const vendId = vendData.id;
                    // console.log('vendId: ', vendId);
                    // console.log('vendData: ', vendData);
                    vendProdList[value] = vendData;
                  }
                  else if (field && value && field === 'brand_id' && actionType && actionType === 'percent_discount'){
                    vendObjArrayData = vendBrandIdMap[value];
                    vendObjArrayData && vendObjArrayData.forEach(vData=>{
                      const id = vData.id;
                      vendProdList[id] = vData;
                    });
                  }
                  else if (field && value && field === 'supplier_id' && actionType && actionType === 'percent_discount'){
                    const vendSupplierData = vendSupplierIdMap[value];
                    vendSupplierData && vendSupplierData.forEach(supData=>{
                      const id = supData.id;
                      vendProdList[id] = supData;
                    });
                  }
                  else if (field && value && field === 'type_id' && actionType && actionType === 'percent_discount'){
                    const vendTypeData = vendTypeMap[value];
                    vendTypeData && vendTypeData.forEach(typeData=>{
                      const id = typeData.id;
                      vendProdList[id] = typeData;
                    });
                  }
                  else if (field && value && field === 'tag_id' && actionType && actionType === 'percent_discount'){
                    const vendData = vendTagIdMap[value];
                    const vendProdId = vendData && vendData.id;
                    vendProdList[vendProdId] = vendData;
                  }
                  else if (field && value && field === 'variant_parent_id' && actionType && actionType === 'percent_discount'){
                    const vendData = vendVariant_parent_idMap[value];
                    const vendProdId = vendData.id;
                    // vendData && vendData.forEach(vdata=>{
                    //   const vendProdId = vdata.id;
                    //   vendProdList[vendProdId] = vendData;
                    // });
                    // vendProdList[vendProdId] = vendData;
                    // for parent variant
                    vendProdList[vendProdId] = vendData;
                  }
                });
                matchedpromo[vendProductId].vendProdDiscountList=vendProdList? vendProdList:null;
              }
            }
          });
        });

        return res.status(200).send({success:true, matchedpromo, vendTagIdMap, vendObjArrayData, vendBrandIdMap, BuyProductDetails, productDetails, validPromoMap, productDetailsArray}); 
      });    
    });
});