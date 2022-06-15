import './App.css';

import {Map,is} from 'immutable';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles, GridList, GridListTile, Avatar, Button, Chip, Typography} from '@material-ui/core';
import PersonIcon from '@material-ui/icons/Person';
import EditIcon from '@material-ui/icons/Edit';
import React, {Component} from 'react';
import moment from 'moment';

import PropTypes from 'prop-types';

import * as Actions from './actions';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(10),
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  card: {
    // width:'auto'
  },
  media: {
    minHeight: 336
  },
  gridList: {
    minWidth: 280,
    alignSelf: 'center',
    // height: 'auto',
    backgroundColor: '#fff',
    padding: theme.spacing(2),
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
    color: '#fff',
  },
  roundButton: {
    width: 44,
    height: 44,
    // margin: 0,
    // padding: 0,
    borderRadius: '50%',
    minWidth: 0,
    color: '#fff',
    backgroundColor: '#fff',
    '&:hover': {
      background: theme.palette.primary['50']
    },
  },
  content: {
    maxWidth: 600,
    marginRight: 'auto',
    marginLeft: 'auto',
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
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
    right: 0,
    left: 0,
    boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)'
  },
  chevron: {
    color: '#fde298',
    fontSize: 64,
  },
  disabled: {
    color: '#fde298',
    opacity: 0.3
  },
  snack: {
    color: '#fde298'
  }
});

class BookingGrid extends Component {

  state = {
    editOneClassDialogOpen:false,
    seatIndex:null
  }

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     seatIndex: null
  //     // dialogOpen: false,
  //     // snackOpen: true,
  //     // isBooking: false
  //   };
  // }

  changeSeat = (seatIndex, booking = null) => {
    // console.log("Booking Grid change seat", seatIndex, this.state.seatIndex, booking);
    if (seatIndex !== this.state.seatIndex) {
      this.setState({
        seatIndex: seatIndex
      });
    }
    this.props.onSeatChange(seatIndex, booking);
    // if(this.props.isActiveSession){
    // }
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log("Grid Next Props and State", nextProps, nextState)

    // if (this.state.sessionIndex !== nextState.sessionIndex &&
    //   this.refs.carouselRef &&
    //   (this.refs.carouselRef.props.slideIndex + 1 !== nextState.sessionIndex ||
    //     this.refs.carouselRef.props.slideIndex - 1 !== nextState.sessionIndex)) {
    //   return false;
    // }

    // if (this.state.name !== nextState.name || this.state.email !== nextState.email || this.state.phone !== nextState.phone) {
    //   return false;
    // }
    //
    if (this.state.seatIndex !== nextState.seatIndex || (this.props.isActiveSession !== nextProps.isActiveSession && nextProps.isActiveSession) ||
      ((this.props.state && nextProps.state) && is(this.props.state, nextProps.state) === false)) {
      // console.log("updating grid");
      return true;
    } else {
      // console.log("not updating grid");
      return false;
    }
    //
    // if (this.state.props && nextProps.state) {
    //   if (this.state.props.state !== nextProps.state) {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // } else {
    //   return true;
    // }
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log("Did update Grid", prevState);


    const {
      session,
      classData,
      state
    } = this.props;

    var activeSeat = this.state.seatIndex;

    if (this.props.isActiveSession === false) {
      return;
    }

    const user = this.props.state.get('user');
    const roles = user && user.get('roles');
    const isAdmin = roles && roles.get('admin') === true ? true : ((user && session && user.get('id') === session.get('trainerId')) ? true : false) ;

    const bookingsForSession = session.get('bookings') ? session.get('bookings') : Map();
    const bookings = state.hasIn(['bookings', 'bookingsById']) ? state.getIn(['bookings', 'bookingsById']) : Map();
    const userId = state.getIn(['user', 'id']);
    const userEmail = state.getIn(['user', 'email']);

    // console.log(bookingsForSession.values(), bookings, userId);

    var userBookingsForSession = Map();
    if (userId && bookings.size > 0 && bookingsForSession.size > 0) {
      userBookingsForSession = bookings.filter((v, k) => {
        // console.log("Booking key", k);
        return bookingsForSession.includes(k) && (v.get('userId') === userId || v.get('email') === userEmail || isAdmin);
      });
    }

    // console.log("User bookings", userBookingsForSession);

    if (this.props.isActiveSession && activeSeat !== null && ((bookingsForSession.has(`${activeSeat}`) === false && userBookingsForSession.size === 0 && isAdmin === false) || isAdmin === true)) {
      const booking = bookingsForSession.get(`${activeSeat}`);
      this.changeSeat(activeSeat, booking);
      // console.log("Booking Grid Update Terminate", activeSeat);
      return;
    }

    for (var i = 0; i < classData.get('maxCapacity') && this.props.isActiveSession; i++) {
      let ii = i;
      const booking = bookingsForSession.get(`${ii}`);
      const isUsersBooking = booking && userBookingsForSession.has(booking);
      const booked = bookingsForSession.has(`${ii}`);
      const disabled = userBookingsForSession.size > 0 || bookingsForSession.has(`${ii}`);

      // console.log(booking, isUsersBooking, disabled, booked);
      // console.log("Seat", ii, disabled, activeSeat, this.props.isActiveSession);
      // console.log("Active Seat", ii, activeSeat, disabled, isAdmin);

      // if(!disabled || isUsersBooking && !booked){
      if ((isAdmin === false && (!disabled || isUsersBooking)) || (activeSeat === null && !booked && isAdmin === true)) {
        activeSeat = ii;
        // console.log('changing seat', activeSeat, booking);
        this.changeSeat(activeSeat, booking);
        return;
      }

    }
    // if(this.state.seatIndex !== activeSeat){
    //
    // }

  }

  componentWillMount() {
    if (this.props.isActiveSession) {
      this.componentDidUpdate();
    }
  }

  handleEditOneClass = (sessionId) => {
    this.props.actions.setEditSession(sessionId);
  };

  render() {
    const {
      classes,
      session,
      trainerData,
      classData,
      isActiveSession,
      state,
      sessionId
    } = this.props;
    // const trainerId = currentSession && currentSession.get('trainerId');

    // if(isActiveSession === false){
    //   return (
    //     <CircularProgress style={{margin:'auto', display:'block', marginTop:120, height:120, width:120}}/>
    //   );
    // }

    const user = this.props.state.get('user');
    const roles = user && user.get('roles');
    const isAdmin = roles && roles.get('admin') === true ? true : ((user && session && user.get('id') === session.get('trainerId')) ? true : false) ;

    if (isActiveSession === false) {
      return (
        <div style={{height:443}}></div>
      );
    }

    const dateTime = moment(session.get('startsAt'));
    var activeSeat = this.state.seatIndex;
    // console.log(activeSeat, sessionId);

    const date = dateTime.format('dddd, MMMM Do');
    const time = dateTime.format('h:mm A');
    var seats = [];

    // console.log(session.toJS());

    const bookingsForSession = session.get('bookings') ? session.get('bookings') : Map();
    const bookings = state.hasIn(['bookings', 'bookingsById']) ? state.getIn(['bookings', 'bookingsById']) : Map();
    const userId = state.getIn(['user', 'id']);
    const userEmail = state.getIn(['user', 'email']);

    // console.log(bookings);

    var userBookingsForSession = Map();
    if (userId && bookings.size > 0 && bookingsForSession.size > 0) {
      userBookingsForSession = bookings.filter((v, k) => {
        // console.log(bookingsForSession, k, bookingsForSession.includes(k), v.get('email'), userEmail, v.get('email') === userEmail, v.get('email') == userEmail);
        return bookingsForSession.includes(k) && (v.get('userId') === userId || v.get('email') === userEmail || isAdmin);
      });
    }

    // console.log(userId, userBookingsForSession, bookings);

    for (var i = 0; i < classData.get('maxCapacity'); i++) {
      let ii = i;
      const booking = bookingsForSession.get(`${ii}`);
      const isUsersBooking = booking && userBookingsForSession.has(booking);
      const booked = bookingsForSession.has(`${ii}`);
      const disabled = (userBookingsForSession.size > 0 || bookingsForSession.has(`${ii}`))

      var buttonStyle = (activeSeat === ii && disabled === false) || isUsersBooking || ((booked || activeSeat === ii) && isAdmin === true) ? {
        background: "#062845"
      } : null;

      var avatar = <PersonIcon/>
      if (isAdmin === true) {
        if (activeSeat === ii) {
          buttonStyle = {
            ...buttonStyle,
            background: "#fde298",
            color: '#062845'
          }
        }

        const bookingDetails = booking ? userBookingsForSession.get(booking) : null;
        const bookingUserId = bookingDetails ? bookingDetails.get('userId') : null;
        const bookingUser = bookingUserId && this.props.state.has('users') ? this.props.state.getIn(['users', 'usersById', bookingUserId]) : null;
        const bookingUserName = bookingUser && bookingUser.has('name') ? bookingUser.get('name') : null;
        const bookingUserImage = bookingUser && bookingUser.has('image') ? bookingUser.get('image') : null;

        if (bookingUserImage || (bookingUserName && bookingUserName.length > 0)) {
          avatar = (bookingUserImage ? (<Avatar style={{width:44, height:44}} src={bookingUserImage} />) : (<Avatar style={{...buttonStyle, width:44, height:44}}>{bookingUserName.charAt(0).toUpperCase()}</Avatar>))
          buttonStyle = {
            ...buttonStyle,
            padding: 0
          }
        }

      }

      const seatButton = (<GridListTile key={ii} cols={2}>
        <Button key={ii} raised
          className={classes.roundButton} style={buttonStyle}
          onClick={()=>this.changeSeat(ii, booking)}
          disabled={disabled && isAdmin === false}
          >{booked ? avatar : `${ii+1}`}</Button>
      </GridListTile>);

      // const seatButton = (
      //   <BookingSeatStyled key={`${ii}`} index={ii} active={activeSeat === ii} disabled={disabled} />
      // );

      seats.push(seatButton);
    }

    const trainerId = session.get('trainerId');
    const trainer = trainerId && trainerData.getIn(['trainersById', trainerId]);
    const trainerName = trainer && trainer.get('name').charAt(0).toUpperCase() + trainer.get('name').slice(1);
    const trainerImage = trainer && trainer.get('image');
    const trainerAvatar = trainerImage ? (
      <Avatar src={trainerImage} />
    )
       : (trainerName ?
          <Avatar>{trainerName.charAt(0).toUpperCase()}</Avatar> : null
        )


    const sessionDetails = session.get('details');

    if (sessionDetails) {
      return (
        <div>
          <GridList className={classes.gridList} cols={10} cellHeight={50}>
          <GridListTile cols={10} style={{ height: 'auto' }}>
          <Typography type="headline" component="h2">
            {sessionDetails}
          </Typography>
          <Typography type="headline" component="h2">
            {date}
          </Typography>
          <Typography type="headline" component="h2" gutterBottom>
            {time}
          </Typography>
          </GridListTile>
          <GridListTile cols={10} style={{ height: 'auto', marginBottom:16 }}>
            <Chip
            avatar={trainerAvatar}
            label={trainerName}
            style={{marginLeft:'auto', marginRight:'auto', marginBottom:8}}
            />
            <Typography type="caption" component="h4">
              Trainer
            </Typography>
            {isAdmin ?
              (<Button onClick={()=>this.handleEditOneClass(sessionId)} >
                <EditIcon />
              </Button>) : (<div></div>)
            }
          </GridListTile>
            {seats}
          </GridList>
        </div>
      );
    } else {
      return (
        <div>
          <GridList key={i} className={classes.gridList} cols={10} cellHeight={50}>
          <GridListTile cols={10} style={{ height: 'auto' }}>
          <Typography type="title" component="h2">
            {date}
          </Typography>
          <Typography type="title" component="h2" gutterBottom>
            {time}
          </Typography>
          </GridListTile>
          <GridListTile cols={10} style={{ height: 'auto', marginBottom:16 }}>
            <Chip
            avatar={trainerAvatar}
            label={trainerName}
            style={{marginLeft:'auto', marginRight:'auto', marginBottom:8}}
            />
            <Typography type="caption" component="h4">
              Trainer
            </Typography>
            {isAdmin ?
              (<Button onClick={()=>this.handleEditOneClass(sessionId)} >
                <EditIcon />
              </Button>) : (<div></div>)
            }
          </GridListTile>
            {seats}
          </GridList>
        </div>
      );
    }
  }
}

BookingGrid.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  ...state
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

const BookingGridStyled = withStyles(styles)(BookingGrid);

export default connect(mapStateToProps, mapDispatchToProps)(BookingGridStyled)
