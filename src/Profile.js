
import {PhotoCamera} from '@material-ui/icons/PhotoCamera';
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
  makeGetCurrentUserGantnerLogs,
  makeGetSelectedUser,
  makeGetSelectedUserGantnerLogs,
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
    freezeData : {}
    // bookingDate: moment().format('YYYY-MM-DD')
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

    const currentUser = this.props.currentUser;
    const roles = currentUser && currentUser.get('roles');
    const isAdmin = roles && roles.get('admin') === true;
    const isMC = roles && roles.get('mc') === true;
    const isTrainer = roles && roles.get('trainer') === true;

    const selectedUserId = (this.props && this.props.match && this.props.match.params && this.props.match.params.userId) || (currentUser && currentUser.get('id'));
    const isCurrentUser = selectedUserId && currentUser && currentUser.get('id') === selectedUserId;

    var userData = isCurrentUser ? currentUser : this.props.selectedUser;
    const selectedUserName = userData && userData.has('name') && userData.get('name') ? userData.get('name') : null;
    const selectedUserMembershipCard = userData && userData.has('membershipCard') && userData.get('membershipCard') ? userData.get('membershipCard') : null;
    const selectedUserPhone = userData && userData.has('phone') && userData.get('phone') ? userData.get('phone') : null;
    const selectedUserEmail = userData && userData.has('email') && userData.get('email') ? userData.get('email') : null;
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
      (selectedUserImage ? (<Avatar src={selectedUserImage} style={{marginLeft:'auto', marginRight:'auto', width:128, height:128, fontSize:'3.5rem'}} />) : (<PhotoCamera style={{width:128, height:128, color:'#fff'}}/>)) :
      null;

    const selectedUserRoles = userData && userData.get('roles');
    const selectedUserIsAdmin = selectedUserRoles && selectedUserRoles.get('admin') === true;
    const selectedUserIsOps = selectedUserRoles && selectedUserRoles.get('ops') === true;
    const selectedUserIsTrainer = selectedUserRoles && selectedUserRoles.get('trainer') === true;
    const selectedUserIsStaff = selectedUserIsAdmin || selectedUserIsTrainer || selectedUserIsOps;
    const selectedUserTrainerBio = selectedUserIsTrainer && userData && userData.get('bio');
    const selectedUserTrainerTier = selectedUserIsTrainer && userData && userData.get('tier');

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


    return (
      <div>
        <MenuAppBar/>
          <div className={classes.container}>
            <Card style={{boxShadow:null, marginLeft:0}} className={classes.card} elevation={0}>
            <CardContent classes={{root:classes.cardRoot}}>
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
              </CardContent>
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
          </div>
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
  const getCurrentUser = makeGetCurrentUser();
  const getCurrentUserGantnerLogs = makeGetCurrentUserGantnerLogs();
  const getSelectedUser = makeGetSelectedUser();
  const getSelectedUserGantnerLogs = makeGetSelectedUserGantnerLogs();
  const getAllUsers = makeGetAllUsers();
  const getSessions = makeGetSessions();
  const getBookings = makeGetBookings();
  const mapStateToProps = (state, props) => {
    // const currentUser = getCurrentUser(state, props);
    // const selectedUserId = (this.props && this.props.match && this.props.match.params && this.props.match.params.userId) || (currentUser && currentUser.get('id'));
    // console.log(selectedUserId);
    return {
      currentUser: getCurrentUser(state, props),
      selectedUser: getSelectedUser(state,props),
      currentUserGanterLogs: getCurrentUserGantnerLogs(state, props),
      selectedUserGanterLogs: getSelectedUserGantnerLogs(state, props),
      users: getAllUsers(state, props),
      sessions: getSessions(state, props),
      bookings: getBookings(state, props),
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
