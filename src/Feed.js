// @flow weak
import {CircularProgress, GridList,GridListTile,GridListTileBar,InputAdornment,Button,TextField,Typography} from '@material-ui/core';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import React from 'react';
import {Search} from '@material-ui/icons';
import moment from 'moment';

import PropTypes from 'prop-types';

import * as Actions from './actions';
import MenuAppBar from './MenuAppBar';
import BabelLogo from './BabelLogo';

const styles = theme => ({
  container: {
    // display: 'flex',
    // flexWrap: 'wrap',
    // justifyContent: 'space-around',
    overflow: 'hidden',
    // background: theme.palette.background.paper,
    // boxSizing: 'border-box',
    maxWidth: theme.spacing(120),
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: theme.spacing(8),
    paddingBottom: 56
    // alignItems:'center'
    // overflowX: 'hidden'
  },
  gridList: {
    width: 'auto',
    height: 'auto',
    // paddingLeft:16,
    // paddingRight:16
    padding: 16
  },
  searchGridList: {
    width: 'auto',
    height: 'auto',
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 16,
    paddingBottom: 0
  },
  // root: {
  //   boxSizing: 'border-box',
  //   flexShrink: 0,
  // },
  tile: {
    position: 'relative',
    display: 'block', // In case it's not renderd with a div.
    overflow: 'hidden',
    borderRadius: 3,
    height: theme.spacing(11),
    backgroundColor: 'rgba(6,40,69,0.62)'
  },
  barRoot: {
    height: 'auto',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    backgroundColor: "#fde298",
    color: '#062845',
    // padding:0,
    minWidth: 0
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  defaultTileIcon: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto',
    display: 'block',
    height: theme.spacing(20),
    width: 'auto'
  },
  subtitle: {
    whiteSpace: 'normal',
    paddingBottom: theme.spacing(2),
    fontSize: 15,
    lineHeight: '18px',
    fontWeight: 300
  },
  subtitleTrim: {
    paddingBottom: theme.spacing(2),
    fontSize: 15,
    lineHeight: '18px',
    fontWeight: 300
  },
  tileTitle: {
    paddingTop: theme.spacing(2),
    fontSize: 19,
    lineHeight: '22px',
    fontWeight: 700
  },
  center: {
    // flexDirection:'column',
    // flex:1,
    // justifyContent:'space-around',
  },
  roundButton: {
    width: 44,
    height: 44,
    margin: 0,
    padding: 0,
    borderRadius: '50%',
    minWidth: 0,
    color: '#062845',
    backgroundColor: "#fde298",
    '&:hover': {
      background: theme.palette.primary['50']
    },
  },
});

class Feed extends React.Component {

  state = {
    search: '',
    daysToLoad: 5
  }

  handleSearch = name => event => {
    this.setState({
      search: event.target.value,
      daysToLoad: 5
    });
  }

  componentDidMount() {
    window.scrollTo(0, 0)
    window.addEventListener('scroll', this.onScroll, false);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll, false);
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

  render() {
    const {
      classes,
      actions,
      state
    } = this.props;
    const searchText = this.state.search.length > 0 ? this.state.search.toLowerCase() : null;
    var allFeed = state.getIn(['classes', 'classesById'])
    var classSearchMiss = false;
    if (searchText && searchText.length > 0) {
      const newFeed = allFeed.filter(x => (x.get('name') && x.get('name').toLowerCase().indexOf(searchText) !== -1) ||
        (x.get('description') && x.get('description').toLowerCase().indexOf(searchText) !== -1) ||
        (x.get('longDescription') && x.get('longDescription').toLowerCase().indexOf(searchText) !== -1) ||
        (x.get('venue') && x.get('venue').toLowerCase().indexOf(searchText) !== -1));
      if (newFeed.count() > 0) {
        allFeed = newFeed;
      } else {
        // allFeed = Map();
        classSearchMiss = true;
      }
    }
    const sessions = state.hasIn(['sessions', 'sessionsById']) ? state.getIn(['sessions', 'sessionsById']).sort((a, b) => {
      const startsAtA = a.get('startsAt');
      const startsAtB = b.get('startsAt');
      if (startsAtA < startsAtB) {
        return -1;
      }
      if (startsAtA > startsAtB) {
        return 1;
      }
      return 0;
    }) : null;

    const user = this.props.state.get('user');
    const userId = user.get('id');

    // const roles = user && user.get('roles');
    // const isAdmin = roles && roles.get('admin') === true;
    // const isTrainer = roles && roles.get('trainer') === true;
    // changed on 3/9/2020
    const roles = user && user.get('staffRole');
    const isStaff = user && user.get('isStaff') === true;
    const isAdmin = roles && roles === 'admin';
    const isTrainer = roles && roles === 'trainer';

    const bookings = sessions && state.hasIn(['bookings', 'bookingsById']) ? state.getIn(['bookings', 'bookingsById']).sort((bookingA, bookingB) => {
      const a = sessions.get(bookingA.get('sessionId'));
      const b = sessions.get(bookingB.get('sessionId'));
      const startsAtA = a ? a.get('startsAt') : bookingA.get('startsAt');
      const startsAtB = b ? b.get('startsAt') : bookingB.get('startsAt');
      if (startsAtA < startsAtB) {
        return -1;
      }
      if (startsAtA > startsAtB) {
        return 1;
      }
      return 0;
    }) : null;

      // console.log(sessions && state.hasIn(['bookings', 'bookingsById']));

    var userBookings = [];
    bookings && bookings.toKeyedSeq().forEach((v, k) => {


      const type = v.get('type');
      const seat = parseInt(v.get('seat'));
      const sessionId = v.get('sessionId');
      const session = sessions && sessions.get(sessionId);
      const sessionClass = session && allFeed && allFeed.get(session.get('classId'));
      if (type==='class' && !sessionClass) {
        return;
      }
      // console.log(v, k);
      const startsAt = session ? session.get('startsAt') : v.get('startsAt');
      const endsAt = session ? session.get('endsAt') : v.get('endsAt');
      const timeToCompare = endsAt || startsAt;

      if (timeToCompare && moment(timeToCompare).valueOf() > moment().valueOf() && !v.get('cancelledAt')) {

        const trainerId = v.get('trainerId');

        if(trainerId && user && user.get('id') === trainerId){
          
          if(type === 'class'){
            const subtitle = (
              <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {moment(startsAt).format('ddd, MMM Do ~ h:mm A')}
              </div>
            );

            const tempImg = sessionClass.get('image');
            const thumbImg = tempImg && tempImg.replace(encodeURIComponent('images/'), encodeURIComponent('images/thumb_512_'));

            // userBookings.push(
            //   [startsAt, (
            //     <GridListTile key={k} cols={2} classes={{tile:classes.tile}} style={{}} onClick={()=>actions.viewClass(sessionClass.get('slug'), sessionId)}>
            //       <img key={k} src={thumbImg} alt={sessionClass.get('name')}  />
            //       <GridListTileBar
            //         classes={{title:classes.tileTitle, subtitle:classes.subtitle, root:classes.barRoot}}
            //         title={sessionClass.get('name')}
            //         subtitle={subtitle}
            //         actionIcon={
            //           <Button key={"book"} raised className={classes.roundButton} style={{flex:'none', margin:16}}>
            //             {`${seat+1}`}
            //           </Button>
            //         }
            //       />
            //     </GridListTile>
            //   )]
            // );
          }else if(type === 'pt'){
            const subtitle = (
              <div>
                <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  {moment(startsAt).format('ddd, MMM Do')}
                </div>
                <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  {moment(startsAt).format('h:mm')} to {moment(endsAt).format('h:mm A')}
                </div>
              </div>
            );

            const bookingUserId = v.get('userId');
            const bookingUser = state.getIn(['users', 'usersById', bookingUserId]);
            const bookingUserName = bookingUser && bookingUser.get('name');

            // const trainer = state.getIn(['trainers', 'trainersById', trainerId]);
            // const trainerName = trainer && trainer.get('name').charAt(0).toUpperCase() + trainer.get('name').slice(1);
            const title = `Training${bookingUserName ? ' with '+bookingUserName : ''}`;
            const bookingUserImage = bookingUser && bookingUser.get('image') ? bookingUser.get('image') : require("./assets/babel-icon.png");
            // trainer && console.log(trainer.toJS());

            userBookings.push(
              [startsAt, (
                <GridListTile key={k} cols={2} classes={{tile:classes.tile}} style={{}} onClick={()=>actions.viewPerson(trainerId, k)}>
                  <GridListTileBar
                    classes={{title:classes.tileTitle, subtitle:classes.subtitle, root:classes.barRoot}}
                    title={title}
                    subtitle={subtitle}
                    actionIcon={
                      <Button key={"book"} raised className={classes.roundButton} style={{flex:'none', margin:16, overflow:'hidden'}} >
                        <img src ={bookingUserImage} alt="logo" style={{width:44, height:44}} />
                      </Button>

                    }
                  />
                </GridListTile>
              )]
            );
          }
        }else{

          if(type === 'class'){
            const subtitle = (
              <div>
                <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  {moment(startsAt).format('ddd, MMM Do ~ h:mm A')}
                </div>
                <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  {sessionClass.get('venue')}
                </div>
              </div>
            );

            const tempImg = sessionClass.get('image');
            const thumbImg = tempImg && tempImg.replace(encodeURIComponent('images/'), encodeURIComponent('images/thumb_512_'));

            userBookings.push(
              [startsAt, (
                <GridListTile key={k} cols={2} classes={{tile:classes.tile}} style={{}} onClick={()=>actions.viewClass(sessionClass.get('slug'), sessionId)}>
                  <img key={k} src={thumbImg} alt={sessionClass.get('name')}  />
                  <GridListTileBar
                    classes={{title:classes.tileTitle, subtitle:classes.subtitle, root:classes.barRoot}}
                    title={sessionClass.get('name')}
                    subtitle={subtitle}
                    actionIcon={
                      <Button key={"book"} raised className={classes.roundButton} style={{flex:'none', margin:16}}>
                        {`${seat+1}`}
                      </Button>
                    }
                  />
                </GridListTile>
              )]
            );
          }else if(type === 'pt'){

            const trainer = state.getIn(['trainers', 'trainersById', trainerId]);
            const trainerName = trainer && trainer.get('name').charAt(0).toUpperCase() + trainer.get('name').slice(1);
            const trainerImage = trainer && trainer.get('image') ? trainer.get('image') : require("./assets/babel-icon.png");

            const bookingUserId = v.get('userId');
            const bookingUser = state.getIn(['users', 'usersById', bookingUserId]);
            const bookingUserName = bookingUser && bookingUser.get('name');
            const bookingUserImage = bookingUser && bookingUser.get('image') ? bookingUser.get('image') : require("./assets/babel-icon.png");

            var title = '';
            var subtitle = null;
            var actionIcon = null;
            if(bookingUserId && user && user.get('id') === bookingUserId){
              title = `Training${trainerName ? ' with '+trainerName : ''}`;
              subtitle = (
                <div>
                  <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {moment(startsAt).format('ddd, MMM Do')}
                  </div>
                  <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {moment(startsAt).format('h:mm')} to {moment(endsAt).format('h:mm A')}
                  </div>
                </div>
              );
              actionIcon = (
                <Button key={"book"} raised className={classes.roundButton} style={{flex:'none', margin:16, overflow:'hidden'}} >
                  <img src ={trainerImage} alt="logo" style={{width:44, height:44}} />
                </Button>
              );
            }else{
              title = `PT - ${bookingUserName ? bookingUserName : ''}`;
              subtitle = (
                <div>
                  <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {trainerName}
                  </div>
                  <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {moment(startsAt).format('ddd, MMM Do ~ h:mm')} to {moment(endsAt).format('h:mm A')}
                  </div>
                </div>
              );
              actionIcon = (
                <Button key={"book"} raised className={classes.roundButton} style={{flex:'none', margin:16, overflow:'hidden'}} >
                  <img src ={bookingUserImage} alt="logo" style={{width:44, height:44}} />
                </Button>
              );
            }

            userBookings.push(
              [startsAt, (
                <GridListTile key={k} cols={2} classes={{tile:classes.tile}} style={{}} onClick={()=>actions.viewPerson(trainerId, k)}>
                  <GridListTileBar
                    classes={{title:classes.tileTitle, subtitle:classes.subtitle, root:classes.barRoot}}
                    title={title}
                    subtitle={subtitle}
                    actionIcon={actionIcon}
                  />
                </GridListTile>
              )]
            );
          }

        }



      }
    });

    // console.log('userBookings', userBookings.length);

    const sessionsForTrainer = sessions && isTrainer && userId ? sessions.filter(x => x.get('trainerId') === userId) : null;
    sessionsForTrainer && sessionsForTrainer.toKeyedSeq().forEach((sv, sk) => {
      const classId = sv.get('classId');
      const sessionClass = allFeed.get(classId);

      if (!sessionClass) {
        return;
      }

      const trainerId = sv.get('trainerId');
      const trainer = state.getIn(['trainers', 'trainersById', trainerId]);
      const trainerName = trainer && trainer.get('name').charAt(0).toUpperCase() + trainer.get('name').slice(1);

      if (classSearchMiss &&
        (trainerName && trainerName.toLowerCase().indexOf(searchText) === -1)
      ) {
        return;
      }

      const subtitle = (
        <div>
          <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
            {moment(sv.get('startsAt')).format('ddd, MMM Do ~ h:mm A')}
          </div>
          <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
            {sessionClass.get('venue')}
          </div>
        </div>
      );

      const tempImg = sessionClass.get('image');
      const thumbImg = tempImg && tempImg.replace(encodeURIComponent('images/'), encodeURIComponent('images/thumb_512_'));

      userBookings.push(
        [sv.get('startsAt'), (
          <GridListTile key={sk} cols={2} classes={{tile:classes.tile}} style={{}} onClick={()=>actions.viewClass(sessionClass.get('slug'), sk)}>
            <img key={sk} src={thumbImg} alt={sessionClass.get('name')}  />
            <GridListTileBar
              classes={{title:classes.tileTitle, subtitle:classes.subtitle, root:classes.barRoot}}
              title={sessionClass.get('name')}
              subtitle={subtitle}
              actionIcon={
                <Button className={classes.button} raised>
                    {isStaff ? 'Manage' : 'Book Now'}
                </Button>
              }
            />
          </GridListTile>
        )]

      );
    });

    var nextItems = [];
    userBookings.sort((a,b)=>{
      const startsAtA = a[0];
      const startsAtB = b[0];
      if(startsAtA > startsAtB){
        return 1;
      }
      if(startsAtB > startsAtA){
        return -1;
      }
      return 0;
    });
    userBookings.forEach(userBooking=>{
      nextItems.push(userBooking[1]);
    })


    var showSpinner = false;
    const sessionsByDay = sessions ? sessions.filter(x => x.get('startsAt') > moment()).groupBy(x => moment(x.get('startsAt')).format('YYYY-MM-DD')) : null;
    var days = [];
    sessionsByDay && sessionsByDay.toKeyedSeq().forEach((v, k) => {
      if (days.length >= this.state.daysToLoad) {
        return;
      }
      var daySessions = [];
      v.toKeyedSeq().forEach((sv, sk) => {
        const classId = sv.get('classId');
        const sessionClass = allFeed.get(classId);

        if (!sessionClass) {
          return;
        }

        const trainerId = sv.get('trainerId');
        const trainer = state.getIn(['trainers', 'trainersById', trainerId]);
        const trainerName = trainer && trainer.get('name').charAt(0).toUpperCase() + trainer.get('name').slice(1);

        const dateString = moment(k).format('dddd, MMMM Do');
        const shortDateString = moment(k).format('dddd, MMM Do');
        if (classSearchMiss &&
          (trainerName && trainerName.toLowerCase().indexOf(searchText) === -1) &&
          (dateString && dateString.toLowerCase().indexOf(searchText) === -1) &&
          (shortDateString && shortDateString.toLowerCase().indexOf(searchText) === -1)
        ) {
          return;
        }

        const subtitle = (
          <div>
            <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
              {moment(sv.get('startsAt')).format('h:mm A')} by {trainerName}
            </div>
            <div style={{whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
              {sessionClass.get('venue')}
            </div>
          </div>
        );

        const tempImg = sessionClass.get('image');
        const thumbImg = tempImg && tempImg.replace(encodeURIComponent('images/'), encodeURIComponent('images/thumb_512_'));

        daySessions.push(
          <GridListTile key={sk} cols={2} classes={{tile:classes.tile}} style={{}} onClick={()=>actions.viewClass(sessionClass.get('slug'), sk)}>
            <img key={sk} src={thumbImg} alt={sessionClass.get('name')}  />
            <GridListTileBar
              classes={{title:classes.tileTitle, subtitle:classes.subtitle, root:classes.barRoot}}
              title={sessionClass.get('name')}
              subtitle={subtitle}
              actionIcon={
                <Button className={classes.button} raised>
                    {isStaff ? 'Manage' : 'Book Now'}
                </Button>
              }
            />
          </GridListTile>
        );
      });

      if (daySessions.length > 0) {
        var gridStyle = {}
        if (days.length + 1 === this.state.daysToLoad) {
          // gridStyle.paddingBottom = 400;
          showSpinner = true;
        }
        days.push(
          <GridList key={k} className={classes.gridList} spacing={16} cellHeight='auto' style={gridStyle}>
            <GridListTile key={k} cols={2} style={{ height: 'auto' }}>
            <Typography type="title">
              {moment(k).calendar(null, {
                sameDay: '[Today], MMMM Do',
                nextDay: '[Tomorrow], MMMM Do',
                nextWeek: 'dddd, MMMM Do',
                lastDay: '[Yesterday], MMMM Do',
                lastWeek: '[Last] dddd, MMMM Do',
                sameElse: 'dddd, MMMM Do'
            })}
            </Typography>
            </GridListTile>
            {daySessions}
          </GridList>
        );
      }
    });

    if (!allFeed || !sessions) {
      return (
        <div className={classes.container}>
          <MenuAppBar />
          <CircularProgress style={{margin:'auto', display:'block', marginTop:120, height:120, width:120}}/>
        </div>
      );
    }

    return (
      <div className={classes.container}>
          <MenuAppBar />
          <GridList className={classes.searchGridList} spacing={16} cellHeight='auto'>
            <GridListTile cols={2} style={{ height: 'auto' }}>
              <TextField
                id="search"
                label="Search Classes, Trainers, Dates..."
                fullWidth
                onChange={this.handleSearch('search')}
                style={{marginBottom:16}}
                InputProps={{
                  endAdornment:(
                    <InputAdornment style={{marginTop:0}} position="end"><Search color='disabled'/></InputAdornment>
                  )
                }}
              />
            </GridListTile>
          </GridList>
          {nextItems.length > 0 &&
            <GridList key={'nextGrid'} className={classes.gridList} spacing={16} cellHeight='auto'>
              <GridListTile key={'nextTitle'} cols={2} style={{ height: 'auto' }}>
              <Typography type="title">
                Next
              </Typography>
              </GridListTile>
              {nextItems}
            </GridList>
          }
          {days}
          {(nextItems.length === 0 && days && days.length === 0) &&
            <GridList key={'nextGrid'} className={classes.gridList} spacing={16} cellHeight='auto'>
              <GridListTile key={'nextTitle'} cols={2} style={{ height: 'auto' }}>
                <Typography type="title" style={{textAlign:'center', color:'rgba(0, 0, 0, 0.54)'}}>
                  You have no upcoming events now
                </Typography>
              </GridListTile>
            </GridList>
          }
          {showSpinner &&
            <CircularProgress style={{margin:'auto', display:'block', marginTop:32, height:64, width:64}}/>
          }
          <BabelLogo />
        </div>
    );
  }
}

Feed.propTypes = {
  classes: PropTypes.object.isRequired,
};

const FeedStyled = withStyles(styles)(Feed);

const mapStateToProps = state => ({
  ...state
})

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedStyled)
