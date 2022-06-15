
  import {bindActionCreators} from 'redux';
  import {connect} from 'react-redux';
  import {withStyles} from '@material-ui/core';
  import Avatar from 'material-ui/Avatar';

  import Grid from 'material-ui/Grid';
  import React from 'react';
  import Button from 'material-ui/Button';
  import TextField from 'material-ui/TextField';
  import Typography from 'material-ui/Typography';
  import {getTheDate} from '../actions'; 
  import axios from 'axios';
  
  import PropTypes from 'prop-types';
  // import { ZoomMtg } from '@zoomus/websdk';
  
  import {
    makeGetCurrentUser,
  } from '../selectors'
  import * as Actions from '../actions';
  import BabelLogo from '../BabelLogo';
  import MenuAppBar from '../MenuAppBar';
  import moment from 'moment';

  const styles = theme => ({
    container: {
      // width: '100%',
      // maxWidth: 360,
      // backgroundColor: theme.palette.background.paper,
      // position: 'relative',
      // overflow: 'auto',
      // maxHeight: 300,
      overflow: 'hidden',
      // maxWidth: theme.spacing(7)5,
      marginLeft: 'auto',
      marginRight: 'auto',
      // paddingTop: theme.spacing(8),
      marginTop: theme.spacing(10),
      paddingBottom: theme.spacing(10),
    },
  });
  
  class vidConfPage extends React.Component {
  
    state = {
    
    }
  
    componentDidMount() {
      window.scrollTo(0, 0);

      // fetch user zoom
      // this.props.actions.getAllZoomUsers((response)=>{
      //   console.log('theResponse: ', response);
      // });
      //   const {users} = this.props;
      //    console.log('theUsers: ', this.props.users);

      // to get all users
      axios.get('https://us-central1-babelasia-37615.cloudfunctions.net/getAllZoomUsers')
      .then(res => {
          console.log('response: ', res);
          const data = res && res.data;
          // const appointments = res && res.data && res.data.appointments;
          if (data && data.users){
            this.setState({zoomUsers: data.users});
          }
      })
      .catch((e)=>{
        console.log('error: ', e);
      });

      // to get all meetings
      axios.get('https://us-central1-babelasia-37615.cloudfunctions.net/getAllZoomMeetings')
      .then(res => {
          console.log('response: ', res);
          const data = res && res.data;
          // const appointments = res && res.data && res.data.appointments;
          if (data && data.meetings){
            this.setState({zoomMeetings: data.meetings});
          }
      })
      .catch((e)=>{
        console.log('error: ', e);
      });

      // fetch('https://us-central1-babelasia-37615.cloudfunctions.net/getAllZoomUsers')
      // .then((response) => {response.json(); console.log('theresponse: ', response)})
      // .then((data) => console.log('This is your data', data));

      // <link type="text/css" rel="stylesheet" href="https://source.zoom.us/1.8.1/css/bootstrap.css" />
      // <link type="text/css" rel="stylesheet" href="https://source.zoom.us/1.8.1/css/react-select.css" />

      // const s = document.createElement('script');
      // s.type = 'text/javascript';
      // s.async = true;
      // s.innerHTML = "document.write('This is output by document.write()!')";
      // s.src = "https://checkoutshopper-test.adyen.com/checkoutshopper/assets/js/sdk/checkoutSDK.1.3.0.min.js";
      // // s.src = "https://checkoutshopper-test.adyen.com/checkoutshopper/assets/js/sdk/checkoutSDK.1.9.14.min.js";
      // // this.instance.appendChild(s);
      // // window.instance.appendChild(s);
      // var head = document.getElementsByTagName('head').item(0);
      // head.appendChild(s);

    }
  
    componentDidUpdate(prevProps) {
      if (this.props.userId !== prevProps.userId) {
        this.handleSelectPerson(this.props.userId);
      }
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (this.props !== nextProps || this.state !== nextState) {
        return true;
      }
      return false;
    }

    openZoom = (number) => {
      window.open(`zoommtg://zoom.us/start?confno=96701429663`, '_blank');
    }

    render() {
      const {
        classes
      } = this.props;

      const user = this.props.currentUser || null;
      const roles = user && user.get('roles');
      const isAdmin = roles && roles.get('admin') === true;
      const isMC = roles && roles.get('mc') === true;
      const isTrainer = roles && roles.get('trainer') === true;
      const email = user && user.get('email');
      // console.log('thezoomuser:: ', this.state);

      return (
        <div className={classes.container}>
            <MenuAppBar />
              <Button key={'testroom1'} className={classes.adminButton} raised onClick={() => this.openZoom(1)}>
                test meeting 1
              </Button>
              <Typography>{'all zoom users test'}</Typography>
              {this.state.zoomUsers && this.state.zoomUsers.length>0 && this.state.zoomUsers.map(user=>{
                return(
                  <Typography key={user.email}>{user.email}</Typography>
                )
              })}
               <Typography>{'all zoom meeting test'}</Typography>
              {this.state.zoomMeetings && this.state.zoomMeetings.length>0 && this.state.zoomMeetings.map(meeting=>{
                return(
                  <div key = {`${meeting.uuid}`}>
                    <Typography>{`Agenda: ${meeting.agenda}`}</Typography>
                    <Typography>{`Topic: ${meeting.topic}`}</Typography>
                    <Typography onClick = {()=>{window.open(`${meeting.join_url} , _blank`)}}>{`URL: ${meeting.join_url}`}</Typography>
                    <Typography>{`TIME: ${meeting.start_time}`}</Typography>
                  </div>
                )
              })}
            <BabelLogo />
        </div>
      );
    }
  }
  
  vidConfPage.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  const vidConfPageStyled = withStyles(styles)(vidConfPage);
  
  const makeMapStateToProps = () => {
    const getCurrentUser = makeGetCurrentUser();
    // const getAllUsers = makeGetAllUsers();
    // const getPaymentsUserItem = makeGetPaymentsMembersItems();
    const mapStateToProps = (state, props) => {
      return {
        currentUser: getCurrentUser(state, props),
        // users: getAllUsers(state, props),
        // usersWithPayment: getPaymentsUserItem(state, props),
      }
    }
    return mapStateToProps
  }
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(vidConfPageStyled)