import { is, fromJS, Map } from 'immutable';
import {getTheDate} from './actions';
import moment from 'moment';

const initialState = Map(fromJS({
  isNative:true,
  booking:{
    data:Map(), label:"", success:false, failure:false
  },
  classes:Map(),
  users:Map(),
  trainers:Map(),
  admins:Map(),
  activeMembers:Map(),
  expiredMembers:Map(),
  cancelledMembers:Map(),
  prospects:Map(),
  sessions:Map(),
  fbToken:Map(),
  bookings:Map(),
  user:Map(),
  invoices:Map(),
  freezePayments:Map()
}));

export default function(state = initialState, action) {
  // console.log('actionReducer: ', action);
  switch (action.type) {
    case 'SET_USER':
      {
        return setUser(action.user, state);
      }
    case 'SET_CLASSES':
      {
        return setClassesById(action.classes, state)
      }
    case 'SET_USERS':
      {
        return setUsersById(action.users, state);
      }
    case 'ADD_USERS':
      {
        return addUsersById(action.users, state);
      }
    case 'SET_TRAINERS':
      {
        return setTrainersById(action.trainers, state);
      }
    case 'SET_ADMINS':
      {
        return setAdminsById(action.admins, state);
      }
    case 'SET_MEMBERSHIP_CONSULTANTS':
      {
        return setMembershipConsultantsById(action.membershipConsultants, state);
      }
    case 'SET_STAFFS':
      {
        return setStaffsById(action.staffs, state);
      }
    case 'SET_ACTIVE_MEMBERS':
      {
        // console.log('SET_ACTIVE_MEMBERS', action.activeMembers, state);
        return setActiveMembersById(action.activeMembers, state);
      }
    case 'SET_EXPIRED_MEMBERS':
      {
        // console.log('SET_EXPIRED_MEMBERS', action.expiredMembers, state);
        return setExpiredMembersById(action.expiredMembers, state);
      }
    case 'SET_CANCELLED_MEMBERS':
      {
        return setCancelledMembersById(action.cancelledMembers, state);
      }
    case 'SET_PROSPECTS':
      {
        return setProspectsById(action.prospects, state);
      }
    case 'SET_SESSIONS':
      {
        return setSessionsById(action.sessions, state);
      }
    case 'SET_FBTOKENS':
      {
        return setFBTokenById(action.fbToken, state);
      }
    case 'SET_PACKAGES':
      {
        return setPackagesById(action.packages, state);
      }
    case 'SET_GANTNER_LOGS':
      {
        return setGantnerLogs(action.gantnerLogs, state);
      }
    case 'SET_GANTNER_LOGS_BY_USER_ID':
      {
        return setGantnerLogsByUserId(action.gantnerLogs, action.userId, state);
      }
    case 'SET_CARD_TO_REGISTER':
    {
      return setCardToRegister(action.cardNumber, state);
    }
    case 'REMOVE_CARD_TO_REGISTER':
    {
      return removeCardToRegister(state);
    }
    case 'SET_BOOKINGS':
      {
        return setBookingsById(action.bookings, state);
      }
    case 'SET_BOOKINGS_BY_USER_ID':
      {
        return setBookingsByUserId(action.bookings, action.userId, state);
      }
    case 'SET_PAYMENTS':
      {
        return setPaymentsById(action.payments, state);
      }
    case 'SET_VENDSALES':
      {
        return setVendSalesById(action.vendSales, state);
      }
    case 'SET_CNY_REFERRAL':
      {
        return setCnyRefById(action.referrallist, state);
      }
    case 'SET_FREEZE_PAYMENTS':
      {
        return setFreezePaymentsById(action.payments, state);
      }
    case 'SET_PAYMENTS_BY_USER_ID':
      {
        return setPaymentsByUserId(action.payments, action.userId, state);
      }
    case 'SET_INVOICES':
      {
        return setInvoicesById(action.invoices, state);
      }
    case 'SET_INVOICE_NOT_FOUND':
      {
        return state.set('invoiceNotFound', true);
      }
    case 'SET_INVOICES_BY_USER_ID':
      {
        return setInvoicesByUserId(action.invoices, action.userId, state);
      }
    case 'SET_VEND_PRODUCTS':
      {
        return setVendProductsById(action.vendProducts, state);
      }
    case 'SET_MESSAGE':
      {
        return state.set('message', fromJS(action.message));
      }
    case 'CLEAR_MESSAGE':
      {
        return state.delete('message');
      }
    case 'SET_ERROR':
      {
        return state.set('error', fromJS(action.error.message));
      }
    case 'CLEAR_ERROR':
      {
        return state.delete('error');
      }
    case 'SET_NATIVE':
    {
      if(action.native){
        return state.set('isNative', true);
      }else{
        return state.delete('isNative');
      }
    }
    case 'SET_FETCHING_EMAIL':
    {
      if(action.fetching){
        return state.set('isFetchingEmail', true);
      }else{
        return state.delete('isFetchingEmail');
      }
    }
    case 'SET_NEEDS_SIGNUP':
    {
      if(action.needed){
        return state.set('emailNeedsSignUp', true);
      }else{
        return state.delete('emailNeedsSignUp');
      }
    }
    case 'SET_NEEDS_SIGNUP_DETAILS':
    {
      if(action.needed){
        return state.set('emailNeedsSignUpDetails', true);
      }else{
        return state.delete('emailNeedsSignUpDetails');
      }
    }
    case 'SET_NEEDS_USER_DETAILS':
    {
      if(action.needed){
        return state.set('emailNeedsUserDetails', true);
      }else{
        return state.delete('emailNeedsUserDetails');
      }
    }
    case 'SET_UPLOADING_IMAGE':
    {
      if(action.uploading){
        return state.set('isUploadingImage', true);
      }else{
        return state.delete('isUploadingImage');
      }
    }
    case 'SET_SIGNING_UP':{
      if(action.signingUp){
        return state.set('isSigningUp', true);
      }else{
        return state.delete('isSigningUp');
      }
    }
    case 'SET_UPLOADED_IMAGE':
    {
      var tempState = state;
      if(action.imageURL){
        tempState = tempState.set('uploadedImageURL', action.imageURL);
      }else{
        tempState = tempState.delete('uploadedImageURL');
      }

      if(action.imagePath){
        tempState = tempState.set('uploadedImagePath', action.imagePath);
      }else{
        tempState = tempState.delete('uploadedImagePath');
      }

      return tempState;
    }
    case 'SET_ADDING_INVOICE':
    {
      if(action.adding){
        return state.set('isAddingInvoice', true);
      }else{
        return state.delete('isAddingInvoice');
      }
    }
    case 'SET_EDIT_SESSION':
    {
      if(action.sessionId){
        return state.set('editSessionId', action.sessionId);
      }else{
        return state.delete('editSessionId');
      }
    }
    default:
      return state;
  }
}

function setUser(user, state) {
  if(typeof user.data === 'function'){
    return state.set('user', fromJS({id:user.id,...user.data()}));
  }else{
    return state.set('user', user);
  }
}

function setClassesById(classes, state) {
  // console.log("classes", classes);
  const immutableClasses = fromJS(classes);
  if (is(state.getIn(['classes', 'classesById']), immutableClasses)){
    return state;
  }else{
    return state.setIn(['classes','classesById'], immutableClasses);
  }
}

function setUsersById(userMap, state) {
  // console.log("trainers", trainers);
  // const immutableUsers = fromJS(users);
  // if (is(state.getIn(['users', 'usersById']), immutableUsers)){
  //   return state;
  // }else{
  //   return state.mergeIn(['users','usersById'], immutableUsers);
  // }

  var users = {};
  var activeMembers = {};
  var expiredMembers = {};
  var cancelledMembers = {};
  var prospects = {};
  var trainers = {};
  var admins = {};
  var membershipConsultants = {};
  var staffs = {};
  var expiredCount = 0;
  Object.entries(userMap).forEach(([userId, userData]) => {
    // if(userId === 'y4HXhkqVBThpa110smf6oS1Rr2l1'){
    //   return;
    // }
    if(!userData || !userId){
      return;
    }
    users[userId] = userData;
    const roles = userData.roles;
    const isStaff = userData.isStaff;
    if (isStaff || roles){
      staffs[userId] = userData;
      if (roles && roles.trainer){
        trainers[userId] = userData;
      }
      if (roles && roles.mc){
        membershipConsultants[userId] = userData;
      }
      if (roles && roles.admin){
        admins[userId] = userData;
      }
    }
    // if(roles){
    //   if(roles.trainer){
    //     trainers[userId] = userData;
    //   }
    //   if(roles.mc){
    //     membershipConsultants[userId] = userData;
    //   }
    //   if(roles.admin){
    //     admins[userId] = userData;
    //   }
    //   // console.log("has roles", doc.data().membershipStarts);
    // }
    else{
      // console.log("no roles", doc.id, doc.data());
      const membershipStarts = userData.autoMembershipStarts ? userData.autoMembershipStarts : userData.membershipStarts;
      const membershipEnds = userData.autoMembershipEnds ? userData.autoMembershipEnds : userData.membershipEnds;
      const packageId = userData && userData.packageId;
      const isComplimentaryPackage = packageId && (packageId === 'yKLfNYOPzXHoAiknAT24' || packageId === 'L6sJtsKG68LpEUH3QeD4');

      // const cancelled = userData && (userData.cancellationDate || userData.cancellationReason) ? true : false;
      const cancelled = userData && (userData.cancellationDate && moment(getTheDate(userData.cancellationDate)).isSameOrBefore(moment(), 'day')) ? true : false;

      const now = new Date();
      if(cancelled){
        cancelledMembers[userId] = userData;
      }
      else if (packageId && membershipStarts 
        && (moment(getTheDate(membershipStarts)) < moment()) 
        && membershipEnds && moment(getTheDate(membershipEnds)) >= moment()){
        activeMembers[userId] = userData;
      }
      else if (packageId && membershipStarts 
        && (moment(getTheDate(membershipStarts)) < moment()) 
        && membershipEnds && moment(getTheDate(membershipEnds)) < moment()){
        expiredCount += 1;
        // console.log('expiredCount: ', userData.email);
        expiredMembers[userId] = userData;
      }
      // else if(userData.packageId && membershipStarts && moment(getTheDate(membershipStarts)) < moment()){
      //   if(membershipEnds){
      //     if(getTheDate(membershipEnds) > now){
      //       activeMembers[userId] = userData;
      //     }else{
      //       expiredMembers[userId] = userData;
      //     }
      //   }
      //   else{
      //     activeMembers[userId] = userData;
      //   }
      // }
      else
      {
        // if(userData.packageId){
        //   activeMembers[userId] = userData;
        // }else{
        //   prospects[userId] = userData;
        // }
        prospects[userId] = userData;
      }
    }
  });

  const immutableUsers = fromJS(users);
  if (!is(state.getIn(['users', 'usersById']), immutableUsers)){
    state = state.setIn(['users','usersById'], immutableUsers);
  }

  const immutableTrainers = fromJS(trainers);
  if (!is(state.getIn(['trainers', 'trainersById']), immutableTrainers)){
    state = state.setIn(['trainers','trainersById'], immutableTrainers);
  }

  const immutableAdmins = fromJS(admins);
  if (!is(state.getIn(['admins', 'adminsById']), immutableAdmins)){
    state = state.setIn(['admins','adminsById'], immutableAdmins);
  }

  const immutableMembershipConsultants = fromJS(membershipConsultants);
  if (!is(state.getIn(['membershipConsultants', 'membershipConsultantsById']), immutableMembershipConsultants)){
    state = state.setIn(['membershipConsultants','membershipConsultantsById'], immutableMembershipConsultants);
  }

  const immutableStaffs = fromJS(staffs);
  if (!is(state.getIn(['staffs', 'staffsById']), immutableStaffs)){
    state = state.setIn(['staffs','staffsById'], immutableStaffs);
  }

  const immutableActiveMembers = fromJS(activeMembers);
  if (!is(state.getIn(['activeMembers', 'activeMembersById']), immutableActiveMembers)){
    state = state.setIn(['activeMembers','activeMembersById'], immutableActiveMembers);
  }

  const immutableExpiredMembers = fromJS(expiredMembers);
  if (!is(state.getIn(['expiredMembers', 'expiredMembersById']), immutableExpiredMembers)){
    state = state.setIn(['expiredMembers','expiredMembersById'], immutableExpiredMembers);
  }

  const immutableCancelledMembers = fromJS(cancelledMembers);
  if (!is(state.getIn(['cancelledMembers', 'cancelledMembersById']), immutableCancelledMembers)){
    state = state.setIn(['cancelledMembers','cancelledMembersById'], immutableCancelledMembers);
  }

  const immutableProspects = fromJS(prospects);
  if (!is(state.getIn(['prospects', 'prospectsById']), immutableProspects)){
    state = state.setIn(['prospects','prospectsById'], immutableProspects);
  }

  return state;
}

function addUsersById(userMap, state) {

  var users = {};
  Object.entries(userMap).forEach(([userId, userData]) => {
    if(!userData || !userId){
      return;
    }
    users[userId] = userData;
  });

  const immutableUsers = fromJS(users);
  state = state.mergeIn(['users','usersById'], immutableUsers);

  return state;
}

function setTrainersById(trainers, state) {
  // console.log("trainers", trainers);
  const immutableTrainers = fromJS(trainers);
  if (is(state.getIn(['trainers', 'trainersById']), immutableTrainers)){
    return state;
  }else{
    return state.setIn(['trainers','trainersById'], immutableTrainers).mergeIn(['users','usersById'], immutableTrainers);
  }
}

function setAdminsById(admins, state) {
  // console.log("trainers", trainers);
  const immutableAdmins = fromJS(admins);
  if (is(state.getIn(['admins', 'adminsById']), immutableAdmins)){
    return state;
  }else{
    return state.setIn(['admins','adminsById'], immutableAdmins).mergeIn(['users','usersById'], immutableAdmins);
  }
}

function setStaffsById(staffs, state) {
  // console.log("trainers", trainers);
  const immutableStaffs = fromJS(staffs);
  if (is(state.getIn(['staffs', 'staffsById']), immutableStaffs)){
    return state;
  }else{
    return state.setIn(['staffs','staffsById'], immutableStaffs).mergeIn(['users','usersById'], immutableStaffs);
  }
}

function setMembershipConsultantsById(membershipConsultants, state) {
  // console.log("trainers", trainers);
  const immutableMembershipConsultants = fromJS(membershipConsultants);
  if (is(state.getIn(['membershipConsultants', 'membershipConsultantsById']), immutableMembershipConsultants)){
    return state;
  }else{
    return state.setIn(['membershipConsultants','membershipConsultantsById'], immutableMembershipConsultants).mergeIn(['users','usersById'], immutableMembershipConsultants);
  }
}

function setActiveMembersById(activeMembers, state) {
  // console.log("trainers", trainers);
  const immutableActiveMembers = fromJS(activeMembers);
  if (is(state.getIn(['activeMembers', 'activeMembersById']), immutableActiveMembers)){
    return state;
  }else{
    return state.setIn(['activeMembers','activeMembersById'], immutableActiveMembers).mergeIn(['users','usersById'], immutableActiveMembers);
  }
}

function setExpiredMembersById(expiredMembers, state) {
  // console.log("trainers", trainers);
  const immutableExpiredMembers = fromJS(expiredMembers);
  if (is(state.getIn(['expiredMembers', 'expiredMembersById']), immutableExpiredMembers)){
    return state;
  }else{
    return state.setIn(['expiredMembers','expiredMembersById'], immutableExpiredMembers).mergeIn(['users','usersById'], immutableExpiredMembers);
  }
}

function setCancelledMembersById(cancelledMembers, state) {
  // console.log("trainers", trainers);
  const immutableCancelledMembers = fromJS(cancelledMembers);
  if (is(state.getIn(['cancelledMembers', 'cancelledMembersById']), immutableCancelledMembers)){
    return state;
  }else{
    return state.setIn(['cancelledMembers','cancelledMembersById'], immutableCancelledMembers).mergeIn(['users','usersById'], immutableCancelledMembers);
  }
}

function setProspectsById(prospects, state) {
  // console.log("trainers", trainers);
  const immutableProspects = fromJS(prospects);
  if (is(state.getIn(['prospects', 'prospectsById']), immutableProspects)){
    return state;
  }else{
    return state.setIn(['prospects','prospectsById'], immutableProspects).mergeIn(['users','usersById'], immutableProspects);
  }
}

function setSessionsById(sessions, state) {
  // console.log("sessions", sessions);
  const immutableSessions = fromJS(sessions);
  if (is(state.getIn(['sessions', 'sessionsById']), immutableSessions)){
    return state;
  }else{
    return state.setIn(['sessions','sessionsById'], immutableSessions);
  }
}

function setFBTokenById(fbToken, state) {
  // console.log("sessions", sessions);
  const immutableTokens = fromJS(fbToken);
  if (is(state.getIn(['fbToken', 'fbTokenById']), immutableTokens)){
    return state;
  }else{
    return state.setIn(['fbToken','fbTokenById'], immutableTokens);
  }
}

function setPackagesById(packages, state) {
  // console.log("sessions", sessions);
  const immutablePackages = fromJS(packages);
  if (is(state.getIn(['packages', 'packagesById']), immutablePackages)){
    return state;
  }else{
    return state.setIn(['packages','packagesById'], immutablePackages);
  }
}

function setGantnerLogs(gantnerLogs, state) {
  // console.log("sessions", sessions);
  const immutableGantnerLogs = fromJS(gantnerLogs);
  if (is(state.getIn(['gantnerLogs', 'gantnerLogsById']), immutableGantnerLogs)){
    return state;
  }else{
    return state.setIn(['gantnerLogs', 'gantnerLogsById'], immutableGantnerLogs);
  }
}

function setGantnerLogsByUserId(gantnerLogs, userId, state) {
  const immutableGantnerLogs = fromJS(gantnerLogs);
  if (is(state.getIn(['gantnerLogs', 'gantnerLogsByUserId', userId]), immutableGantnerLogs)){
    return state;
  }else{
    return state.setIn(['gantnerLogs', 'gantnerLogsByUserId', userId], immutableGantnerLogs);
  }
}

function setCardToRegister(cardToRegister, state) {
  return state.set('cardToRegister', cardToRegister);
}

function removeCardToRegister(state) {
  if(state.has('cardToRegister')){
    return state.delete('cardToRegister');
  }else{
    return state;
  }
}

function setBookingsById(bookings, state) {
  // console.log("bookings", bookings);
  const immutableBookings = fromJS(bookings);
  if (is(state.getIn(['bookings', 'bookingsById']), immutableBookings)){
    return state;
  }else{
    return state.setIn(['bookings','bookingsById'], immutableBookings);
  }
}

function setBookingsByUserId(bookings, userId, state) {
  const immutableBookings = fromJS(bookings);
  if (is(state.getIn(['bookings', 'bookingsByUserId', userId]), immutableBookings)){
    return state;
  }else{
    return state.setIn(['bookings','bookingsByUserId', userId], immutableBookings);
  }
}

function setPaymentsById(payments, state) {
  // console.log("bookings", bookings);
  const immutablePayments = fromJS(payments);
  if (is(state.getIn(['payments', 'paymentsById']), immutablePayments)){
    return state;
  }else{
    return state.setIn(['payments','paymentsById'], immutablePayments);
  }
}

function setVendSalesById(payments, state) {
  // console.log("payments", payments);
  const immutablePayments = fromJS(payments);
  if (is(state.getIn(['vendSales', 'vendSalesById']), immutablePayments)){
    return state;
  }else{
    return state.setIn(['vendSales','vendSalesById'], immutablePayments);
  }
}

function setCnyRefById(data, state) {
  // console.log("datasetCnyRefById", data);
  const immutableData = fromJS(data);
  // console.log('immutableData: ', immutableData);
  if (is(state.getIn(['cnyReferrals', 'cnyReferralsById']), immutableData)){
    return state;
  }else{
    return state.setIn(['cnyReferrals','cnyReferralsById'], immutableData);
  }
}

function setFreezePaymentsById(payments, state) {
  // console.log("bookings", bookings);
  const immutablePayments = fromJS(payments);
  if (is(state.getIn(['freezePayments', 'freezePaymentsById']), immutablePayments)){
    return state;
  }else{
    return state.setIn(['freezePayments','freezePaymentsById'], immutablePayments);
  }
}

function setPaymentsByUserId(payments, userId, state) {
  const immutablePayments = fromJS(payments);
  if (is(state.getIn(['payments', 'paymentsByUserId', userId]), immutablePayments)){
    return state;
  }else{
    return state.setIn(['payments', 'paymentsByUserId', userId], immutablePayments);
  }
}

function setInvoicesById(invoices, state) {
  // console.log("invoices", invoices);
  const immutableInvoices = fromJS(invoices);
  if (is(state.getIn(['invoices', 'invoicesById']), immutableInvoices)){
    return state;
  }else{
    return state.setIn(['invoices','invoicesById'], immutableInvoices);
  }
}

function setInvoicesByUserId(invoices, userId, state) {
  const immutableInvoices = fromJS(invoices);
  if (is(state.getIn(['invoices', 'invoicesByUserId', userId]), immutableInvoices)){
    return state;
  }else{
    return state.setIn(['invoices', 'invoicesByUserId', userId], immutableInvoices);
  }
  // return state;
}

function setVendProductsById(vendProducts, state) {
  console.log("vendProducts from reducer", vendProducts);
  const immutableVendProducts = fromJS(vendProducts);
  if (is(state.getIn(['vendProducts', 'vendProductsById']), immutableVendProducts)){
    return state;
  }else{
    return state.setIn(['vendProducts', 'vendProductsById'], immutableVendProducts);
  }
}
