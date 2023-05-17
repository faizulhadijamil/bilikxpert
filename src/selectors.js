import {createSelector} from 'reselect'
import moment from 'moment';

import {getTheDate} from './actions';
import { object } from 'firebase-functions/lib/providers/storage';
// const getVisibilityFilter = (state, props) =>
//   state.todoLists[props.listId].visibilityFilter
//
// const getTodos = (state, props) =>
//   state.todoLists[props.listId].todos
const getMessage = (state, props) => {
  // console.log("searchText", props.searchText);
  return (state && state.state && state.state.get('message')) || null;
}
export const getMessageState = createSelector(
  [ getMessage ],
  (message) => {
    return message;
  }
);
const getSearchText = (state, props) => {
  // console.log("searchText", props.searchText);
  return (props.searchText && props.searchText.trim()) || '';
}
export const getSearchTextState = createSelector(
  [ getSearchText ],
  (searchText) => {
    return searchText;
  }
);
const getFilteredStaffId = (state, props) => {
  // console.log("filteredStaffId", props.filteredStaffId);
  return props.filteredStaffId || null;
}
export const getFilteredStaffIdState = createSelector(
  [ getFilteredStaffId ],
  (filteredStaffId) => {
    return filteredStaffId;
  }
);

const getCardToRegister = (state, props) => {
  // console.log("filteredStaffId", props.filteredStaffId);
  return (state && state.state && state.state.get('cardToRegister')) || (state && state.state && state.state.has('cardToRegister')) || null;
}
export const getCardToRegisterState = createSelector(
  [ getCardToRegister ],
  (cardToRegister) => {
    return cardToRegister || null;
  }
);

export const getCurrentUserId = (state, props) => state.state && state.state.has('user') && state.state.hasIn(['user', 'id']) ? state.state.getIn(['user', 'id']) : null;
const getPackages = (state,props) => state.state && state.state.hasIn(['packages', 'packagesById']) ? state.state.getIn(['packages', 'packagesById']) : null;
export const getPackagesList = createSelector(
  [ getPackages ],
  (packages) => {
    return packages || null;
  }
);

export const getCurrentUserData = (state, props) => state.state && state.state.has('user') ? state.state.get('user') : null;
const getUsers = (state,props) => state.state && state.state.hasIn(['users', 'usersById']) ? state.state.getIn(['users', 'usersById']) : null;
const getAdmins = (state,props) => state.state && state.state.hasIn(['admins', 'adminsById']) ? sortBy(state.state.getIn(['admins', 'adminsById']), 'name') : null;
const getOps = (state,props) => state.state && state.state.hasIn(['membershipConsultants', 'membershipConsultantsById']) ? state.state.getIn(['membershipConsultants', 'membershipConsultantsById']) : null;
const getStaffs = (state,props) => state.state && state.state.hasIn(['staffs', 'staffsById']) ? state.state.getIn(['staffs', 'staffsById']) : null;
const getActiveMembers = (state,props) => state.state && state.state.hasIn(['activeMembers', 'activeMembersById']) ? sortBy(state.state.getIn(['activeMembers', 'activeMembersById']), 'name') : null;
const getExpiredMembers = (state,props) => state.state && state.state.hasIn(['expiredMembers', 'expiredMembersById']) ? sortBy(state.state.getIn(['expiredMembers', 'expiredMembersById']), 'autoMembershipEnds') : null;
const getCancelledMembers = (state,props) => state.state && state.state.hasIn(['cancelledMembers', 'cancelledMembersById']) ? sortBy(state.state.getIn(['cancelledMembers', 'cancelledMembersById']), 'name') : null;
const getProspects = (state,props) => state.state && state.state.hasIn(['prospects', 'prospectsById']) ? sortBy(state.state.getIn(['prospects', 'prospectsById']), 'name') : null;
export const getTrainers = (state,props) => state.state && state.state.hasIn(['trainers', 'trainersById']) ? sortBy(state.state.getIn(['trainers', 'trainersById']), 'name') : null;
const getGantnerLogs = (state, props) => {
  const gantnerLogs = state.state && state.state.hasIn(['gantnerLogs', 'gantnerLogsById']) ? sortBy(state.state.getIn(['gantnerLogs', 'gantnerLogsById']), 'createdAt') : null;
  // const userData = state.state && state.state.has('user') ? state.state.get('user') : null;
  // const userEmail = userData.get('email') || null;
  // if(gantnerLogs && userEmail.indexOf('+klcc@babel.fit') !== -1){
  //   return gantnerLogs.filter(x=>x.get('deviceId') === 'Check In - KLCC' || x.get('deviceId') === 'App - Manual (KLCC)')
  // }else if(gantnerLogs){
  //   return gantnerLogs.filter(x=>x.get('deviceId') === 'Check In' || x.get('deviceId') === 'App - Manual')
  // }

  return gantnerLogs;

  // return null;
}

const getPaymentsByUserId = (state, props) => state.state && state.state.hasIn(['payments', 'paymentsByUserId']) ? state.state.getIn(['payments', 'paymentsByUserId']) : null;
export const getFreezePayments = (state, props) => state.state && state.state.hasIn(['freezePayments', 'freezePaymentsById']) ? sortBy(state.state.getIn(['freezePayments', 'freezePaymentsById']), 'createdAt') : null;
const getPaidUsers = (state,props) => state.state && state.state.hasIn(['payments', 'paymentsById']) ? sortBy(state.state.getIn(['payments', 'paymentsById']), 'createdAt') : null;
const getInvoiceUsers = (state,props) => state.state && state.state.hasIn(['invoices', 'invoicesById']) ? sortBy(state.state.getIn(['invoices', 'invoicesById']), 'createdAt') : null;
// const getcnyReferralList = (state,props) => state.state && state.state.hasIn(['cnyReferrals', 'cnyReferralById']) ? sortBy(state.state.getIn(['cnyReferrals', 'cnyReferralById']), 'theDate') : null;
const getcnyReferralList = (state,props) => {
  return state.state && state.state.hasIn(['cnyReferrals', 'cnyReferralsById']) ? sortBy(state.state.getIn(['cnyReferrals', 'cnyReferralsById']), 'theDate') : null
};

export const getCnyRef = createSelector(
  [getcnyReferralList],
  (cnyRefList)=>{
    return cnyRefList || null;
  }
);

export const makeGetCnyRef = () => {
  return getCnyRef;
}

const getVendSales = (state,props) => state.state && state.state.hasIn(['vendSales', 'vendSalesById']) ? sortBy(state.state.getIn(['vendSales', 'vendSalesById']), 'created_at') : null;

export const getVendProducts = (state, props) => {
  return state.state && state.state.hasIn(['vendProducts', 'vendProductsById']) ? state.state.getIn(['vendProducts', 'vendProductsById']) : null
}

export const getAllVendSales = createSelector(
  [getVendSales],
  (vendSales)=>{
    // console.log('theVendSales: ', vendSales);
    return vendSales || null;
  }
)

export const getAllVendProducts = createSelector(
  [getVendProducts],
  (vendProducts)=>{
    // console.log('theVendSales: ', vendSales);
    return vendProducts || null;
  }
)

export const getAllFreezePayments = createSelector(
  [getFreezePayments],
  (freezePayments)=>{
    return freezePayments || null;
  }
);


export const getAllUsers = createSelector(
  [getUsers],
  (users)=>{
    return users || null;
  }
);

export const makeGetAllUsers = () => {
  return getAllUsers;
}


export const getStaff = createSelector(
  [getAdmins, getTrainers, getOps, getStaffs],
  (admins, trainers, ops, staffs)=>{
    // var staff = ops || trainers || admins || staffs;
    var staff = staffs;
    // staff = staff && staff.merge(trainers, admins);
    // console.log('getStaff: ', staff);
    return staff || null;
  }
);

export const makeGetStaff = () => {
  return getStaff;
}

const getBranches = (state,props) => state.state && state.state.hasIn(['branches', 'branchesById']) ? state.state.getIn(['branches', 'branchesById']) : null;
export const getBranchesList = createSelector(
  [ getBranches ],
  (branches) => {
    console.log('theBranches package: ', branches);
    return branches || null;
  }
);

export const makeGetBranch = () => {
  return getBranchesList;
}

const getRooms = (state,props) => state.state && state.state.hasIn(['rooms', 'roomsById']) ? state.state.getIn(['rooms', 'roomsById']) : null;
export const getRoomsList = createSelector(
  [ getRooms ],
  (rooms) => {
    return rooms || null;
  }
);

export const makeGetRoom = () => {
  return getRoomsList;
}

const sortBy = (seq, key) =>{
  return seq.sort((a, b) => {
    const nameA = a.get(key);
    const nameB = b.get(key);
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    if (nameA === nameB) {
      return 0;
    }
  });
}

export const makeGetInGymItems = () => {
  return getInGymItems;
}

const getInGymItems = createSelector(
  [ getGantnerLogs, getUsers, getPackages, getSearchTextState, getFilteredStaffIdState ],
  (gantnerLogs, users, packages, searchText, filteredStaffId) => {

    const inGym = inGymArray(gantnerLogs);

    var userItems = [];
    inGym.forEach(([userId, createdAt])=>{
      const user = users.get(userId) || null;
      if(user && userMatchesSearchText(user, userId, searchText, filteredStaffId)){
        userItems.push(itemForInGym(user, userId, createdAt));
      }
    });

    return userItems;
  }
);

export const makeGetInGymNeedsAttentionItems = () => {
  return getInGymNeedsAttentionItems;
}

const getInGymNeedsAttentionItems = createSelector(
  [ getGantnerLogs, getUsers, getPackages, getSearchTextState, getFilteredStaffIdState ],
  (gantnerLogs, users, packages, searchText, filteredStaffId) => {

    const inGym = inGymArray(gantnerLogs);

    var userItems = [];
    inGym.forEach(([userId, createdAt])=>{
      const user = users.get(userId) || null;
      const membershipEnds = (user && user.get('autoMembershipEnds'))? getTheDate(user.get('autoMembershipEnds')):null;
      // console.log('membershipEnds: ', membershipEnds);
      if(user && membershipEnds && moment(membershipEnds).subtract(3, 'days').isSameOrBefore(moment(), 'day') && userMatchesSearchText(user, userId, searchText, filteredStaffId)){
        userItems.push(itemForInGym(user, userId, createdAt));
      }
    });

    return userItems;
  }
);

export const makeGetInGymTTDIItems = () => {
  return getInGymTTDIItems;
}

const getInGymTTDIItems = createSelector(
  [ getGantnerLogs, getUsers, getPackages, getSearchTextState, getFilteredStaffIdState ],
  (gantnerLogs, users, packages, searchText, filteredStaffId) => {

    const inGym = gantnerLogs ? inGymArray(gantnerLogs.filter(x=>x.get('deviceId') === 'Check In' || x.get('deviceId') === 'App - Manual' || x.get('deviceId') === 'App - Registration')) : [];

    var userItems = [];
    inGym.forEach(([userId, createdAt])=>{
      const user = users.get(userId) || null;
      if(user && userMatchesSearchText(user, userId, searchText, filteredStaffId)){
        userItems.push(itemForInGym(user, userId, createdAt));
      }
    });

    return userItems;
  }
);

export const makeGetInGymTTDINeedsAttentionItems = () => {
  return getInGymTTDINeedsAttentionItems;
}

const getInGymTTDINeedsAttentionItems = createSelector(
  [ getGantnerLogs, getUsers, getPackages, getSearchTextState, getFilteredStaffIdState ],
  (gantnerLogs, users, packages, searchText, filteredStaffId) => {

    const inGym = gantnerLogs ? inGymArray(gantnerLogs.filter(x=>x.get('deviceId') === 'Check In' || x.get('deviceId') === 'App - Manual'  || x.get('deviceId') === 'App - Registration')) : [];

    var userItems = [];
    inGym.forEach(([userId, createdAt])=>{
      const user = users.get(userId) || null;
      const membershipEnds = (user && user.get('autoMembershipEnds')) || null;
      if(user && membershipEnds && moment(getTheDate(membershipEnds)).subtract(3, 'days').isSameOrBefore(moment(), 'day') && userMatchesSearchText(user, userId, searchText, filteredStaffId)){
        userItems.push(itemForInGym(user, userId, createdAt));
      }
    });
    return userItems;
  }
);

export const makeGetInGymKLCCItems = () => {
  return getInGymKLCCItems;
}

const getInGymKLCCItems = createSelector(
  [ getGantnerLogs, getUsers, getPackages, getSearchTextState, getFilteredStaffIdState ],
  (gantnerLogs, users, packages, searchText, filteredStaffId) => {

    const inGym = gantnerLogs ? inGymArray(gantnerLogs.filter(x=>x.get('deviceId') === 'Check In - KLCC' || x.get('deviceId') === 'App - Manual (KLCC)'  || x.get('deviceId') === 'App - Registration (KLCC)')) : [];

    var userItems = [];
    inGym.forEach(([userId, createdAt])=>{
      const user = users.get(userId) || null;
      if(user && userMatchesSearchText(user, userId, searchText, filteredStaffId)){
        userItems.push(itemForInGym(user, userId, createdAt));
      }
    });

    return userItems;
  }
);

export const makeGetInGymKLCCNeedsAttentionItems = () => {
  return getInGymKLCCNeedsAttentionItems;
}

const getInGymKLCCNeedsAttentionItems = createSelector(
  [ getGantnerLogs, getUsers, getPackages, getSearchTextState, getFilteredStaffIdState ],
  (gantnerLogs, users, packages, searchText, filteredStaffId) => {

    const inGym = gantnerLogs ? inGymArray(gantnerLogs.filter(x=>x.get('deviceId') === 'Check In - KLCC' || x.get('deviceId') === 'App - Manual (KLCC)' || x.get('deviceId') === 'App - Registration (KLCC)')) : [];

    var userItems = [];
    inGym.forEach(([userId, createdAt])=>{
      const user = users.get(userId) || null;
      const membershipEnds = (user && user.get('autoMembershipEnds')) || null;
      if(user && membershipEnds && moment(getTheDate(membershipEnds)).subtract(3, 'days').isSameOrBefore(moment(), 'day') && userMatchesSearchText(user, userId, searchText, filteredStaffId)){
        userItems.push(itemForInGym(user, userId, createdAt));
      }
    });

    return userItems;
  }
);

const getInGymMap = createSelector(
  [getGantnerLogs],
  (gantnerLogs) =>{
    return inGymMap(gantnerLogs) || null;
  }
)

export const makeGetInGymMap = () =>{
  return getInGymMap;
}

const getCheckIn = createSelector(
  [getGantnerLogs],
  (gantnerLogs) =>{
    return checkIn(gantnerLogs) || null;
  }
)

export const makeGetCheckIn = () =>{
  return getCheckIn;
}

const getCheckOut = createSelector(
  [getGantnerLogs],
  (gantnerLogs) =>{
    return checkOut(gantnerLogs) || null;
  }
)

export const makeGetCheckOut = () =>{
  return getCheckOut;
}

const inGymMap = (gantnerLogs) =>{
  var inGymMap = {};
  gantnerLogs && gantnerLogs.toKeyedSeq().forEach((v, k) => {
    const registered = v.get('registered');
    const userId = v.get('userId');
    if(!registered || !userId){
      return;
    }
    const checkInDate = getTheDate(v.get('createdAt'));
    if (inGymMap[userId]) {
      delete inGymMap[userId];
    } else {
      inGymMap[userId] = checkInDate;
    }
  });
  return inGymMap;
}

const checkIn = (gantnerLogs) =>{
  var checkIn = {};
  gantnerLogs && gantnerLogs.toKeyedSeq().forEach((v, k) => {
    const userId = v.get('userId');
  });
  return checkIn;
}

const checkOut = (gantnerLogs) =>{
  var checkOut = {};
  gantnerLogs && gantnerLogs.toKeyedSeq().forEach((v, k) => {
    const userId = v.get('userId');
  });
  return checkOut;
}

const inGymArray = (gantnerLogs) =>{
  var map = inGymMap(gantnerLogs);
  var inGym = Object.entries(map);
  var cin = checkIn(gantnerLogs);
  var cout = checkOut(gantnerLogs);
  inGym.reverse();
  return inGym;
}

const getNewUserItems = createSelector(
  [ getUsers, getPackages, getSearchTextState, getFilteredStaffId ],
  (users, packages, searchText, filteredStaffId) => {
    // console.log('getNewUserItems: ', users);
    if (users && users.size>0){
      const newUsers = users.filter(x=>{
        const joinDate = x.get('joinDate')? getTheDate(x.get('joinDate')):null;
        const isSameDay = moment(joinDate).isSame(moment(), 'day');
        if(joinDate && isSameDay){
          return true;
        }else{
          // console.log('joinDateFalse: ', moment(joinDate));
          return false;
        }
      });
      const sortedNewUsers = sortBy(newUsers, 'joinDate').reverse();
      return filteredItemsForUsers(sortedNewUsers, searchText, packages, null, null, filteredStaffId);
    }
  }
);

export const makeGetNewUserItems = () => {
  return getNewUserItems;
}

// for klcc visitor/member sign up today
const getNewUserItemsklcc = createSelector(
  [ getUsers, getPackages, getSearchTextState, getFilteredStaffId ],
  (users, packages, searchText, filteredStaffId) => {
    // console.log('getNewUserItems: ', users);
    if (users && users.size>0){
      const newUsers = users.filter(x=>{
        const joinDate = x.get('joinDate')? getTheDate(x.get('joinDate')):null;
        const isSameDay = moment(joinDate).isSame(moment(), 'day');
        const packageId = x.get('packageId');
        const firstJoinVisit = x.get('firstJoinVisit');

        if(joinDate && isSameDay && firstJoinVisit==='KLCC' && !packageId){
          return true;
        }else{
          // console.log('joinDateFalse: ', moment(joinDate));
          return false;
        }
      });
      const sortedNewUsers = sortBy(newUsers, 'joinDate').reverse();
      return filteredItemsForUsers(sortedNewUsers, searchText, packages, null, null, filteredStaffId);
    }
  }
);

export const makeGetNewUserItemsKLCC = () => {
  return getNewUserItemsklcc;
}

// for new ttdi visitor/member sign up today
const getNewUserItemsttdi = createSelector(
  [ getUsers, getPackages, getSearchTextState, getFilteredStaffId ],
  (users, packages, searchText, filteredStaffId) => {
    // console.log('getNewUserItems: ', users);
    if (users && users.size>0){
      const newUsers = users.filter(x=>{
        const joinDate = x.get('joinDate')? getTheDate(x.get('joinDate')):null;
        const isSameDay = moment(joinDate).isSame(moment(), 'day');
        const packageId = x.get('packageId');
        const firstJoinVisit = x.get('firstJoinVisit');

        if(joinDate && isSameDay && firstJoinVisit==='TTDI' && !packageId){
          return true;
        }else{
          // console.log('joinDateFalse: ', moment(joinDate));
          return false;
        }
      });
      const sortedNewUsers = sortBy(newUsers, 'joinDate').reverse();
      return filteredItemsForUsers(sortedNewUsers, searchText, packages, null, null, filteredStaffId);
    }
  }
);

export const makeGetNewUserItemsTTDI = () => {
  return getNewUserItemsttdi;
}

const getInvoicesMembersItems = createSelector(
  [getUsers, getInvoiceUsers],
  (users, invoiceUsers) => {
    // console.log('invoiceUser: ', invoiceUsers);
    // console.log('theusers: ', users);
    const filteredGeneratedInvoice = filterByInvoice(users, invoiceUsers);
    return invoiceUsers;
  }
);

export const makeGetInvoicesMembersItems = () => {
  return getInvoicesMembersItems;
}

const filterByInvoice = (users, invoiceUser) => {
  const filteredInvoice = invoiceUser && invoiceUser.filter(v=>{
    return true;
  });
  return filteredInvoice;
}

const getActiveMembersItemsKLCC = createSelector(
  [ getActiveMembers, getFreezePayments, getPackages, getSearchTextState, getFilteredStaffId, getPaidUsers ],
  (activeMembers, freezePayments, packages, searchText, filteredStaffId, paidUsers) => {
    const filteredActiveMembers = filterByFreezePaymentsKLCC(freezePayments, activeMembers, false);
    const filteredWithoutComplimentaryMembers = filterByActiveWithoutComplimentary(filteredActiveMembers);
    // return filteredItemsForUsers(filteredComplimentaryMembers, searchText, packages, null, null, filteredStaffId);
    // console.log('filteredActiveMembersKLCC: ', filteredActiveMembers);
    return filteredItemsForUsers(filteredWithoutComplimentaryMembers, searchText, packages, null, null, filteredStaffId);
  }
);

export const makeGetActiveMemberItemsKLCC = () => {
  return getActiveMembersItemsKLCC;
}
const getActiveMembersItemsTTDI = createSelector(
  [ getActiveMembers, getFreezePayments, getPackages, getSearchTextState, getFilteredStaffId, getPaidUsers ],
  (activeMembers, freezePayments, packages, searchText, filteredStaffId, paidUsers) => {
    const filteredActiveMembers = filterByFreezePaymentsTTDI(freezePayments, activeMembers, false);
    const filteredWithoutComplimentaryMembers = filterByActiveWithoutComplimentary(filteredActiveMembers);
    // return filteredItemsForUsers(filteredComplimentaryMembers, searchText, packages, null, null, filteredStaffId);
    return filteredItemsForUsers(filteredWithoutComplimentaryMembers, searchText, packages, null, null, filteredStaffId);
  }
);

export const makeGetActiveMemberItemsTTDI = () => {
  return getActiveMembersItemsTTDI;
}
const getActiveMembersItems = createSelector(
  [ getActiveMembers, getFreezePayments, getPackages, getSearchTextState, getFilteredStaffId ],
  (activeMembers, freezePayments, packages, searchText, filteredStaffId) => {
    const filteredActiveMembers = filterByFreezePayments(freezePayments, activeMembers, false);
    const filteredWithoutComplimentaryMembers = filterByActiveWithoutComplimentary(filteredActiveMembers);
    activeMembers && activeMembers.toKeyedSeq().forEach((v,k)=>{
      if (k === 'NYPGHFkYMCoKFArIe3bq'){
        console.log('theK :', k);
      }
    });
    filteredActiveMembers && filteredActiveMembers.toKeyedSeq().forEach((v,k)=>{
      // console.log('theK filtered 2:', k);
      if (k === 'NYPGHFkYMCoKFArIe3bq'){
        console.log('theK filtered :', k);
      }
    });
    // return filteredItemsForUsers(filteredActiveMembers, searchText, packages, null, null, filteredStaffId);
    console.log('searchText: ', searchText);
    return filteredItemsForUsers(filteredWithoutComplimentaryMembers, searchText, packages, null, null, filteredStaffId);
  }
);

export const makeGetActiveMemberItems = () => {
  return getActiveMembersItems;
}

const getPaymentsMembersItems = createSelector(
  [getUsers, getPaidUsers],
  (users, paidUser) => {
    const filteredPaidMembers = filterByPayments(users, paidUser);
    return filteredPaidMembers;
  }
);

export const makeGetReferralsMembersItems = () => {
  return getReferralsMembersItems;
}

const getReferralsMembersItems = createSelector(
  [getUsers, getPaidUsers],
  (users, paidUser) => {
    const filteredPaidMembers = filterByReferrals(users, paidUser);
    return filteredPaidMembers;
  }
);

const filterByReferrals = (users, paidUser) => {
  var paidUserMap = {};

  const filteredReferredUsers = paidUser && paidUser.filter(v=>{
    const userId = v.get('userId') || null;
    const source = v.get('source') || null;
    const type = v.get('type') || null
    const createdAt = v.get('createdAt') || null;
    const packageId = v.get('packageId') || null;
    // hardcode first
    const createdAtStartDate = moment('20200801');
    const createdAtEndDate = moment('20200730');
    const createdAtTransDate = moment('20200801');
    const theValidDate = moment(createdAt).isBetween(createdAtStartDate, createdAtEndDate,createdAtTransDate)||null;
    
    if(userId && (source === 'refer') && (type === 'membership')){
      // console.log('Thesource: ', source);
      return true;
    }
  });
  return filteredReferredUsers || null;
}

export const makeGetPaymentsMembersItems = () => {
  return getPaymentsMembersItems;
}

const filterByPayments = (users, paidUser) => {
  var paidUserMap = {};

  const filteredpaidUsers = paidUser && paidUser.filter(v=>{
    const userId = v.get('userId') || null;
    const source = v.get('source') || null;
    const status = v.get('status') || null;
    const type = v.get('type') || null
    const createdAt = v.get('createdAt') || null;
    const packageId = v.get('packageId') || null;
    // hardcode first
    const createdAtStartDate = moment('20180801');
    const createdAtEndDate = moment('20190730');
    const createdAtTransDate = moment('20180801');
    const theValidDate = moment(createdAt).isBetween(createdAtStartDate, createdAtEndDate,createdAtTransDate)||null;
    
    if(userId && (status === 'CLOSED')){
      return true;
    }
  })

  const filteredUsers = users && users.filter((v)=>{
    const totalPayments = v.get('totalPayments') || null;
    if (totalPayments>0){
      return true;
    }
  });
  // return filteredUsers || null;
  return filteredpaidUsers || null;
}

const getComplementaryMembersItems = createSelector(
  [getUsers, getActiveMembers, getFreezePayments, getPackages, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, freezePayments, packages, searchText, filteredStaffId) => {
    // const filteredActiveMembers = filterByFreezePayments(freezePayments, activeMembers, false);
    // const filteredComplimentary = filteredActiveMembers && filteredActiveMembers.filter(x=>{
    const filteredComplimentary = allUsers && allUsers.filter(x=>{  
      const packageId = x.get('packageId');
      const isTerminatedMember = x.get('cancellationDate');
      if(packageId && (packageId === 'yKLfNYOPzXHoAiknAT24' || packageId==='L6sJtsKG68LpEUH3QeD4') && !isTerminatedMember){
        return true
      }else{
        return false
      }
    })
    return filteredItemsForUsers(filteredComplimentary, searchText, packages, null, null, filteredStaffId);
  }
);

export const makeGetHansonMemberItems = () => {
  return getHansonMemberItems;
}

const getHansonMemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByHansonMember = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === 'vv0qzJtltz6HFrMvUWdF'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByHansonMember, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetMidahMemberItems = () => {
  return getMidahMemberItems;
}

const getMidahMemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByMidahMember = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === 'xpaG1rNyXKkiSPGJp9FR'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByMidahMember, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetMelawatiMemberItems = () => {
  return getMelawatiMemberItems;
}

const getMelawatiMemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByMelawatiMember = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === '1m997jLZxcodDbS5BacQ'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByMelawatiMember, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetMelawati2MemberItems = () => {
  return getMelawati2MemberItems;
}

const getMelawati2MemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByMelawatiMember = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === 'pgUPhs4isKYwnSR3qyVQ'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByMelawatiMember, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetCempakaMemberItems = () => {
  return getCempakaMemberItems;
}

const getCempakaMemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByCempakaMember = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === 'LQTsMJDhTrJOgxcvOCNZ'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByCempakaMember, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetIndahMemberItems = () => {
  return getIndahMemberItems;
}

const getIndahMemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByIndahMember = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === 'MlLy46h9yjD234b1ZBQp'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByIndahMember, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetMajuMemberItems = () => {
  return getMajuMemberItems;
}

const getMajuMemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByMajuMember = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === 'nrL156utGX4JPndt0mD4'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByMajuMember, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetWarisanMemberItems = () => {
  return getWarisanMemberItems;
}

const getWarisanMemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByWarisanMember = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === 'rk8UuvMpELv4bFKCZfhH'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByWarisanMember, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetTenagaMemberItems = () => {
  return getTenagaMemberItems;
}

const getTenagaMemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByTenagaMember = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === 'thPGIInvOOq6paElACDP'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByTenagaMember, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetWangsa1MemberItems = () => {
  return getWangsa1MemberItems;
}

const getWangsa1MemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByWangsa1Member = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === '6jtY4wlwO0XFZm3ZguSB'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByWangsa1Member, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetWangsa2MemberItems = () => {
  return getWangsa2MemberItems;
}

const getWangsa2MemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByWangsa2Member = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === '7tdFOQWIOTrDIZCGtSoC'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByWangsa2Member, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetWangsa3MemberItems = () => {
  return getWangsa3MemberItems;
}

const getWangsa3MemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByWangsa3Member = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === '44q8JVy4NHPYVjTSbemz'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByWangsa3Member, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetWangsa4MemberItems = () => {
  return getWangsa4MemberItems;
}

const getWangsa4MemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByWangsa4Member = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === '2BONsPO56oNyloOgfSuI'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByWangsa4Member, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetWangsa5MemberItems = () => {
  return getWangsa5MemberItems;
}

const getWangsa5MemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByWangsa5Member = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === 'BfuDPVzSLyvN9d3y4q1d'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByWangsa5Member, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetWangsa6MemberItems = () => {
  return getWangsa6MemberItems;
}

const getWangsa6MemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByWangsa6Member = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === 'D0PhhSlFxgPfxEaST1DO'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByWangsa6Member, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetWangsa7MemberItems = () => {
  return getWangsa7MemberItems;
}

const getWangsa7MemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByWangsa7Member = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === 'K8GFRZ1ZcosgQy30qLam'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByWangsa7Member, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetCahaya1MemberItems = () => {
  return getCahaya1MemberItems;
}

const getCahaya1MemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByCahaya1Member = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === 'PyaWYN81quJCXXh70iNm'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByCahaya1Member, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetCahaya2MemberItems = () => {
  return getCahaya2MemberItems;
}

const getCahaya2MemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByCahaya2Member = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === 'QHIVYA7TtnVOqDz5yjaP'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByCahaya2Member, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetCahaya3MemberItems = () => {
  return getCahaya3MemberItems;
}

const getCahaya3MemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByCahaya3Member = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === 'XFqtpQQl3pA4xXF4pGZx'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByCahaya3Member, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetCahaya4MemberItems = () => {
  return getCahaya4MemberItems;
}

const getCahaya4MemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByCahaya4Member = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === 'ZMYGLyprUnYFxK730QZP'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByCahaya4Member, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetCahaya5MemberItems = () => {
  return getCahaya5MemberItems;
}

const getCahaya5MemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByCahaya5Member = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === 'gXEIvTJtFhRnxg1a29da'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByCahaya5Member, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetCahaya6MemberItems = () => {
  return getCahaya6MemberItems;
}

const getCahaya6MemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByCahaya6Member = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === 'lJxU94mtwbrGDZRkKfWc'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByCahaya6Member, searchText, null, null, null, filteredStaffId, rooms);
  }
);

export const makeGetCahaya7MemberItems = () => {
  return getCahaya7MemberItems;
}

const getCahaya7MemberItems = createSelector(
  [getUsers, getActiveMembers, getRooms, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, rooms, searchText, filteredStaffId) => {
    const filteredByCahaya7Member = allUsers && allUsers.filter(x=>{  
      const currentBranchId = x.get('currentBranch');
      const currentRoomId = x.get('currentRoomId');
      if (currentBranchId && currentRoomId && currentBranchId === 'mjCXb93tpZ1HRo8y0pjD'){
        return true;
      }
      else{
        return false;
      }
    });
    return filteredItemsForUsers(filteredByCahaya7Member, searchText, null, null, null, filteredStaffId, rooms);
  }
);


export const makeGetComplementaryMemberItems = () => {
  return getComplementaryMembersItems;
}

const getComplementaryPromoMembersItems = createSelector(
  [ getAllUsers, getActiveMembers, getFreezePayments, getPaidUsers, getPackages, getSearchTextState, getFilteredStaffId ],
  (allUsers, activeMembers, freezePayments, paidUsers, packages, searchText, filteredStaffId) => {
    const filteredComplimentaryMembers = filterByComplimentaryPromo(allUsers, paidUsers);
    // const filteredActiveMembers = filterByFreezePayments(freezePayments, activeMembers, false);
    // const filteredComplimentary = filteredActiveMembers && filteredActiveMembers.filter(x=>{
    //   const packageId = x.get('packageId');
    //   if(packageId && packageId === 'yKLfNYOPzXHoAiknAT24'){
    //     return true
    //   }else{
    //     return false
    //   }
    // })
    return filteredItemsForUsers(filteredComplimentaryMembers, searchText, packages, null, null, filteredStaffId);
  }
);

export const makeGetComplementaryPromoMemberItems = () => {
  return getComplementaryPromoMembersItems;
}

const filterByComplimentaryPromo = (users, paidUser) => {
  const filteredMembers = users && users.filter((v,k)=>{
    const complimentaryPromo = v.get('complimentaryPromo')||null;
    const packageId = v.get('packageId')||null;
    if (complimentaryPromo || packageId === 'L6sJtsKG68LpEUH3QeD4'){
      return true;
    }
  });
  return filteredMembers || null;
}

const filterByActiveWithoutComplimentary = (users) => {
  // var complimentaryPromoUserMap = {};
  // paidUser && paidUser.toKeyedSeq().forEach((v,k)=>{
  //   const userId = v.get('userId') || null;
  //   const source = v.get('source') || null;
  //   const status = v.get('status') || null;
  //   const type = v.get('type') || null
  //   const createdAt = v.get('createdAt') || null;
  //   const packageId = v.get('packageId') || null;
  //   const vendProductId = v.get('vendProductId') || null;
  //   const isThisMonth = createdAt && moment(getTheDate(createdAt))

  //   if(userId && (vendProductId === 'b3ad8405-92c8-d7a6-4142-e3e3ca4e86d7') && (type === 'membership')){
  //     complimentaryPromoUserMap[userId] = true;
  //   }
  // });
  // const filteredMembers = users && users.filter((v,k)=>{
  //   // console.log('filteredMember v: ', v);
  //   // console.log('filteredMember k: ', k);
  //   const membershipEnds = v.get('autoMembershipEnds')||null;
  //   const isThisMonth = membershipEnds && moment(getTheDate(membershipEnds)).isSameOrAfter(moment().add(1,'month'));
  //   const totalPayments = v.get('totalPayments')||null;
  //   const promoJan2020 = v.get('promoJan2020')||null;
    
  //   if (promoJan2020){
  //     return true;
  //   }
  //   else{
  //     return complimentaryPromoUserMap && complimentaryPromoUserMap[k] ? false : true;
  //   }
  // });

  const filteredMembers = users && users.filter((v,k)=>{
    const complimentaryPromo = v.get('complimentaryPromo')||null;
    const isComplimentaryPackage = v.get('packageId')? (v.get('packageId')==='yKLfNYOPzXHoAiknAT24')? true: false:false;
    const isComplimentaryPromoPkg = v.get('packageId')? (v.get('packageId')==='L6sJtsKG68LpEUH3QeD4')? true: false:false;

    // console.log('filteredMembered K: ', k);
    if (!complimentaryPromo || !isComplimentaryPackage || !isComplimentaryPromoPkg){
      return true;
    }
  });

  return filteredMembers || null;
}
const getFreezeMembersItems = createSelector(
  [ getActiveMembers, getFreezePayments, getPackages, getSearchTextState, getFilteredStaffId ],
  (activeMembers, freezePayments, packages, searchText, filteredStaffId) => {
    // freezePayments && freezePayments.forEach(payment=>{
    //   console.log('frpayment: ', payment);
    // });
    const filteredFreezeMebers = filterByFreezePayments(freezePayments, activeMembers, true);
    return filteredItemsForUsers(filteredFreezeMebers, searchText, packages, null, null, filteredStaffId, '#01BAEF');
  }
);

export const makeGetFreezeMemberItems = () => {
  return getFreezeMembersItems;
}

// const klccPackage = () => {

//     return [
//     'q7SXXNKv83MkkJs8Ql0n', // 12m all clubs
//     'TJ7Fiqgrt6EHUhR5Sb2q', // monthly all club
//     'eRMTW6cQen6mcTJgKEvy', // CP310
//     '89THMCx0BybpSVJ1J8oz', // 6M all clubs
//     'BKcaoWGrWKYihS40MpGd', // CP290
//     'aTHIgscCxbwjDD8flTi3', // 3M all clubs
//     'LNGWNSdm6kf4rz1ihj0i', // 3M Jan2020 promo all clubs
//     'YsOxVJGLRXrHDgNTBach', // 3M August 2020 (all access)
//     'uQO2UsaRiqXtzPKjTSIS', // 3M UNO
//     'kh513XOaG7eLX4z9G0Ft', // 3M September 2020 (All Access) Promo
//     ];
  
// };

const klccPackage = 
  [
  'q7SXXNKv83MkkJs8Ql0n', // 12m all clubs
  'TJ7Fiqgrt6EHUhR5Sb2q', // monthly all club
  'eRMTW6cQen6mcTJgKEvy', // CP310
  '89THMCx0BybpSVJ1J8oz', // 6M all clubs
  'BKcaoWGrWKYihS40MpGd', // CP290
  'aTHIgscCxbwjDD8flTi3', // 3M all clubs
  'LNGWNSdm6kf4rz1ihj0i', // 3M Jan2020 promo all clubs
  'YsOxVJGLRXrHDgNTBach', // 3M August 2020 (all access)
  'uQO2UsaRiqXtzPKjTSIS', // 3M UNO
  'kh513XOaG7eLX4z9G0Ft', // 3M September 2020 (All Access) Promo
  'AdXIzAK4qTgVNAK2t9be', // 12 M renewal
  'ciha9165NwgeF7wQz7GP', //flx
  '8yHoIQAkBd7NZ75y0OZe', // 12 months prepaid membership 2022 (All Access)
  'fh2P4R9YYtqDaU2yKRiX', // 12 months contract pay monthly 2022 (All Access)
  'hhForDFr6YIbSQNgkUcF', // Angpau All Access 2022
  'TlhkyieN2eB8Gc6f6rTX', // monthly due all access
  'UQHWN9nsDAZiuiBlcsP7', // FLX 2022 all access
  'jnB6jQf8aD8DVUVmrZII', // euphoria complimentary
  ''
];

// const klccPackage = getPackages && Object.entries(getPackages).forEach(([key, data])=>{
//   var klccpkgArray = [];
//   if (data && data.base && data.base === 'KLCC'){
    
//     klccpkgArray.push(key);
//   }
//   console.log('klccpkgArray: ', klccpkgArray);
//   return klccpkgArray;
// }); 
// getPackages.filter((data, index)=>{
//   const isKLCC = false;
//   console.log('klccdata: ', data);
//   if (isKLCC){
//     return true;
//   }
// });

const TTDIPackage = 
  [
  'vf2jCUOEeDDiIQ0S42BJ', // monthly
  'WmcQo1XVXehGaxhSNCKa', // yearly
  'VWEHvdhNVW0zL8ZAeXJX', // 12M term renewal
  'wpUO5vxWmme7KITqSITo', // CP230
  'w12J3n9Qs6LTViI6HaEY', // 3M term
  'ZEDcEHZp3fKeQOkDxCH8', // CP180
  'yQFACCzpS4DKcDyYftBx', // 3M term membership
  'DjeVJskpeZDdEGlcUlB1', // 6M term renewal
  'dz8SAwq99GWdEvHCKST2', // CP210
  'duz1AkLuin8nOUd7r66L', // 6M
  'k7As68CqGsFbKZh1Imo4', // 3M promo single club
  'AHgEEavKwpJoGTMOzUdX', // 3M August 2020 (single access)
  'hUZjGJR77bP30I3fjvwD', //3M Mid September 2020 (single access)
  'D5WcUdxQNbUmltbE3fWk', //flx singles
  '2G3bVcJ3F8xXsMUhwOnJ', // 12 months prepaid membership 2022 (Single Access)
  'GjzBC8zwfUTDuefjMDQi', // Angpau single 2022
  'YeTJrScRWvVzC1gApYZc', // 12 months contract pay monthly 2022 (Single Access)
  'WO1OJGAS3h0KpcNsHAmB', // monthly due single access
  'nVBuI66WGttWrwL4mDuy', // flx single access
];

const filterByFreezePaymentsKLCC = (freezePayments, members, isFrozen = false) => {
  var freezeUserMap = {};
  freezePayments && freezePayments.toKeyedSeq().forEach((v,k)=>{
    const userId = v.get('userId') || null;
    const freezeFor = v.get('freezeFor') || null;
    const freezeStartMoment = (freezeFor && moment(getTheDate(freezeFor))) || null;
    const freezeEndMoment = (freezeStartMoment && moment(getTheDate(freezeFor)).clone().add(1, 'months')) || null;
    // if(userId && freezeFor && moment().isBetween(freezeStartMoment, freezeEndMoment, 'day', '[)')){
    if (userId && freezeFor && moment().isSameOrBefore(freezeEndMoment)){
      freezeUserMap[userId] = true;
    }
  });
  const filteredMembers = members && members.filter((v,k)=>{
    // console.log(v, k);
    const packageId = v.get('packageId')||null;
    if (klccPackage.includes(packageId)){
      return freezeUserMap && freezeUserMap[k] ? isFrozen : !isFrozen
    }
    else{
      return false;
    }
  });
  return filteredMembers || null;
}

const filterByFreezePaymentsTTDI = (freezePayments, members, isFrozen = false) => {
  var freezeUserMap = {};
  freezePayments && freezePayments.toKeyedSeq().forEach((v,k)=>{
    const userId = v.get('userId') || null;
    const freezeFor = v.get('freezeFor') || null;
    const freezeStartMoment = (freezeFor && moment(getTheDate(freezeFor))) || null;
    const freezeEndMoment = (freezeStartMoment && moment(getTheDate(freezeFor)).clone().add(1, 'months')) || null;
    // if(userId && freezeFor && moment().isBetween(freezeStartMoment, freezeEndMoment, 'day', '[)')){
      
    if (userId && freezeFor && moment().isSameOrBefore(freezeEndMoment)){
      freezeUserMap[userId] = true;
      // if (userId === 'YHoTi64lcco83At6H9wz'){
      //   console.log('filterByFreezePaymentsTTDIUserId: ', userId)
      // }
    }
  });
  const filteredMembers = members && members.filter((v,k)=>{
    // console.log(v, k);
    const packageId = v.get('packageId')||null;
    const userId = v.get('userId')||null;
    if (TTDIPackage.includes(packageId)){
      return freezeUserMap && freezeUserMap[k] ? isFrozen : !isFrozen
    }
    else{
      return false;
    }
  });
  return filteredMembers || null;
}

const filterByFreezePayments = (freezePayments, members, isFrozen = false) => {
  var freezeUserMap = {};
  var freezeCount = 0;
  freezePayments && freezePayments.toKeyedSeq().forEach((v,k)=>{
   
    const userId = v.get('userId') || null;
    const freezeFor = v.get('freezeFor') || null;
    const freezeStartMoment = (freezeFor && moment(getTheDate(freezeFor))) || null;
    const freezeEndMoment = (freezeStartMoment && moment(getTheDate(freezeFor)).clone().add(1, 'months')) || null;
    // if(userId && freezeFor && moment().isBetween(freezeStartMoment, freezeEndMoment, 'day', '[)')){
    if (userId && moment(getTheDate(freezeFor)).isAfter(moment().subtract(1, 'months'))){
      freezeUserMap[userId] = true;
      freezeCount++
    }
  });
  // console.log('freezeCount: ', freezeCount);
  const filteredMembers = members && members.filter((v,k)=>{
    // console.log(v, k);
    const packageId = v.get('packageId')||null;
    if (packageId 
      && (TTDIPackage.includes(packageId) || klccPackage.includes(packageId))
      ){
      return freezeUserMap && freezeUserMap[k] ? isFrozen : !isFrozen
    }
    // return true;
  });
  return filteredMembers || null;
}

const getExpiredMembersItems = createSelector(
  [ getExpiredMembers, getPackages, getSearchTextState, getStaff, getFilteredStaffId ],
  (expiredMembers, packages, searchText, staff, filteredStaffId) => {
    const groupedExpiredMembers = expiredMembers && expiredMembers.groupBy(x=>{
      return x.get('mcId') || null
    }).sort((a,b)=>{
      const amcId = a.first().get('mcId') || null;
      const bmcId = b.first().get('mcId') || null;
      const amc = (staff && staff.get(amcId)) || null;
      const bmc = (staff && staff.get(bmcId)) || null;
      const nameA = amc && amc.get('name');
      const nameB = bmc && bmc.get('name');

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      if (nameA === nameB) {
        return 0;
      }
      return 0
    });
    var filteredExpiredMemberItems = [];
    groupedExpiredMembers && groupedExpiredMembers.forEach((v,k)=>{
      // console.log(k, v);
      const batch = filteredItemsForUsers(v, searchText, packages, staff, k || null, filteredStaffId);
      // const batch = filteredItemsForUsers(v, searchText, packages, staff, k || null, filteredStaffId, '#F71A38');
      if(batch.length>0){
        filteredExpiredMemberItems = filteredExpiredMemberItems.concat(batch);
      }
    });
    return filteredExpiredMemberItems
  }
);

export const makeGetExpiredMemberItems = () => {
  return getExpiredMembersItems;
}

const getExpiredMembersItemsKLCC = createSelector(
  [ getExpiredMembers, getPackages, getSearchTextState, getStaff, getFilteredStaffId ],
  (expiredMembers, packages, searchText, staff, filteredStaffId) => {
    const expiredKLCC = expiredMembers && expiredMembers.filter((x,y)=>{
      const packageId = x.get('packageId')||null;
      // console.log('packageId: ', packageId);
      if (klccPackage.includes(packageId)) return true;
      else return false
    });
    const groupedExpiredMembers = expiredKLCC && expiredKLCC.groupBy(x=>{
      return x.get('mcId') || null
    }).sort((a,b)=>{
      const amcId = a.first().get('mcId') || null;
      const bmcId = b.first().get('mcId') || null;
      const amc = (staff && staff.get(amcId)) || null;
      const bmc = (staff && staff.get(bmcId)) || null;
      const nameA = amc && amc.get('name');
      const nameB = bmc && bmc.get('name');
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      if (nameA === nameB) {
        return 0;
      }
      return 0
    });
    var filteredExpiredMemberItems = [];
    groupedExpiredMembers && groupedExpiredMembers.forEach((v,k)=>{
      // console.log(k, v);
      const batch = filteredItemsForUsers(v, searchText, packages, staff, k || null, filteredStaffId);
      // const batch = filteredItemsForUsers(v, searchText, packages, staff, k || null, filteredStaffId, '#F71A38');
      if(batch.length>0){
        filteredExpiredMemberItems = filteredExpiredMemberItems.concat(batch);
      }
    });
    return filteredExpiredMemberItems
  }
);

export const makeGetExpiredMemberItemsKLCC = () => {
  return getExpiredMembersItemsKLCC;
}

const getExpiredMembersItemsTTDI = createSelector(
  [ getExpiredMembers, getPackages, getSearchTextState, getStaff, getFilteredStaffId ],
  (expiredMembers, packages, searchText, staff, filteredStaffId) => {
    const expiredTTDI = expiredMembers && expiredMembers.filter((x,y)=>{
      const packageId = x.get('packageId')||null;
      // console.log('packageId: ', packageId);
      if (TTDIPackage.includes(packageId)) return true;
      else return false
    });
    const groupedExpiredMembers = expiredTTDI && expiredTTDI.groupBy(x=>{
      return x.get('mcId') || null
    }).sort((a,b)=>{
      const amcId = a.first().get('mcId') || null;
      const bmcId = b.first().get('mcId') || null;
      const amc = (staff && staff.get(amcId)) || null;
      const bmc = (staff && staff.get(bmcId)) || null;
      const nameA = amc && amc.get('name');
      const nameB = bmc && bmc.get('name');

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      if (nameA === nameB) {
        return 0;
      }
      return 0
    });
    var filteredExpiredMemberItems = [];
    groupedExpiredMembers && groupedExpiredMembers.forEach((v,k)=>{
      // console.log(k, v);
      const batch = filteredItemsForUsers(v, searchText, packages, staff, k || null, filteredStaffId);
      // const batch = filteredItemsForUsers(v, searchText, packages, staff, k || null, filteredStaffId, '#F71A38');
      if(batch.length>0){
        filteredExpiredMemberItems = filteredExpiredMemberItems.concat(batch);
      }
    });
    return filteredExpiredMemberItems
  }
);

export const makeGetExpiredMemberItemsTTDI = () => {
  return getExpiredMembersItemsTTDI;
}

const getNeedsTrainerItems = createSelector(
  [ getUsers, getPackages, getSearchTextState, getFilteredStaffId ],
  (users, packages, searchText, filteredStaffId) => {
    if (users && users.size>0){
    const needsTrainer = users.filter(x=>{
      const packageId = x.get('packageId') || null;
      const trainerId = x.get('trainerId') || null;
      if(packageId && packageId !== 'yKLfNYOPzXHoAiknAT24'){
        return trainerId ? false : true;
      }else{
        return false;
      }

    });
    const sortedNeedsTrainer = sortBy(needsTrainer, 'joinDate');
    return filteredItemsForUsers(sortedNeedsTrainer, searchText, packages, null, null, filteredStaffId);
    }
  }
);

export const makeGetNeedsTrainerItems = () => {
  return getNeedsTrainerItems;
}

const getNeedsInductionItems = createSelector(
  [ getUsers, getPackages, getSearchTextState, getStaff, getFilteredStaffId ],
  (users, packages, searchText, staff, filteredStaffId) => {
    if (users && users.size>0){
    const needsInduction = users.filter(x=>{
      const packageId = x.get('packageId') || null;
      const inductionDone = x.get('inductionDone') || null;
      // const isCancelled = x.get('cancellationDate') || x.get('cancellationReason');
      const isCancelled = x.get('cancellationDate') && moment(getTheDate(x.get('cancellationDate'))).isSameOrBefore(moment(), 'day');
      
      if(packageId && !isCancelled && packageId !== 'yKLfNYOPzXHoAiknAT24'){
        return inductionDone ? false : true;
      }else{
        return false;
      }

    });
    const groupedNeedsInduction = sortBy(needsInduction, 'joinDate').groupBy(x=>{
      return x.get('trainerId') || null
    }).sort((a,b)=>{
      const amcId = a.first().get('trainerId') || null;
      const bmcId = b.first().get('trainerId') || null;
      const amc = (staff && staff.get(amcId)) || null;
      const bmc = (staff && staff.get(bmcId)) || null;
      const nameA = amc && amc.get('name');
      const nameB = bmc && bmc.get('name');

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      if (nameA === nameB) {
        return 0;
      }
      return 0
    });

    var filteredNeedsInductionItems = [];
    groupedNeedsInduction && groupedNeedsInduction.forEach((v,k)=>{
      // console.log(k, v);
      const batch = filteredItemsForUsers(v, searchText, packages, staff, k || null, filteredStaffId);
      if(batch.length>0){
        filteredNeedsInductionItems = filteredNeedsInductionItems.concat(batch);
      }
    });
    return filteredNeedsInductionItems;
    }
  }
);

export const makeGetNeedsInductionItems = () => {
  return getNeedsInductionItems;
}

const getNeedsMembershipCardItems = createSelector(
  [ getUsers, getPackages, getSearchTextState, getFilteredStaffId ],
  (users, packages, searchText, filteredStaffId) => {
    // console.log('theUser: ', users);
    if (users && users.size>0){
    const needsMembershipCard = users.filter(x=>{
      const packageId = x.get('packageId') || null;
      const gantnerCardNumber = x.get('gantnerCardNumber') || null;
      // const isCancelled = x.get('cancellationDate') || x.get('cancellationReason');
      const isCancelled = x.get('cancellationDate') && moment(getTheDate(x.get('cancellationDate'))).isSameOrBefore(moment(), 'day');
      
      if(packageId && !isCancelled){
        return gantnerCardNumber ? false : true;
      }else{
        return false;
      }

    });
    const sortedNeedsMembershipCard = sortBy(needsMembershipCard, 'joinDate');
    return filteredItemsForUsers(sortedNeedsMembershipCard, searchText, packages, null, null, filteredStaffId);
    }
  }
);

export const makeGetNeedsMembershipCardItems = () => {
  return getNeedsMembershipCardItems;
}

const getCancelledMembersItems = createSelector(
  [ getCancelledMembers, getPackages, getSearchTextState, getFilteredStaffId ],
  (cancelledMembers, packages, searchText, filteredStaffId) => {
    return filteredItemsForUsers(cancelledMembers, searchText, packages, null, null, filteredStaffId);
  }
);

export const makeGetCancelledMemberItems = () => {
  return getCancelledMembersItems;
}

const getProspectItems = createSelector(
  [ getProspects, getPackages, getSearchTextState ],
  (prospects, packages, searchText) => { 
    return filteredItemsForUsers(prospects, searchText, packages);
  }
);

export const makeGetProspectItems = () => {
  return getProspectItems;
}

const getTrainerItems = createSelector(
  [ getTrainers, getPackages, getSearchTextState, getFilteredStaffId ],
  (trainers, packages, searchText, filteredStaffId) => {
    return filteredItemsForUsers(trainers, searchText, packages, null, null, filteredStaffId);
  }
);

export const makeGetTrainerItems = () => {
  return getTrainerItems;
}

const getOpsItems = createSelector(
  [ getOps, getPackages, getSearchTextState ],
  (ops, packages, searchText) => {
    return filteredItemsForUsers(ops, searchText, packages);
  }
);

export const makeGetStaffItems = () => {
  return getStaffItems;
}

const getStaffItems = createSelector(
  [ getStaffs, getPackages, getSearchTextState ],
  (staffs, packages, searchText) => {
    // console.log('getStaffs: ', staffs);
    return filteredItemsForUsers(staffs, searchText, packages);
  }
);

export const makeGetOpsItems = () => {
  return getOpsItems;
}

const getAdminItems = createSelector(
  [ getAdmins, getPackages, getSearchTextState ],
  (admins, packages, searchText) => {
    return filteredItemsForUsers(admins, searchText, packages);
  }
);

export const makeGetAdminItems = () => {
  return getAdminItems;
}

const filteredItemsForUsers = (users, searchText, packages, staff, staffId, filteredStaffId, backgroundColor = null, rooms = null) => {
  if(!users){
    return null;
  }
  var userItems = [];
  users.toKeyedSeq().forEach((v,k)=>{
    if(userMatchesSearchText(v, k, searchText, filteredStaffId)){
      userItems.push(itemForMember(v, k, packages, staff, staffId, backgroundColor, rooms));
    }
  });
  return userItems;
}

const userMatchesSearchText = (v, k, searchText, filteredStaffId) => {
  if((searchText && searchText.length > 2) || filteredStaffId){
    const name = v.get('name') || null;
    const email = v.get('email') || null;
    const nric = v.get('nric') || null;
    const passport = v.get('passport') || null;
    const membershipId = nric || passport;
    const remarks = v.get('remarks') || null;
    const trainerId = v.get('trainerId') || null;
    const mcId = v.get('mcId') || null;
    const teamLeaderId = v.get('teamLeaderId') || null;
    // console.log(filteredStaffId, trainerId, mcId, (filteredStaffId && ((trainerId && trainerId !== filteredStaffId) || (mcId && mcId !== filteredStaffId))));
    if((!name || name.toLowerCase().indexOf(searchText) === -1) &&
      (!email || email.toLowerCase().indexOf(searchText) === -1) &&
      (!remarks || remarks.toLowerCase().indexOf(searchText) === -1) &&
      (!membershipId || `${membershipId}`.toLowerCase().indexOf(searchText) === -1)
    ){
        return false;
      }else{
        return filteredStaffId ? ((trainerId && trainerId === filteredStaffId) || (mcId && mcId === filteredStaffId) || (teamLeaderId && teamLeaderId === filteredStaffId))  : true;
      }
  }
  return true;
}

const itemForMember = (member, id, packages, staff = null, staffId = null, backgroundColor=null, rooms = null) =>{
  const primaryText = member.get('name') || 'No Name';

  const packageId = member.get('packageId') || null;
  const packageData = ((packageId && packages) && packages.get(packageId)) || null;
  const packageName = (packageData && packageData.get('name')) || null;
  const roomId = (member.get('currentroomId')) || null;


  // const roomData = rooms && rooms.get(roomId);
  // const roomNumber = roomData && roomData.roomNumber;

  var secondaryText = packageName;
  if(member && member.get('tier')){
    secondaryText = `Tier ${member.get('tier')}`;
  }
  if(staff ||staffId){
    const staffData = staff.get(staffId) || null;
    const staffName = (staffData && staffData.get('name')) || null;
    if(staffName){
      secondaryText = `${secondaryText} (${staffName})`
    }

    // disable on 18/8/2020
    // const isOps = (staffData && staffData.get('roles').toJS().mc) || false;
    // if(isOps){
    //   const membershipEnds = getTheDate(member.get('autoMembershipEnds')) || null;
    //   if(membershipEnds){
    //     secondaryText = `${secondaryText} (Billing : ${moment(membershipEnds).format('DD MMM YY')})`
    //   }
    // }else{
    //   // const membershipEnds = member.get('joinDate') || null;
    //   const joinDate = getTheDate(member.get('joinDate')) || null;
    //   if(joinDate){
    //     secondaryText = `${secondaryText} (Join : ${moment(joinDate).format('DD MMM YY')})`
    //   }
    // }

  }

  const avatarImage = (member.get('image') && member.get('image').replace(encodeURIComponent('images/'), encodeURIComponent('images/thumb_64_'))) || null;
  const avatarName = primaryText && typeof primaryText === 'string' && primaryText.trim().length > 0 ? primaryText.trim().charAt(0) : 'X';

  if(!backgroundColor){
    var bgroundColor = '#fff';
    const membershipEnds =  member.get('autoMembershipEnds')
    if(packageId){
      if(member.get('cancellationDate') && moment(getTheDate(member.get('cancellationDate'))).isSameOrBefore(moment(), 'day')){
        bgroundColor = '#ccc';
      }else if(membershipEnds && moment(getTheDate(membershipEnds)).isSameOrBefore(moment(), 'day')){
        bgroundColor = '#F71A38';
      }else if(membershipEnds && moment(getTheDate(membershipEnds)).subtract(3, 'days').isSameOrBefore(moment(), 'day')){
        bgroundColor = '#FF751B';
      }
    }else{
      // const roles = member.get('roles') || null;
      const isStaff = member.get('isStaff') || null;
      // if(!roles || !(roles.get('admin') || roles.get('trainer') || roles.get('mc')) ){
      if (!isStaff){  
        bgroundColor = '#fde298';
      }
    }
    backgroundColor = bgroundColor;
  }
  return {id, primaryText, secondaryText, avatarImage, avatarName, backgroundColor};
}

const itemForInGym = (member, id, createdAt) =>{
  const primaryText = member.get('name') || 'No Name';
  const secondaryText = createdAt;

  const avatarImage = (member.get('image') && member.get('image').replace(encodeURIComponent('images/'), encodeURIComponent('images/thumb_64_'))) || null;
  const avatarName = primaryText && typeof primaryText === 'string' && primaryText.trim().length > 0 ? primaryText.trim().charAt(0) : 'X';

  var backgroundColor = '#fff';
  const membershipEnds =  member.get('autoMembershipEnds')? getTheDate(member.get('autoMembershipEnds')):null;
  const packageId = member.get('packageId') || null;
  if(packageId){
    if(member.get('cancellationDate') && moment(getTheDate(member.get('cancellationDate'))).isSameOrBefore(moment(), 'day')){
      backgroundColor = '#ccc';
    }else if(membershipEnds && moment(membershipEnds).isSameOrBefore(moment(), 'day')){
      backgroundColor = '#F71A38';
    }else if(membershipEnds && moment(membershipEnds).subtract(3, 'days').isSameOrBefore(moment(), 'day')){
      backgroundColor = '#FF751B';
    }
  }else{
    const roles = member.get('roles') || null;
    if(!roles || !(roles.get('admin') || roles.get('trainer') || roles.get('mc')) ){
      backgroundColor = '#fde298';
    }
  }

  return {id, primaryText, secondaryText, avatarImage, avatarName, backgroundColor};
}

const getSelectedUserId = (state, props) => {
  return props.userId || (props && props.match && props.match.params && props.match.params.userId) || null;
}

const getSelectedUser = createSelector(
  [ getSelectedUserId, getUsers ],
  (selectedUserId, users) => {
    if(!selectedUserId || !users){
      return null;
    }
    const selectedUser = users.get(selectedUserId);
    return selectedUser || null;
  }
);

export const makeGetSelectedUser = () => {
  return getSelectedUser;
}

const getSelectedUserOrLastCheckedInId = createSelector(
  [getSelectedUserId, getGantnerLogs],
  (selectedUserId, gantnerLogs) =>{

    if(!getSelectedUserId && !gantnerLogs){
      return null;
    }

    if(selectedUserId){
      return selectedUserId;
    }
    const inGym = inGymArray(gantnerLogs);
    const lastCheckedInUserId = inGym && inGym.length && inGym[0][0];

    return lastCheckedInUserId || null
  }
)

export const makeGetSelectedUserOrLastCheckedInId = () =>{
  return getSelectedUserOrLastCheckedInId;
}

const getSelectedUserOrLastCheckedIn = createSelector(
  [getSelectedUserId, getSelectedUser, getUsers, getGantnerLogs, getFreezePayments],
  (selectedUserId, selectedUser, users, gantnerLogs, freezePayments) =>{

    if(!selectedUser && !gantnerLogs && !users){
      return null;
    }

    if(!selectedUser){
      const inGym = inGymArray(gantnerLogs);
      selectedUserId = inGym && inGym.length && inGym[0][0];
      selectedUser = selectedUserId && users.get(selectedUserId);
    }

    freezePayments && freezePayments.some((v,k)=>{
      const userId = v.get('userId') || null;
      const freezeFor = getTheDate(v.get('freezeFor')) || null;
      const freezeStartMoment = (freezeFor && moment(freezeFor)) || null;
      const freezeEndMoment = (freezeStartMoment && moment(freezeFor).clone().add(1, 'months')) || null;

      // if(userId && userId === selectedUserId && freezeFor && moment().isBetween(freezeStartMoment, freezeEndMoment, 'day', '[)')){
      if(userId && userId === selectedUserId && freezeFor && moment().isBefore(freezeEndMoment)){ 
        selectedUser = selectedUser.set('isFrozen', true);
        return true;
      }
      else{
        return false;
      }
    });

    return selectedUser || null;
  }
)

export const makeGetSelectedUserOrLastCheckedIn = () =>{
  return getSelectedUserOrLastCheckedIn;
}

const getCurrentUser = createSelector(
  [ getCurrentUserData ],
  (currentUserData) => {
    console.log('currentUserData: ', currentUserData);
    return currentUserData || null;
  }
);

export const makeGetCurrentUser = () => {
  return getCurrentUser;
}

const getGantnerLogsByUserId = (state, props) => {
  return state.state && state.state.hasIn(['gantnerLogs', 'gantnerLogsByUserId']) ? state.state.getIn(['gantnerLogs', 'gantnerLogsByUserId']) : null
}

const getSelectedUserGantnerLogs = createSelector(
  [ getSelectedUserId, getGantnerLogsByUserId ],
  (selectedUserId, gantnerLogsByUserId) => {
    if(!selectedUserId || !gantnerLogsByUserId){
      return null;
    }
    return gantnerLogsByUserId.get(selectedUserId) || null;
  }
);

export const makeGetSelectedUserGantnerLogs = () =>{
  return getSelectedUserGantnerLogs;
}

const getCurrentUserGantnerLogs = createSelector(
  [ getCurrentUserId, getGantnerLogsByUserId ],
  (CurrentUserId, gantnerLogsByUserId) => {
    if(!CurrentUserId || !gantnerLogsByUserId){
      return null;
    }
    return gantnerLogsByUserId.get(CurrentUserId) || null;
  }
);

export const makeGetCurrentUserGantnerLogs = () =>{
  return getCurrentUserGantnerLogs;
}

const getCurrentUserPayments = createSelector(
  [ getCurrentUserId, getPaymentsByUserId ],
  (CurrentUserId, paymentByUserId) => {
    // console.log('paymentByUserId: ', paymentByUserId);
    // console.log('CurrentUserId: ', CurrentUserId);
    if(!CurrentUserId || !paymentByUserId){
      return null;
    }
    return paymentByUserId.get(CurrentUserId) || null;
    // return paymentByUserId || null;
  }
);

export const makeGetCurrentUserPayments = () =>{
  return getCurrentUserPayments;
}

const getInvoicesByUserId = (state, props) => {
  return state.state && state.state.hasIn(['invoices', 'invoicesByUserId']) ? state.state.getIn(['invoices', 'invoicesByUserId']) : null
}

const getSelectedUserInvoices = createSelector(
  [ getSelectedUserId, getInvoicesByUserId ],
  (selectedUserId, invoicesByUserId) => {
    if(!selectedUserId || !invoicesByUserId){
      return null;
    }

    return invoicesByUserId.get(selectedUserId) || null;
  }
);

export const makeGetSelectedUserInvoices = () =>{
  return getSelectedUserInvoices;
}

const getSelectedUserReferredByUser = createSelector(
  [ getSelectedUser, getUsers ],
  (selectedUser, users) => {
    if(!selectedUser || !selectedUser.get('referredByUserId') || !users){
      return null;
    }

    return users.get(selectedUser.get('referredByUserId')) || null;
  }
);

export const makeGetSelectedUserReferredByUser = () =>{
  return getSelectedUserReferredByUser;
}

const getSelectedUserReferredToUser = createSelector(
  [ getSelectedUser, getUsers ],
  (selectedUser, users) => {
    var selectedUserReferredToUser = null;
    if(!selectedUser || !selectedUser.get('referredByUserId') || !users){
      return null; //null, no referral
    }
    else{
      selectedUserReferredToUser = users.get(selectedUser.get('referredByUserId')) || null;

    }
  }
);

export const makeGetSelectedUserReferredToUser = () =>{
  return getSelectedUserReferredToUser;
}

const getSelectedUserPayments = createSelector(
  [ getSelectedUserId, getPaymentsByUserId ],
  (selectedUserId, paymentsByUserId) => {
    // console.log('paymentsByUserId: ', paymentsByUserId);
    // console.log('selectedUserId: ', selectedUserId);
    if(!selectedUserId || !paymentsByUserId){
      return null;
    }
    const selectedUserPayments = paymentsByUserId.get(selectedUserId) ?
    paymentsByUserId.get(selectedUserId)
    .filter(x => x.get('status') !== 'FAILED' && x.get('status') !== 'VOIDED' && x.get('status') !== 'REFUNDED').sort((a, b) => {
      
      // const nameA = typeof a.get('createdAt').getMonth === 'function' ? a.get('createdAt') : moment(a.get('createdAt')).toDate();
      // const nameB = typeof b.get('createdAt').getMonth === 'function' ? b.get('createdAt') : moment(b.get('createdAt')).toDate();
      const nameA = getTheDate(a.get('createdAt'));
      const nameB = getTheDate(b.get('createdAt'));

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }

      const sourceA = a.get('source');
      const sourceB = b.get('source')
      if(sourceA === 'join'){
        return -1;
      }
      if(sourceB === 'join'){
        return 1;
      }
      return 0;

    }) : null;
    return selectedUserPayments || null;
  }
);

export const makeGetSelectedUserPayments = () => {
  return getSelectedUserPayments;
}

const getSelectedUserFreezes = createSelector(
  [getSelectedUserPayments],
  (selectedUserPayments) => {
    // selectedUserPayments && console.log(selectedUserPayments.filter(x=>x.get('source')=== 'freeze').toJS());
    // return selectedUserPayments ? selectedUserPayments.filter(x=>x.get('source')=== 'freeze') : null;
    var sortedFreezeArray = [];
    if (selectedUserPayments){
      sortedFreezeArray = selectedUserPayments.filter(x=>x.get('source')=== 'freeze');
      return sortedFreezeArray.sort((a,b)=>{
        const dateA = getTheDate(a.get('freezeFor'));
        const dateB = getTheDate(b.get('freezeFor'));
        if(moment(dateA).isAfter(dateB)){
          return 1
        }
        if(moment(dateB).isAfter(dateA)){
          return -1;
        }
        return 0;
      });
    }
    else{
      return null;
    }
  }
);

export const makeGetSelectedUserFreeze = () => {
  return getSelectedUserFreezes;
}

function createPrimaryText (date1, date2, index){
  // return (date1 && date2)? `${index} : ${date1} - ${date2}`: 'Date not found';
  return (date1 && date2)? `${date1} - ${date2}`: 'Date not found';
}

function createSecondaryText (paymentSource, theDate, paymentType, cardSummary, cardExpired, theText, thePrice, referredUserTxt, freezeCount, freezeTypeText = null){
  var secondaryText = 'Unpaid';
  var theTxt = theText? theText:'';
  const dateFormat = `${moment(theDate).format('D MMM YYYY')}`;
  const paymentText = paymentType? ` ${paymentType}`:'';
  const cardSummaryText = cardSummary? `${cardSummary}`:'';
  const cardExpiredText = cardExpired? ` Expire on ${cardExpired}`:'';
  const cardText = cardSummary? ` - ${cardSummaryText}`:``;

  // console.log('freezeTypeText: ', freezeTypeText);
  // console.log('referredUserTxt: ', referredUserTxt);
  console.log('paymentSource: ', paymentSource);
  if (paymentSource){
    secondaryText = `${paymentSource} ${thePrice} Paid on ${dateFormat} ${theTxt}`;
  }
  else{
    secondaryText = `Unpaid`;
  }
  return secondaryText;
}

const getSelectedUserPaymentItems = createSelector(
  [getSelectedUser, getSelectedUserPayments, getSelectedUserFreezes, getUsers],
  (selectedUser, selectedUserPayments, selectedUserFreezes, users) => {
    var combinedItems = [];
    // console.log('selectedUser: ', selectedUser)
    if(!selectedUser){
      return null;
    }

    const userStartDate = selectedUser.get('autoMembershipStarts') ? selectedUser.get('autoMembershipStarts') : selectedUser.get('membershipStarts');
    const startMoment = moment(getTheDate(userStartDate));

    // console.log('userStartDate: ', userStartDate);
    // initial
    var addMonths = 0;
    var addYears = 0;
    var membershipHistoryList = [];
    var combinedData = [];
    var userFreezes = [];
    var userFreezeTerminated = []; // for the terminated package (user whos terminated and rejoin)
    var userFreeAccess = [];
    var combinedVendMth = [];
    var combinedVendYear = [];
    var freezeCountPerYear = 1;
   
    var paymentSource;

    var primaryText =`Not Started`;
    var secondaryText = `Unpaid`;
    var action = () => {
      // console.log('nothing');
    }

    if (userStartDate && selectedUserPayments){
      
      selectedUserPayments.toKeyedSeq().forEach((v,k)=>{
        const paymentCreatedDate = getTheDate(v.get('createdAt'));
        const paymentSource = v.get('source');
        const paymentType = v.get('paymentType');
        const cardSummary = v.get('cardSummary');
        const cardExpired = v.get('cardExpiryDate');
        const paymentStatus = v.get('status')? v.get('status'):null;
        const referredUserId = v.get('referredUserId')? v.get('referredUserId'):null;
        const referredUser = referredUserId? (users.get(referredUserId)? users.get(referredUserId):null) : null;
        const referredUserName = (referredUser && referredUser.get('name')) || null;
        const type = v.get('type');
       
        // var price = v.get('totalPrice')? (typeof(v.get('totalPrice'))==="number")? v.get('totalPrice').toString():v.get('totalPrice'):null;
        var price = v.get('totalPrice')? 'RM '+v.get('totalPrice'):'RM 0';
        // console.log('price: ', price);
        var qty = v.get('quantity')? v.get('quantity'):1;

        // console.log('renewalTerm: ', v.get('renewalTerm'));
        if (paymentSource === 'freeze'){
          // console.log('freezeqty: ', qty);
          const freezeFor = getTheDate(v.get('freezeFor'));
          const freezeType = v.get('freezeType')||null;
          for (var a = 0; a<qty; a++){
            userFreezes.push({
              // date: (a>0)? moment(freezeFor):moment(freezeFor).add(a, 'months'),
              date:moment(freezeFor).add(a, 'months'),
              freezeType,
              // dateFormat: moment(freezeFor).add(a, 'months').format('YYYY-MM-DD'),
              // price:(freezeCountPerYear>=3)?'RM 50':'RM 0',
              // freezeCountPerYear: freezeCountPerYear,
              yearOfFreeze: moment(freezeFor).format('YYYY'),
              price, cardSummary, cardExpired
            });
            // if (cardSummary){
            //   userFreezes[a].cardSummary = `${cardSummary} ${cardExpired}`;
            // }
          }
          // console.log('userFreezes: ', userFreezes);
        }
        else if (paymentSource==='freezeTerminate'){
          const freezeFor = getTheDate(v.get('freezeFor'));
          userFreezeTerminated.push({date:moment(freezeFor), bgroundColor:'#ccc'});
        }
        else if ((paymentSource==='join') || (paymentSource==='luckyDraw') || (paymentSource==='promo')|| (paymentSource==='free')
        || (paymentSource==='complimentary') || (paymentSource==='jfr') || (paymentSource==='refer')){
          userFreeAccess.push({
            date:moment(paymentCreatedDate), 
            type:paymentSource,
            referredUser: referredUserName
          });
        }
        else if (paymentStatus === 'CLOSED'){
          // check if the payment is yearly or monthly via the renewalTerm.
          var renewalTerm = v.get('renewalTerm')? v.get('renewalTerm'):'month';
          if (renewalTerm && (renewalTerm === 'year' || renewalTerm === 'yearly')){
            combinedVendYear.push({
              date:paymentCreatedDate
            });
            for (var i=0; i<(qty*12); i++){
              combinedVendMth.push({
                date:moment(paymentCreatedDate).add(i, 'months'), 
                paymentDate:paymentCreatedDate,
                visitLeft: (qty*12) - i,
                visitMax: qty*12,
                type:paymentSource,
                price, paymentType, cardSummary, cardExpired
              });
              // if (cardSummary){
              //   combinedVendMth[i].cardSummary = `${cardSummary} ${cardExpired}`;
              // }
            }
          }
          else if (renewalTerm && (renewalTerm === 'month' || renewalTerm === 'monthly')){
            for (var j=0; j<qty; j++){
              combinedVendMth.push({
                date:moment(paymentCreatedDate),
                paymentDate:paymentCreatedDate,
                visitLeft: 1,
                visitMax: 1,
                type:paymentSource,
                price, paymentType,
                cardSummary, cardExpired
              });
              // if (cardSummary){
              //   combinedVendMth[j].cardSummary = `${cardSummary} ${cardExpired}`;
              // }
            }
          }
          else if (renewalTerm && (renewalTerm === 'biyearly' || renewalTerm === 'biyear')){
            for (var k=0; k<qty*6; k++){
              combinedVendMth.push({
                date:moment(paymentCreatedDate).add(k, 'months'), 
                paymentDate:paymentCreatedDate,
                visitLeft: qty*6 - k,
                visitMax: qty*6,
                type: paymentSource,
                price, paymentType,
                cardSummary, cardExpired
              });
              // if (cardSummary){
              //   combinedVendMth[k].cardSummary = `${cardSummary} ${cardExpired}`;
              // }
            }
          }
          else if (renewalTerm && renewalTerm === 'quarterly'){
            for (var l=0; l<qty*3; l++){
              combinedVendMth.push({
                date:moment(paymentCreatedDate).add(l, 'months'), 
                paymentDate:paymentCreatedDate,
                visitLeft: qty*3 - l,
                visitMax: qty*3,
                type: paymentSource,
                price, paymentType,
                cardSummary, cardExpired
              });
              // if (cardSummary){
              //   combinedVendMth[l].cardSummary = `${cardSummary} ${cardExpired}`;
              // }
            }
          }
          else if (renewalTerm && renewalTerm === '4monthly'){
            for (var m=0; m<qty*4; m++){
              combinedVendMth.push({
                date:moment(paymentCreatedDate).add(m, 'months'), 
                paymentDate:paymentCreatedDate,
                visitLeft: qty*4 - m,
                visitMax: qty*4,
                type: paymentSource,
                price, paymentType,
                cardSummary, cardExpired
              });
              // if (cardSummary){
              //   combinedVendMth[m].cardSummary = `${cardSummary} ${cardExpired}`;
              // }
            }
          }
          else{
            combinedVendMth.push({
              date:moment(paymentCreatedDate).add(m, 'months'), 
              paymentDate:paymentCreatedDate,
              type: paymentSource,
              price, paymentType
            });
          }
        }
      });
      
      // resort the array dates
      userFreezes.sort((a,b) => a.date.format('YYYYMMDD') - b.date.format('YYYYMMDD'));
      userFreezeTerminated.sort((a,b) => a.date.format('YYYYMMDD') - b.date.format('YYYYMMDD'));
      userFreezeTerminated.reverse();
      userFreeAccess.sort((a,b) => a.date.format('YYYYMMDD') - b.date.format('YYYYMMDD'));
      userFreeAccess.reverse();
      combinedVendMth.sort((a,b) => a.date.format('YYYYMMDD') - b.date.format('YYYYMMDD'));
      combinedVendMth.reverse();

      var freezeCountPerYear = 1;
      userFreezes.forEach((x,index)=>{
        if (index>=1 && (userFreezes[index].yearOfFreeze === userFreezes[index-1].yearOfFreeze)){
          freezeCountPerYear += 1;
        }
        else{
          freezeCountPerYear = 1;
        }
        // rewrite
        userFreezes[index].freezeCountPerYear = freezeCountPerYear;
        // userFreezes[index].price = (freezeCountPerYear>3)?'RM 50':'RM 0';
        // userFreezes[index].price = 'RM 0';
      });

      userFreezes.reverse();
      // store the freeze size first
      var freezeCount = userFreezes.length;

      // console.log('userFreezes: ', userFreezes)
      const initialMonthsDiff = Math.max(moment(new Date()).diff(startMoment, 'months'));
      var monthsDiff = initialMonthsDiff;
      var totalArrayLength = userFreezeTerminated.length + userFreezes.length + userFreeAccess.length + combinedVendMth.length;
      if (totalArrayLength>initialMonthsDiff){
        monthsDiff = totalArrayLength-1;
      }

      // default, if there is no payment detected
      for (var i=0; i<=monthsDiff; i++){
        const iterationStartMoment = startMoment.clone().add(addMonths, 'months').add(addYears, 'years');
        // primaryText = createPrimaryText(startMoment, moment(getTheDate(userStartDate)).clone().add(i, 'months'), i);
        primaryText = createPrimaryText(startMoment.format('D MMM'), startMoment.add(1, 'months').format('D MMM YYYY'), i);
        combinedItems.push({effectiveDate:iterationStartMoment, primaryText:primaryText, secondaryText: secondaryText, action:action});
        membershipHistoryList.push({
          date:iterationStartMoment, 
          type:'unpaid'
        });
      }

      membershipHistoryList && membershipHistoryList.filter((x,indexx)=>{
        // console.log('userFreezes[userFreezes.length-1].date', userFreezes[userFreezes.length-1].date.format('YYYY-MM-DD'));
        // console.log('xDate: ', x.date.format('YYYY-MM-DD'));
        // console.log('xDateAdd1Month: ', x.date.add(1, 'months').format('YYYY-MM-DD'));
        if (userFreezeTerminated && userFreezeTerminated.length>0 
          && moment(x.date).isSameOrAfter(userFreezeTerminated[userFreezeTerminated.length-1].date)
          // && moment(userFreezeTerminated[userFreezeTerminated.length-1].date).isBetween(x.date, moment(x.date).add(1,'month'))
          // && moment(x.date).isBetween(userFreezeTerminated[userFreezeTerminated.length-1].date, userFreezeTerminated[userFreezeTerminated.length-1].date.add('months', 1))
        ){
            combinedData.push({
              date:userFreezeTerminated[userFreezeTerminated.length-1].date,
              type:'freezeTerminated',
              bgroundColor:'#ccc'
            });
            userFreezeTerminated.pop();
        }
        else if (userFreezes && userFreezes.length>0
          && moment(x.date).isSameOrAfter(userFreezes[userFreezes.length-1].date.clone()) 
          && moment(x.date).isBefore(userFreezes[userFreezes.length-1].date.clone().add(1, 'months')) 
          // && moment(userFreezes[userFreezes.length-1].date).isBetween(x.date, (x.date).add('month', 1).subtract('days', 1))
          // && moment(x.date).isBetween(userFreezes[userFreezes.length-1].date, userFreezes[userFreezes.length-1].date.add('months', 1))
          ){
          // console.log('userFreezes[userFreezes.length].price: ', userFreezes[userFreezes.length-1].price);
          // console.log('userFreezesDate: ', userFreezes[userFreezes.length-1].date.format('DDMMYYYY'));
          // console.log('thexDate: ', x.date.format('DDMMYYYY'));
          combinedData.push({
            date:userFreezes[userFreezes.length-1].date,
            type:'freeze',
            freezeType: userFreezes[userFreezes.length-1].freezeType? userFreezes[userFreezes.length-1].freezeType:null,
            price:userFreezes[userFreezes.length-1].price, 
            freezeCountPerYear:userFreezes[userFreezes.length-1].freezeCountPerYear
          });
          userFreezes.pop();
        }
        else if (userFreeAccess && userFreeAccess.length>0 
          // && userFreeAccess[userFreeAccess.length-1].date.isSameOrAfter(moment(x.date))
          && moment(x.date).isSameOrAfter(userFreeAccess[userFreeAccess.length-1].date)
          // && userFreeAccess[userFreeAccess.length-1].date.isBetween(x.date, moment(x.date).add(1,'month'))
          ){
          combinedData.push({
            date:userFreeAccess[userFreeAccess.length-1].date,
            type:userFreeAccess[userFreeAccess.length-1].type,
            referredUser: userFreeAccess[userFreeAccess.length-1].referredUser
          })
          userFreeAccess.pop();   
        }
        // else if (userFreeAccess && userFreeAccess.length>0){
        //   combinedData.push({
        //     date:userFreeAccess[userFreeAccess.length-1].date,
        //     type:userFreeAccess[userFreeAccess.length-1].type,
        //     referredUser: userFreeAccess[userFreeAccess.length-1].referredUser
        //   })
        //   userFreeAccess.pop(); 
        // }
        // else if (userFreezes && userFreezes.length>0){
        //   combinedData.push({
        //     date:userFreezes[userFreezes.length-1].date,
        //     type:'freeze',
        //     freezeType: userFreezes[userFreezes.length-1].freezeType? userFreezes[userFreezes.length-1].freezeType:null,
        //     price:userFreezes[userFreezes.length-1].price, 
        //     freezeCountPerYear:userFreezes[userFreezes.length-1].freezeCountPerYear
        //   });
        //   userFreezes.pop();
        // }
        else if (combinedVendMth && combinedVendMth.length>0){
          combinedData.push({
            date:combinedVendMth[combinedVendMth.length-1].date,
            paymentDate: combinedVendMth[combinedVendMth.length-1].paymentDate,
            type:combinedVendMth[combinedVendMth.length-1].type,
            visitLeft:combinedVendMth[combinedVendMth.length-1].visitLeft,
            visitMax: combinedVendMth[combinedVendMth.length-1].visitMax,
            bgroundColor: combinedData.length>(initialMonthsDiff)? "#20BF55":null,
            price:combinedVendMth[combinedVendMth.length-1].price, 
            paymentType: combinedVendMth[combinedVendMth.length-1].paymentType,
            cardSummary: combinedVendMth[combinedVendMth.length-1].cardSummary,
            cardExpired: combinedVendMth[combinedVendMth.length-1].cardExpired
          })
          combinedVendMth.pop();
        }
       
        else{
          combinedData.push({
            date:x.date,
            type:'CASH'
            // bgroundColor: combinedData.length>(initialMonthsDiff)? "#20BF55":null
          })
        }
      });

      // console.log('combinedData: ', combinedData);
      // console.log('userFreeze: ', userFreezes);
      membershipHistoryList.forEach((x, indexx)=>{
        if (combinedData && combinedData.length>0 && indexx<combinedData.length){
          const visitText = combinedData[indexx].visitLeft? `(${combinedData[indexx].visitLeft}/${combinedData[indexx].visitMax})`:null;
          const referredUserTxt = (combinedData[indexx].referredUser!=null)?combinedData[indexx].referredUser:null;
          const paymentDate = combinedData[indexx].paymentDate? combinedData[indexx].paymentDate:combinedData[indexx].date;
          const paymentType = combinedData[indexx].paymentType? combinedData[indexx].paymentType:null;
          const cardSummary = combinedData[indexx].cardSummary? combinedData[indexx].cardSummary:null;
          const cardExpired = combinedData[indexx].cardExpired? combinedData[indexx].cardExpired:null;
          const freezeTypeText = combinedData[indexx].freezeType? combinedData[indexx].freezeType:null;
          console.log('combinedData[indexx].paymentType: ', combinedData[indexx]);
          secondaryText = createSecondaryText(combinedData[indexx].paymentType, paymentDate, paymentType, cardSummary, cardExpired, visitText, combinedData[indexx].price, referredUserTxt, freezeCount, freezeTypeText);
          combinedItems[indexx].secondaryText = secondaryText;
          combinedItems[indexx].primaryText = `${combinedItems[indexx].effectiveDate.format('D MMM')} - ${combinedItems[indexx].effectiveDate.add(1, 'month').subtract(1, 'days').format('D MMM YYYY')}`
          combinedItems[indexx].bgroundColor = combinedData[indexx].bgroundColor? combinedData[indexx].bgroundColor : null;
        }
      });
    }
    // if no payment detected
    else{
      var monthsDiff = Math.max(moment(new Date()).diff(startMoment, 'months'));
      for (var i=0; i<=monthsDiff; i++){
        const iterationStartMoment = startMoment.clone().add(addMonths, 'months').add(addYears, 'years');
        // primaryText = createPrimaryText(startMoment, moment(getTheDate(userStartDate)).clone().add(i, 'months'), i);
        primaryText = createPrimaryText(startMoment.format('D MMM'), startMoment.add(1, 'months').format('D MMM YYYY'), i);
        combinedItems.push({effectiveDate:iterationStartMoment, primaryText:primaryText, secondaryText: secondaryText, action:action});
        membershipHistoryList.push({
          date:iterationStartMoment, 
          type:'unpaid'
        });
      }
    }
    combinedItems.reverse();
      // console.log('userFreezes: ', userFreezes)
      // const initialMonthsDiff = Math.max(moment(new Date()).diff(startMoment, 'months'));//round down(MEMBERSHIP START DATE - 1 January 2018)
      // var monthsDiff = initialMonthsDiff;
      // var totalArrayLength = userFreezeTerminated.length + userFreezes.length + userFreeAccess.length + combinedVendMth.length;
      // if (totalArrayLength>initialMonthsDiff){
      //   monthsDiff = totalArrayLength-1;
      // }

      // // default, if there is no payment detected
      // for (var i=0; i<=monthsDiff; i++){
      //   const iterationStartMoment = startMoment.clone().add(addMonths, 'months').add(addYears, 'years');
      //   // primaryText = createPrimaryText(startMoment, moment(getTheDate(userStartDate)).clone().add(i, 'months'), i);
      //   primaryText = createPrimaryText(startMoment.format('D MMM'), startMoment.add(1, 'months').format('D MMM YYYY'), i);
      //   combinedItems.push({effectiveDate:iterationStartMoment, primaryText:primaryText, secondaryText: secondaryText, action:action});
      //   combinedItems.shift({
      //     date:iterationStartMoment, 
      //     type:''
      //   });
      // }

    // combinedItems.shift()//Shift Membership start date and Package Name Nad email and username
    return combinedItems;
  }
);

export const makeGetSelectedUserPaymentItems = () => {
  return getSelectedUserPaymentItems;
}

const getSelectedUserFreezeItems = createSelector(
  [getSelectedUser, getSelectedUserPayments, getSelectedUserFreezes, getUsers],
  (selectedUser, selectedUserPayments, selectedUserFreezes, users) => {
    // console.log(selectedUserPayments);
    if(!selectedUser){
      return null;
    }
    const startDate = selectedUser.get('autoMembershipStarts') ? selectedUser.get('autoMembershipStarts') : selectedUser.get('membershipStarts');

    var primaryText =`Not Started`;
    var secondaryText = `Unpaid`;
    var action = () => {
      console.log('nothing');
    }
    var secondaryAction = () => {
      console.log('nothing 2');
    }
    var userFreezes = [];
    if(startDate && selectedUserPayments){
      selectedUserFreezes.forEach((freeze, key)=>{
        const freezeFor = freeze.get('freezeFor');
        const freezeType = freeze.get('freezeType');
        const totalPrice = freeze.get('totalPrice');
        const freezeSource = freeze.get('freezeSource');

        const freezeName = (freezeType && freezeType.includes('specialFreeze'))? '(Special Freeze) on ': (freezeSource === 'vend' || freezeSource === 'adyen')? `(Paid Freeze RM ${totalPrice}) on `:'(Freeze) on ';
        if(freezeFor){
          const freezeStartMoment = moment(getTheDate(freezeFor));
          const freezeEndMoment = freezeStartMoment.clone().add(1, 'months');
          primaryText = `${freezeStartMoment.format('D MMM')} - ${freezeEndMoment.clone().subtract(1, 'day').format('D MMM YYYY')}`;
          secondaryText = `${freezeName} ${freezeStartMoment.format('D MMM YYYY')}`;
          userFreezes.push({primaryText, secondaryText, action, freezeStartMoment, freezeEndMoment, id:key, secondaryAction, totalPrice, freezeSource, freezeType});
        }
      });
    }
    return userFreezes;
});

export const makeGetSelectedUserFreezeItems = () => {
  return getSelectedUserFreezeItems;
}

// export const getVendProduct = createSelector(
//   [getVendProducts],
//   (vendProducts) => {
//     // selectedUserPayments && console.log(selectedUserPayments.filter(x=>x.get('source')=== 'freeze').toJS());
//     return selectedUserPayments ? selectedUserPayments.filter(x=>x.get('source')=== 'freeze') : null;
//   }
// );

const getSessions = (state, props) => {
  const sessions = state.state && state.state.hasIn(['sessions', 'sessionsById']) ? sortBy(state.state.getIn(['sessions', 'sessionsById']), 'createdAt') : null;
  const selectedUserId = (props && props.match && props.match.params && props.match.params.userId);
  if(!selectedUserId || !sessions){
    return null
  }

  const filteredSessions = sessions.filter(x => x.get('trainerId') === selectedUserId);
  // console.log('sels', selectedUserId, sessions, filteredSessions);

  return filteredSessions;
}

export const makeGetSessions = () => {

  return getSessions;
}

const getBookings = (state, props) => {
  const selectedUserId = (props && props.match && props.match.params && props.match.params.userId);
  if(!selectedUserId){
    return null;
  }

  // const tB = state.state && state.state.hasIn(['bookings', 'bookingsByUserId']) ? state.state.getIn(['bookings', 'bookingsByUserId']) : null;
  const bookings = state.state && state.state.hasIn(['bookings', 'bookingsByUserId']) && state.state.hasIn(['bookings', 'bookingsByUserId', selectedUserId]) ? sortBy(state.state.getIn(['bookings', 'bookingsByUserId', selectedUserId]).filter(x=>x.get('type') === 'pt'), 'createdAt') : null;

  console.log('books', selectedUserId, bookings);
  return bookings ? bookings.filter(x=>!x.get('cancelledAt')) : null;
  // const filteredBookings = bookings.filter(x => x.get('trainerId') === selectedUserId);


  // return filteredBookings;
}

// const getSelectedUserOrLastCheckedInId = createSelector(
//   [getSelectedUserId, getGantnerLogs],
//   (selectedUserId, gantnerLogs) =>{

//     if(!getSelectedUserId && !gantnerLogs){
//       return null;
//     }

//     if(selectedUserId){
//       return selectedUserId;
//     }
//     const inGym = inGymArray(gantnerLogs);
//     const lastCheckedInUserId = inGym && inGym.length && inGym[0][0];

//     return lastCheckedInUserId || null
//   }
// )


const getExclusiveBookings = (state, props) => {
  // const tB = state.state && state.state.hasIn(['bookings', 'bookingsByUserId']) ? state.state.getIn(['bookings', 'bookingsByUserId']) : null;
  const bookings = state.state && state.state.hasIn(['bookings', 'bookingsByUserId']) ? state.state.getIn(['bookings', 'bookingsByUserId']) : null;
  console.log('books', bookings);
  return bookings ? bookings : null;
  // const filteredBookings = bookings.filter(x => x.get('trainerId') === selectedUserId);
  

  // return filteredBookings;
}

const getBabelExclusiveBookings = createSelector(
  [getSelectedUserId, getExclusiveBookings],
  (selectedUserId, bookings) => {
    var bookingMap = {};
    console.log('bookings from selector: ', bookings && bookings.toJS());
    if (!bookings){
      return null;
    }
    bookingMap = delete bookings.regex;
    console.log('theBookingMap123: ', bookingMap);
    return bookings.toJS()||null;
  }
)

export const makeGetBookings = () => {
  return getBookings;
}

export const makeGetBabelExclusiveBookings = () => {
  return getBabelExclusiveBookings;
}
