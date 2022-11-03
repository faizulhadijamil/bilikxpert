import PhotoCamera from '@material-ui/icons/PhotoCamera';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles, Chip, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, 
  IconButton, TextField, GridList, GridListTile, GridListTileBar, Avatar, Switch, Radio, RadioGroup,
  Card, CardContent, Typography, Button
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import moment from 'moment';
import {getTheDate} from './actions'; 

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
import BabelLogo from './BabelLogo';
import IntegrationAutosuggest from './IntegrationAutosuggest';
import MenuAppBar from './MenuAppBar';
import UserPayments from './UserPayments';

const styles = theme => ({
  container: {
    paddingBottom: 370,
  },
  card: {
    overflow: 'hidden',
  },
  cardRoot: {
    padding: 0
  },
  gridList: {
    width: 'auto',
    height: 'auto',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16
    // padding: 16
  },
  tile: {
    position: 'relative',
    display: 'block', // In case it's not renderd with a div.
    overflow: 'hidden',
    borderRadius: 3,
    height: theme.spacing(9),
    backgroundColor: 'rgba(6,40,69,1)'
  },
  tileTitle: {
    paddingTop: theme.spacing(2),
    fontSize: 19,
    lineHeight: '22px',
    fontWeight: 700
  },
  subtitle: {
    whiteSpace: 'normal',
    paddingBottom: theme.spacing(2),
    fontSize: 15,
    lineHeight: '18px',
    fontWeight: 300
  },
  barRoot: {
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(6,40,69,1)'
  },
  fileInput: {
    display: 'none'
  },
  button: {
    fontSize: "0.875rem",
    textTransform: "uppercase",
    fontWeight: 500,
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    marginTop: theme.spacing(4),
    marginBottom: 0,
    backgroundColor: "#fde298",
    color: '#062845',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 2,
    minHeight: 36,
    minWidth: 88,
    // width: '100%',
    boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    justifyContent: 'flexEnd'
  },
  buttonDisabled: {
    fontSize: "0.875rem",
    textTransform: "uppercase",
    fontWeight: 500,
    fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
    backgroundColor: "#ccc",
    color: '#fff',
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 2,
    minHeight: 36,
    minWidth: 88,
    // width: '100%',
    boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    justifyContent: 'flexEnd'
  },
  content: {
    maxWidth: 600,
    marginRight: 'auto',
    marginLeft: 'auto',
    padding:16
  },
  bottomBar: {
    width: '100%',
    maxWidth: 600,
    marginRight: 'auto',
    marginLeft: 'auto',
    zIndex: 1200,
    minHeight: 56,
    position: 'fixed',
    backgroundColor: '#fff',
    // bottom: 56,
    right: 0,
    left: 0,
    boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)'
  },
  bottomRow: {
    justifyContent: 'left',
    alignItems: 'center',
    display: 'flex',
    overflowX: 'auto'
  },
  bottomRowSpaceAround: {
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    overflowX: 'auto'
  },
  bottomRowCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  bookButton: {
    margin: theme.spacing(1),
    backgroundColor: "#fde298",
    color: '#062845',
  },
  adminButton: {
    margin: theme.spacing(0.5),
    backgroundColor: "#fde298",
    color: '#062845',
    // alignSelf: 'flex-end'
  },
  roundButton: {
    width: 44,
    height: 44,
    margin: 0,
    padding: 0,
    borderRadius: '50%',
    minWidth: 0,
    color: '#fff',
    backgroundColor: '#fff',
    '&:hover': {
      background: theme.palette.primary['50']
    },
  },
  fab: {
    position: 'fixed',
    bottom: 56 + theme.spacing(2),
    right: theme.spacing(2),
    zIndex: 1300
  },
});

class Profile extends React.Component {

  state = {
    userId: null,
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
    daysToLoad: 5,
    scheduleDialogOpen : false,
    bookingDialogOpen : false,
    bookingUserId: null,
    bookingDuration:'30',
    freezeDialogOpen : false,
    freezeData : {}
    // bookingDate: moment().format('YYYY-MM-DD')
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps || this.state !== nextState) {
      return true;
    }
    return false;
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
  componentDidMount() {
    const user = this.props.currentUser;
    const currentLoginUseremail = user && user.get('email');
    const currentLoginUserId = user && user.get('id');
    this.setState({
      currentLoginUserId,
      currentLoginUseremail
    });

    window.scrollTo(0, 0)
    window.addEventListener('scroll', this.onScroll, false);
    this.updateForUser();
    // this.nearestAvailableSlot(this.state.bookingDate, this.state.bookingStart, this.state.bookingDuration);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
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


    if (this.props.uploadedImageURL || this.props.uploadedImagePath) {
      var updatedState = {};
      updatedState.image = this.props.uploadedImageURL;
      updatedState.imagePath = this.props.uploadedImagePath;
      updatedState.completeRegistration = true;
      this.setState({ ...updatedState
      })
      this.props.actions.setUploadedImage(null, null);
    }
    this.updateForUser(prevProps);
  }

  updateForUser(prevProps = null){
    const currentUser = this.props.currentUser;
    const currentUserId = currentUser && currentUser.get('id');
    const roles = currentUser && currentUser.get('roles');
    const isAdmin = roles && roles.get('admin') === true;
    const isMC = roles && roles.get('mc') === true;
    const isTrainer = roles && roles.get('trainer') === true;
    const prevSelectedUserId = (prevProps && prevProps.match && prevProps.match.params && prevProps.match.params.userId);
    const selectedUserId = (this.props && this.props.match && this.props.match.params && this.props.match.params.userId);
    if(selectedUserId){
      if((prevSelectedUserId !== selectedUserId || this.state.userId !== selectedUserId || prevProps.selectedUser !== this.props.selectedUser || prevProps.bookings !== this.props.bookings || prevProps.sessions !== this.props.sessions)){
        var updatedState = this.availableMoments();
        if ((isAdmin || isMC || isTrainer)){
          this.props.actions.getGantnerLogsByUserId(selectedUserId);

          // var updatedState = this.nearestAvailableSlot(this.state.bookingDate, this.state.bookingStart, this.state.bookingDuration, false);
          // var updatedState = this.state;
        }
        this.props.actions.getBookingsByTrainerId(selectedUserId);
        updatedState.userId = selectedUserId;
        // console.log(updatedState);
        this.setState({...updatedState});
      }
    }else if(currentUserId && this.state.userId !== currentUserId){
      this.setState({userId:currentUserId});
      this.props.actions.getGantnerLogsByUserId(currentUserId);
    }
  }

  onScroll = () => {
    if (
      (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)
    ) {
      // console.log("Load more");
      this.setState({
        ...this.state,
        daysToLoad: (this.state.daysToLoad + 5)
      })
    }
  }

  handleChange = name => event => {
    var updatedState = this.state;
    // console.log(name, event.target.value, updatedState);
    if (name === 'image') {
      const imageFile = event.target.files[0];
      if (imageFile) {
        this.props.actions.uploadImage(imageFile, (imageURL, imagePath) => {
          updatedState.image = imageURL;
          updatedState.imagePath = imagePath;
          this.setState({
            ...updatedState
          });
        });
      }
    }else{
      // var bookingDate = this.state.bookingDate;
      // var bookingStart = this.state.bookingStart;
      // var bookingDuration = this.state.bookingDuration;
      // var value = event.target.value;
      // if(name === 'bookingStart'){
      //   var mom = moment(value, 'HH:mm');
      //   var roundedMoment = this.nearestMinutes(15, mom);
      //   value = roundedMoment.format('HH:mm');
      //   bookingStart = value;
      // }else if(name === 'bookingDuration'){
      //   bookingDuration = value;
      //   console.log("!!!", bookingDuration);
      // }else if(name === 'bookingDate'){
      //   bookingDate = value;
      // }
      //
      // this.nearestAvailableSlot(bookingDate, bookingStart, bookingDuration);
    }
  }

  handleChangeAvailability = (day, periodIndex, isStart, dayAvailablity) => event => {

    var value = event ? event.target.value : null;
    this.updatedAvailabilityState(day, periodIndex, isStart, value, dayAvailablity);
    // console.log(day, periodIndex, event.target.value);

  }

  updatedAvailabilityState = (day, periodIndex, isStart, value, dayAvailablity) =>{
    var updatedState = this.state;
    var updatedAvailability = updatedState.availability || {};
    var updatedPeriods = updatedAvailability[day] || dayAvailablity || [];
    var updatedPeriod = updatedPeriods[periodIndex] || {};

    var mom = moment(value, 'HH:mm');
    var roundedMoment = this.nearestMinutes(15, mom);
    var roundedValue = roundedMoment.format('HH:mm');
    // console.log(roundedValue);
    // nearestPastMinutes(interval, someMoment)

    if(!value){
      updatedPeriod = null;
    }else if(isStart){
      updatedPeriod.start = roundedValue;
    }else{
      updatedPeriod.end = roundedValue;
    }
    if(updatedPeriod){
      updatedPeriods[periodIndex] = updatedPeriod;
    }else{
      updatedPeriods.splice(periodIndex, 1);
    }

    // console.log("updatedpe", updatedPeriods, updatedPeriod, dayAvailablity);

    updatedAvailability[day] = updatedPeriods;
    // console.log(updatedAvailability);
    updatedState.availability = updatedAvailability;
    this.setState({
      ...updatedState
    });
  }

  handleSaveAvailability = () => {
    const currentUser = this.props.currentUser;
    const roles = currentUser && currentUser.get('roles');
    const isAdmin = roles && roles.get('admin') === true;
    const isMC = roles && roles.get('mc') === true;
    const isTrainer = roles && roles.get('trainer') === true;

    const selectedUserId = (this.props && this.props.match && this.props.match.params && this.props.match.params.userId) || (currentUser && currentUser.get('id'));
    const isCurrentUser = selectedUserId && currentUser && currentUser.get('id') === selectedUserId;
    var userData = isCurrentUser ? currentUser : this.props.selectedUser;
    const selectedUserRoles = userData && userData.get('roles');
    const selectedUserIsTrainer = selectedUserRoles && selectedUserRoles.get('trainer') === true;

    const availability = selectedUserIsTrainer && userData && userData.get("availability") && userData.get("availability").toJS();

    const updatedAvailability = {
      ...availability,
      ...this.state.availability
    }
    if(selectedUserId && updatedAvailability){
      // console.log(selectedUserId, updatedAvailability);
      this.props.actions.saveUserData(selectedUserId, {availability:updatedAvailability});
    }
    this.handleClose();


  }

  handleSchedule = () => {
    this.setState({
      scheduleDialogOpen: true
    });
  };

  handleBookNow = (classId, sessionId, trainerId, activeSeat, longBookingLabel) => {
    const user = this.props.currentUser;
    const userId = user ? user.get('id') : null;
    const roles = user && user.get('roles');
    const isAdmin = roles && roles.get('admin') === true;
    if (isAdmin) {
      this.setState({
        bookingDialogOpen: true
      });
      // console.log(this.state);
      // this.handleMakeBooking();
    } else if (userId) {
      // adminMakePTBooking(trainerId, userId, bookerId, startsAt, duration)
      this.handleMakeBooking();
      // this.handleMakeBooking(classId, sessionId, trainerId, `${activeSeat}`, longBookingLabel)
    } else {
      // this.setState({
      //   bookingDialogOpen: true
      // });
    }
  };

  handleClose = () =>{
    this.setState({
      scheduleDialogOpen: false,
      bookingDialogOpen : false,
      availability : null,
      freezeDialogOpen : false
    });
  }

  availableMoments(){
    const currentUser = this.props.currentUser;
    const selectedUserId = (this.props && this.props.match && this.props.match.params && this.props.match.params.userId) || (currentUser && currentUser.get('id'));
    const isCurrentUser = selectedUserId && currentUser && currentUser.get('id') === selectedUserId;
    var userData = isCurrentUser ? currentUser : this.props.selectedUser;
    const selectedUserRoles = userData && userData.get('roles');
    const selectedUserIsTrainer = selectedUserRoles && selectedUserRoles.get('trainer') === true;

    const availability = selectedUserIsTrainer && userData && userData.get("availability") && userData.get("availability").toJS();
    var availableSessions = [];

    const sessions = this.props.sessions;
    const bookings = this.props.bookings;
    var unavailableTimes = [];
    // console.log(sessions, bookings, this.props);
    sessions && sessions.toKeyedSeq().forEach((v, k)=>{
      unavailableTimes.push([moment(getTheDate(v.get('startsAt'))), moment(getTheDate(v.get('endsAt'))).add(30, 'minutes')]);
      // console.log(k, v.get('startsAt'), v.get('endsAt'));
    });
    bookings && bookings.toKeyedSeq().forEach((v, k)=>{
      unavailableTimes.push([moment(getTheDate(v.get('startsAt'))), moment(getTheDate(v.get('endsAt')))]);
      // console.log(k, v.get('startsAt'), v.get('endsAt'));
    });
    // console.log(unavailableTimes);
    // console.log(selectedUserIsTrainer);

    // const bookingId = this.props.location.search.replace('?bid=', '');
    // const bookings = this.props.state && this.props.state.has('bookings') && this.props.state.hasIn(['bookings', 'bookingsById']) && this.props.state.getIn(['bookings', 'bookingsById']);
    // const booking = bookings && bookingId && bookings.get(bookingId);
    // booking && console.log(booking.toJS());
    // console.log(bookingId, bookings);
    // console.log(this.props.state && this.props.state.hasIn(['bookings', 'bookingsById']));
    // const bookingId = (this.props && this.props.match && this.props.match.params && this.props.match.params.userId) || (currentUser && currentUser.get('id'));

    sessions && bookings && availability && Object.keys(availability).forEach(weekday=>{
      var startMoment = moment().weekday(weekday);
      var sessionTimes = [];

      while(startMoment.isSameOrBefore(moment().add(1, 'months'))){
        const periods = availability[weekday];
        // console.log('periods', periods);
        periods.forEach(period=>{
          const periodStart = period.start;
          const periodEnd = period.end;
          const periodStartTimeMoment = moment(getTheDate(periodStart), 'HH:mm');
          const periodEndTimeMoment = moment(getTheDate(periodEnd), 'HH:mm');

          if(periodStart && periodEnd && periodStartTimeMoment.isBefore(periodEndTimeMoment)){
            const iterationStartMoment = startMoment.clone().hours(periodStartTimeMoment.hours()).minutes(periodStartTimeMoment.minutes()).seconds(0);
            const iterationEndMoment = startMoment.clone().hours(periodEndTimeMoment.hours()).minutes(periodEndTimeMoment.minutes()).seconds(0);
            const sessionStartMoment = iterationStartMoment.clone();
            var sessionEndMoment = sessionStartMoment.clone().add(30, 'minutes');
            while(moment().isSameOrBefore(sessionStartMoment) && sessionEndMoment.isSameOrBefore(iterationEndMoment)){
              // console.log(sessionStartMoment.toDate(), sessionEndMoment.toDate());
              const time = sessionStartMoment.toDate();
              const longDuration = sessionStartMoment.clone().add(60,'minutes').isSameOrBefore(iterationEndMoment);
              // sessionTimes.push({time:null});
              sessionTimes.push({time:time, longDuration:longDuration});

              //increment
              sessionStartMoment.add(15, 'minutes');
              sessionEndMoment = sessionStartMoment.clone().add(30, 'minutes');
            }
            // sessionStartMoment.add(30)
            // console.log(iterationStartMoment.toDate(), iterationEndMoment.toDate());
          }
        });

        //increment 1 week
        if(sessionTimes.length > 0){
          sessionTimes.sort((a,b)=>{
            const dateA = a.time;
            const dateB = b.time;
            if(dateA < dateB){
              return -1;
            }
            if(dateB < dateA){
              return 1;
            }
            return 0;
          });
          sessionTimes = sessionTimes.filter(x=>{
            const availableStartMoment = moment(x.time);
            const availableEndMoment = x.longDuration ? availableStartMoment.clone().add(60, 'minutes') : availableStartMoment.clone().add(30, 'minutes');
            var remove = false;
            unavailableTimes.forEach(uT=>{
              const unavailableStartMoment = uT[0];
              const unavailableEndMoment = uT[1];
              if(!remove){
                remove = availableStartMoment.isBetween(unavailableStartMoment, unavailableEndMoment) || availableEndMoment.isBetween(unavailableStartMoment, unavailableEndMoment);
                if(remove){
                  // console.log(availableStartMoment.isBetween(unavailableStartMoment, unavailableEndMoment), availableEndMoment.isBetween(unavailableStartMoment, unavailableEndMoment), availableStartMoment.toDate(), availableEndMoment.toDate());
                  return;
                }
              }

            });

            return !remove;

          });
          const sessionDate = moment(startMoment.format('YYYY-MM-DD')).toDate();
          availableSessions.push({date:sessionDate, times:[...sessionTimes]});
          sessionTimes.length = 0;
        }
        startMoment.add(1, 'weeks');

      }

    });

    var updatedState = this.state;
    if(availableSessions.length > 0){
      availableSessions.sort((a,b)=>{
        const dateA = a.date;
        const dateB = b.date;
        if(dateA < dateB){
          return -1;
        }
        if(dateB < dateA){
          return 1;
        }
        return 0;
      });
      if(!updatedState.bookingDate){
        updatedState.bookingDate = availableSessions[0].date;
      }
      if(!updatedState.bookingStart){
        updatedState.bookingStart = availableSessions[0].times[0].time;
      }
      if(!updatedState.bookingDuration || (updatedState.bookingDuration === '60' && !availableSessions[0].times[0].longDuration)){
        updatedState.bookingDuration = '30';
      }
      updatedState.availableSessions = availableSessions;
      updatedState.hideBookings = false;
    }else{
      updatedState.availableSessions = null;
      updatedState.hideBookings = true;
    }
    // const sessions = this.props && this.props.state && this.props.state.sessions;
    // console.log(this.props.sessions);
    updatedState.hideBookings = true;
    return updatedState;
    // this.setState({...updatedState});
    // console.log(updatedState, availableSessions);
  }

  handleMakeBooking = (classId, sessionId, trainerId, seat, longBookingLabel) => {
    this.handleClose();
    const currentUser = this.props.currentUser;
    const selectedUserId = (this.props && this.props.match && this.props.match.params && this.props.match.params.userId) || (currentUser && currentUser.get('id'));
    const isCurrentUser = selectedUserId && currentUser && currentUser.get('id') === selectedUserId;
    var userData = isCurrentUser ? currentUser : this.props.selectedUser;
    const selectedUserRoles = userData && userData.get('roles');
    const selectedUserIsTrainer = selectedUserRoles && selectedUserRoles.get('trainer') === true;

    const startsTimeMoment = moment(this.state.bookingStart, 'HH:mm');
    const startsAtMoment = moment(this.state.bookingDate).hours(startsTimeMoment.hours()).minutes(startsTimeMoment.minutes());
    const endsAtMoment = startsAtMoment.clone().add(parseInt(this.state.bookingDuration), 'minutes');
    this.props.actions.adminMakePTBooking(selectedUserId, this.state.bookingUserId || currentUser.get('id'), currentUser.get('id'), startsAtMoment.toDate(), endsAtMoment.toDate(), parseInt(this.state.bookingDuration));

    // const classData = classId && this.props.state.getIn(['classes', 'classesById', classId]);
    //
    // const label = "Booked " + classData.get('name') + longBookingLabel.slice(4);
    //
    // const user = this.props.state.get('user');
    // const userId = user ? user.get('id') : null;
    // const roles = user && user.get('roles');
    // const isAdmin = roles && roles.get('admin') === true;
    // const selectedUserId = this.state.selectedUserId;
    //
    // if (isAdmin) {
    //   // const selectedUser = selectedUserId && this.props.state.has('users') ? this.props.state.getIn(['users', 'usersById', selectedUserId]) : null;
    //   // console.log("Selected User", selectedUser);
    //   // const selectedUserName = selectedUser && selectedUser.has('name') ? selectedUser.get('name') : null;
    //   // const selectedUserEmail = selectedUser && selectedUser.has('email') ? selectedUser.get('email') : null;
    //   // const selectedUserPhone = selectedUser && selectedUser.has('phone') ? selectedUser.get('phone') : null;
    //   if (selectedUserId) {
    //     this.props.actions.adminMakeBooking(classId, sessionId, trainerId, seat, selectedUserId, userId);
    //   } else {
    //     this.props.actions.adminMakeBooking(classId, sessionId, trainerId, seat, userId, userId);
    //   }
    //
    // } else {
    //   const name = this.state.name ? this.state.name : user.get('name');
    //   const email = this.state.email ? this.state.email : user.get('email');
    //   const phone = this.state.phone ? this.state.phone : user.get('phone');
    //
    //   this.props.actions.makeBooking(classId, sessionId, trainerId, name, email, phone, seat, label, userId);
    // }

    // console.log('booking classId: ' + classId + ' sessionId: ' + sessionId, trainerId, seat, longBookingLabel);


  };

  handleCancelBooking = (bookingId) => {
    // this.setState({
    //   booking: null
    // });
    // this.props.actions.cancelBooking(bookingId);
  }

  nearestMinutes(interval, someMoment){
    const roundedMinutes = Math.round(someMoment.clone().minute() / interval) * interval;
    return someMoment.clone().minute(roundedMinutes).second(0);
  }
  //
  // nearestPastMinutes(interval, someMoment){
  //   const roundedMinutes = Math.floor(someMoment.minute() / interval) * interval;
  //   return someMoment.clone().minute(roundedMinutes).second(0);
  // }
  //
  // nearestFutureMinutes(interval, someMoment){
  //   const roundedMinutes = Math.ceil(someMoment.minute() / interval) * interval;
  //   return someMoment.clone().minute(roundedMinutes).second(0);
  // }

  handleAdd = () => {

  }

  handleFreeze = (editUserId) =>{
    this.setState({
      freezeDialogOpen:true,
      editUserId:editUserId,
      freezeData:{}
    });
  }

  handleAddFreeze = name => event => {
    var value = event.target.value;
    var freezeData = this.state.freezeData || {};
    if (name === 'freezeDate') {
      value = moment(value).toDate();
      freezeData.freezeDate = value;
    } else if (name === 'freezeQuantity') {
      value = parseInt(value);
      freezeData.freezeQuantity = value;
    }

    this.setState({
      freezeData: { ...freezeData
      }
    });


  }

  handleSaveFreeze = () => {
    const editUserId = this.state.editUserId;
    const freezeData = this.state.freezeData;
    const freezeDate = freezeData.freezeDate;
    const freezeQuantity = freezeData.freezeQuantity || 1;
    if (editUserId && freezeDate && freezeQuantity > 0 && freezeQuantity < 12) {
      this.props.actions.addFreeze(editUserId, freezeDate, freezeQuantity);
    }
    this.handleClose();
  }


  render() {
    const {
      classes
    } = this.props;

    const user = this.props.currentUser;
    // const roles = user && user.get('roles');
    //const roles = user && user.get('staffRole');
    // const isAdmin =  roles && roles.get('admin') === true;
    // const isSuperUser = roles && roles.get('superUser') === true;
    // const isCRO = roles && roles.get('mc') === true;
    // const isTrainer = roles && roles.get('trainer') === true;
    // const isSuperVisor = roles && roles.get('superVisor') === true;
    // const isseniorCRO = roles && roles.get('seniorCRO') === true;
    //const isAdmin =  roles && (roles === 'admin');
    const roles = user && user.get('staffRole');
    const isSuperUser = roles && (roles === 'superUser');
    const isCRO = roles && (roles === 'CRO');
    //const isTrainer = roles && (roles === 'trainer');
    const isSuperVisor = roles && (roles === 'supervisor');
    const isSeniorCRO = roles && (roles === 'seniorCRO');
    const isShared = roles && (roles === 'shared');
    const staffBranch = user && user.get('staffBranch');
    const branchLabel = 'Branch';
    const roomNumberLabel = 'Room Number';

    const staffLevel0 = isSuperUser;
    const staffLevel1 = isSuperUser || isAdmin;
    const staffLevel2 = isSuperUser || isAdmin || isSuperVisor;
    const staffLevel3 = isSuperUser || isAdmin || isSuperVisor || isSeniorCRO;
    const staffLevel4 = isSuperUser || isAdmin || isSuperVisor || isSeniorCRO || isCRO;
    const staffLevel5 = isSuperUser || isAdmin || isSuperVisor || isSeniorCRO || isCRO || isTrainer;
    const staffLevel6 = isSuperUser || isAdmin || isSuperVisor || isSeniorCRO || isCRO || isTrainer || isShared;

    var isStaff = false;
    if (editUser && editUser.get('isStaff')){
      // console.log('selected member is staff: ', editUser && editUser.get('isStaff'));
      isStaff = true;
    }

    const branchesData = this.props.branch || null;
    const branchSize = branchesData && branchesData.size;
    const branchId = this.state.branch || null;
    console.log('theBranchId: ', branchId);

    const roomsData = this.props.rooms || null;
    const selectedRoomId = this.state.roomId;

    const currentUser = this.props.currentUser;
    //const roles = currentUser && currentUser.get('roles');
    const isAdmin = roles && roles.get('admin') === true;
    const isMC = roles && roles.get('mc') === true;
    const isTrainer = roles && roles.get('trainer') === true;

    const packages = this.props.packages;
    const complimentaryPkg = 'yKLfNYOPzXHoAiknAT24';
    const complimentaryPromoPkg = 'L6sJtsKG68LpEUH3QeD4';

    const selectedUserId = (this.props && this.props.match && this.props.match.params && this.props.match.params.userId) || (currentUser && currentUser.get('id'));
    const isCurrentUser = selectedUserId && currentUser && currentUser.get('id') === selectedUserId;

    var userData = isCurrentUser ? currentUser : this.props.selectedUser;
    const selectedUserName = userData && userData.has('name') && userData.get('name') ? userData.get('name') : null;
    const selectedUserMembershipCard = userData && userData.has('membershipCard') && userData.get('membershipCard') ? userData.get('membershipCard') : null;
    const selectedUserPhone = userData && userData.has('phone') && userData.get('phone') ? userData.get('phone') : null;
    const selectedUserEmail = userData && userData.has('email') && userData.get('email') ? userData.get('email') : null;

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

      var branchName = '';
      const selectedBranch = branchesData && branchesData.filter((x, key)=>{
          if (key === editUserCurrentBranchId){
              branchName = x.has('name')? x.get('name'):'';
              return true;
          }
          return false;
      }).first();

    var editUserMembershipStarts = editUserStartDate ? editUserStartDate : editUserFirstVisit;
    const editUserStartDate = editUser && editUser.has('autoMembershipStarts') && editUser.get('autoMembershipStarts') ? getTheDate(editUser.get('autoMembershipStarts')) : null;
    const editUserFirstVisit = editUser && editUser.has('membershipStarts') && editUser.get('membershipStarts') ? getTheDate(editUser.get('membershipStarts')) : null;
    
    const selectedUserRoomId = userData && userData.has('currentRoomId') ? userData.get('currentRoomId') : null; 
    // console.log('selectedBranch: ', selectedBranch);
     const selectedUserBranchName = selectedBranch && selectedBranch.get('name'); 
     const editUserBranchId = this.state.editUserData.branch;
    
     const editUserRoomId = editUser && editUser.get('currentRoomId');

    // const selectedUserPackageId = userData && userData.has('packageId') ? userData.get('packageId') : null;
    // const selectedUserPackageData = selectedUserPackageId && packages && packages.has(selectedUserPackageId) ? packages.get(selectedUserPackageId) : null;
    // const selectedUserPackageName = selectedUserPackageData && selectedUserPackageData.get('name');
    const hasImage = userData && userData.has('image') && userData.get('image') ? true : false;
    const hasPackage = userData && userData.has('packageId') && userData.get('packageId') ? true : false;
    var canChangeImage = false;
    if (isCurrentUser) {
      if (hasImage) {
        if (isAdmin || isMC || isTrainer) {
          canChangeImage = true;
        } else {
          canChangeImage = false;
        }
      } else {
        canChangeImage = true;
      }
    } else if (isAdmin || isMC) {
      canChangeImage = true;
    }

    var memberId;
    if (editUser) {
      if (editUser.get('nric')) {
        memberId = editUser.get('nric');
      } else {
        memberId = editUser.get('passport');
      }
    }
    console.log('editUser : ',this.state);

    const image = this.state.image;
    const canSaveImage = canChangeImage && this.state.image && this.state.image !== (userData && userData.has('image') && userData.get('image') ? userData.get('image') : null);
    const selectedUserImage = image ? image : (userData && userData.has('image') ? userData.get('image') : null);
    const selectedUserAvatar = selectedUserImage || (selectedUserName && selectedUserName.length > 0) ?
      (selectedUserImage ? (<Avatar src={selectedUserImage} style={{marginLeft:'auto', marginRight:'auto', width:128, height:128, fontSize:'3.5rem'}} />) : 
     (<PhotoCamera style={{width:128, height:128, color:'#fff'}}/>)) 
      :null;

    const selectedUserRoles = userData && userData.get('roles');
    const selectedUserIsAdmin = selectedUserRoles && selectedUserRoles.get('admin') === true;
    const selectedUserIsOps = selectedUserRoles && selectedUserRoles.get('ops') === true;
    const selectedUserIsTrainer = selectedUserRoles && selectedUserRoles.get('trainer') === true;
    const selectedUserIsStaff = selectedUserIsAdmin || selectedUserIsTrainer || selectedUserIsOps;
    const selectedUserTrainerBio = selectedUserIsTrainer && userData && userData.get('bio');
    const selectedUserTrainerTier = selectedUserIsTrainer && userData && userData.get('tier');

    const editUserCurrentBranchId = (editUser && editUser.has('currentBranch'))? editUser.get('currentBranch'):null;
    const editUserAutoBilling = editUser && editUser.has('autoMembershipEnds') && editUser.get('autoMembershipEnds') ? getTheDate(editUser.get('autoMembershipEnds')) : (editUser && editUser.has('membershipEnds') && editUser.get('membershipEnds') ? getTheDate(editUser.get('membershipEnds')) : null);
    const editUserPackageName = editUserPackage && editUserPackage.get('name');

    const isSelectedUserStaff = editUser && editUser.get('isStaff');

    var teamLeaderId = editUser && editUser.get('teamLeaderId');
    if (editUserData && 'teamLeaderId' in editUserData) {
      teamLeaderId = editUserData.teamLeaderId;
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

    const teamLeader = teamLeaderId && this.props.staff.has(teamLeaderId) ? this.props.staff.get(teamLeaderId) : null;
    const teamLeaderName = teamLeader && teamLeader.has('name') ? teamLeader.get('name') : null;
    const teamLeaderImage = teamLeader && teamLeader.has('image') ? teamLeader.get('image') : null;
    const teamLeaderAvatar = teamLeaderImage || (teamLeaderName && teamLeaderName.length > 0) ?
      (teamLeaderImage ? (<Avatar src={teamLeaderImage} />) : (<Avatar>{teamLeaderName.charAt(0).toUpperCase()}</Avatar>)) :
      null;

    var days = [];
    if (true) {
      var gantnerLogs = isCurrentUser ? this.props.currentUserGanterLogs : this.props.selectedUserGanterLogs;
      const selectedUserGanterLogs = gantnerLogs ? gantnerLogs.sort((a, b) => {
        const nameA = a.get('createdAt');
        const nameB = b.get('createdAt');
        if (nameA > nameB) {return -1;}
        if (nameA < nameB) {return 1;}
        return 0;
      }) : null;

      var editUserPackageId = editUser && editUser.get('packageId');
      var editUserPackage = packages && packages.get(editUserPackageId);
      if (editUserData && editUserData.packageId) {
        editUserPackage = packages && packages.get(editUserData.packageId);
      }



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

      const selectedUserGanterLogsByDay = selectedUserGanterLogs ? selectedUserGanterLogs.groupBy(x => moment(getTheDate(x.get('createdAt'))).format('YYYY-MM-DD')) : null;
      var showSpinner = false;
      if (selectedUserGanterLogsByDay && selectedUserGanterLogsByDay.size > 0) {
        selectedUserGanterLogsByDay.toKeyedSeq().forEach((dayValue, dayKey) => {
          console.log('dayValue: ', dayValue);
          console.log('dayKey: ', dayKey);
          if (days.length >= this.state.daysToLoad) {
            return;
          }
          var dayItems = [];
          var previousCheckinMoment = null;
          const sortedDayValue = dayValue.sort((a, b) => {
            const nameA = a.get('createdAt');
            const nameB = b.get('createdAt');
            if (nameA < nameB) {return -1;}
            if (nameA > nameB) {return 1;}
            return 0;
          })
          sortedDayValue.toKeyedSeq().forEach((v, k) => {
            const createdAt = v.get('createdAt') ? v.get('createdAt') : null;
            const createdAtMoment = createdAt && moment(getTheDate(createdAt));
            if (createdAtMoment) {
              if (previousCheckinMoment && previousCheckinMoment.isSame(createdAtMoment, 'day')) {
                //check out
                if (v.get('deviceId') === 'Check In') {
                  dayItems.pop();
                  dayItems.push(
                    <GridListTile key={k} cols={2} classes={{tile:classes.tile}} style={{}}>
                      <GridListTileBar
                        classes={{title:classes.tileTitle, subtitle:classes.subtitle, root:classes.barRoot}}
                        title={'Visited Club'}
                        subtitle={`${previousCheckinMoment.format('h:mm A')} - ${createdAtMoment.format('h:mm A')}`}
                        actionIcon={
                          <img src ={require("./assets/babel-icon.png")} alt="logo" style={{width:64, height:64}} />
                        }
                      />
                    </GridListTile>
                  );
                }
                previousCheckinMoment = null;

              } else {
                //check in
                previousCheckinMoment = createdAtMoment;
                dayItems.push(
                  <GridListTile key={k} cols={2} classes={{tile:classes.tile}} style={{}}>
                    <GridListTileBar
                      classes={{title:classes.tileTitle, subtitle:classes.subtitle, root:classes.barRoot}}
                      title={'Visited Club'}
                      subtitle={createdAtMoment.format('h:mm A')}
                      actionIcon={
                        <img src ={require("./assets/babel-icon.png")} alt="logo" style={{width:64, height:64}} />
                      }
                    />
                  </GridListTile>
                );
              }
            }

          });

          if (dayItems.length > 0) {
            var gridStyle = {}
            if (days.length + 1 === this.state.daysToLoad) {
              // gridStyle.paddingBottom = 400;
              showSpinner = true;
            }
            days.push(
              <GridList key={dayKey} className={classes.gridList} spacing={16} cellHeight='auto' style={gridStyle}>
                <GridListTile key={dayKey} cols={2} style={{ height: 'auto' }}>
                <Typography type="title">
                  {false && dayKey}
                  {true && moment(getTheDate(dayKey)).calendar(null, {
                    sameDay: '[Today], MMMM Do',
                    nextDay: '[Tomorrow], MMMM Do',
                    nextWeek: 'dddd, MMMM Do',
                    lastDay: '[Yesterday], MMMM Do',
                    lastWeek: '[Last] dddd, MMMM Do',
                    sameElse: 'dddd, MMMM Do'
                })}
                </Typography>
                </GridListTile>
                {dayItems}
              </GridList>
            );
          }

        });
      }
    }

    const availability = selectedUserIsTrainer && userData && userData.get("availability") && userData.get("availability").toJS();
    const daysOfWeek = ['1', '2', '3', '4', '5', '6', '0'];
    var availabilityForms = [];
    daysOfWeek.forEach(day=>{
      const dayAvailablity = (this.state.availability && this.state.availability[day]) || (availability && availability[day]) || [{start:null, end:null}]; // || ([{start:"13:00", end:null}, {start:null, end:null}, {start:null, end:null}]);
      var dayPeriods = [];
      // console.log(dayAvailablity);
      var periodIndex = 0;
      var firstOrNeedsPeriod = true;
      const dayPeriod = (index, start, end) => (
        <FormGroup key={index} row>
          <TextField
            id="start"
            label="From"
            type="time"
            required
            value={start}
            margin='dense'
            onChange={this.handleChangeAvailability(day, index, true, dayAvailablity)}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              inputProps: {
                step: 60, // 5 min
              },
            }}
          />
        {start !== '' &&
            <div>
              <TextField
                id="end"
                label="To"
                type="time"
                required
                value={end}
                margin='dense'
                onChange={this.handleChangeAvailability(day, index, false, dayAvailablity)}
                InputLabelProps={{
                  shrink: true,
                }}
                InputProps={{
                  inputProps: {
                    step: 900, // 5 min
                  },
                }}
                style={{marginLeft:8}}
              />
              <IconButton onClick={()=>{
                  console.log('clear');
                  this.updatedAvailabilityState(day, index, false, null, dayAvailablity);
                }
              }>
                <CloseIcon />
              </IconButton>
            </div>
          }
        </FormGroup>
      );
      dayAvailablity.forEach(period=>{
        // console.log(period);
        const periodStart = period.start || '';
        const periodEnd = period.end || '';
        if(firstOrNeedsPeriod){
          dayPeriods.push(dayPeriod(periodIndex, periodStart, periodEnd));
          periodIndex += 1;
          firstOrNeedsPeriod = periodEnd !== '';
        }
      });

      if(firstOrNeedsPeriod){
        dayPeriods.push(dayPeriod(periodIndex, '', ''));
      }

      const availabilityForm = (
          <div key={day} style={{marginBottom:16}}>
            <FormGroup row>
              <FormLabel key={day}>
                {moment().weekday(day).format('dddd')}
              </FormLabel>
            </FormGroup>
            {dayPeriods}
          </div>
      );
      availabilityForms.push(availabilityForm);
    });

    const bottomBarStyle = (currentUser && currentUser.has('id')) ? {
      bottom: 56
    } : {
      bottom: 0
    };

    const availableSessions = this.state.availableSessions;
    var dateButtons = [];
    var timeButtons = [];
    var durationButtons = [];
    availableSessions && availableSessions.forEach(sessionDate=>{
      const date = sessionDate.date;
      const isSelectedDate = this.state.bookingDate.getTime() === date.getTime();
      if(isSelectedDate){
        const times = sessionDate.times;
        times && times.forEach(sessionTime=>{
          const time = sessionTime.time;
          const isSelectedTime = this.state.bookingStart.getTime() === time.getTime();
          if(isSelectedTime){
            timeButtons.push((
              <Button key={time.getTime()} raised style={{color:'#fff', backgroundColor:'#062845', marginTop:4, marginBottom:4, marginRight:8, marginLeft:8}} onClick={()=>this.setState({bookingStart:time, bookingDuration:'30'})}>{moment(time).format('H:mm A')}</Button>
            ));
            var durations = ['30'];
            if(sessionTime.longDuration){
              durations.push('60');
            }
            durations.forEach(duration=>{
              const isSelectedDuration = this.state.bookingDuration === duration;
              if(isSelectedDuration){
                durationButtons.push((
                  <Button key={duration} raised style={{color:'#fff', backgroundColor:'#062845', marginTop:0, marginBottom:0, marginRight:8, marginLeft:8}} onClick={()=>this.setState({bookingDuration:duration})}>{`${duration} mins`}</Button>
                ))
              }else{
                durationButtons.push((
                  <Button key={duration} style={{marginTop:0, marginBottom:0, marginRight:8, marginLeft:8}} onClick={()=>this.setState({bookingDuration:duration})}>{`${duration} mins`}</Button>
                ))
              }
            });
          }else{
            timeButtons.push((
              <Button key={time.getTime()} style={{marginTop:4, marginBottom:4, marginRight:8, marginLeft:8}} onClick={()=>this.setState({bookingStart:time, bookingDuration:'30'})}>{moment(time).format('H:mm A')}</Button>
            ));
          }
        });
        dateButtons.push((
          <Button key={date.getTime()} raised style={{color:'#fff', backgroundColor:'#062845', marginTop:4, marginBottom:4, marginRight:8, marginLeft:8}} onClick={()=>this.setState({bookingDate:date, bookingStart:sessionDate.times[0].time, bookingDuration:'30'})}>{moment(date).format('ddd, MMM D')}</Button>
        ));
      }else{
        dateButtons.push((
          <Button key={date.getTime()} style={{marginTop:4, marginBottom:4, marginRight:8, marginLeft:8}} onClick={()=>this.setState({bookingDate:date, bookingStart:sessionDate.times[0].time, bookingDuration:'30'})}>{moment(date).format('ddd, MMM D')}</Button>
        ));
      }

    })

    const bookingUserId = this.state.bookingUserId;
    const bookingUser = bookingUserId && this.props.users
      ? this.props.users.get(bookingUserId)
      : null;
    const bookingUserName = bookingUser && bookingUser.has('name')
      ? bookingUser.get('name')
      : null;
    const bookingUserEmail = bookingUser && bookingUser.has('email')
      ? bookingUser.get('email')
      : null;
    const bookingUserPhone = bookingUser && bookingUser.has('phone')
      ? bookingUser.get('phone')
      : null;
    const bookingUserImage = bookingUser && bookingUser.has('image')
      ? bookingUser.get('image')
      : null;
    const bookingUserAvatar = bookingUserImage || (bookingUserName && bookingUserName.length > 0)
      ? (
        bookingUserImage
        ? (<Avatar src={bookingUserImage}/>)
        : (<Avatar>{bookingUserName.charAt(0).toUpperCase()}</Avatar>))
      : null;
    const bookingUserChips = (<div>
      <Chip avatar={bookingUserAvatar} label={bookingUserName} style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 16,
          fontSize: '1rem',
          fontWeight: '500'
        }} onDelete={() => this.setState({bookingUserId:null})}/> {
        bookingUserEmail && <Chip avatar={<Avatar><EmailIcon/></Avatar>} label={bookingUserEmail} style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              fontSize: '0.75rem',
              marginTop: 16
            }}/>
      }
      {
        bookingUserPhone && <Chip avatar={<Avatar><PhoneIcon/></Avatar>} label={bookingUserPhone} style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              fontSize: '0.75rem',
              marginTop: 16
            }}/>
      }
    </div>);

    const bookingId = this.props.location.search.replace('?bid=', '');
    const bookings = this.props.allBookings;
    const booking = bookings && bookingId && bookings.get(bookingId) && !bookings.get(bookingId).get('cancelledAt') && bookings.get(bookingId);
    const selectedBookingUserId = booking && booking.get('userId');
    const selectedBookingUser = selectedBookingUserId && this.props.users && this.props.users.get(selectedBookingUserId)
      ? this.props.users.get(selectedBookingUserId)
      : (selectedBookingUserId && currentUser && currentUser.get('id') && currentUser.get('id') === selectedBookingUserId ? currentUser : null);
    const selectedBookingUserName = selectedBookingUser && selectedBookingUser.get('name');
    // booking && console.log(booking.toJS(), selectedBookingUserId, selectedBookingUser);
    // console.log(bookingId);

    // bookings && console.log(bookings.toJS());
    // console.log(this.props.state && this.props.state.hasIn(['bookings', 'bookingsById']));
    var editUserData = this.state.editUserData;
    console.log('canChangeImage:' , canChangeImage);

    return (
      <div>
        <MenuAppBar/>
          {true && <div className={classes.container}>
            <Card style={{boxShadow:null, marginLeft:0}} className={classes.card} elevation={0}>
            {true && <CardContent classes={{root:classes.cardRoot}}>
                {!userData &&
                  <div style={{backgroundColor:'#062845', paddingTop:96, paddingBottom:32, height:240}} />
                }
                {userData &&
                  <div style={{backgroundColor:'#062845', paddingTop:96, paddingBottom:32}}>
                    {!canChangeImage &&
                      <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
                        <IconButton color="primary" component="span" style={{marginTop:32, marginBottom:32}} >
                          {selectedUserImage || (selectedUserName && selectedUserName.length > 0) ?
                            (selectedUserImage ? (<Avatar src={selectedUserImage} style={{marginLeft:'auto', marginRight:'auto', width:128, height:128, fontSize:'3.5rem'}} />) : (<Avatar style={{marginLeft:'auto', marginRight:'auto', width:128, height:128, fontSize:'3.5rem'}}>{selectedUserName.charAt(0).toUpperCase()}</Avatar>)) :
                            null}
                        </IconButton>
                      </div>
                      
                    }
                    {(canChangeImage && this.props.isNative) &&
                      <div>
                        <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
                          <IconButton color="primary" component="span" style={{marginTop:32, marginBottom:32}} disabled={this.props.isUploadingImage} onClick={()=>this.props.actions.useNativeCamera()}>
                            {selectedUserAvatar}
                          </IconButton>
                        </div>
                        <div style={{display:'flex', flex:1, marginLeft:32, marginRight:32, justifyContent:'center'}}>
                          <Button raised component="span" color='primary' key={'uploadPhoto'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} disabled={this.props.isUploadingImage} onClick={()=>this.props.actions.useNativeLibrary()}>
                            {this.state.image || hasImage ? 'Change Photo' : 'Upload Photo' }
                            {this.props.isUploadingImage &&
                              <CircularProgress style={{color:'white', marginLeft:8}}/>
                            }
                          </Button>
                        </div>
                        {canSaveImage &&
                          <div style={{display:'flex', flex:1, marginLeft:32, marginRight:32, justifyContent:'center'}}>
                          <Button raised component="span" color='primary' key={'savePhoto'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.saveUserData(selectedUserId, {image:this.state.image, imagePath:this.state.imagePath})}>
                            {'Save'}
                          </Button>
                          </div>
                        }
                      </div>
                    }
                    {(canChangeImage && !this.props.isNative) &&
                      <div>
                        <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
                        <input accept="image/*" className={classes.fileInput} id="icon-button-file" type="file" onChange={this.handleChange('image')} disabled={this.props.isUploadingImage} />
                          <label htmlFor="icon-button-file" >
                            <IconButton color="primary" component="span" style={{marginTop:32, marginBottom:32}}>
                              {selectedUserAvatar}
                            </IconButton>
                          </label>
                        </div>
                        <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
                        <input accept="image/*" className={classes.fileInput} id="icon-button-file" type="file" onChange={this.handleChange('image')} />
                          <label htmlFor="icon-button-file" >
                            <Button raised component="span" color='primary' key={'uploadPhoto'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} disabled={this.props.isUploadingImage} >
                              {this.state.image || hasImage ? 'Change Photo' : 'Upload Photo' }
                              {this.props.isUploadingImage &&
                                <CircularProgress style={{color:'white', marginLeft:8}}/>
                              }
                            </Button>
                          </label>
                        </div>
                        {canSaveImage &&
                          <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
                          <label>
                            <Button raised component="span" color='primary' key={'savePhoto'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.saveUserData(selectedUserId, {image:this.state.image, imagePath:this.state.imagePath})}>
                              {'Save'}
                            </Button>
                          </label>
                          </div>
                        }
                      </div>
                    }
                    {true && //!isTrainer && hasPackage && //
                      <div style={{display:'flex', flex:1, marginLeft:32, marginRight:32, justifyContent:'center'}}>
                        <Button raised component="span" color='primary' key={'ptAvailability'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.handleFreeze(selectedUserId)}>
                          {'Freeze Membership'}
                        </Button>
                      </div>
                    }
                    {((isCurrentUser && isTrainer) || (selectedUserIsTrainer && isAdmin)) &&
                      <div style={{display:'flex', flex:1, marginLeft:32, marginRight:32, justifyContent:'center'}}>
                        <Button raised component="span" color='primary' key={'ptAvailability'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.handleSchedule()}>
                          {'PT Availability'}
                        </Button>
                      </div>
                    }
                    <Typography type="headline" component="h1" color="inherit" style={{textAlign:'center', marginTop:32, color:'white'}}>
                      {selectedUserName}
                    </Typography>
                    {selectedUserMembershipCard &&
                      <Typography type="subheading" component="p" gutterBottom color="primary" style={{textAlign:'center', color:'#fff'}} disabled>
                        {`#${selectedUserMembershipCard}`}
                      </Typography>
                    }
                    {(!isCurrentUser && !selectedUserIsStaff && selectedUserPhone) &&
                      <Chip onClick={()=>window.open(`tel:${selectedUserPhone}`)} avatar={<Avatar><PhoneIcon color='primary'/></Avatar>} label={`${selectedUserPhone}`} style={{marginTop:16, marginLeft:'auto', marginRight:'auto'}}/>
                    }
                    {(!isCurrentUser && !selectedUserIsStaff && selectedUserEmail) &&
                      <Chip onClick={()=>window.open(`mailto:${selectedUserEmail}`)} avatar={<Avatar><EmailIcon color='primary'/></Avatar>} label={`${selectedUserEmail}`} style={{marginTop:16, marginLeft:'auto', marginRight:'auto'}}/>
                    }
                    {selectedUserTrainerTier &&
                      <Typography type="subheading" component="p" gutterBottom color="primary" style={{textAlign:'center', color:'#fff'}}>
                        {`Tier ${selectedUserTrainerTier}`}
                      </Typography>
                    }
                    {selectedUserTrainerBio &&
                      <div className={classes.content}>
                        <Typography type="subheading" component="p" gutterBottom color="primary" style={{textAlign:'justify', color:'#fff', paddingLeft:16, paddingRight:16}}>
                          {selectedUserTrainerBio}
                        </Typography>
                      </div>
                    }
                  </div>
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
                label="Customer Name"
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
                    {/* {( userData && selectedUserId && selectedUserId.length > 0 && selectedUserRoomId) &&
                      <Button key={'checkInOutRoom'} className={classes.addButton} onClick={()=>this.props.actions.addCheckInOut(selectedUserId)}>
                        {'Check Out'}
                      </Button>
                    }

                    {( userData && selectedUserId && selectedUserId.length > 0 && !(editUser || editUserId === 'NEW') && (!this.state.addingCard && !this.state.addingTempCard)) &&
                      <Button key={'editButton'} className={classes.addButton} onClick={()=>
                      {
                        this.handleEdit(selectedUserId)
                        // this.handleShowEditDialog(selectedUserId)
                      }}>
                        {'Edit'}
                      </Button>
                    } */}

                {(!selectedUserIsTrainer && days.length === 0) &&
                  <GridList key={'timelineGrid'} className={classes.gridList} spacing={16} cellHeight='auto'>
                    <GridListTile key={'timelineTitle'} cols={2} style={{ height: 'auto', marginTop:16 }}>
                      <Typography type="title" style={{textAlign:'center', color:'rgba(0, 0, 0, 0.54)'}}>
                        {isCurrentUser ? "You have no past events" : `No past events`}
                      </Typography>
                    </GridListTile>
                  </GridList>
                }

                {days}
                {showSpinner &&
                  <CircularProgress style={{margin:'auto', display:'block', marginTop:32, height:64, width:64}}/>
                }
                <BabelLogo/>
            </CardContent>}
              {(!booking && selectedUserIsTrainer && !this.state.hideBookings) &&
                <div className={classes.bottomBar} style={bottomBarStyle}>
                  <div className={classes.bottomRow}>
                    <Typography type="subheading" component="p" color="primary" style={{margin:8}}>
                      {"Select a Date"}
                    </Typography>

                  </div>
                  <div className={classes.bottomRow}>
                    {dateButtons}
                  </div>
                  <Divider style={{marginTop:8}}/>
                  <div className={classes.bottomRow}>
                    <Typography type="subheading" component="p" color="primary" style={{margin:8}}>
                      {"Select a Time"}
                    </Typography>
                  </div>
                  <div className={classes.bottomRow}>
                    {timeButtons}
                  </div>
                  <Divider style={{marginTop:8}}/>
                  <div className={classes.bottomRow}>
                    <Typography type="subheading" component="p" color="primary" style={{margin:8}}>
                      {"Select a Duration"}
                    </Typography>
                  </div>
                  <div className={classes.bottomRowSpaceAround}>
                    {durationButtons}
                    {true &&
                      <Button className={classes.bookButton} raised disabled={!this.state.bookingDate || !this.state.bookingStart || !this.state.bookingDuration} onClick={()=>this.handleBookNow()}>
                        {isAdmin ? 'Add Booking' : 'Book Now'}
                      </Button>
                    }
                    {false &&
                      <Button className={classes.bookButton} raised onClick={()=>console.log('cancel')}>
                        {'Cancel Booking'}
                      </Button>
                    }
                  </div>
                </div>
              }
              {(booking && selectedUserIsTrainer) &&
                <div className={classes.bottomBar} style={bottomBarStyle}>
                  <div className={classes.bottomRowSpaceAround}>
                    <Typography type="title" component="p" color="primary" style={{
                        padding: 8 * 2
                      }}>
                      {`Booking for ${selectedBookingUserName} on ${moment(booking.get('startsAt')).format('ddd, D MMM')} from ${moment(booking.get('startsAt')).format('h:mm A')} to ${moment(booking.get('endsAt')).format('h:mm A')}`}
                    </Typography>
                    <Button className={classes.bookButton} raised onClick={()=>this.props.actions.cancelBooking(bookingId)}>
                      {'Cancel Booking'}
                    </Button>
                  </div>
                </div>
              }
            </Card>
          </div>}
          <Dialog key={'scheduleDialog'} open={this.state.scheduleDialogOpen} onClose={this.handleClose}>

              <DialogTitle>{'Available For PT'}</DialogTitle>
              <DialogContent>
              <FormControl>
                {availabilityForms}
              </FormControl>
              </DialogContent>
              <DialogActions>
              <Button key={'cancel'} onClick={this.handleClose} color="primary">
                Cancel
              </Button>
              <Button key={'saveAvailability'} className={classes.bookButton} raised onClick={this.handleSaveAvailability}>
                Save
              </Button>
              </DialogActions>
          </Dialog>
          <Dialog key={'bookingDialog'} open={this.state.bookingDialogOpen} onClose={this.handleClose}>
                <DialogTitle>{isAdmin? 'Add Booking' : 'Book Your Session'}</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    {`Training with ${selectedUserName} on ${moment(this.state.bookingDate).format('ddd, D MMMM')} at ${moment(this.state.bookingDate).format('H:mm A')} for ${this.state.bookingDuration} minutes`}
                  </DialogContentText>
                  {isAdmin && !bookingUserId && <IntegrationAutosuggest onSelectionChange={bookingUserId => this.setState({bookingUserId})}/>}
                  {!selectedUserId &&
                    <div>
                    <TextField
                      margin="dense"
                      id="name"
                      label="Name"
                      required
                      fullWidth
                      disabled={this.state.isBooking}
                      onChange={this.handleChange('name')}
                    />
                    <TextField
                      margin="dense"
                      id="email"
                      label="Email Address"
                      type="email"
                      fullWidth
                      disabled={this.state.isBooking}
                      onChange={this.handleChange('email')}
                      required
                    />
                    <TextField
                      margin="dense"
                      id="phone"
                      label="Phone Number"
                      type="number"
                      fullWidth
                      disabled={this.state.isBooking}
                      onChange={this.handleChange('phone')}
                      required
                    />
                    </div>
                  }
                  {bookingUserId && bookingUserChips}
                </DialogContent>
                <DialogActions>
                <Button key={'cancel'} onClick={this.handleClose} color="primary">
                  Cancel
                </Button>
                <Button key={'makebooking'} className={classes.bookButton} raised onClick={()=>{
                    this.handleMakeBooking();
                    console.log("Booking");
                  }
                }>
                  {isAdmin ? 'Add Booking' : 'Book Now'}
                </Button>
                </DialogActions>
              </Dialog>
              <Dialog key={'freezeDialog'} open={this.state.freezeDialogOpen} onClose={this.handleClose}>
                <DialogContent>
                <DialogTitle style={{textAlign:'center'}}>Freeze Your Membership</DialogTitle>
                <TextField
                  id="freezeDate"
                  label="Freeze Date"
                  type="date"
                  required
                  margin="dense"
                  fullWidth
                  onChange={this.handleAddFreeze('freezeDate')}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  margin="dense"
                  id="freezeMonths"
                  label="Free Months"
                  type='number'
                  fullWidth
                  required
                  onChange={this.handleAddFreeze('freezeQuantity')}
                  defaultValue={`1`}
                />
                </DialogContent>
                <DialogActions>
                <Button key={'cancel'} onClick={this.handleClose} color="primary">
                  Cancel
                </Button>
                <Button key={'saveEdit'} className={classes.bookButton} raised onClick={()=>this.handleSaveFreeze()}>
                  {'Add Freeze'}
                </Button>
                </DialogActions>
              </Dialog>
              {(!isCurrentUser && !selectedUserIsStaff && (isAdmin || isMC || isTrainer)) &&
                <Button fab className={classes.fab} color='primary' onClick={()=>this.handleAdd()}>
                  <AddIcon/>
                </Button>
              }
      </div>
    );
  }

}


Profile.propTypes = {
  classes: PropTypes.object.isRequired,
};

const ProfileStyled = withStyles(styles)(Profile);

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
  //const getSelectedUser = makeGetSelectedUser();
  const getSelectedUserGantnerLogs = makeGetSelectedUserGantnerLogs();
  const getSelectedUserReferredByUser = makeGetSelectedUserReferredByUser();
  const getAllUsers = makeGetAllUsers();
  //const getSessions = makeGetSessions();
  //const getBookings = makeGetBookings();
  const mapStateToProps = (state, props) => {
    // const currentUser = getCurrentUser(state, props);
    // const selectedUserId = (this.props && this.props.match && this.props.match.params && this.props.match.params.userId) || (currentUser && currentUser.get('id'));
    // console.log(selectedUserId);
    return {
      currentUser: getCurrentUser(state, props),
      selectedUserOrLastCheckedInId: getSelectedUserOrLastCheckedInId(state, props),
      //selectedUser: getSelectedUser(state,props),
      //currentUserGanterLogs: getCurrentUserGantnerLogs(state, props),
      selectedUserGanterLogs: getSelectedUserGantnerLogs(state, props),
      users: getAllUsers(state, props),
      staff: getStaff(state, props),
      packages: getPackagesList(state, props),
      inGymMap: getInGymMap(state, props),
      checkIn: getCheckIn(state, props),
      checkOut: getCheckOut(state, props),
      branch: getBranch(state, props),
      rooms: getRooms(state, props),
      //sessions: getSessions(state, props),
      //bookings: getBookings(state, props),
      cardToRegister: getCardToRegisterState(state, props),
      //selectedUserReferredByUser: getSelectedUserReferredByUser(state, props),
      allBookings: state.state && state.state.has('bookings') && state.state.hasIn(['bookings', 'bookingsById']) && state.state.getIn(['bookings', 'bookingsById']),
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

export default connect(makeMapStateToProps, mapDispatchToProps)(ProfileStyled)
