import './App.css';

import {Map, is} from 'immutable';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles, CircularProgress, FormLabel, FormControl, FormGroup, FormControlLabel,
  Avatar, Button, Card, CardContent, CardMedia, Checkbox, Chip, 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Switch, TextField, Toolbar, Typography, IconButton
} from '@material-ui/core';

import EmailIcon from '@material-ui/icons/Email';
import PhoneIcon from '@material-ui/icons/Phone';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import PlaceIcon from '@material-ui/icons/Place';
import React, {Component} from 'react';
import TimerIcon from '@material-ui/icons/Timer';
import moment from 'moment';

import PropTypes from 'prop-types';

import * as Actions from './actions';
import BabelLogo from './BabelLogo';
import BookingCarousel from './BookingCarousel';
import IntegrationAutosuggest from './IntegrationAutosuggest'
import MenuAppBar from './MenuAppBar';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(10)
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  card: {
    // width:'auto'
    paddingBottom: theme.spacing(10)
  },
  media: {
    minHeight: 336,
    backgroundColor: 'rgba(6,40,69,0.62)'
  },
  gridList: {
    minWidth: 280,
    alignSelf: 'center',
    height: 'auto',
    backgroundColor: '#fff',
    padding: 16,
    // flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    // transform: 'translateZ(0)',
  },
  subtitle: {
    paddingBottom: theme.spacing(2),
    fontSize: 15,
    lineHeight: '18px',
    fontWeight: 300
  },
  title: {
    paddingTop: theme.spacing(2),
    fontSize: 19,
    lineHeight: '22px',
    fontWeight: 700
  },
  button: {
    margin: theme.spacing(1),
    color: theme.palette.text.primary
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  bookButton: {
    margin: theme.spacing(2),
    backgroundColor: "#fde298",
    color: '#062845'
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
    }
  },
  content: {
    maxWidth: 600,
    marginRight: 'auto',
    marginLeft: 'auto'
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
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex'
  },
  bottomRowCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex'
  },
  chevron: {
    color: '#fde298',
    fontSize: 64
  },
  disabled: {
    color: '#fde298',
    opacity: 0.3
  },
  snack: {
    color: '#fde298'
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
    alignItems: 'center',
    padding: 0,
    display: 'flex',
    minHeight: 0
  },
  textField: {
  },
  fileInput: {
    display: 'none'
  },
  fileLabel: {
    marginLeft: 'auto',
    marginRight: 'auto'
  }
});

class Booking extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sessionIndex: null,
      seatIndex: null,
      booking: null,
      bookingDialogOpen: false,
      editDialogOpen: false,
      scheduleDialogOpen: false,
      isBooking: false,
      isEditing: false,
      isScheduling: false,
      message: " ",
      selectedUserId: null
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0)
  }

  componentDidUpdate(prevProps){
    const prevState = prevProps.state;
    const prevEditSessionId = prevState && prevState.get('editSessionId');

    const state = this.props.state;
    const editSessionId = state && state.get('editSessionId');

    if(editSessionId !== prevEditSessionId){
      if(editSessionId){
        const sessions = state && state.get('sessions') && state.getIn(['sessions', 'sessionsById']);
        const editSessionData = sessions && editSessionId && sessions.get(editSessionId);

        const trainerId = editSessionData && editSessionData.get('trainerId');
        const dateTime = editSessionData && editSessionData.get('startsAt') && moment(editSessionData.get('startsAt'));
        const time = dateTime && dateTime.format('HH:mm');
        const cancelled = editSessionData && editSessionData.get('cancelled');

        this.setState({'session-id':editSessionId, 'session-trainerId':trainerId, 'session-time':time, 'session-cancelled':cancelled, 'session-dateTime':dateTime});

      }else{
        var updatedState = this.state;
        delete updatedState['session-id'];
        delete updatedState['session-trainerId'];
        delete updatedState['session-time'];
        delete updatedState['session-dateTime'];
        delete updatedState['session-cancelled'];
        this.setState({...updatedState});
      }
    }


    // console.log(sessions && sessions.toJS(), editSessionId, sessions && sessions.get(editSessionId) && sessions.get(editSessionId).toJS());
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log("Booking Next Props and State", nextProps.state.toJS(), nextState)
    // console.log("class data chsnged", this.state, nextState);

    if (this.props.isNative !== nextProps.isNative) {
      return true;
    }

    if(this.state['session-trainerId'] !== nextState['session-trainerId'] || this.state['session-time'] !== nextState['session-time'] || this.state['session-cancelled'] !== nextState['session-cancelled']){
      return true;
    }

    if (this.state.name !== nextState.name || this.state.email !== nextState.email || this.state.phone !== nextState.phone || (this.state.editClassData !== nextState.editClassData && this.state.editDialogOpen === nextState.editDialogOpen) || (this.state.schedulingData !== nextState.schedulingData && this.state.scheduleDialogOpen === nextState.scheduleDialogOpen)) {
      // console.log("Not updating booking form");
      // console.log("something data chsnged", this.state.editClassData, nextState.editClassData, this.state.editClassData.image === nextState.editClassData.image);

      if (this.state.editClassData !== nextState.editClassData && (this.state.editClassData.image !== nextState.editClassData.image || this.state.editClassData.active !== nextState.editClassData.active)) {
        return true;
      }
      return false;
    }

    // console.log("checking to update booking", this.state.booking, nextState.booking);

    if (this.state.selectedUserId !== nextState.selectedUserId || this.state.booking !== nextState.booking || this.state.seatIndex !== nextState.seatIndex || this.state.sessionIndex !== nextState.sessionIndex || this.state.bookingDialogOpen !== nextState.bookingDialogOpen || this.state.editDialogOpen !== nextState.editDialogOpen || this.state.scheduleDialogOpen !== nextState.scheduleDialogOpen || ((this.props.state && nextProps.state) && is(this.props.state, nextProps.state) === false)) {
      // console.log("updating booking", this.state.booking, nextState.booking);
      return true;
    } else {
      // console.log("not updating booking");
      return false;
    }

  }

  handleBookNow = (classId, sessionId, trainerId, activeSeat, longBookingLabel) => {
    const user = this.props.state.get('user');
    const userId = user
      ? user.get('id')
      : null;
    const roles = user && user.get('roles');
    const isAdmin = roles && roles.get('admin') === true;
    const isMC = roles && roles.get('mc') === true;
    const isTrainer = roles && roles.get('trainer') === true;
    const isStaff = isAdmin || isMC || isTrainer;
    if (isStaff) {
      this.setState({bookingDialogOpen: true});
    } else if (userId) {
      this.handleMakeBooking(classId, sessionId, trainerId, `${activeSeat}`)
    } else {
      this.setState({bookingDialogOpen: true});
    }
  };

  handleSchedule = () => {
    this.setState({
      scheduleDialogOpen: true,
      schedulingData: {
        daysOfWeek: []
      }
    });
  };

  handleScheduling = (classId, duration) => {
    this.props.actions.makeSchedule(classId, this.state.schedulingData.daysOfWeek, this.state.schedulingData.trainerId, this.state.schedulingData.time, this.state.schedulingData.startDate, this.state.schedulingData.endDate, duration);
    this.handleRequestClose();
  };

  handleEdit = (classData) => {
    this.setState({
      editDialogOpen: true,
      editClassData: {
        active: classData.has('active')
          ? classData.get('active')
          : false
      }
    });
  };

  handleSaveEdit = (classId) => {
    this.props.actions.saveClassData(classId, this.state.editClassData);
    this.handleRequestClose();
  };

  handleSaveSession = () => {
    const sessionId = this.state['session-id'];
    const trainerId = this.state['session-trainerId'];
    const cancelled = this.state['session-cancelled'] ? true : false;

    const dateTime = this.state['session-dateTime'];
    const date =dateTime.format('YYYY-MM-DD');

    const time = this.state['session-time'];
    const newStartsAt = moment(date + ' ' + time);

    var className = this.props.match.params.name;
    const classId = this.props.state && this.props.state.hasIn(['classes', 'classesById'])
      ? this.props.state.getIn(['classes', 'classesById']).findKey(x => x.get('slug') === className)
      : null;
    const classData = classId && this.props.state && this.props.state.getIn(['classes', 'classesById', classId]);
    const newEndsAt = newStartsAt.clone().add(classData.get('duration'), 'minutes');

    // console.log(dateTime.toDate(), newStartsAt.toDate(), classData && classData.toJS());
    // console.log({trainerId:trainerId, cancelled:cancelled, startsAt:newStartsAt.toDate(), endsAt:newEndsAt.toDate()});

    // const startsAt =


    // const sessionData = sessionId && this.props.state && this.props.state.getIn(['sessions', 'sessionsById', sessionId]);
    // const time = this.state['session-time'];
    if(sessionId && trainerId){
      this.props.actions.updateSession(sessionId, {trainerId:trainerId, cancelled:cancelled, startsAt:newStartsAt.toDate(), endsAt:newEndsAt.toDate()});
    }
    this.props.actions.setEditSession(null);
  }

  handleChange = name => event => {
    if (name.indexOf('class-') === 0) {
      const classPropertyName = name.replace('class-', '');
      var editClassData = this.state.editClassData
        ? {
          ...this.state.editClassData
        }
        : {};
      var value;
      if (name.indexOf('maxCapacity') >= 0 || name.indexOf('duration') >= 0) {
        value = parseInt(event.target.value);
      } else if (name.indexOf('image') >= 0) {
        const imageFile = event.target.files[0];
        if (imageFile) {
          this.props.actions.uploadImage(imageFile, (imageURL, imagePath) => {
            editClassData.image = imageURL;
            editClassData.imagePath = imagePath;
            this.setState({
              editClassData: {
                ...editClassData
              }
            });
          });
        }
        return;
      } else {
        value = event.target.value;
      }
      editClassData[classPropertyName] = value;
      this.setState({
        editClassData: {
          ...editClassData
        }
      });
    } else if (name.indexOf('schedule-') === 0) {
      const classPropertyName = name.replace('schedule-', '');
      var schedulingData = this.state.schedulingData
        ? this.state.schedulingData
        : {};
      var value;
      if (name.indexOf('daysOfWeek') >= 0) {
        value = schedulingData.daysOfWeek;
        const eventValue = parseInt(event.target.value)
          ? parseInt(event.target.value)
          : 0;
        const eventValueIndex = value.indexOf(eventValue);
        if (eventValueIndex === -1) {
          value.push(eventValue);
        } else {
          value.splice(eventValueIndex, 1);
        }
      } else {
        value = event.target.value;
      }
      schedulingData[classPropertyName] = value;
      this.setState({
        schedulingData: {
          ...schedulingData
        }
      });
    } else {
      this.setState({[name]: event.target.value});
    }
  };

  handleMakeBooking = (classId, sessionId, trainerId, seat) => {
    this.handleRequestClose();

    const user = this.props.state.get('user');
    const userId = user
      ? user.get('id')
      : null;
    const roles = user && user.get('roles');
    const isAdmin = roles && roles.get('admin') === true;
    const isMC = roles && roles.get('mc') === true;
    const isTrainer = roles && roles.get('trainer') === true;
    const isStaff = isAdmin || isMC || isTrainer;
    const selectedUserId = this.state.selectedUserId;

    this.props.actions.makeClassBooking(classId, sessionId, trainerId, selectedUserId || userId, userId, seat, isStaff);
  };

  handleCancelBooking = (bookingId) => {
    this.setState({booking: null});
    this.props.actions.cancelBooking(bookingId);
  }

  handleRequestClose = () => {
    this.setState({bookingDialogOpen: false, editDialogOpen: false, scheduleDialogOpen: false, editOneClassDialogOpen:false});
  };

  changeSession = (index) => {
    if (this.state.sessionIndex !== index || !this.state.seatIndex) {
      this.setState({
        sessionIndex: index, booking: null
        // seatIndex: null
      });
    }
  }

  changeSeat = (seatIndex, booking = null) => {
    // console.log("Booking change seat", seatIndex, booking);
    if (this.state.seatIndex !== seatIndex || this.state.booking !== booking) {
      this.setState({seatIndex: seatIndex, booking: booking});
    }
  }

  changeSelectedUser = (selectedUserId = null) => {
    // console.log("Booking change selected userId", selectedUserId);
    this.setState({
      selectedUserId: selectedUserId
      // seatIndex: null
    });
  }

  render() {

    const {classes, state} = this.props;

    const user = this.props.state.get('user');
    const roles = user && user.get('roles');
    const isAdmin = roles && roles.get('admin') === true;
    const isMC = roles && roles.get('mc') === true;
    const isTrainer = roles && roles.get('trainer') === true;
    const isStaff = isAdmin || isMC || isTrainer;
    const isMember = !(isAdmin || isMC || isTrainer);

    console.log('isMember: ', isMember);

    const booking = this.state.booking;
    const bookingDetails = booking && isStaff === true
      ? this.props.state.getIn(['bookings', 'bookingsById', booking])
      : null;
    const bookingUserId = bookingDetails && bookingDetails.has('userId')
      ? bookingDetails.get('userId')
      : null;
    const bookingUser = bookingUserId && this.props.state.has('users')
      ? this.props.state.getIn(['users', 'usersById', bookingUserId])
      : null;
    const bookingUserImage = bookingUser && bookingUser.has('image')
      ? bookingUser.get('image')
      : null;
      const bookingName = bookingUser && bookingUser.has('name')
        ? bookingUser.get('name')
        : null;
      const bookingEmail = bookingUser && bookingUser.has('email')
        ? bookingUser.get('email')
        : null;
      const bookingPhone = bookingUser && bookingUser.has('phone')
        ? bookingUser.get('phone')
        : null;

    var bookingLabel = (bookingName || bookingEmail || bookingPhone)
      ? `${bookingName} (${bookingEmail} - ${bookingPhone})`.trim()
      : null;
    const bookingAvatar = bookingUserImage || (bookingName && bookingName.length > 0)
      ? (
        bookingUserImage
        ? (<Avatar src={bookingUserImage}/>)
        : (<Avatar>{bookingName.charAt(0).toUpperCase()}</Avatar>))
      : null;
    const bookingChips = bookingLabel || bookingAvatar
      ? (<div>
        <div className={classes.bottomRow}>
          <Chip avatar={bookingAvatar} label={bookingName} style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 16,
              fontSize: '1rem',
              fontWeight: '500'
            }}/>
        </div>
        <div className={classes.bottomRowCenter}>
          {
            bookingEmail && <Chip avatar={<Avatar><EmailIcon/></Avatar>} label={bookingEmail} style={{
                  fontSize: '0.75rem',
                  marginLeft: 8,
                  marginRight: 8,
                  marginTop: 16
                }}/>
          }
          {
            bookingPhone && <Chip avatar={<Avatar><PhoneIcon/></Avatar>} label={bookingPhone} style={{
                  fontSize: '0.75rem',
                  marginLeft: 8,
                  marginRight: 8,
                  marginTop: 16
                }}/>
          }
        </div>
      </div>)
      : null;

    const selectedUserId = this.state.selectedUserId;
    const selectedUser = selectedUserId && this.props.state.has('users')
      ? this.props.state.getIn(['users', 'usersById', selectedUserId])
      : null;
    const selectedUserName = selectedUser && selectedUser.has('name')
      ? selectedUser.get('name')
      : null;
    const selectedUserEmail = selectedUser && selectedUser.has('email')
      ? selectedUser.get('email')
      : null;
    const selectedUserPhone = selectedUser && selectedUser.has('phone')
      ? selectedUser.get('phone')
      : null;
    const selectedUserImage = selectedUser && selectedUser.has('image')
      ? selectedUser.get('image')
      : null;
    const selectedUserAvatar = selectedUserImage || (selectedUserName && selectedUserName.length > 0)
      ? (
        selectedUserImage
        ? (<Avatar src={selectedUserImage}/>)
        : (<Avatar>{selectedUserName.charAt(0).toUpperCase()}</Avatar>))
      : null;
    const selectedUserChips = (<div>
      <Chip avatar={selectedUserAvatar} label={selectedUserName} style={{
          marginLeft: 'auto',
          marginRight: 'auto',
          marginTop: 16,
          fontSize: '1rem',
          fontWeight: '500'
        }} onDelete={() => this.changeSelectedUser()}/> {
        selectedUserEmail && <Chip avatar={<Avatar><EmailIcon/></Avatar>} label={selectedUserEmail} style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              fontSize: '0.75rem',
              marginTop: 16
            }}/>
      }
      {
        selectedUserPhone && <Chip avatar={<Avatar><PhoneIcon/></Avatar>} label={selectedUserPhone} style={{
              marginLeft: 'auto',
              marginRight: 'auto',
              fontSize: '0.75rem',
              marginTop: 16
            }}/>
      }
    </div>);

    // console.log(booking);

    var className = this.props.match.params.name;
    const urlSessionId = this.props.location.search.replace('?sid=', '');
    // console.log(urlSessionId);
    const classId = state.hasIn(['classes', 'classesById'])
      ? state.getIn(['classes', 'classesById']).findKey(x => x.get('slug') === className)
      : null;
    const classData = classId && state.getIn(['classes', 'classesById', classId]);
    const classImage = classData && classData.has('image')
      ? classData.get('image')
      : null;
    var classAvatar = <PhotoCameraIcon style={{
        width: 64,
        height: 64
      }}/>;
    if (classImage) {
      classAvatar = <Avatar style={{
          width: 64,
          height: 64,
          marginLeft: 'auto',
          marginRight: 'auto'
        }} src={classImage}/>;
    }

    if (this.state && this.state.editClassData && this.state.editClassData.image) {
      classAvatar = <Avatar style={{
          width: 64,
          height: 64,
          marginLeft: 'auto',
          marginRight: 'auto'
        }} src={this.state.editClassData.image}/>;
    }
    const sessionData = classId && state.hasIn(['sessions', 'sessionsById'])
      ? state.getIn(['sessions', 'sessionsById']).filter(x => x.get('classId') === classId && x.get('startsAt') > moment().valueOf()).sort((a, b) => {
        // console.log("a, b", a.toJS(), b.toJS());
        const dateA = a.get('startsAt');
        const dateB = b.get('startsAt');
        if (dateA < dateB) {
          return -1;
        }
        if (dateA > dateB) {
          return 1;
        }
        if (dateA === dateB) {
          return 0;
        }
      }).toOrderedMap()
      : null;
    const trainerData = state.get('trainers');
    let currentSession;
    if (this.state.sessionIndex === null && urlSessionId.length > 0) {
      currentSession = sessionData && sessionData.get(urlSessionId);
    } else {
      currentSession = sessionData && sessionData.skip(this.state.sessionIndex).first();
    }

    const trainerId = currentSession && currentSession.get('trainerId');
    const sessionId = currentSession && sessionData.keyOf(currentSession);
    // const bookingData = classId && sessionId && state.hasIn(['bookings', 'bookingsById']) ? state.getIn(['bookings', 'bookingsById']).filter(x => x.get('classId') === classId && x.get('sessionId') === sessionId) : Map();
    const bookingData = currentSession && currentSession.get('bookings')
      ? currentSession.get('bookings')
      : Map();

    // console.log("works", className, classId, sessionData, trainerData, bookingData);
    if (!classId || !sessionData || !trainerData || !bookingData) {
      return (<div className={classes.container}>
        <MenuAppBar/>
        <CircularProgress style={{
            margin: 'auto',
            display: 'block',
            marginTop: 120,
            height: 120,
            width: 120
          }}/>
      </div>);
    }

    const sessions = sessionData;
    var longBookingLabel;
    var activeSeat = this.state.seatIndex;
    // console.log("Booking", sessionId, activeSeat);
    if (sessionId) {
      const selectedSession = sessions.get(sessionId);
      const dateTime = moment(selectedSession.get('startsAt'));
      const date = dateTime.format('dddd, MMMM Do');
      const time = dateTime.format('h:mm A');
      const dateTimeString = dateTime.format('ddd, MMM Do ~ h:mm A');
      bookingLabel = isStaff === true && (bookingName || bookingEmail || bookingPhone)
        ? `${bookingName} (${bookingEmail} - ${bookingPhone})`
        : dateTimeString;
      bookingLabel = dateTimeString;
      // var activeSeat = this.state.seatIndex;
      longBookingLabel = isStaff === true
        ? `Station ${activeSeat + 1} on ${date} at ${time}`
        : `Book Station ${activeSeat + 1} on ${date} at ${time}`;
    }

    var trainerOptions = [];
    if (isStaff && trainerData) {
      trainerData.get('trainersById').sort((a, b) => {
        const nameA = a.get('name');
        const nameB = b.get('name');
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        if (nameA === nameB) {
          return 0;
        }
      }).toOrderedMap().mapEntries(([key, value]) => {
        // console.log(key, value);
        trainerOptions.push(<option key={key} value={key}>
          {value.get('name')}
        </option>);
      });

      trainerOptions.splice(0, 0, <option key={'nullOption'} value={''}></option>);
    }

    const bottomBarStyle = (user && user.has('id'))
      ? {
        bottom: 56
      }
      : {
        bottom: 0
      };

    const tempImg = classData.get('image');
    const thumbImg = tempImg && tempImg.replace(encodeURIComponent('images/'), encodeURIComponent('images/thumb_512_'));

    const editSessionId = state && state.get('editSessionId');
    const editSession = sessionData && editSessionId && sessionData.get(editSessionId);
    const editSessionDateTime = editSession && moment(editSession.get('startsAt'));
    const editSessionDate = editSessionDateTime && editSessionDateTime.format('dddd, MMMM Do');
    const editOneClassDialogOpen = editSessionId ? true : false;

    console.log('this.state: ', this.state);

    return (<div>
      <MenuAppBar transparent={true}/>
      <Card className={classes.card}>
        <CardMedia className={classes.media} image={thumbImg} title={classData.get('name')}/>
        <CardContent className={classes.content}>
          <Typography type="display1" component="h1" gutterBottom color="primary">
            {
              isStaff && <Toolbar className={classes.toolbar}>
                  <Button key={'schedule'} className={classes.adminButton} onClick={() => this.handleSchedule()}>
                    Schedule
                  </Button>
                  <Button key={'edit'} className={classes.adminButton} onClick={() => this.handleEdit(classData)}>
                    Edit
                  </Button>
                </Toolbar>
            }
            {classData.get('name')}
          </Typography>
          <Typography type="title" component="p" gutterBottom color="primary">
            {classData.get('description')}
          </Typography>
          <Button className={classes.button} dense disabled classes={{
              disabled: classes.button
            }}>
            <PlaceIcon className={classes.leftIcon}/> {classData.get('venue')}
          </Button>
          <Button className={classes.button} dense disabled classes={{
              disabled: classes.button
            }}>
            <TimerIcon className={classes.leftIcon}/> {classData.get('duration')}
            minutes
          </Button>
          <Typography type='body1' gutterBottom>
            {classData.get('longDescription')}
          </Typography>
          {
            classData.get('remarks') && <Typography type="caption" component="h2" gutterBottom>
                {classData.get('remarks')}
              </Typography>
          }
          <BookingCarousel sessionData={sessionData} classData={classData} trainerData={trainerData} onSessionChange={index => this.changeSession(index)} onSeatChange={(index, booking) => this.changeSeat(index, booking)}/>
        </CardContent>
        {
          sessions.size > 0 && <div className={classes.bottomBar} style={bottomBarStyle}>
              {bookingChips}
              <div className={classes.bottomRow}>
                <Button key={"book"} className={classes.roundButton} style={{
                    flex: 'none',
                    margin: 16,
                    background: '#fde298',
                    color: '#062845'
                  }}>
                  {`${activeSeat + 1}`}
                </Button>
                <Typography type="title" component="p" color="primary" style={{
                    padding: 8 * 2
                  }}>
                  {bookingLabel}
                </Typography>
                {
                  !booking && <Button className={classes.bookButton} onClick={() => this.handleBookNow(classId, sessionId, trainerId, `${activeSeat}`, longBookingLabel)}>
                      {
                        isStaff
                          ? 'Add Booking'
                          : 'Book Now'
                      }
                    </Button>
                }
                {
                  booking && <Button className={classes.bookButton} onClick={() => this.handleCancelBooking(booking)}>
                      {'Cancel Booking'}
                    </Button>
                }
              </div>
            </div>
        }
      </Card>

      <Dialog key={'bookingDialog'} open={this.state.bookingDialogOpen} onClose={this.handleRequestClose}>
        <DialogTitle>{
            isStaff
              ? `Add Booking for ${classData.get('name')}`
              : `Book Your Place for ${classData.get('name')}`
          }
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {longBookingLabel}
          </DialogContentText>
          {isStaff && !selectedUserId && <IntegrationAutosuggest onSelectionChange={selectedUserId => this.changeSelectedUser(selectedUserId)}/>}
          {selectedUserId && selectedUserChips}
        </DialogContent>
        <DialogActions>
          <Button key={'cancel'} onClick={this.handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button key={'makebooking'} className={classes.bookButton} onClick={() => this.handleMakeBooking(classId, sessionId, trainerId, `${activeSeat}`)}>
            {
              isStaff
                ? 'Add Booking'
                : 'Book Now'
            }
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog key={'scheduleDialog'} open={this.state.scheduleDialogOpen} onClose={this.handleRequestClose}>
        <DialogTitle>{'Schedule '}
          {classData.get('name')}</DialogTitle>
        <DialogContent>
          <FormControl>
            <FormLabel>Day of Week</FormLabel>
            <FormGroup row="row">
              {
                [
                  '1', // monday?
                  '2',
                  '3',
                  '4',
                  '5',
                  '6',
                  '0'
                ].map(option => (<FormControlLabel key={option} control={<Checkbox
                  checked = {
                    this.state.checkedA
                  }
                  onChange = {
                    this.handleChange(`schedule-daysOfWeek`)
                  }
                  value = {
                    option
                  }
                  />} label={moment().weekday(option).format('dddd')}/>))
              }
            </FormGroup>
          </FormControl>
          <TextField id="trainer" select label="Trainer" margin="dense" fullWidth onChange={this.handleChange('schedule-trainerId')} SelectProps={{
              native: true,
              MenuProps: {
                className: classes.menu
              }
            }}>
            {trainerOptions}
          </TextField>
          <TextField id="time" label="Time" type="time" required margin="dense" fullWidth onChange={this.handleChange('schedule-time')} InputLabelProps={{
              shrink: true
            }} InputProps={{
              inputProps: {
                step: 900, // 5 min
              }
            }}/>
          <TextField id="startDate" label="Start Date" type="date" required defaultValue={moment().format("MM-DD-YYYY")} margin="dense" fullWidth onChange={this.handleChange('schedule-startDate')} InputLabelProps={{
              shrink: true
            }}/>
          <TextField id="endDate" label="End Date" type="date" required defaultValue={moment().format("MM-DD-YYYY")} margin="dense" fullWidth onChange={this.handleChange('schedule-endDate')} InputLabelProps={{
              shrink: true
            }}/>
        </DialogContent>
        <DialogActions>
          <Button key={'cancel'} onClick={this.handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button key={'makeSchedule'} className={classes.bookButton} onClick={() => this.handleScheduling(classId, classData.get('duration'))}>
            Schedule
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog key={'editDialog'} open={this.state.editDialogOpen} onClose={this.handleRequestClose}>
        {
          !this.props.isNative && <div style={{
                display: 'flex',
                flex: 1,
                marginLeft: 'auto',
                marginRight: 'auto',
                justifyContent: 'center'
              }}>
              <input accept="image/*" className={classes.fileInput} id="icon-button-file" type="file" onChange={this.handleChange('class-image')}/>
              <label htmlFor="icon-button-file" style={{
                  marginLeft: 'auto',
                  marginRight: 'auto'
                }}>
                <IconButton color="primary" component="span" style={{
                    marginTop: 32,
                    marginBottom: 32
                  }}>
                  {classAvatar}
                </IconButton>
              </label>
            </div>
        }
        <DialogContent>
          <FormGroup>
            <FormControlLabel control={<Switch
              checked = {
                this.state.editClassData
                  ? this.state.editClassData.active
                  : false
              }
              onChange = {
                (event, checked) => {
                  var editClassData = {
                    ...this.state.editClassData
                  };
                  editClassData.active = checked;
                  this.setState({
                    editClassData: {
                      ...editClassData
                    }
                  });
                }
              }
              />} label={this.state.editClassData && this.state.editClassData.active === true
                ? 'Active'
                : 'Coming Soon'}/>
          </FormGroup>
          <TextField margin="dense" id="name" label="Name" required fullWidth disabled={this.state.isScheduling} onChange={this.handleChange('class-name')} defaultValue={classData.get('name')}/>
          <TextField margin="dense" id="description" label="Short Description" type='text' multiline required fullWidth disabled={this.state.isScheduling} onChange={this.handleChange('class-description')} defaultValue={classData.get('description')}/>
          <TextField margin="dense" id="longDescription" label="Long Description" type='text' multiline required fullWidth disabled={this.state.isScheduling} onChange={this.handleChange('class-longDescription')} defaultValue={classData.get('longDescription')}/>
          <TextField margin="dense" id="remarks" label="Remarks" type='text' required fullWidth disabled={this.state.isScheduling} onChange={this.handleChange('class-remarks')} defaultValue={classData.get('remarks')}/>
          <TextField margin="dense" id="duration" label="Duration (minutes)" type="number" required fullWidth disabled={this.state.isScheduling} onChange={this.handleChange('class-duration')} defaultValue={`${classData.get('duration')}`}/>
          <TextField margin="dense" id="capacity" label="Max Capacity" type='number' required fullWidth disabled={this.state.isScheduling} onChange={this.handleChange('class-maxCapacity')} defaultValue={`${classData.get('maxCapacity')}`}/>
          <TextField margin="dense" id="venue" label="Venue" type='text' required fullWidth disabled={this.state.isScheduling} onChange={this.handleChange('class-venue')} defaultValue={classData.get('venue')}/>
          <TextField margin="dense" id="slug" label="URL slug (/classes/slug)" type='text' required fullWidth disabled={this.state.isScheduling} onChange={this.handleChange('class-slug')} defaultValue={classData.get('slug')}/>
        </DialogContent>
        <DialogActions>
          <Button key={'cancel'} onClick={this.handleRequestClose} color="primary">
            Cancel
          </Button>
          <Button key={'saveEdit'} className={classes.bookButton} onClick={() => this.handleSaveEdit(classId)}>
            {'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog key={'editOneClassDialog'} open={editOneClassDialogOpen} onClose={()=>this.props.actions.setEditSession(null)}>
        <DialogContent>
          <Typography type="title" component="p" gutterBottom color="primary">
            {`Edit ${classData.get('name')} Session`}
          </Typography>
          <Typography type="title" component="p" gutterBottom color="primary">
            {editSessionDate}
          </Typography>
          <TextField id="trainer" select label="Trainer" margin="dense" fullWidth value={this.state['session-trainerId']} onChange={this.handleChange('session-trainerId')} SelectProps={{
              native: true,
              MenuProps: {
                className: classes.menu
              }
            }}>
            {trainerOptions}
          </TextField>
          <TextField id="time" label="Time" type="time" required margin="dense" fullWidth value={this.state['session-time']} onChange={this.handleChange('session-time')} InputLabelProps={{
              shrink: true
            }} InputProps={{
              inputProps: {
                step: 900, // 5 min
              }
            }}/>
        </DialogContent>
        <DialogActions>
          <Button key={'cancelSession'} onClick={()=>this.setState({'session-cancelled':!this.state['session-cancelled'] ? true : false})} >
            {`${this.state['session-cancelled'] ? 'Undo Remove Session' : 'Remove This Session' }`}
          </Button>
        </DialogActions>
        <DialogActions>
          <Button key={'cancel'} onClick={()=>this.props.actions.setEditSession(null)} color="primary">
            Cancel
          </Button>
          <Button key={'saveEdit'} className={classes.bookButton} onClick={() => this.handleSaveSession()}>
            {'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      <BabelLogo/>
    </div>);
  }
}

Booking.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  ...state,
  isNative: state && state.state && state.state.get('isNative')
    ? true
    : false
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

const BookingStyled = withStyles(styles)(Booking);

export default connect(mapStateToProps, mapDispatchToProps)(BookingStyled)
