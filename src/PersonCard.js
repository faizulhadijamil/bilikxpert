import {FormLabel, FormControl, FormGroup, FormControlLabel, Avatar, Button,
  Card, CardContent, CardHeader, Chip, Collapse, Dialog, DialogActions,
  DialogContent, DialogContentText, DialogTitle, 
  Radio, RadioGroup, List, ListItem, ListItemText,
  Switch, TextField, Typography, IconButton, CircularProgress
} from '@material-ui/core';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
  getCardToRegisterState,
  getPackagesList,
  makeGetAllUsers,
  makeGetBranch,
  makeGetRoom,
  makeGetCurrentUser,
  makeGetInGymMap,
  makeGetCheckIn,
  makeGetCheckOut,
  makeGetSelectedUserGantnerLogs,
  makeGetSelectedUserInvoices,
  makeGetSelectedUserOrLastCheckedIn,
  makeGetSelectedUserOrLastCheckedInId,
  makeGetSelectedUserReferredByUser,
  // makeGetSelectedUserReferredToUser,
  makeGetSelectedUserFreezeItems,
  makeGetSelectedUserFreeze,
  makeGetStaff
} from './selectors';
import * as Actions from './actions';
import IntegrationAutosuggest from './IntegrationAutosuggest';
import UserPayments from './UserPayments';
import FreezePayments from './components/FreezePayments';
import UserGantner from './Cards/UserGantner';
import BabelLogo from './BabelLogo';
import StdText from './components/StdText';

import {getTheDate} from './actions'; 
// import DialogError from './dialogs/SimpleDialog';

const styles = theme => ({
  container: {
    // width: '100%',
    // maxWidth: 360,
    // backgroundColor: theme.palette.background.paper,
    // position: 'relative',
    // overflow: 'auto',
    // maxHeight: 300,
    // overflow: 'hidden',
    paddingBottom: 10
  },
  contentFirstRow: {
    maxWidth: 600,
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(8),
  },
  content: {
    maxWidth: 600,
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  search: {
    // marginTop: 64,
    marginTop: -48,
    marginBottom: 32,
    position: 'fixed',
    // top: 64,
    backgroundColor: '#fff',
    zIndex: 1200,
    marginRight: 2,
    marginLeft: 2,
    width: '90%',
    // alignItems: 'end'
    // borderRadius: 8,
    // padding: 8
  },
  selectedUser: {
    position: 'fixed',
    zIndex: 1200
  },
  listSection: {
  },
  title: {
    marginBottom: theme.spacing(1),
  },
  bookButton: {
    margin: theme.spacing(2),
    backgroundColor: "#fde298",
    color: '#062845',
  },
  addButton: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
    backgroundColor: "#fde298",
    color: '#062845',
  },
  fileInput: {
    display: 'none'
  },
  fileLabel: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  fab: {
    position: 'fixed',
    bottom: 56 + 2,
    right: 2,
    zIndex: 1300
  },
  media: {
    minHeight: 32,
    backgroundColor: 'rgba(6,40,69,0.62)'
  },
  card: {
    marginTop: 8,
    overflow: 'hidden',
  },
  cardSmall: {
    marginTop: 8,
    marginLeft: 2,
    maxWidth: '90%',
    // zIndex: 1200,
    // position: 'fixed'
    overflow: 'hidden'
  },
  userDetailChip: {
    marginLeft: 20,
  },
  avatar: {
    // width: 500,
    // height: 500
  },
  headerRoot: {
    padding: 0,
  },
  headerAction: {
    margin: 0
  },
  cardRoot: {
    paddingTop: 0,
  }
});

class PersonCard extends React.Component {

  state = {
    itemsToLoad: 1000,
    editDialogOpen: false,
    // editUserDialogOpen: true,
    editUserId: null,
    editUserData: {},
    currentBranch: {},
    currentRoomId: {},
    branchLabel: {},
    branchName: null,
    roomNumberLabel: '',
    roomNumber: '',
    branch:'',
    currentUserData: {},
    userId: null,
    search: '',
    paymentHistoryOpen: false,
    visitHistoryOpen: false,
    manageOpen: false,
    freezeDialogOpen: false,
    terminateDialogOpen: false,
    freezaData: {},
    addingTempCard: false,
    addingCard: false,
    referredToUserId:null,
    enableBillDate:false,
    showError:false,
    showAddFreezeBtn:true,
    showBuyFreezeBtn:false,
    showOtherRoles:false,
  }

  componentDidMount() {
    const user = this.props.currentUser;
    const currentLoginUseremail = user && user.get('email');
    const currentLoginUserId = user && user.get('id');
    this.setState({
      currentLoginUserId,
      currentLoginUseremail
    });

    window.scrollTo(0, 0);
    window.addEventListener('scroll', this.onScroll, false);

    // window.addEventListener("offline", () => {
    //   console.log('OFFLINE.....')
    //   // setOnlineStatus(false);
    // });
    // window.addEventListener("online", () => {
    //   console.log('ONLINE.....')
    //   // setOnlineStatus(true);
    // });
    // this.cancelRegisterCard();
  }
  //
  // componentWillUnmount() {
  //   window.removeEventListener('scroll', this.onScroll, false);
  //   this.cancelRegisterCard();
  // }
  //
  // onScroll = () => {
  //   if (
  //     (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)
  //   ) {
  //     // console.log("Load more");
  //     this.setState({
  //       ...this.state,
  //       itemsToLoad: (this.state.itemsToLoad + 50)
  //     })
  //   }
  // }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps || this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps) {
    if (this.props.userId !== prevProps.userId) {
      this.handleSelectPerson(this.props.userId);
    }

    if (this.props.uploadedImageURL || this.props.uploadedImagePath) {
      var editUserData = this.state.editUserData;
      editUserData.image = this.props.uploadedImageURL;
      editUserData.imagePath = this.props.uploadedImagePath;
      this.setState({
        editUserData: {
          ...editUserData,

        },
      });
      this.props.actions.setUploadedImage(null, null);
    }
  }

  handleEdit = (userId) => {
    this.cancelRegisterCard();
    if (!userId) {
      userId = 'NEW';
    }
    this.setState({
      editDialogOpen: true,
      editUserId: userId
    });
  };

  // handleShowEditDialog = (userId) => {
  //   this.cancelRegisterCard();
  //   if (!userId) {
  //     userId = 'NEW';
  //   }
  //   this.setState({
  //     // editDialogOpen: true,
  //     editUserDialogOpen:true,
  //     editUserId: userId
  //   });
  // }

  handleFreeze = (userId) => {
    this.cancelRegisterCard();
    this.setState({
      freezeDialogOpen: true,
      editUserId: userId,
      freezeData: {}
    });
  };

  handleTerminate = (userId) => {
    this.cancelRegisterCard();
    this.setState({
      terminateDialogOpen: true,
      editUserId: userId
    });
  };

  handleUnTerminate = (userId) => {
    // this.cancelRegisterCard();
    // this.setState({
    //   terminateDialogOpen: true,
    //   editUserId: userId
    // });
    // saveUserData
    //console.log('unterminate state: ', this.state);
    // this.props.actions.saveUserData(userId, this.state.editUserData, this.state.currentUserData, this.state.currentLoginUseremail, this.state.currentLoginUserId);
    // this.props.actions.unTerminate(userId);
    this.props.actions.unTerminate(userId, this.state.editUserData, this.state.currentUserData, this.state.currentLoginUseremail, this.state.currentLoginUserId);
  };

  handleFreezeTerminate = (userId) => {
    // to add in dummy payment
    this.cancelRegisterCard();
    this.setState({
      freezeDialogOpen: true,
      editUserId: userId,
      freezeData: {}
    });
  }

  handleClose = (content = null) => {
    if (content === 'errorDialog'){this.setState({showError:false})}
    else{
      this.cancelRegisterCard();
      this.setState({
        open: false,
        editUserId: null,
        editUserData: {},
        editDialogOpen: false,
        terminateDialogOpen: false,
        freezeDialogOpen: false,
        showError:false,
        freezeData: {},
        showOtherRoles:false,
      });
    }
  };

  handleSearch = name => event => {
    window.scrollTo(0, 0);
    this.setState({
      search: event.target.value,
      itemsToLoad: 20
    });
  }

  handleChange = name => event => {
    var editUserData = this.state.editUserData;
    var currentUserData = this.state.currentUserData;
    var value = event.target.value;
    var defaultValue = event.target.defaultValue;
    var selectedUser = this.props.selectedUser || null;

    if (name === 'membershipStarts' || name === 'membershipEnds' || name === 'autoMembershipStarts' || name === 'autoMembershipStarts' || name === 'cancellationDate') {
      value = moment(value).toDate();
      defaultValue = moment(defaultValue).toDate();
    } else if (name === 'freeMonths' || name === 'freeMonthsReferrals' || name === 'joiningFee' || name === 'monthlyFee' || name === 'prepaidAmount') {
      value = parseInt(value);
      defaultValue = parseInt(defaultValue);
    } else if (name === 'gender') {
      // defaultValue = (value === 'male')? 'female':'male';
      defaultValue = selectedUser && selectedUser.get('gender')? selectedUser.get('gender'):null;
    } else if (name === 'packageId') {
      defaultValue = selectedUser && selectedUser.get('packageId')? selectedUser.get('packageId'):null;
      // console.log('defaultValue: ', defaultValue);
      if (editUserData && (value === "L6sJtsKG68LpEUH3QeD4" || value === 'yKLfNYOPzXHoAiknAT24' || value === 'jnB6jQf8aD8DVUVmrZII')){
        this.setState({enableBillDate:true});
      }
      else{
        this.setState({enableBillDate:false});
      }
    } else if (name === 'race') {
      defaultValue = selectedUser && selectedUser.get('race')? selectedUser.get('race'):null;
    } else if (name === 'image') {
      const imageFile = event.target.files[0];
      if (imageFile) {
        this.props.actions.uploadImage(imageFile, (imageURL, imagePath) => {
          editUserData.image = imageURL;
          editUserData.imagePath = imagePath;
          this.setState({
            editUserData: {
              ...editUserData
            },
          });
        });
      }
      return;
    }
    else if (name === 'email'){
      value = value.toLowerCase();
    }
    else if (name === 'achieveTarget'){
      defaultValue = defaultValue? defaultValue:'';
      value = value?value:'';
    }
    editUserData[name] = value;
    currentUserData[name] = defaultValue;
    this.setState({
      editUserData: {
        ...editUserData,
      },
      currentUserData:{
        ...currentUserData
      }
    });
  }

  handleAddFreeze = name => event => {
    var value = event.target.value;
    // console.log('thevalue: ', value);
    // console.log('theevent: ', event);
    var freezeData = this.state.freezeData;
    if (name === 'freezeDate') {
      value = moment(value).toDate();
      freezeData.freezeDate = value;
    } else if (name === 'freezeQuantity') {
      if (parseInt(value)<1){
        value = parseFloat(value);
        this.setState({showAddFreezeBtn:true, showBuyFreezeBtn:false});
      }
      else if (value === '50'||value===50){
        //console.log('enabling freeze button');
        value = 1;
        // show the buy page or show buy button
        this.setState({showAddFreezeBtn:false, showBuyFreezeBtn:true});
        // window.open(`/payments/${selectedUserInvoiceId}`, '_blank'
      }
      // else if (value === '100'){
      //   value = 2;
      //   this.setState({showAddFreezeBtn:false});
      //   // show the buy page
      // }
      // else if (value === '150'){
      //   value = 3;
      //   this.setState({showAddFreezeBtn:false});
      //   // show the buy page
      // }
      else {
        //console.log('show button')
        value = parseInt(value);
        this.setState({showAddFreezeBtn:true, showBuyFreezeBtn:false});
      }
      freezeData.freezeQuantity = value;
    }
    this.setState({freezeData: { ...freezeData}});
  }

  handleSaveFreeze = (terminatedUser, dayQty = null, buyFreeze = false, specialFreeze=false) => {
    const editUserId = this.state.editUserId;
    const freezeData = this.state.freezeData;
    // const buyFreeze = this.state.showAddFreezeBtn? false:true;
    const freezeDate = freezeData.freezeDate;
    const userFreezeItems = this.props.userFreezeItems;
    const freezeQuantity = freezeData.freezeQuantity || 1;
    var freezeClash = false; // default
    const selectedUser = this.props.selectedUser || null;
    const selectedEmail = selectedUser && selectedUser.get('email')? selectedUser.get('email'):null;

    //console.log('freezeDate: ', freezeDate);
   // console.log('freezeData: ', freezeData);

    if (!freezeDate){
      this.setState({showError:true});
      return; 
    }
    if (buyFreeze && !freezeDate){
      this.handleClose();
      // window.open(`/buymembership/`, '_blank');
      window.open(`/buy/a3be38de-934f-aa1c-7f69-89f8fcc16f4a/?email=${selectedEmail}`, '_blank');
      return;
    }
    else if (buyFreeze && freezeDate){
      const freezeDateFormat = moment(freezeDate).startOf('day').format('YYYYMMDD');
      this.handleClose();
      // window.open(`/buymembership/`, '_blank');
      // window.open(`/buy/a3be38de-934f-aa1c-7f69-89f8fcc16f4a/?email=${selectedEmail}/?date=${freezeDateFormat}`, '_blank');
      window.open(`/buy/a3be38de-934f-aa1c-7f69-89f8fcc16f4a/?email=${selectedEmail}`, '_blank');
      return;
    }
    if (editUserId && freezeDate && freezeQuantity === 0.5){
      // console.log('freezeQty is : ', freezeQuantity);
      this.props.actions.addFreeze(editUserId, freezeDate, freezeQuantity, this.state.currentLoginUseremail, this.state.currentLoginUserId);
    }
    else if (editUserId && freezeDate && freezeQuantity > 0 && freezeQuantity < 12 && !dayQty) {
      if (userFreezeItems && userFreezeItems.length>0){
        userFreezeItems.forEach((v,k)=>{
          const freezeStartMoment = v.freezeStartMoment||null;
          if (moment(freezeDate).isBetween(freezeStartMoment.clone().subtract(1, 'days'), freezeStartMoment.clone().add(1,'month').subtract(1, 'days'))){
            freezeClash = true;
            return;
          }
        });
      }
      if (!freezeClash){
        this.props.actions.addFreeze(editUserId, freezeDate, freezeQuantity, terminatedUser, this.state.currentLoginUseremail, this.state.currentLoginUserId, specialFreeze);
      }
      else{
        // this will throw error
        this.props.actions.addFreeze();
      }
    }
    // else if (editUserId && freezeDate && freezeQuantity > 0 && freezeQuantity < 12){
    //   this.props.actions.addSpecialFreeze(editUserId, freezeDate, freezeQuantity, dayQty, this.state.currentLoginUseremail, this.state.currentLoginUserId);
    // }
    this.handleClose();
  }

  handleAutosuggest = (name, value) => {
    // console.log('handleAutosuggestName: ', name);
    // console.log('handleAutosuggestValue: ', value);

    var currentUserData = this.state.currentUserData;
    var editUserData = this.state.editUserData;
    editUserData[name] = value;
   
    this.setState({
      editUserData: { ...editUserData
      },
      currentUserData: {
        ...currentUserData,
      }
    });
  }


  handleSaveEdit = () => {
    //console.log('handleSaveEdit: ', this.state);

    // window.ononline = (event) => {
    // 	console.log("Back Online")
	  // };
  
    // window.onoffline = (event) => {
    //     console.log("Connection Lost")
    // };
    // window.addEventListener("offline", () => {
    //   console.log('save data OFFLINE.....');
    //   console.log('should close the popup')
    //   this.handleClose();
      
    //   // this.props.actions.showOffline
    //   // setOnlineStatus(false);
    // });

    // window.addEventListener("online", () => {

      //console.log('ONLINE.....')
      // setOnlineStatus(true);
      const cardToRegister = this.props.cardToRegister;
      if(Object.getOwnPropertyNames(this.state.editUserData).length>0) {
        if (cardToRegister && typeof cardToRegister === 'string' && cardToRegister.length > 0) {
          this.props.actions.saveUserData(
            this.state.editUserId, 
            // { ...this.state.editUserData,
            //   gantnerCardNumber: cardToRegister
            // }
            { ...this.state.editUserData,
              gantnerCardNumber: cardToRegister
            },
            this.state.currentUserData,
            this.state.currentLoginUseremail, 
            this.state.currentLoginUserId
          );
        } else {
          // console.log('editUserData: ', this.state.editUserData);
          // console.log('currentUserData: ', this.state.currentUserData);
          // if (this.state.editUserData.cancellationDate){
          //   // todo: remove the current invoice

          // }
          //console.log('editUserData: ', this.state.editUserData);
          //console.log('currentUserData: ', this.state.currentUserData);
          var editUserData = {...this.state.editUserData}
          if (this.state.editUserData.branch){
            editUserData = {...this.state.editUserData, currentBranch:this.state.editUserData.branch}
          }
          if (this.state.editUserData.roomId){
            editUserData = {...this.state.editUserData, currentRoomId:this.state.editUserData.roomId}
          }
          
          this.props.actions.saveUserData(this.state.editUserId, editUserData, this.state.currentUserData, this.state.currentLoginUseremail, this.state.currentLoginUserId);
        }
        this.handleClose();
      }
      else{
        this.handleClose();
      }
    
    // });
  }

  removeMembershipCard = (userId) => {
    // console.log('removeMembershipCardUserId: ', userId);
    this.props.actions.removeGantnerCard(userId);
  }

  handleRegisterCard = (isTemporary = false) => {
    this.setState({
      addingTempCard: isTemporary,
      addingCard: !isTemporary
    });
    //console.log('cardToRegisterHandleRegisterCard: ', this.props.cardToRegister);
    if (this.props.cardToRegister) {
      // console.log('remove card to register');
      this.props.actions.removeCardToRegister();
    }
    this.props.actions.getCardToRegister();
    // this.props.actions.getCardToRegisterTest();
  }

  cancelRegisterCard = () => {
    this.setState({
      addingTempCard: false,
      addingCard: false
    });
    if (this.props.cardToRegister) {
      this.props.actions.removeCardToRegister();
    }
  }

  handleSelectPerson = (userId) => {
    this.cancelRegisterCard();
    const user = this.props.currentUser || null;
    // const roles = user && user.get('roles');
    // const isAdmin = roles && roles.get('admin') === true;
    // const isMC = roles && roles.get('mc') === true;
    // const isTrainer = roles && roles.get('trainer') === true;
    const roles = user && user.get('staffRole');
    const isSuperUser = roles && roles === 'superUser';
    const isSupervisor = roles && roles === 'supervisor';
    const isAdmin = roles && roles === 'admin';
    const isCRO = roles && roles === 'CRO';
    const isTrainer = roles && roles === 'trainer';
    const isSeniorCRO = roles && roles === 'seniorCRO';

    if (!(isAdmin || isCRO || isTrainer || isSeniorCRO || isSuperUser || isSupervisor)) {
      return;
    }
    this.setState({
      userId: userId,
      paymentHistoryOpen: false,
      visitHistoryOpen: false,
    })
    // this.props.actions.getGantnerLogsByUserId(userId);
    this.props.actions.getInvoicesByUserId(userId);
    this.props.actions.getPaymentsByUserId(userId);
    // this.props.actions.viewPerson(userId);
    // console.log(userId);
    // this.props.actions.removeCardToRegister();
    window.scrollTo(0, 0);
  }

  handleSaveCard = (isTemporary = false) => {
    const cardToRegister = this.props.cardToRegister;
    const selectedUserId = this.state.userId;
    // console.log('isTemporaryCard: ', isTemporary);

    if (cardToRegister && typeof cardToRegister === 'string' && cardToRegister.length > 0) {
      if (isTemporary) {
        
        this.props.actions.saveUserData(selectedUserId, {
          tempCardNumber: cardToRegister
        });
      } else {
        this.props.actions.saveUserData(selectedUserId, {
          gantnerCardNumber: cardToRegister
        });
      }
    }
    this.cancelRegisterCard();
  }

  handleClickSearchCloseIcon = () => {
    this.setState({
      search: ''
    });
    window.scrollTo(0, 0);
  }

  handleClickManage = () => {
    this.setState({
      manageOpen: !this.state.manageOpen
    });
  };

  handleRewardReferral = (selectedUserId, referredToUserId) => {
    this.props.actions.addReferralReward(selectedUserId, referredToUserId);
  };

  handleChangeReferral = () => event => {
    var referredToUserId = event.target.value;
    this.setState({
      referredToUserId
    })
  };

  handleAddInvoice = (selectedUserId) => {
    // window.open(`/createInvoice/${selectedUserId}`, '_blank');
    // this.props.actions.addInvoiceRental(selectedUserId, (response)=>{
    //   console.log('addInvoiceRentalresponse: ', response);
    // });
    this.props.actions.viewNewInvoice(selectedUserId);
  };

  handleSwitch = (event, checked) =>{
    //console.log('event: ', event);
   // console.log('event.target.name: ', event.target.name);
   // console.log('checked: ', checked);
    // console.log('editUserData: ', this.state.editUserData);
    this.setState({...this.state.editUserData, [event.target.name]:event.target.checked});
  }

  renderErrorDialog(){
    return(
      <Dialog key={'errorDialog'} open={this.state.showError} onClose={()=>this.handleClose('errorDialog')}>
        <DialogContent>
        <DialogTitle style={{textAlign:'center'}}>{'PLEASE ENTER A VALID DATE'}</DialogTitle>
        </DialogContent>
        <DialogActions>
          <Button key={'okErrorDialog'} onClick={()=>this.handleClose('errorDialog')} color="primary" style={{textAlign:'center'}}>
            {'OK'}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  convertRoleToText = (role) => {
    // console.log('therole: ', role);
    if (!role){return null}
    else if (role === 'superUser'){return 'Super User'}
    else if (role === 'mc'){return 'CRO'}
    else if (role === 'seniorCRO'){return 'Senior CRO'}
    else if (role === 'supervisor'){return 'Supervisor'}
    else if (role === 'isShared'){return 'Shared Service'}
    else {return role}
  }

  render() {
    const {classes} = this.props;

    const user = this.props.currentUser;
    // const roles = user && user.get('roles');
    const roles = user && user.get('staffRole');
    // const isAdmin =  roles && roles.get('admin') === true;
    // const isSuperUser = roles && roles.get('superUser') === true;
    // const isCRO = roles && roles.get('mc') === true;
    // const isTrainer = roles && roles.get('trainer') === true;
    // const isSuperVisor = roles && roles.get('superVisor') === true;
    // const isseniorCRO = roles && roles.get('seniorCRO') === true;
    const isAdmin =  roles && (roles === 'admin');
    const isSuperUser = roles && (roles === 'superUser');
    const isCRO = roles && (roles === 'CRO');
    const isTrainer = roles && (roles === 'trainer');
    const isSuperVisor = roles && (roles === 'supervisor');
    const isSeniorCRO = roles && (roles === 'seniorCRO');
    const isShared = roles && (roles === 'shared');
    const staffBranch = user && user.get('staffBranch');
    const branchLabel = 'Branch';
    const roomNumberLabel = 'Room Number';

    // define the staff level
    const staffLevel0 = isSuperUser;
    const staffLevel1 = isSuperUser || isAdmin;
    const staffLevel2 = isSuperUser || isAdmin || isSuperVisor;
    const staffLevel3 = isSuperUser || isAdmin || isSuperVisor || isSeniorCRO;
    const staffLevel4 = isSuperUser || isAdmin || isSuperVisor || isSeniorCRO || isCRO;
    const staffLevel5 = isSuperUser || isAdmin || isSuperVisor || isSeniorCRO || isCRO || isTrainer;
    const staffLevel6 = isSuperUser || isAdmin || isSuperVisor || isSeniorCRO || isCRO || isTrainer || isShared;

    // console.log('staffRole: ', roles);
    // console.log('staffLevel6: ', staffLevel6);
    // var roleText = this.convertRoleToText(roles);


    const branchesData = this.props.branch || null;
    const branchSize = branchesData && branchesData.size;
    const branchId = this.state.branch || null;
    console.log('theBranchId: ', branchId);

    const roomsData = this.props.rooms || null;
    const selectedRoomId = this.state.roomId;
    
    const complimentaryPkg = 'yKLfNYOPzXHoAiknAT24';
    const complimentaryPromoPkg = 'L6sJtsKG68LpEUH3QeD4';
  
    const editUserId = this.state.editDialogOpen ? this.state.editUserId : null;
    const editUser = (this.state.editDialogOpen && editUserId !== 'NEW') ? this.props.selectedUser : null;
    var editUserImage = editUser && editUser.has('image') ? editUser.get('image') : null;
    if (this.state.editUserData && this.state.editUserData.image) {
      editUserImage = this.state.editUserData.image;
    }
    var editUserAvatar = <PhotoCameraIcon style={{width:64, height:64}} />;
    if (editUserImage) {
      editUserAvatar = <Avatar style={{width:64, height:64, marginLeft:'auto', marginRight:'auto'}} src={editUserImage} />;
    }

    const editUserStartDate = editUser && editUser.has('autoMembershipStarts') && editUser.get('autoMembershipStarts') ? getTheDate(editUser.get('autoMembershipStarts')) : null;
    const editUserFirstVisit = editUser && editUser.has('membershipStarts') && editUser.get('membershipStarts') ? getTheDate(editUser.get('membershipStarts')) : null;
    var editUserMembershipStarts = editUserStartDate ? editUserStartDate : editUserFirstVisit;
    const editUserAutoBilling = editUser && editUser.has('autoMembershipEnds') && editUser.get('autoMembershipEnds') ? getTheDate(editUser.get('autoMembershipEnds')) : (editUser && editUser.has('membershipEnds') && editUser.get('membershipEnds') ? getTheDate(editUser.get('membershipEnds')) : null);
    const editUserCurrentBranchId = (editUser && editUser.has('currentBranch'))? editUser.get('currentBranch'):null;
    // console.log('editUserCurrentBranchId: ', editUserCurrentBranchId);
    // console.log('editUserData: ', this.state.editUserData);

    // console.log('selectedStaffRole: ', editUser && editUser.get('staffRole'));

    var branchName = '';
    const selectedBranch = branchesData && branchesData.filter((x, key)=>{
        if (key === editUserCurrentBranchId){
            branchName = x.has('name')? x.get('name'):'';
            return true;
        }
        return false;
    }).first();

    // console.log('selectedRoomId: ', selectedRoomId);
    var roomNumber = ''
    const selectedRooms = roomsData && roomsData.filter((x, key)=>{
      const isAvailable = x.has('isAvailable')? x.get('isAvailable'):true;
      if ((key === selectedRoomId) && isAvailable){
        roomNumber = x.has('roomNumber')? x.get('roomNumber'):'';
        //console.log('roomNumber: ', roomNumber);
        return true;
      }
        // if (key === branchId){
        //     branchName = x.has('rooms')? x.get('roomNumber'):'';
        //     return true;
        // }
        // return false;
    }).first();

    var memberId;
    if (editUser) {
      if (editUser.get('nric')) {
        memberId = editUser.get('nric');
      } else {
        memberId = editUser.get('passport');
      }
    }
    const editUserData = this.state.editUserData;
    if (editUserData) {
      if (editUserData.nric) {
        memberId = editUserData.nric;
      } else if (editUserData.passport) {
        memberId = editUserData.passport;
      }

      if (editUserData.image) {
        editUserAvatar = <Avatar style={{width:64, height:64, marginLeft:'auto', marginRight:'auto'}} src={editUserData.image} />;
      }

      if (editUserData.autoMembershipStarts) {
        editUserMembershipStarts = editUserData.autoMembershipStarts
      }
    }

    var editUserGantnerCardNumber = editUser && editUser.get('gantnerCardNumber');
    var isRegisteringCard = false;
    // console.log('cardToRegister: ', this.props.cardToRegister);
    if (this.props.cardToRegister) {
      const cardToRegister = this.props.cardToRegister;
      if (cardToRegister && typeof cardToRegister === 'string' && cardToRegister.length > 0) {
        editUserGantnerCardNumber = cardToRegister;
      } else {
        isRegisteringCard = true;
      }
    }

    const selectedUserId = this.props.userId;
    const isCurrentUser = selectedUserId && this.props.currentUser && this.props.currentUser.get('id') === selectedUserId;
    var userData = isCurrentUser ? this.props.currentUser : this.props.selectedUser;
    // console.log(selectedUserId, userData && userData.toJS(), this.props.currentUser.get('id'));
    // console.log(this.props.selectedUserOrLastCheckedInId);
    const inGymMap = this.props.inGymMap;
    const packages = this.props.packages;
    const checkIn = this.props.checkIn;
    const checkOut = this.props.checkOut;

    // const selectedUserInGym = inGymMap && inGymMap[selectedUserId];
    // console.log('selectedUserInGym: ', selectedUserInGym);

    var isStaff = false;
    if (editUser && editUser.get('isStaff')){
      // console.log('selected member is staff: ', editUser && editUser.get('isStaff'));
      isStaff = true;
    }

    //console.log('inGymMap: ', inGymMap);

    // if (this.state.editUserData.roles) {
    //   if (this.state.editUserData.roles.trainer 
    //     || this.state.editUserData.roles.admin 
    //     || this.state.editUserData.roles.mc
    //     || this.state.editUserData.roles.seniorCRO 
    //     || this.state.editUserData.roles.superVisor
    //     || this.state.editUserData.roles.superUser
    //     || this.state.editUserData.roles.shared
    //     ) {
    //     isStaff = true;
    //   }
    // } else if (editUser && 
    //   (editUser.getIn(['roles', 'trainer']) 
    //   || editUser.getIn(['roles', 'admin']) 
    //   || editUser.getIn(['roles', 'mc'])
    //   || editUser.getIn(['roles', 'seniorCRO'])
    //   || editUser.getIn(['roles', 'superVisor'])
    //   || editUser.getIn(['roles', 'superUser'])
    //   || editUser.getIn(['roles', 'shared'])
    //   )) {
    //   isStaff = true;
    // }
    // if (editUser && editUser.get('isStaff') || this.state.editUserData.isStaff){
    //   console.log('editUserisStaff: ', editUser && editUser.get('isStaff'));
    //   console.log('editUserDatailsStaff: ', this.state.editUserData.isStaff);
    //   isStaff = true;
    //   console.log('memberisStaff: ', isStaff);
    // }

    var packageOptions = [];
    var packageList = [];
    if (staffLevel6 && packages) {
      packages.sort((a, b) => {
        const nameA = a.get('name');
        const nameB = b.get('name');
        if (nameA < nameB) {return -1}
        if (nameA > nameB) {return 1}
        return 0;
      }).toOrderedMap().mapEntries(([key, value]) => {
        // console.log(key, value);
        var display = `${value.get('name')}`;
        packageOptions.push(
          <option key={key} value={key}>
            {display}
          </option>
        );
        packageList.push({value, label:display});
      });

      packageOptions.splice(0, 0,
        <option key={'nullOption'} value={''}>
        </option>);
    }

    var achieveTargetOptions = [];
    var achieveTargetArray = ['Lose Weight', 'Bulk Up', 'Be Healthier', 'Get Fitter', 'Recover from Injury', 'Tone Up'];
    achieveTargetArray.map((value, key) => {
      // console.log('achieveTargetArray:', key, value);
      var display = value;
      achieveTargetOptions.push(
        <option key={key} value={value}>
          {display}
        </option>
      );
    });
    // if no option, put it as empty
    achieveTargetOptions.splice(0, 0,
      <option key={'nullOption'} value={''}>
      </option>);

    var editUserPackageId = editUser && editUser.get('packageId');
    var editUserPackage = packages && packages.get(editUserPackageId);
    if (editUserData && editUserData.packageId) {
      editUserPackage = packages && packages.get(editUserData.packageId);
    }

    var trainerId = editUser && editUser.get('trainerId');
    if (editUserData && 'trainerId' in editUserData) {
      trainerId = editUserData.trainerId;
    }
    const trainer = trainerId && this.props.staff.has(trainerId) ? this.props.staff.get(trainerId) : null;
    const trainerName = trainer && trainer.has('name') ? trainer.get('name') : null;
    const trainerImage = trainer && trainer.has('image') ? trainer.get('image') : null;
    const trainerAvatar = trainerImage || (trainerName && trainerName.length > 0) ?
      (trainerImage ? (<Avatar src={trainerImage} />) : (<Avatar>{trainerName.charAt(0).toUpperCase()}</Avatar>)) :
      null;

    var mcId = editUser && editUser.get('mcId');
    if (editUserData && 'mcId' in editUserData) {
      mcId = editUserData.mcId;
    }
    const mc = this.props.staff && this.props.staff.has(mcId) ? this.props.staff.get(mcId) : null;
    const mcName = mc && mc.has('name') ? mc.get('name') : null;
    const mcImage = mc && mc.has('image') ? mc.get('image') : null;
    const mcAvatar = mcImage || (mcName && mcName.length > 0) ?
      (mcImage ? (<Avatar src={mcImage} />) : (<Avatar>{mcName.charAt(0).toUpperCase()}</Avatar>)) :
      null;

    // for referredBy
    var referredByUserId = editUser && editUser.get('referredByUserId');
    if (editUserData && 'referredByUserId' in editUserData) {
      referredByUserId = editUserData.referredByUserId;
    }
    const referredByUser = (editUserData && editUserData.referredByUserId && this.props.users && this.props.users.get(editUserData.referredByUserId)) || this.props.selectedUserReferredByUser;
    const referredByUserName = referredByUser && referredByUser.has('name') ? referredByUser.get('name') : null;
    const referredByUserImage = referredByUser && referredByUser.has('image') ? referredByUser.get('image') : null;
    const referredByUserAvatar = referredByUserImage || (referredByUserName && referredByUserName.length > 0) ?
      (referredByUserImage ? (<Avatar src={referredByUserImage} />) : (<Avatar>{referredByUserName.charAt(0).toUpperCase()}</Avatar>)) :
      null;
    // console.log('referredByUser: ', referredByUser);

    // for referredTo
    // const referredToUser = (editUserData && editUserData.referredToUserId && this.props.users && this.props.users.get(editUserData.referredToUserId)) || this.props.selectedUserReferredToUser;
    // const referredToUserName = referredToUser && referredToUser.has('name') ? referredToUser.get('name') : null;
    // console.log('referredToUser: ', referredToUser);

    var teamLeaderId = editUser && editUser.get('teamLeaderId');
    if (editUserData && 'teamLeaderId' in editUserData) {
      teamLeaderId = editUserData.teamLeaderId;
    }
    const teamLeader = teamLeaderId && this.props.staff.has(teamLeaderId) ? this.props.staff.get(teamLeaderId) : null;
    const teamLeaderName = teamLeader && teamLeader.has('name') ? teamLeader.get('name') : null;
    const teamLeaderImage = teamLeader && teamLeader.has('image') ? teamLeader.get('image') : null;
    const teamLeaderAvatar = teamLeaderImage || (teamLeaderName && teamLeaderName.length > 0) ?
      (teamLeaderImage ? (<Avatar src={teamLeaderImage} />) : (<Avatar>{teamLeaderName.charAt(0).toUpperCase()}</Avatar>)) :
      null;


    // const userData = null;
    // const userImage = null;

    // const userData = this.props.state.hasIn(['users', 'usersById']) ? this.props.state.getIn(['users', 'usersById', userId]) : null;
    const selectedUserName = userData && userData.has('name') && userData.get('name') ? userData.get('name') : null
    const selectedUserImage = userData && userData.has('image') ? userData.get('image') : (userData && userData.has('fbPhotoURL'))? userData.get('fbPhotoURL'):null;
    const selectedUserAvatar = selectedUserImage || (selectedUserName && selectedUserName.length > 0) ?
      (selectedUserImage ? (<Avatar src={selectedUserImage} style={{marginLeft:'auto', marginRight:'auto', width:128, height:128, fontSize:'3.5rem'}} />) : (<Avatar style={{marginLeft:'auto', marginRight:'auto', width:128, height:128, fontSize:'3.5rem'}}>{selectedUserName.charAt(0).toUpperCase()}</Avatar>)) :
      null;
    var selectedUserGantnerCardNumber = userData && userData.get('gantnerCardNumber');
    const selectedUserPackageId = userData && userData.has('packageId') ? userData.get('packageId') : null;
    const selectedUserPackageData = selectedUserPackageId && packages && packages.has(selectedUserPackageId) ? packages.get(selectedUserPackageId) : null;
    const selectedUserPackageName = selectedUserPackageData && selectedUserPackageData.get('name');
    const selectedUserStartDate = userData && userData.has('autoMembershipStarts') && userData.get('autoMembershipStarts') ? moment(getTheDate(userData.get('autoMembershipStarts'))).format('Do MMM YYYY') : null;
    // const selectedUserFirstVisit = userData && userData.has('membershipStarts') && userData.get('membershipStarts') ? moment(getTheDate(userData.get('membershipStarts'))).format('Do MMM YYYY') : null;
    // const selectedUserFirstVisit = userData && userData.has('autoMembershipStarts') && userData.get('autoMembershipStarts') ? moment(getTheDate(userData.get('autoMembershipStarts'))).format('Do MMM YYYY') : 
    // userData && userData.has('membershipStarts') && userData.get('membershipStarts') ? moment(getTheDate(userData.get('membershipStarts'))).format('Do MMM YYYY') : null;
    var selectedUserFirstVisit = null; // changed on 17/8/2020
    const selectedUserRole = userData && userData.has('staffRole') && userData.get('staffRole') ? userData.get('staffRole') : null
    const selectedUserRoleText = this.convertRoleToText(selectedUserRole);

    const isSelectedUserStaff = editUser && editUser.get('isStaff');

    const selectedUserJoinDate = userData && userData.has('joinDate') && userData.get('joinDate') ? moment(getTheDate(userData.get('joinDate'))).format('Do MMM YYYY') : null;
    var idForLastVisit = selectedUserId || null;
    var selectedUserLastVisit = (idForLastVisit && inGymMap && inGymMap[idForLastVisit]) ? moment(inGymMap[idForLastVisit]).format('Do MMM YYYY') : null;
    const showCovid19Btn = (userData && userData.get('covid19DeclarationAt') && (moment(getTheDate(userData.get('covid19DeclarationAt'))).add(14, 'days').isSameOrAfter(moment()))) ? false:true;

    var userVisitItems = [];
    if (true) {
      const selectedUserGanterLogs = this.props.selectedUserGanterLogs ? this.props.selectedUserGanterLogs.sort((a, b) => {
        const nameA = a.get('createdAt');
        const nameB = b.get('createdAt');
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }

        return 0;

      }) : null;
      if (selectedUserGanterLogs && selectedUserGanterLogs.size > 0) {
        const selectedUserLastVisitDate = selectedUserGanterLogs && selectedUserGanterLogs.last().get('createdAt') ? getTheDate(selectedUserGanterLogs.last().get('createdAt')) : null;
        selectedUserFirstVisit = selectedUserGanterLogs && selectedUserGanterLogs.first().get('createdAt') ? moment(getTheDate(selectedUserGanterLogs.first().get('createdAt'))).format('Do MMM YYYY') : null;
        if (selectedUserLastVisitDate) {
          selectedUserLastVisit = moment(selectedUserLastVisitDate).format('Do MMM YYYY')
        }

        var previousCheckinMoment = null;
        selectedUserGanterLogs.toKeyedSeq().forEach((v, k) => {
          const createdAt = v.get('createdAt') ? getTheDate(v.get('createdAt')) : null;
          const createdAtMoment = createdAt && moment(createdAt);
          if (createdAtMoment) {
            if (previousCheckinMoment && previousCheckinMoment.isSame(createdAtMoment, 'day')) {
              //check out
              userVisitItems.pop();
              userVisitItems.push(
                <ListItem divider button key={k} >
                  <ListItemText primary={createdAtMoment.format('D MMM YYYY')} secondary={`${previousCheckinMoment.format('h:mm A')} - ${createdAtMoment.format('h:mm A')}`} />
                </ListItem>
              );
              previousCheckinMoment = null;

            } else {
              //check in
              previousCheckinMoment = createdAtMoment;
              userVisitItems.push(
                <ListItem divider button key={k} >
                  <ListItemText primary={createdAtMoment.format('D MMM YYYY')} secondary={createdAtMoment.format('h:mm A')} />
                </ListItem>
              );
            }
          }
        });

        if (userVisitItems.length > 1) {
          userVisitItems.reverse();
        }
      }
    }
    const selectedUserInvoiceId = this.props.selectedUserInvoiceId;

    const selectedUserNextBillingDate = userData && userData.has('autoMembershipEnds') && userData.get('autoMembershipEnds') ? getTheDate(userData.get('autoMembershipEnds')) : (userData && userData.has('membershipEnds') && userData.get('membershipEnds') ? getTheDate(userData.get('membershipEnds')) : null);
    const selectedUserNextBilling = selectedUserNextBillingDate ? moment(selectedUserNextBillingDate).format('Do MMM YYYY') : null;
    var selectedUserPackageBilling = selectedUserPackageName;
    if (selectedUserNextBilling && selectedUserPackageName) {
      if (selectedUserPackageBilling && selectedUserPackageBilling.toLowerCase().indexOf('corp') !== -1) {
        selectedUserPackageBilling = 'Corporate';
      }
      selectedUserPackageBilling = `${selectedUserPackageBilling} - ${selectedUserNextBilling}`;
    }

    // const selectedUserCancelled = userData && ((userData.has('cancellationDate') && userData.get('cancellationDate')) || (userData.has('cancellationReason') && userData.get('cancellationReason'))) ? true : false;
    const selectedUserCancelled = userData && (userData.has('cancellationDate') && userData.get('cancellationDate') && moment(getTheDate(userData.get('cancellationDate'))).isSameOrBefore(moment(), 'day')) ? true : false;
    const selectedUserFrozen = userData && userData.has('isFrozen') && userData.get('isFrozen') === true ? true : false;
    
    var selectedUserCardStyle = {};
    if (selectedUserCancelled) {
      selectedUserCardStyle = {
        backgroundColor: '#ccc'
      }
    } else if (selectedUserFrozen){
      selectedUserCardStyle = {
        backgroundColor: '#01BAEF'
      }
    } else if (selectedUserNextBillingDate) {
      if (moment(selectedUserNextBillingDate).isSameOrBefore(moment(), 'day')) {
        selectedUserCardStyle = {
          backgroundColor: '#F71A38'
        }
      } else if (moment(selectedUserNextBillingDate).subtract(3, 'd').isSameOrBefore(moment(), 'day')) {
        // console.log(moment(membershipEnds).format());
        selectedUserCardStyle = {
          backgroundColor: '#FF751B'
        }
      }
      else if (showCovid19Btn){
        selectedUserCardStyle = {
          backgroundColor: '#9932CC'
        }
      }
    }
    // else if(userData){ // for visitors
    //   const roles = userData.get('roles');
    //   if(!roles || !(roles.get('admin') || roles.get('trainer') || roles.get('mc')) ){
    //     selectedUserCardStyle = {
    //       backgroundColor : '#fde298'
    //     }
    //   }
    // }
    const selectedUserRemarks = userData && userData.has('remarks') ? userData.get('remarks') : null;
    const selectedUserTrainerId = userData && userData.get('trainerId');
    const selectedUserTrainer = selectedUserTrainerId && this.props.staff.has(selectedUserTrainerId) ? this.props.staff.get(selectedUserTrainerId) : null;
    const selectedUserTrainerName = selectedUserTrainer && selectedUserTrainer.has('name') ? selectedUserTrainer.get('name') : null;
    const selectedUserTrainerImage = selectedUserTrainer && selectedUserTrainer.has('image') ? selectedUserTrainer.get('image') : null;
    const selectedUserTrainerAvatar = selectedUserTrainerImage || (selectedUserTrainerName && selectedUserTrainerName.length > 0) ?
      (selectedUserTrainerImage ? (<Avatar src={selectedUserTrainerImage} />) : (<Avatar>{selectedUserTrainerName.charAt(0).toUpperCase()}</Avatar>)) :
      null;
    const selectedUserTrainerChip = (
      <Chip
        avatar={selectedUserTrainerAvatar}
        label={selectedUserTrainerName}
        className={classes.userDetailChip}
      />
    );
    // console.log(selectedUserId);

    const manageFreezeBtn = selectedUserId && <Button className={classes.addButton} key='manageFreeze' onClick={()=>this.handleFreeze(selectedUserId)}>Freeze</Button>
    const manageTerminateBtn = selectedUserId && <Button className={classes.addButton} key='manageTerminate' onClick={()=>this.handleTerminate(selectedUserId)}>Terminate</Button>
    const manageUnterminateBtn = selectedUserId && <Button className={classes.addButton} key='manageUnterminateBtn' onClick={()=>this.handleUnTerminate(selectedUserId)}>UnTerminate</Button>
    // const referralTextId = 
    //   <TextField
    //     margin="dense"
    //     id="referredToUIdText"
    //     label="Referral Member ID"
    //     type="text"
    //     defaultValue={this.state.referredToUserId}
    //     // value={this.state.referredToUserId}
    //     fullWidth
    //     onChange={this.handleChangeReferral()}
    //     required
    //     key='referredUserID'
    //   />

    // const referralBtn = selectedUserId &&  <Button key='referalBtn' className={classes.addButton} onClick={()=>{this.handleRewardReferral(selectedUserId, this.state.referredToUserId)}}>{'reward referral'}</Button>

    var manageItems = [];
    
    if (staffLevel4 && selectedUserPackageId) {
      // if user is terminated, disable the freeze button
      if (selectedUserCancelled){
        staffLevel3 && manageItems.push(manageTerminateBtn);
        isSuperUser && manageItems.push(manageFreezeBtn);
        staffLevel1 && manageItems.push(manageUnterminateBtn);
      }
      else{
        manageItems.push(manageFreezeBtn);
        staffLevel3 && manageItems.push(manageTerminateBtn);

        // isSuperUser && selectedUserId && manageItems.push(referralTextId);
        // isSuperUser && manageItems.push(referralBtn);
      }
    }

    // console.log('editUserData: ', editUserData);
    const currentUserPkgId = editUser && editUser.has('packageId') ? editUser.get('packageId') : '';
    const editUserPackageName = editUserPackage && editUserPackage.get('name');

    const selectedUserRoomId = userData && userData.has('currentRoomId') ? userData.get('currentRoomId') : null; 
   // console.log('selectedBranch: ', selectedBranch);
    const selectedUserBranchName = selectedBranch && selectedBranch.get('name'); 
    const editUserBranchId = this.state.editUserData.branch;
   
    const editUserRoomId = editUser && editUser.get('currentRoomId');

    var editUserBranchName = '';
    const editUserBranch = branchesData && branchesData.filter((x, key)=>{
      if (key === editUserBranchId){
        editUserBranchName = x.has('name')? x.get('name'):'';
          return true;
      }
      return false;
  }).first();

  var editUserRoomNumber;
  const editRoomData = roomsData && roomsData.filter((x,y)=>{
    if (y === editUserRoomId){
      editUserRoomNumber = x.get('roomNumber');
      return true;
    }
  });

  const editUserDataRoomId = editUserData && editUserData.roomId;
  var editUserDataRoomNumber;
  roomsData && roomsData.filter((x,y)=>{
    if (y === editUserDataRoomId){
      editUserDataRoomNumber = x.get('roomNumber');
      return true;
    }
  });

    
    // console.log('selectedUserRoomId: ', selectedUserRoomId)
    return (
      <div className={classes.container}>
            {true && staffLevel6 && 
                <Card style={!isCurrentUser ? selectedUserCardStyle : {boxShadow:null}} className={classes.card} elevation={this.props.elevation}>
                  <CardHeader
                    action={
                      (selectedUserId && this.props.clearAction) ? <IconButton onClick={()=>{
                        this.cancelRegisterCard();
                        this.props.clearAction();
                      }
                      }>
                        <CloseIcon />
                      </IconButton>
                      : null
                    }
                    classes={{root:classes.headerRoot, action:classes.headerAction}}
                  />
                <CardContent classes={selectedUserId && {root:classes.cardRoot }}>
                    {userData &&
                      <List>
                      {selectedUserAvatar}

                      <StdText text = {selectedUserName} variant = 'h2' color="primary" style={{textAlign:'center', marginTop:32, marginBottom:32}}
                        onClick={()=>{
                          this.handleSelectPerson(this.props.selectedUserOrLastCheckedInId);
                          this.props.actions.viewPerson(this.props.selectedUserOrLastCheckedInId)
                        }}
                      />

                      {/* <Typography type="headline" component="h1" color="primary" style={{textAlign:'center', marginTop:32, marginBottom:32}} onClick={()=>{
                          this.handleSelectPerson(this.props.selectedUserOrLastCheckedInId);
                          this.props.actions.viewPerson(this.props.selectedUserOrLastCheckedInId)
                        }}>
                        {selectedUserName}
                      </Typography> */}
                      {selectedUserRemarks &&
                        <ListItem divider>{selectedUserRemarks}</ListItem>
                      }
                      {selectedUserRoleText &&
                        <ListItem divider>Babel Staff <Chip className={classes.userDetailChip} label={selectedUserRoleText}/></ListItem>
                      }
                      {selectedUserLastVisit &&
                        <ListItem divider>Last Visit <Chip className={classes.userDetailChip} label={selectedUserLastVisit}/></ListItem>
                      }
                      {selectedUserTrainer &&
                        <ListItem divider>Trainer {selectedUserTrainerChip}</ListItem>
                      }
                      {selectedUserPackageBilling &&
                        <ListItem divider>Package<Chip className={classes.userDetailChip} label={selectedUserPackageBilling}/></ListItem>
                      }
                      </List>
                    }
                    {(staffLevel4 && userData && selectedUserId && selectedUserId.length > 0 && selectedUserRoomId) &&
                      <Button key={'checkInOutRoom'} className={classes.addButton} onClick={()=>this.props.actions.addCheckInOut(selectedUserId)}>
                        {'Check Out'}
                      </Button>
                    }
                    {false && (staffLevel4 && userData && !selectedUserCancelled && selectedUserId && selectedUserId.length > 0 && !(editUser || editUserId === 'NEW')) && (!this.state.addingCard && !this.state.addingTempCard) &&
                      <Button key={'checkIn'} className={classes.addButton} onClick={()=>this.props.actions.addCheckIn(selectedUserId, 'App - Manual')}>
                        { (checkIn && !checkIn[selectedUserId]) ? 'Check In ' : 'Check Out '}
                      </Button>
                    }

                    {false && (staffLevel4 && userData && !selectedUserCancelled && selectedUserId && selectedUserId.length > 0 && !(editUser || editUserId === 'NEW')) && (!this.state.addingCard && !this.state.addingTempCard) &&
                      <Button key={'checkOut'} className={classes.addButton} onClick={()=>this.props.actions.addCheckOut(selectedUserId, 'App - Manual')}>
                        { (checkOut && !checkOut[selectedUserId]) ? 'Check Out ' : 'Check In '}
                      </Button>
                    }


                    {(staffLevel6 && userData && selectedUserId && selectedUserId.length > 0 && !(editUser || editUserId === 'NEW') && (!this.state.addingCard && !this.state.addingTempCard)) &&
                      <Button key={'editButton'} className={classes.addButton} onClick={()=>
                      {
                        this.handleEdit(selectedUserId)
                        // this.handleShowEditDialog(selectedUserId)
                      }}>
                        {'Edit'}
                      </Button>
                    }

                    {selectedUserFirstVisit &&
                      <ListItem divider>First Visit<Chip className={classes.userDetailChip} label={selectedUserFirstVisit}/></ListItem>
                    }
                    {selectedUserStartDate &&
                      <ListItem divider>Start Date<Chip className={classes.userDetailChip} label={selectedUserStartDate}/></ListItem>
                    }
                    {selectedUserJoinDate &&
                      <ListItem divider>Join Date<Chip className={classes.userDetailChip} label={selectedUserJoinDate}/></ListItem>
                    }
                    {(staffLevel4) && selectedUserInvoiceId &&
                      <Button key={'invoiceButton'} className={classes.addButton} onClick={()=>window.open(`/payments/${selectedUserInvoiceId}`, '_blank')}>
                        {'View Invoice'}
                      </Button>
                    }
                    {(isSuperUser) &&
                      <Button key={'generateButton'} className={classes.addInvoiceButton} onClick={()=>{this.handleAddInvoice(selectedUserId)}}>
                        {'Create Invoice'}
                      </Button>
                    }
                    {manageItems.length > 0 && (staffLevel4) && 
                      <List>
                        <ListItem button onClick={this.handleClickManage}>
                          <ListItemText primary={`Manage`} />
                          {this.state.manageOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                        </ListItem>
                        <Collapse in={this.state.manageOpen} timeout="auto" unmountOnExit>
                          <List component="div" disablePadding>
                            {manageItems}
                          </List>
                        </Collapse>
                      </List>
                    }
                    {(selectedUserId) &&
                      <UserPayments userId={selectedUserId} />
                    }
                    {selectedUserId && <UserGantner userId={selectedUserId}/>}
                  {!userData && <BabelLogo />}
                  </CardContent>
                </Card>
            }
            
          {(editUser || editUserId === 'NEW') &&
            <Dialog key={'editDialog'} open={this.state.editDialogOpen} onClose={this.handleClose}>
              {this.props.isNative &&
                <div>
                  <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
                    <IconButton color="primary" component="span" style={{marginTop:32, marginBottom:32}} disabled={this.props.isUploadingImage} onClick={()=>this.props.actions.useNativeCamera()}>
                      {editUserAvatar}
                    </IconButton>
                  </div>
                  <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
              <input accept="/*" className={classes.fileInput} id="icon-button-file" type="file" onChange={this.handleChange('image')} />
              <label htmlFor="icon-button-file" >
                <Button raised component="span" color='primary' key={'uploadPhoto'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} disabled={this.props.isUploadingImage} style={{marginBottom:32}}>
                  {this.state.image ? 'Change Photo' : 'Upload Photo' }
                  {this.props.isUploadingImage &&
                    <CircularProgress style={{color:'white', marginLeft:8}}/>
                  }
                </Button>
              </label>
            </div>
                  {/* <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
                <input accept="image/*" className={classes.fileInput} id="icon-button-file" type="file" onChange={this.handleChange('image')} />
                  <label htmlFor="icon-button-file" >
                    <Button raised component="span" color='primary' key={'uploadPhoto'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} disabled={this.props.isUploadingImage} style={{marginBottom:32}}>
                      {this.state.image ? 'Change Photo' : 'Upload Photo' }
                      {this.props.isUploadingImage && <CircularProgress style={{color:'white', marginLeft:8}}/>}
                    </Button>
                  </label>
                </div> */}
                </div>
              }
              {!this.props.isNative &&
                <div>
                  <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
                  <input accept="image/*" className={classes.fileInput} id="icon-button-file" type="file" onChange={this.handleChange('image')} disabled={this.props.isUploadingImage} />
                    <label htmlFor="icon-button-file" >
                      <IconButton color="primary" component="span" style={{marginTop:32, marginBottom:32}}>
                        {editUserAvatar}
                      </IconButton>
                    </label>
                  </div>
                  <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
                  <input accept="image/*" className={classes.fileInput} id="icon-button-file" type="file" onChange={this.handleChange('image')} />
                    <label htmlFor="icon-button-file" >
                      <Button raised component="span" color='primary' key={'uploadPhoto'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} disabled={this.props.isUploadingImage} style={{marginBottom:32}}>
                        {this.state.image ? 'Change Photo' : 'Upload Photo' }
                        {this.props.isUploadingImage &&
                          <CircularProgress style={{color:'white', marginLeft:8}}/>
                        }
                      </Button>
                    </label>
                  </div>
                </div>
              }
              <DialogContent>
                {
                  <FormGroup>
                    {staffLevel1 && <FormControlLabel
                      control={
                        <Switch
                          checked={this.state.editUserData.roles ? this.state.editUserData.roles.testAccount : (editUser ? editUser.getIn(['roles', 'testAccount']) : false)}
                          onChange={(event, checked) => {
                            var editUserData = this.state.editUserData;
                            // var roles = editUserData.roles ? {...editUser.get('roles').toJS(), admin:editUserData.roles.admin} : (editUser.get('roles') ? editUser.get('roles').toJS() : {});
                            var roles = editUserData.roles;
                            if(!roles){
                              if(editUser && editUser.get('roles')){
                                roles = editUser && editUser.get('roles').toJS();
                              }else{
                                roles = {};
                              }
                            }
                            roles.testAccount = checked;
                            this.setState({ editUserData:{...editUserData, roles}});
                          }}
                        />
                      }
                      label={'Test Account'}
                    />}
                  
                  {staffLevel2 && <FormControlLabel
                    control={
                      <Switch
                        // checked={this.state.editUserData? this.state.editUserData.isStaff? this.state.editUserData.isStaff: (editUser && editUser.get('isStaff')): false}
                        // checked={this.state.showOtherRoles}
                        // checked = {isStaff}
                        checked={this.state.editUserData? (this.state.editUserData.isStaff !== undefined)? this.state.editUserData.isStaff : (editUser && editUser.get('isStaff')) : false}
                        onChange={(event, checked) => {
                          
                          var editUserData = this.state.editUserData;
                          //console.log('theState: ', this.state);
                          var isStaff = editUserData.isStaff;
                          
                          if(!isStaff){
                            if(editUser && editUser.get('isStaff')){
                              isStaff = editUser && editUser.get('isStaff');
                            }else{
                              isStaff = false;
                            }
                          }
                         
                          isStaff = checked;
                          //console.log('memberIsStaff: ', isStaff, checked);
                        
                          // this.setState({ editUserData:{...editUserData, isStaff}});
                          if (checked){
                            isStaff = true;
                            this.setState({showOtherRoles:true, editUserData: {...editUserData, isStaff}});
                          }
                          else{
                            isStaff = false;
                            const staffRole = null;
                            // roles = null;
                            this.setState({showOtherRoles:false, editUserData: {...editUserData, isStaff, staffRole}});
                          }
                        }}
                        // onChange = {this.handleSwitch}
                      />
                    }
                    label={'Staff'}
                  />}
                  </FormGroup>
                }

                {(staffLevel2) && (this.state.showOtherRoles) && false &&
                  <FormGroup>

                  {false && <FormControlLabel
                    control={
                      <Switch
                        checked={this.state.editUserData.roles ? this.state.editUserData.roles.admin : (editUser ? editUser.getIn(['roles', 'admin']) : false)}
                        onChange={(event, checked) => {
                          var editUserData = this.state.editUserData;
                          // var roles = editUserData.roles ? {...editUser.get('roles').toJS(), admin:editUserData.roles.admin} : (editUser.get('roles') ? editUser.get('roles').toJS() : {});
                          var roles = editUserData.roles;
                          if(!roles){
                            if(editUser && editUser.get('roles')){
                              roles = editUser && editUser.get('roles').toJS();
                            }else{
                              roles = {};
                            }
                          }
                          roles.admin = checked;
                          // if (roles.admin){
                          //   roles.seniorCRO = false;
                          //   roles.superUser = false;
                          //   roles.superVisor = false;
                          //   roles.mc = false;
                          //   roles.trainer = false;
                          //   roles.shared = false;
                          // }
                          // console.log('therole: ', roles);
                          // console.log('editUserData: ', editUserData);
                          // this.setState({ editUserData });
                          this.setState({ editUserData:{...editUserData, roles}});
                        }}
                      />
                    }
                    label={'Admin'}
                  />}

                  {false && <FormControlLabel
                    control={
                      <Switch
                        checked={this.state.editUserData.roles ? this.state.editUserData.roles.superVisor : (editUser ? editUser.getIn(['roles', 'superVisor']) : false)}
                        onChange={(event, checked) => {
                          var editUserData = this.state.editUserData;
                          // var roles = editUserData.roles ? {...editUser.get('roles').toJS(), admin:editUserData.roles.admin} : (editUser.get('roles') ? editUser.get('roles').toJS() : {});
                          var roles = editUserData.roles;
                          if(!roles){
                            if(editUser && editUser.get('roles')){
                              roles = editUser && editUser.get('roles').toJS();
                            }else{
                              roles = {};
                            }
                          }
                          roles.superVisor = checked;
                          // if (roles.superVisor){
                          //   roles.seniorCRO = false;
                          //   roles.superUser = false;
                          //   roles.admin = false;
                          //   roles.mc = false;
                          //   roles.trainer = false;
                          //   roles.shared = false;
                          // }
                          // console.log('editUserData: ', editUserData);
                          // this.setState({ editUserData });
                          this.setState({ editUserData:{...editUserData, roles}});
                        }}
                      />
                    }
                    label={'Supervisor'}
                  />}

                  {false && <FormControlLabel
                    control={
                      <Switch
                        checked={this.state.editUserData.roles ? this.state.editUserData.roles.seniorCRO : (editUser ? editUser.getIn(['roles', 'seniorCRO']) : false)}
                        onChange={(event, checked) => {
                          var editUserData = this.state.editUserData;
                          // var roles = editUserData.roles ? {...editUser.get('roles').toJS(), admin:editUserData.roles.admin} : (editUser.get('roles') ? editUser.get('roles').toJS() : {});
                          var roles = editUserData.roles;
                          if(!roles){
                            if(editUser && editUser.get('roles')){
                              roles = editUser.get('roles').toJS();
                            }else{
                              roles = {}
                            }
                          }
                          roles.seniorCRO = checked;
                          // if (roles.seniorCRO){
                          //   roles.superVisor = false;
                          //   roles.superUser = false;
                          //   roles.admin = false;
                          //   roles.mc = false;
                          //   roles.trainer = false;
                          //   roles.shared = false;
                          // }
                          // console.log('editUserData: ', editUserData);
                          // this.setState({ editUserData });
                          this.setState({ editUserData:{...editUserData, roles}});
                        }}
                      />
                    }
                    label={'Senior CRO'}
                  />}

                  {false && <FormControlLabel
                    control={
                      <Switch
                        checked={this.state.editUserData.roles ? this.state.editUserData.roles.mc : (editUser ? editUser.getIn(['roles', 'mc']) : false)}
                        onChange={(event, checked) => {
                          var editUserData = this.state.editUserData;
                          // var roles = editUserData.roles ? {...editUser.get('roles').toJS(), admin:editUserData.roles.admin} : (editUser.get('roles') ? editUser.get('roles').toJS() : {});
                          var roles = editUserData.roles;
                          if(!roles){
                            if(editUser && editUser.get('roles')){
                              roles = editUser.get('roles').toJS();
                            }else{
                              roles = {}
                            }
                          }
                          roles.mc = checked;
                          // if (roles.mc){
                          //   roles.seniorCRO = false;
                          //   roles.superUser = false;
                          //   roles.admin = false;
                          //   roles.superVisor= false;
                          //   roles.trainer = false;
                          //   roles.shared = false;
                          // }
                          // console.log('editUserData: ', editUserData);
                          // this.setState({ editUserData });
                          this.setState({ editUserData:{...editUserData, roles}});
                        }}
                      />
                    }
                    label={'CRO'}
                  />}

                  {false && <FormControlLabel
                    control={
                      <Switch
                        checked={this.state.editUserData.roles ? this.state.editUserData.roles.trainer : (editUser ? editUser.getIn(['roles', 'trainer']) : false)}
                        onChange={(event, checked) => {
                          var editUserData = this.state.editUserData;
                          var roles = editUserData.roles;
                          if(!roles){
                            if(editUser && editUser.get('roles')){
                              roles = editUser.get('roles').toJS();
                            }else{
                              roles = {}
                            }
                          }
                          // var roles = editUserData.roles ? {...editUser.get('roles').toJS(), trainer:editUserData.roles.trainer} : (editUser.get('roles') ? editUser.get('roles').toJS() : {});
                          roles.trainer = checked;
                          // if (roles.trainer){
                          //   roles.seniorCRO = false;
                          //   roles.superUser = false;
                          //   roles.admin = false;
                          //   roles.superVisor= false;
                          //   roles.mc = false;
                          //   roles.shared = false;
                          // }
                          // console.log('editUserData: ', editUserData);
                          // this.setState({ editUserData });
                          this.setState({ editUserData:{...editUserData, roles}});
                        }}
                      />
                    }
                    label={'Trainer'}
                  />}

                  {false && <FormControlLabel
                    control={
                      <Switch
                        checked={this.state.editUserData.roles ? this.state.editUserData.roles.shared : (editUser ? editUser.getIn(['roles', 'shared']) : false)}
                        onChange={(event, checked) => {
                          var editUserData = this.state.editUserData;
                          var roles = editUserData.roles;
                          if(!roles){
                            if(editUser && editUser.get('roles')){
                              roles = editUser.get('roles').toJS();
                            }else{
                              roles = {}
                            }
                          }
                          // var roles = editUserData.roles ? {...editUser.get('roles').toJS(), trainer:editUserData.roles.trainer} : (editUser.get('roles') ? editUser.get('roles').toJS() : {});
                          roles.shared = checked;
                         
                          this.setState({ editUserData:{...editUserData, roles}});
                        }}
                      />
                    }
                    label={'Shared'}
                  />}
                </FormGroup>
              }

              {staffLevel2 && (this.state.editUserData? (this.state.editUserData.isStaff !== undefined)? this.state.editUserData.isStaff : (editUser && editUser.get('isStaff')) : false) && 
                <FormGroup>
                  <FormControl required style={{marginTop:32}}>
                    <FormLabel component="legend">Role</FormLabel>
                    <RadioGroup
                      aria-label="Role"
                      name="role"
                      value={this.state.editUserData.staffRole ? this.state.editUserData.staffRole : (editUser ? editUser.get('staffRole') : "nonStaff")}
                      onChange={this.handleChange('staffRole')}
                    >
                      {(isSuperUser || isAdmin) && <FormControlLabel value="admin" control={<Radio />} label="Admin" />}
                      <FormControlLabel value="supervisor" control={<Radio />} label="Supervisor" />
                      <FormControlLabel value="seniorCRO" control={<Radio />} label="Senior CRO" />
                      <FormControlLabel value="CRO" control={<Radio />} label="CRO" />
                      <FormControlLabel value="shared" control={<Radio />} label="Shared Service" />
                      <FormControlLabel value="trainer" control={<Radio />} label="Trainer" />
                      <FormControlLabel value="terminatedStaff" control={<Radio />} label="EX Staff" />
                    </RadioGroup>
                  </FormControl>
                  <FormControl required style={{marginTop:32}}>
                    <FormLabel component="legend">Branch</FormLabel>
                    <RadioGroup
                      aria-label="Branch"
                      name="branch"
                      value={this.state.editUserData.staffBranch ? this.state.editUserData.staffBranch : (editUser ? editUser.get('staffBranch') : null)}
                      onChange={this.handleChange('staffBranch')}
                    >
                      <FormControlLabel value="TTDI" control={<Radio />} label="TTDI" />
                      <FormControlLabel value="KLCC" control={<Radio />} label="KLCC" />
                    </RadioGroup>
                  </FormControl>
                </FormGroup>
              }

              {false && (!isStaff && memberId) &&
                <TextField
                  margin="dense"
                  id="memberId"
                  label="Member ID"
                  type="text"
                  value={memberId}
                  fullWidth
                  required
                  disabled
                />
              }
              {isSelectedUserStaff && <TextField
                margin="dense"
                id="staffname"
                label="Staff Name"
                defaultValue={editUser && editUser.get('name')}
                required
                fullWidth
                disabled={(!(isSuperUser || isAdmin) && isSelectedUserStaff)}
                onChange={this.handleChange('name')}
              />}
              {!isSelectedUserStaff && <TextField
                margin="dense"
                id="name"
                label="Member Name"
                defaultValue={editUser && editUser.get('name')}
                required
                fullWidth
                disabled={!roles || isShared}
                onChange={this.handleChange('name')}
              />}
              {isSelectedUserStaff && <TextField
                margin="dense"
                id="staffemail"
                label="Email Address"
                type="email"
                defaultValue={editUser && editUser.get('email')}
                fullWidth
                onChange={this.handleChange('email')}
                disabled={(!(isSuperUser) && isSelectedUserStaff)}
                required
              />}
               {!isSelectedUserStaff && <TextField
                margin="dense"
                id="email"
                label="Email Address"
                type="email"
                defaultValue={editUser && editUser.get('email')}
                fullWidth
                onChange={this.handleChange('email')}
                disabled={!roles || isShared || isTrainer}
                required
              />}
              <TextField
                margin="dense"
                id="phone"
                label="Phone Number"
                type="number"
                defaultValue={editUser && editUser.get('phone')}
                fullWidth
                onChange={this.handleChange('phone')}
                disabled={!roles || isShared || isTrainer}
                required
              />
              {(this.state.editUserData? (this.state.editUserData.staffRole === 'trainer')? true : editUser? (editUser.get('staffRole')==='trainer')? true:false:false:false) &&
                <div>
                  <TextField
                    margin="dense"
                    id="bio"
                    label="Bio"
                    type='text'
                    multiline
                    required
                    fullWidth
                    disabled={this.state.isScheduling}
                    onChange={this.handleChange('bio')}
                    defaultValue={editUser && editUser.get('bio')}
                  />
                  <FormGroup>
                    <FormControl required style={{marginTop:32}}>
                      <FormLabel component="legend">Tier</FormLabel>
                      <RadioGroup
                        aria-label="tier"
                        name="tier"
                        value={this.state.editUserData.tier ? this.state.editUserData.tier : (editUser ? editUser.get('tier') : null)}
                        onChange={this.handleChange('tier')}
                      >
                        <FormControlLabel value="1" control={<Radio />} label="1" />
                        <FormControlLabel value="2" control={<Radio />} label="2" />
                        <FormControlLabel value="3" control={<Radio />} label="3" />
                        <FormControlLabel value="X" control={<Radio />} label="X" />
                      </RadioGroup>
                    </FormControl>
                  </FormGroup>
                  {!teamLeaderId &&
                    <IntegrationAutosuggest key='trainersTeamLeader' selections='trainers' placeholder='Team Leader' onSelectionChange={selectedUserId => this.handleAutosuggest('teamLeaderId', selectedUserId)}/>
                  }
                  {teamLeaderId &&
                    <div style={{marginTop:16}}>
                      <FormLabel component="legend">Team Leader</FormLabel>
                      <Chip
                      avatar={teamLeaderAvatar}
                      label={teamLeaderName}
                      style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                      onDelete={()=>this.handleAutosuggest('teamLeaderId', null)}
                      />
                    </div>
                  }
                </div>
              }
            {!isStaff &&
              <div>
                <TextField
                  margin="dense"
                  id="nric"
                  label="IC/Passport ID"
                  // type="number"
                  type="text"
                  defaultValue={editUser && editUser.get('nric')}
                  fullWidth
                  onChange={this.handleChange('nric')}
                  disabled={!roles || isShared || isTrainer}
                  required
                />
                {false && <TextField
                  margin="dense"
                  id="passport"
                  label="Passport ID"
                  type="text"
                  defaultValue={editUser && editUser.get('passport')}
                  fullWidth
                  onChange={this.handleChange('passport')}
                  required
                />}

                {staffLevel5 && <FormGroup>
                  <FormControl required style={{marginTop:32}}>
                    <FormLabel component="legend">Gender</FormLabel>
                    <RadioGroup
                      aria-label="gender"
                      name="gender1"
                      value={this.state.editUserData.gender ? this.state.editUserData.gender : (editUser ? editUser.get('gender') : null)}
                      onChange={this.handleChange('gender')}
                    >
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                    </RadioGroup>
                  </FormControl>
                  <FormControl required style={{marginTop:32}}>
                    <FormLabel component="legend">Race</FormLabel>
                    <RadioGroup
                      aria-label="race"
                      name="race"
                      value={this.state.editUserData.race ? this.state.editUserData.race : (editUser ? editUser.get('race') : null)}
                      onChange={this.handleChange('race')}
                    >
                      <FormControlLabel value="malay" control={<Radio />} label="Malay" />
                      <FormControlLabel value="chinese" control={<Radio />} label="Chinese" />
                      <FormControlLabel value="indian" control={<Radio />} label="Indian" />
                      <FormControlLabel value="other" control={<Radio />} label="Other" />
                    </RadioGroup>
                  </FormControl>
                </FormGroup>}
                {/* {staffLevel4 && !isSelectedUserStaff && !trainerId &&
                  <IntegrationAutosuggest key='trainers' selections='trainers' placeholder='Trainer' onSelectionChange={selectedUserId => this.handleAutosuggest('trainerId', selectedUserId)}/>
                }
                {staffLevel4 && !isSelectedUserStaff && trainerId &&
                  <div style={{marginTop:16}}>
                    <FormLabel id="trainerId" component="legend">Trainer</FormLabel>
                    <Chip
                    avatar={trainerAvatar}
                    label={trainerName}
                    style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                    onDelete={()=>this.handleAutosuggest('trainerId', null)}
                    />
                  </div>
                } */}
                {/* {staffLevel4 && !isSelectedUserStaff && !mcId &&
                  <IntegrationAutosuggest key='mc' selections='membershipConsultants' placeholder='Membership Consultant' onSelectionChange={selectedUserId => this.handleAutosuggest('mcId', selectedUserId)}/>
                }
                {staffLevel4 && !isSelectedUserStaff && mcId &&
                  <div style={{marginTop:16}}>
                    <FormLabel id="mcColId" component="legend">Membership Consultant</FormLabel>
                    <Chip
                      avatar={mcAvatar}
                      label={mcName}
                      style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                      onDelete={()=>{
                        // 25/8/2020 - only staff level 2 can remove mcId
                        if (staffLevel2){this.handleAutosuggest('mcId', null)}
                      }}
                    />
                  </div>
                } */}
                {/* {staffLevel4 && !isSelectedUserStaff && !referredByUserId &&
                  <IntegrationAutosuggest key='referral' selections='activeMembers' placeholder='Referred By Member' onSelectionChange={selectedUserId => this.handleAutosuggest('referredByUserId', selectedUserId)}/>
                }
                {staffLevel4 && !isSelectedUserStaff && referredByUserId &&
                  <div style={{marginTop:16}}>
                    <FormLabel id="referredById" component="legend">Referred By Member</FormLabel>
                    <Chip
                    avatar={referredByUserAvatar}
                    label={referredByUserName}
                    style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                    onDelete={()=>this.handleAutosuggest('referredByUserId', null)}
                    />
                  </div>
                } */}
                {/* {staffLevel4 && !isSelectedUserStaff && <TextField
                  id="package"
                  select
                  defaultValue={currentUserPkgId}
                  label="Package"
                  margin="dense"
                  fullWidth
                  onChange={this.handleChange('packageId')}
                  // value={packageList}
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{
                    native: true,
                    MenuProps: {
                      className: classes.menu,
                    },
                  }}
                >
                  {packageOptions}
                </TextField>} */}
                {/* {staffLevel4 && !isSelectedUserStaff && <TextField
                  id="goal"
                  select
                  defaultValue={editUser && editUser.has('achieveTarget') ? editUser.get('achieveTarget') : null}
                  label="Achieve Target"
                  margin="dense"
                  fullWidth
                  onChange={this.handleChange('achieveTarget')}
                  InputLabelProps={{ shrink: true }}
                  SelectProps={{
                    native: true,
                    MenuProps: {
                      className: classes.menu,
                    },
                  }}
                >
                  {achieveTargetOptions}
                </TextField>} */}
                {/* {(editUserPackage && false) &&
                  <div>
                  <TextField
                    margin="dense"
                    id="joiningFee"
                    label="Joining Fee (RM)"
                    type="number"
                    defaultValue={`${editUserPackage.get('joiningFee')}`}
                    disabled
                    fullWidth
                    required
                  />
                  <TextField
                    margin="dense"
                    id="monthlyFee"
                    label="Monthly Fee (RM)"
                    type="number"
                    defaultValue={`${editUserPackage.get('monthlyFee')}`}
                    disabled
                    fullWidth
                    required
                  />
                  <TextField
                    margin="dense"
                    id="prepaidAmount"
                    label="Prepaid Amount (RM)"
                    type="number"
                    defaultValue={`${editUserPackage.get('prepaidAmount')}`}
                    disabled
                    fullWidth
                    required
                  />
                  <TextField
                    margin="dense"
                    id="freeGift"
                    label="Bonus Free Gift"
                    type="text"
                    defaultValue={editUserPackage.get('freeGift')}
                    disabled
                    fullWidth
                    required
                  />
                  <TextField
                    margin="dense"
                    id="freePT"
                    label="Bonus Free PT Sessions"
                    type="number"
                    defaultValue={editUserPackage.get('freePT')}
                    disabled
                    fullWidth
                    required
                  />
                  <TextField
                    margin="dense"
                    id="freeMonths"
                    label="Bonus Free Months"
                    type="number"
                    defaultValue={`${editUserPackage.get('freeMonths')}`}
                    disabled
                    fullWidth
                    required
                  />
              </div>
                }
                {false && <TextField
                  id="inductionDate"
                  label="Induction Date"
                  type="date"
                  required
                  margin="dense"
                  fullWidth
                  onChange={this.handleChange('inductionDate')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />} */}
                {/* {false && <FormGroup>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.editUserData.inductionDone ? this.state.editUserData.inductionDone : (editUser ? editUser.get('inductionDone') : false)}
                      onChange={(event, checked) => {
                        var editUserData = this.state.editUserData;
                        var inductionDone = checked;
                        this.setState({ editUserData:{...editUserData, 'inductionDone':inductionDone}});
                      }}
                    />
                  }
                  label={'Induction Done'}
                />
                </FormGroup>} */}
                
        {staffLevel4 && (this.state.showBranchDetails) && <IntegrationAutosuggest selections='branches' placeholder={branchLabel} onSelectionChange={branch => {
          this.handleAutosuggest('branch', branch);
          this.setState({showBranchDetails:false})
          
          }}/>}
        {staffLevel4 && !this.state.showBranchDetails && 
            <div style={{marginTop:16}}>
            <FormLabel component="legend">Branch</FormLabel>
            <Chip
                avatar={null}
                label={editUserBranchName? editUserBranchName: selectedUserBranchName? selectedUserBranchName:null }
                style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                onDelete={()=>{
                  this.handleAutosuggest('branch', null)
                  this.setState({showBranchDetails:true});
                }}
            />
            </div>
        }
        
        {staffLevel4 && this.state.showRoomNumber && <IntegrationAutosuggest selections='rooms' branchId={this.state.branch? this.state.branch:editUserCurrentBranchId? editUserCurrentBranchId:editUserBranchId} placeholder={roomNumberLabel} onSelectionChange={roomId => {
          this.handleAutosuggest('roomId', roomId)
          this.setState({showRoomNumber:false});
          }}/>}
        {staffLevel4 && !this.state.showRoomNumber &&
                    <div style={{marginTop:16}}>
                    <FormLabel component="legend">Room Number</FormLabel>
                    <Chip
                        avatar={null}
                        label={editUserDataRoomNumber? editUserDataRoomNumber:editUserRoomNumber?editUserRoomNumber:''}
                        style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                        onDelete={()=>{
                          this.handleAutosuggest('roomId', null);
                          this.setState({showRoomNumber:true})
                        }}
                    />
                    </div>
        }
              {staffLevel4 && !isSelectedUserStaff && editUserMembershipStarts &&
                  <TextField
                    id="startDate"
                    label="Start Date"
                    type="date"
                    required
                    value={moment(editUserMembershipStarts).format('YYYY-MM-DD')}
                    margin="dense"
                    fullWidth
                    onChange={this.handleChange('autoMembershipStarts')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    disabled={((isSuperUser || isAdmin || isSuperVisor) ) ? false : true}
                  />
                }
                {staffLevel4 && (!editUser || !editUserMembershipStarts) && !isSelectedUserStaff &&
                  <TextField
                    id="startDate"
                    label="Start Date"
                    type="date"
                    required
                    defaultValue={editUser && moment(editUserMembershipStarts).format('YYYY-MM-DD')}
                    margin="dense"
                    fullWidth
                    onChange={this.handleChange('autoMembershipStarts')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                }
                {staffLevel4 && !isSelectedUserStaff && <TextField
                  id="endDate"
                  // label={(editUserPackageId && (editUserPackageId === complimentaryPkg) || (editUserPackageId === complimentaryPromoPkg)) ? "End Date" : "Billing Date"}
                  label = {(editUserPackageId && (editUserPackageId === complimentaryPkg) || (editUserPackageId === complimentaryPromoPkg)) || this.state.enableBillDate?  "End Date" : "Billing Date" }
                  type="date"
                  required
                  defaultValue={editUser && moment(editUserAutoBilling).format('YYYY-MM-DD')}
                  margin="dense"
                  fullWidth
                  onChange={this.handleChange('membershipEnds')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  disabled = {((isAdmin || isSuperUser || isSuperVisor) && (this.state.enableBillDate || (editUserPackageName && editUserPackageName.toLowerCase().includes('complimentary'))))? false:true }
                  // disabled={isAdmin && editUserPackageId && (editUserPackageId === complimentaryPkg || editUserPackageId === complimentaryPromoPkg) ? false : true}
                />}
                <TextField
                  margin="dense"
                  id="remarks"
                  label="Remarks"
                  type='text'
                  multiline
                  required
                  fullWidth
                  onChange={this.handleChange('remarks')}
                  defaultValue={editUser && editUser.get('remarks')}
                  disabled={(staffLevel4) ? false : true}
                />
                {isStaff && staffLevel1 && false && 
                  <Button key={'terminateStaff'} className={classes.staffTerminateButton} raised onClick={()=>this.handleTerminateStaff()}>
                    {'Terminate'}
                  </Button>
                }
              </div>
            }

              </DialogContent>
              {!isStaff &&
                <DialogActions style={{margin:0}}>
                  {!isRegisteringCard &&
                    <Button key={'membershipCard'} className={classes.addButton} onClick={()=>this.handleRegisterCard()}>
                      {editUserGantnerCardNumber ? 'Change Membership Card' : 'Add Membership Card'}
                    </Button>
                  }
                  {isRegisteringCard &&
                    <Button key={'registerMembershipCard'} className={classes.addButton} onClick={()=>this.cancelRegisterCard()}>
                      {'Please tap card to reader'} <CircularProgress style={{color:'white'}}/>
                    </Button>
                  }
                </DialogActions>
              }
              <DialogActions style={{margin:0}}>
                <Button key={'cancel'} onClick={this.handleClose} color="primary">
                  Cancel
                </Button>
                <Button key={'saveEdit'} className={classes.bookButton} raised onClick={()=>this.handleSaveEdit()}>
                  {'Save'}
                </Button>
              </DialogActions>
            </Dialog>
          }
          <Dialog 
            key={'terminateDialog'} 
            open={this.state.terminateDialogOpen} 
            onClose={this.handleClose}
            >
            <DialogContent>
            <DialogTitle style={{textAlign:'center'}}>{'Termination'}</DialogTitle>
            <DialogContentText>{selectedUserName}</DialogContentText>
            <TextField
              id="startDate"
              label="Termination Date"
              type="date"
              required
              // defaultValue={(editUser && editUser.get('cancellationDate')) && moment(editUser.get('cancellationDate')).format('YYYY-MM-DD')}
              defaultValue = {this.props.selectedUser && this.props.selectedUser.get('cancellationDate') && moment(getTheDate(this.props.selectedUser.get('cancellationDate'))).format('YYYY-MM-DD')}
              margin="dense"
              fullWidth
              onChange={this.handleChange('cancellationDate')}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              margin="dense"
              id="cancellationReason"
              label="Reason"
              type='text'
              required
              fullWidth
              onChange={this.handleChange('cancellationReason')}
              defaultValue={this.props.selectedUser && this.props.selectedUser.get('cancellationReason')}
              // defaultValue={editUser && editUser.get('cancellationReason')}
            />
            </DialogContent>
            <DialogActions>
            <Button key={'cancel'} onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button 
              key={'saveEdit'} 
              className={classes.bookButton} 
              raised 
              onClick={()=>this.handleSaveEdit()}
              disabled = {!this.state.editUserData.cancellationDate}
              // roomRef = {roomRef.update({isAvailable:false})}
              >
              {'Save'}
              
            </Button>
            </DialogActions>
          </Dialog>
          {this.renderErrorDialog()}
          {(!this.props.addHidden && (isAdmin || isCRO)) && false && 
            <Button fab className={classes.fab} color='primary' onClick={()=>this.handleEdit()}>
              <AddIcon/>
            </Button>
          }
      </div>
    );
  }

}


PersonCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

const PersonCardStyled = withStyles(styles)(PersonCard);

const makeMapStateToProps = () => {
  const getSelectedUserOrLastCheckedIn = makeGetSelectedUserOrLastCheckedIn();
  const getSelectedUserOrLastCheckedInId = makeGetSelectedUserOrLastCheckedInId();

  const getCurrentUser = makeGetCurrentUser();
  const getUsers = makeGetAllUsers();
  const getStaff = makeGetStaff();
  const getInGymMap = makeGetInGymMap();
  const getCheckIn = makeGetCheckIn();
  const getCheckOut = makeGetCheckOut();
    const getBranch = makeGetBranch();
    const getRooms = makeGetRoom();
  const getSelectedUserGantnerLogs = makeGetSelectedUserGantnerLogs();
  const getSelectedUserInvoices = makeGetSelectedUserInvoices();
  const getUserFreeze = makeGetSelectedUserFreeze();
  const getUserFreezeItems = makeGetSelectedUserFreezeItems();
  const getSelectedUserReferredByUser = makeGetSelectedUserReferredByUser();
  // const getSelectedUserReferredToUser = makeGetSelectedUserReferredToUser();
  const mapStateToProps = (state, props) => {
    return {
      selectedUserOrLastCheckedInId: getSelectedUserOrLastCheckedInId(state, props),
      selectedUser: getSelectedUserOrLastCheckedIn(state, props),
      currentUser: getCurrentUser(state, props),
      users: getUsers(state, props),
      staff: getStaff(state, props),
      packages: getPackagesList(state, props),
      inGymMap: getInGymMap(state, props),
      checkIn: getCheckIn(state, props),
      checkOut: getCheckOut(state, props),
      branch: getBranch(state, props),
      rooms: getRooms(state, props),
      selectedUserGanterLogs: getSelectedUserGantnerLogs(state, props),
      selectedUserInvoiceId: getSelectedUserInvoices(state, props),
      userFreeze: getUserFreeze(state, props),
      userFreezeItems: getUserFreezeItems(state, props),
      selectedUserReferredByUser: getSelectedUserReferredByUser(state, props),
      // selectedUserReferredToUser: getSelectedUserReferredToUser(state, props),
      cardToRegister: getCardToRegisterState(state, props),
      isNative: state && state.state && state.state.get('isNative') ? true : false,
      isUploadingImage: state && state.state && state.state.get('isUploadingImage') ? true : false,
      uploadedImageURL: state && state.state && state.state.get('uploadedImageURL') ? state.state.get('uploadedImageURL') : null,
      uploadedImagePath: state && state.state && state.state.get('uploadedImagePath') ? state.state.get('uploadedImagePath') : null
    }
  }
  return mapStateToProps
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(makeMapStateToProps, mapDispatchToProps)(PersonCardStyled)
