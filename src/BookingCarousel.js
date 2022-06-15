import './App.css';

import {List,is} from 'immutable';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles, IconButton} from '@material-ui/core';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import NCarousel from 'nuka-carousel';
import React, {Component} from 'react';
import createReactClass from 'create-react-class';

import PropTypes from 'prop-types';
import classNames from 'classnames';

import * as Actions from './actions';
import BookingGrid from './BookingGrid';

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
    padding: 16,
    paddingBottom: theme.spacing(10),
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
    paddingTop:theme.spacing(2),
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
    marginLeft:theme.spacing(1),
  },
  bookButton: {
    margin: theme.spacing(2),
    backgroundColor: "#fde298",
    color: '#fff',
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


let timer = null;

class BookingCarousel extends Component {


  constructor(props) {
    super(props);
    this.state = {
      sessionIndex: null,
      seatIndex: null
      // dialogOpen: false,
      // snackOpen: true,
      // isBooking: false
    };
  }

  componentWillUnmount() {
    this._clearTimer();
  }

  _clearTimer() {
    if (timer) {
      clearTimeout(timer);
    }
  }

  changeSession = (index) => {

    // this._clearTimer();
    // timer = setTimeout(() => {
    //   this.setState({
    //     sessionIndex: index,
    //     seatIndex: null
    //   });
    //   this.props.onSessionChange(index);
    //   // this.props.onSeatChange(null);
    // }, 250);

    this.setState({
      sessionIndex: index,
      seatIndex: null
    });
    this.props.onSessionChange(index);
  }

  changeSeat = (seatIndex, booking = null) => {
    // console.log('Booking Carousel changeSeat', seatIndex, booking);
    if (seatIndex !== this.state.seatIndex) {
      this.setState({
        seatIndex: seatIndex
      });
    }
    this.props.onSeatChange(seatIndex, booking);
  }

  shouldComponentUpdate(nextProps, nextState) {
    // console.log("Carousel Next Props and State", nextProps, nextState)

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
    // if (this.state.seatIndex !== nextState.seatIndex) {
    //   return true;
    // }
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

    if (this.state.sessionIndex !== nextState.sessionIndex ||
      // (this.props.location && this.props.location.search && nextProps.location && nextProps.location.search) && this.props.location.search !== nextProps.location.search ||
      ((this.props.state && nextProps.state) && is(this.props.state, nextProps.state) === false)) {
      // console.log("updating carousel");
      return true;
    } else {
      // console.log("not updating carousel");
      return false;
    }

    // return true;
  }

  render() {
    const {
      classes,
      sessionData,
      trainerData,
      classData
    } = this.props;
    const urlSessionId = this.props.router.location && this.props.router.location.search ? this.props.router.location.search.replace('?sid=', '') : null;
    let currentSession;
    let currentSlideIndex;
    // console.log(urlSessionId);
    if (this.state.sessionIndex === null && urlSessionId && urlSessionId.length > 0) {
      const sessionList = sessionData && List(sessionData);
      const sessionIndex = sessionList && sessionList.findIndex(x => x[0] === urlSessionId);
      currentSlideIndex = sessionIndex ? sessionIndex : 0;
      currentSession = sessionData && sessionData.get(urlSessionId);
    } else {
      currentSlideIndex = this.state.sessionIndex ? this.state.sessionIndex : 0;
      currentSession = sessionData && sessionData.skip(currentSlideIndex).first();
    }
    // const currentSession = sessionData && sessionData.skip(this.state.sessionIndex).first();
    // const trainerId = currentSession && currentSession.get('trainerId');
    const sessionId = currentSession && sessionData.keyOf(currentSession);
    var sessionItems = [];

    let sessions = sessionData;
    if (sessionId) {
      // console.log(activeSeat, sessionId);

      var sessionsIndex = 0;
      sessions.forEach(session => {

        sessionItems.push(
          <BookingGrid key={sessionsIndex} sessionId={sessionId} session={session} trainerData={trainerData} classData={classData}
          onSeatChange={(index, booking) => this.changeSeat(index, booking)} isActiveSession={currentSlideIndex===sessionsIndex} />
        );

        sessionsIndex = sessionsIndex + 1;

      })
    }

    const Decorators = [{
        component: createReactClass({
          render() {
            return (
              <IconButton className={classNames(classes.root, this.props.currentSlide === 0 && !this.props.wrapAround && classes.disabled)} disabled={this.props.currentSlide === 0 && !this.props.wrapAround} onClick={this.handleClick}>
                <ChevronLeftIcon className={classes.chevron}/>
              </IconButton>
            )
          },
          handleClick(e) {
            e.preventDefault();
            this.props.previousSlide();
          }
        }),
        position: 'TopLeft'
      },
      {
        component: createReactClass({
          render() {
            return (
              <IconButton className={classNames(classes.root, this.props.currentSlide + this.props.slidesToScroll >= this.props.slideCount && !this.props.wrapAround && classes.disabled)} disabled={this.props.currentSlide + this.props.slidesToScroll >= this.props.slideCount && !this.props.wrapAround} onClick={this.handleClick}>
                <ChevronRightIcon className={classes.chevron}/>
              </IconButton>

            )
          },
          handleClick(e) {
            e.preventDefault();
            this.props.nextSlide();
          }
        }),
        position: 'TopRight'
      }
    ];

    // console.log(sessionItems.length);
    const user = this.props.state.get('user');
    const roles = user && user.get('roles');
    const isAdmin = roles && roles.get('admin') === true;
    var carouselStyle = {
      textAlign: 'center',
      paddingBottom: 0
    }
    if (isAdmin) {
      carouselStyle = { ...carouselStyle,
        paddingBottom: 8 * 8
      }
    }

    if (sessionItems.length > 0) {
      // console.log("Enough items SessionId", sessionId, sessionItems.length);

      return (
        <NCarousel
          slideIndex={currentSlideIndex}
          afterSlide={newSlideIndex => this.changeSession(newSlideIndex)}
          decorators={Decorators}
          style={carouselStyle}
          ref="carouselRef"
          >
          {sessionItems}
        </NCarousel>
      );
    } else {
      // console.log("Not enough items SessionId", sessionId, sessionItems.length);

      return (
        <div></div>
      )
    }
  }
}

BookingCarousel.propTypes = {
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

const BookingCarouselStyled = withStyles(styles)(BookingCarousel);

export default connect(mapStateToProps, mapDispatchToProps)(BookingCarouselStyled)
