import PhotoCamera from '@material-ui/icons/PhotoCamera';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles, Chip, CircularProgress, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle, Divider, FormControl, FormGroup, FormLabel, 
  IconButton, TextField, GridList, GridListTile, GridListTileBar, Avatar,
  Card, CardContent, Typography, Button
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import AddIcon from '@material-ui/icons/Add';
import React from 'react';
import moment from 'moment';
import {getTheDate} from './actions'; 

import PropTypes from 'prop-types';

import {
  makeGetAllUsers,
  makeGetCurrentUser,
  makeGetSelectedUser,
  makeGetBranch,
  makeGetRoom,
  makeGetSessions,
  makeGetBookings
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
    search: '',
    daysToLoad: 5,
    scheduleDialogOpen : false,
    bookingDialogOpen : false,
    bookingUserId: null,
    bookingDuration:'30',
    freezeDialogOpen : false,
    freezeData : {},
    editUserState:false,
    branchId: null,
    roomId: null,
    roomNumberLabel: '',
    roomNumber: '',
    startDate: '',
    remark: null,
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps || this.state !== nextState) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    window.addEventListener('scroll', this.onScroll, false);
    this.updateForUser();
    // this.nearestAvailableSlot(this.state.bookingDate, this.state.bookingStart, this.state.bookingDuration);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
  }

  componentDidUpdate(prevProps) {
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
      var value = event.target.value;
      if (name === 'email' && value && value.length > 0) {
        value = value.toLowerCase();
      }else if(name==='phone'){
        value = value.replace(/[^0-9]/g, '');
      }else if(name==='name'){
        value = value.replace(/[0-9:]+/g, '');
      }
      updatedState[name] = value;
      this.setState({ ...updatedState });
    }
   
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
    // }
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

  handleAutosuggest = (name, value) => {
    var valueMap = {};
    valueMap[name] = value;
    this.setState({ ...valueMap });
  }

  render() {
    const {classes} = this.props;
    const {editUserState, branchId} = this.state;

    const currentUser = this.props.currentUser;
    const roles = currentUser && currentUser.get('roles');
    const isAdmin = roles && roles.get('admin') === true;
    const isMC = roles && roles.get('mc') === true;
    const isTrainer = roles && roles.get('trainer') === true;

    const selectedUserId = (this.props && this.props.match && this.props.match.params && this.props.match.params.userId) || (currentUser && currentUser.get('id'));
    const isCurrentUser = selectedUserId && currentUser && currentUser.get('id') === selectedUserId;

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

    var userData = isCurrentUser ? currentUser : this.props.selectedUser;
    const selectedUserName = userData && userData.has('name') && userData.get('name') ? userData.get('name') : null;
    const selectedUserMembershipCard = userData && userData.has('membershipCard') && userData.get('membershipCard') ? userData.get('membershipCard') : null;
    const selectedUserPhone = userData && userData.has('phone') && userData.get('phone') ? userData.get('phone') : null;
    const selectedUserEmail = userData && userData.has('email') && userData.get('email') ? userData.get('email') : null;
    const selectedUserBranchId = userData && userData.has('currentBranch') ? userData.get('currentBranch'):null;
    const selectedUserStartDate = this.state.startDate? this.state.startDate:(userData && userData.has('autoMembershipStarts'))? userData.get('autoMembershipStarts'):'';
    //const selectedUserStartDate = userData && userData.has('autoMembershipStarts') && userData.get('autoMembershipStarts') ? userData.get('autoMembershipStarts') : null;
    const remark = userData && userData.has('remark') ? userData.get('remark'):'';

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

    const image = this.state.image;
    const canSaveImage = canChangeImage && this.state.image && this.state.image !== (userData && userData.has('image') && userData.get('image') ? userData.get('image') : null);
    const selectedUserImage = image ? image : (userData && userData.has('image') ? userData.get('image') : null);
    const selectedUserAvatar = selectedUserImage || (selectedUserName && selectedUserName.length > 0) ?
      (selectedUserImage ? (<Avatar src={selectedUserImage} style={{marginLeft:'auto', marginRight:'auto', width:128, height:128, fontSize:'3.5rem'}} />) : 
     (<PhotoCamera style={{width:128, height:128, color:'#D9E3F0'}}/>)) 
      :null;

    const selectedUserRoles = userData && userData.get('roles');
    const selectedUserIsAdmin = selectedUserRoles && selectedUserRoles.get('admin') === true;
    const selectedUserIsOps = selectedUserRoles && selectedUserRoles.get('ops') === true;
    const selectedUserIsTrainer = selectedUserRoles && selectedUserRoles.get('trainer') === true;
    const selectedUserIsStaff = selectedUserIsAdmin || selectedUserIsTrainer || selectedUserIsOps;
    

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

    const branchesData = this.props.branch || null;
    const roomsData = this.props.rooms || null;

    console.log('theState: ', this.state);

    var branchName;
    var editBranchName;
    branchesData && branchesData.filter((x, key)=>{
      if (this.state.branchId && key === this.state.branchId){
        editBranchName = x.has('name')? x.get('name'):'';
        return true;
      }
      else if (key === selectedUserBranchId){
        branchName = x.has('name')? x.get('name'):'';
        return true;
      }
      else{
        return false;  
      }
    }).first();

    var roomNumber, editRoomNumber;
    const selectedUserRoomId = userData && userData.has('currentRoomId') ? userData.get('currentRoomId') : null; 
    roomsData && roomsData.filter((x, key)=>{
      const isAvailable = x.has('isAvailable')? x.get('isAvailable'):true;
      if (this.state.roomId && key === this.state.roomId && isAvailable){
        editRoomNumber = x.has('roomNumber')? x.get('roomNumber'):'';
        return true;
      }
      else if (key === selectedUserRoomId){
        roomNumber = x.has('roomNumber')? x.get('roomNumber'):'';
        return true;
      }
      else{
        return false;
      }
    }).first();
    
    console.log('canChangeImage123: ', canChangeImage);
    return (
      <div>
        <MenuAppBar/>
          {<div className={classes.container}>
            <Card style={{boxShadow:null, marginLeft:0}} className={classes.card} elevation={0}>
            {true && <CardContent classes={{root:classes.cardRoot}}>
                {!userData &&
                  <div style={{backgroundColor:'#062845', paddingTop:96, paddingBottom:32, height:240}} />
                }
                {userData &&
                  <div style={{backgroundColor:'#062845', paddingTop:96, paddingBottom:32}}>
                    {!canChangeImage &&
                      <div style={{display:'flex', flex:1, backgroundColor:'red', marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
                        <IconButton color="primary" component="span" style={{backgroundColor:'red', marginTop:32, marginBottom:32}} >
                          {selectedUserImage || (selectedUserName && selectedUserName.length > 0) ?
                            (selectedUserImage ? (<Avatar src={selectedUserImage} style={{marginLeft:'auto', marginRight:'auto', width:128, height:128, fontSize:'3.5rem'}} />) : (<Avatar style={{marginLeft:'auto', marginRight:'auto', width:128, height:128, fontSize:'3.5rem'}}>{selectedUserName.charAt(0).toUpperCase()}</Avatar>)) :
                            null}
                        </IconButton>
                      </div>
                      
                    }
                    {(!canChangeImage && !this.props.isNative) &&
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
                          <div style={{display:'flex', flex:1, marginLeft:0, marginRight:0, justifyContent:'center'}}>
                          <Button raised component="span" color='primary' key={'savePhoto'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.saveUserData(selectedUserId, {image:this.state.image, imagePath:this.state.imagePath})}>
                            {'Save'}
                          </Button>
                          </div>
                        }
                      </div>
                    }
                    {(canChangeImage && this.props.isNative) &&
                      <div>
                        <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
                        <input accept="image/*" className={classes.fileInput} id="icon-button-file" type="file" onChange={this.handleChange('image')} disabled={this.props.isUploadingImage} />
                          <label htmlFor="icon-button-file" >
                            <IconButton color="#D9E3F0" component="span" style={{marginTop:0, marginBottom:0}}>
                              {selectedUserAvatar}
                            </IconButton>
                          </label>
                        </div>
                        <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center', padding:1, backgroundColor:'white'}}>
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
                        {
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
                    <Typography type="headline" component="h1" color="inherit" style={{textAlign:'center', marginTop:0, color:'white'}}>
                      {selectedUserName}
                    </Typography>
                    <Typography type="headline" component="h1" color="inherit" style={{textAlign:'center', marginTop:0, color:'white'}}>
                      {selectedUserEmail}
                    </Typography>
                    {selectedUserMembershipCard &&
                      <Typography type="subheading" component="p" gutterBottom color="primary" style={{textAlign:'center', color:'#fff'}} disabled>
                        {`#${selectedUserMembershipCard}`}
                      </Typography>
                    }
                    {(!isCurrentUser && !selectedUserIsStaff && selectedUserPhone) &&
                      <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
                        <Chip onClick={()=>window.open(`tel:${selectedUserPhone}`)} avatar={<Avatar><PhoneIcon color='primary'/></Avatar>} label={`${selectedUserPhone}`} style={{marginTop:16, marginLeft:'auto', marginRight:'auto'}}/>
                      </div>
                    }
                  </div>
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

                <Button key={'editUserState'} 
                  onClick={()=>{this.setState({editUserState:editUserState?false:true})}} color="primary">
                  {editUserState? `HIDE`:`EDIT USER`}
                </Button>
                {editUserState &&
                   <div style={{display:'flex', flex:1, marginLeft:10, marginRight:10, justifyContent:'center', flexDirection:'column',color:'primary'}}>
                      <TextField
                        margin="dense"
                        id="name"
                        label="Name"
                        defaultValue={selectedUserName}
                        required
                        fullWidth
                        onChange={this.handleChange('name')}
                      />
                      <TextField
                        margin="dense"
                        id="name"
                        label="Email"
                        defaultValue={selectedUserEmail}
                        required
                        fullWidth
                        onChange={this.handleChange('email')}
                      />
                      <TextField
                        margin="dense"
                        id="phone"
                        label="Phone Number"
                        type="number"
                        defaultValue={selectedUserPhone}
                        fullWidth
                        onChange={this.handleChange('phone')}
                        required
                      />
                      {(this.state.showBranchDetails) && <IntegrationAutosuggest selections='branches' placeholder={'Branch'} onSelectionChange={branch => { this.setState({showBranchDetails:false});this.handleAutosuggest('branchId', branch)}}/>}
                      {(!this.state.showBranchDetails) && <div style={{marginTop:16}}>
                        <FormLabel component="legend">Branch</FormLabel>
                        <Chip
                            avatar={null}
                            label={editBranchName? editBranchName:branchName?branchName:null}
                            style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                            onDelete={()=>{
                              this.handleAutosuggest('branchId', null);
                              this.setState({showBranchDetails:true});
                            }}
                        />
                      </div>}
                      {this.state.showRoomNumber && <IntegrationAutosuggest selections='rooms' branchId={this.state.branchId? this.state.branchId:selectedUserBranchId? selectedUserBranchId:null} placeholder={'Room Number'} onSelectionChange={roomId => {
                        this.handleAutosuggest('roomId', roomId)
                        this.setState({showRoomNumber:false});
                        }}/>}
                      {!this.state.showRoomNumber &&
                        <div style={{marginTop:16}}>
                        <FormLabel component="legend">Room Number</FormLabel>
                        <Chip
                            avatar={null}
                            label={editRoomNumber? editRoomNumber:roomNumber?roomNumber:''}
                            style={{marginTop:8, fontSize:'1rem', fontWeight:'500'}}
                            onDelete={()=>{
                              this.handleAutosuggest('roomId', null);
                              this.setState({showRoomNumber:true})
                            }}
                        />
                        </div>
                      }

                      <TextField
                      margin="dense"
                      id="startDate"
                      label="Start Date"
                      type="date"
                      defaultValue={selectedUserStartDate}
                       value={selectedUserStartDate}
                      fullWidth
                      onChange={this.handleChange('startDate')}
                      required
                       />
                      
                      <TextField
                        margin="dense"
                        id="remark"
                        label="Notes/Remarks"
                        defaultValue={remark}
                        value={remark}
                        fullWidth
                        onChange={this.handleChange('remark')}
                        required
                      />
                    <Button key={'saveUserData'} 
                      onClick={()=>{
                        this.props.actions.saveUserData(selectedUserId, 
                          {
                            name:this.state.name?this.state.name:selectedUserName,
                            email:this.state.email?this.state.email:selectedUserEmail,
                            phone:this.state.phone? this.state.phone:selectedUserPhone,
                            currentBranch:this.state.branchId? this.state.branchId:selectedUserBranchId,
                            currentRoomId:this.state.roomId? this.state.roomId:selectedUserRoomId,
                            remark:this.state.remark,
                            autoMembershipStarts:this.state.startDate? this.state.startDate:selectedUserStartDate,
                            image:this.state.image, 
                            imagePath:this.state.imagePath
                            /// ni state picture baru x ada. letak kat sini
                          }
                        )
                      }} color="primary">
                      {`SAVE`}
                    </Button>
                   </div>
                }
                <BabelLogo/>
            </CardContent>}
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
  const getCurrentUser = makeGetCurrentUser();
  const getSelectedUser = makeGetSelectedUser();
  const getAllUsers = makeGetAllUsers();
  const getBranch = makeGetBranch();
  const getRooms = makeGetRoom();
  const getSessions = makeGetSessions();
  const mapStateToProps = (state, props) => {
    // const currentUser = getCurrentUser(state, props);
    // const selectedUserId = (this.props && this.props.match && this.props.match.params && this.props.match.params.userId) || (currentUser && currentUser.get('id'));
    // console.log(selectedUserId);
    return {
      currentUser: getCurrentUser(state, props),
      selectedUser: getSelectedUser(state,props),
      branch: getBranch(state, props),
      rooms: getRooms(state, props),
      users: getAllUsers(state, props),
      sessions: getSessions(state, props),
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
