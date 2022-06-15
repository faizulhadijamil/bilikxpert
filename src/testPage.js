
  import {bindActionCreators} from 'redux';
  import {CircularProgress} from 'material-ui/Progress'
  import {List} from 'material-ui';
  import {
    connect
  } from 'react-redux';
  import {
    withStyles
  } from '@material-ui/core';

  import Grid from 'material-ui/Grid';
  import React from 'react';
  import Button from 'material-ui/Button';
  //import TextField from 'material-ui/TextField';
  import Typography from 'material-ui/Typography';
  // import {getTheDate} from './actions'; 
  
  import PropTypes from 'prop-types';
  
  import {
    makeGetCurrentUser,
    // makeGetAllUsers,
    // makeGetPaymentsMembersItems,
  } from './selectors'
  import * as Actions from './actions';

  import moment from 'moment';
  import * as firebase from 'firebase';
  import 'firebase/firestore';

  // var FileSaver = require('file-saver');

  const styles = theme => ({
    container: {
      // width: '100%',
      // maxWidth: 360,
      // backgroundColor: theme.palette.background.paper,
      // position: 'relative',
      // overflow: 'auto',
      // maxHeight: 300,
      overflow: 'hidden',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: theme.spacing(10),
      paddingBottom: theme.spacing(10),
    },
  });
  
  class testPage extends React.Component {

    state = {
      selectedUserId: null,
      editData: {},
      gantnerData:null,
      isLoading:false,
      showDownloadBtn:false,
      enableGenerateReport:false,
    }
  
    componentWillMount() {
      // this.timer = null;
    }
  
    componentWillUnmount() {
      clearTimeout(this.timer);
    }
  
    componentDidMount() {
        window.scrollTo(0, 0);
        var gantnerData = [];

        const startTime = new Date();
        this.setState({startTime});

        const ref = firebase.firestore().collection('payments').where('userId', '==', 'cukIezXNUeAgkuAPKNf1');
       
        // const ref = firebase.firestore().collection('packages').where('renewalTerm', '==', 'month');
        ref.get().then((querySnapshot) => {
            const startTime2 = new Date();
            this.setState({startTime2});
            querySnapshot.forEach(doc=>{
                console.log(doc.id, '=>', doc.data());
                gantnerData.push(doc.data());
            });
            this.setState({gantnerData:gantnerData});
        });

        // const ref = firebase.firestore().collection('gantnerLogs').where('userId', '==', 'cukIezXNUeAgkuAPKNf1');
       
        // ref.get().then((querySnapshot) => {
        //     const startTime2 = new Date();
        //     this.setState({startTime2});
        //     querySnapshot.forEach(doc=>{
        //         console.log(doc.id, '=>', doc.data());
        //         gantnerData.push(doc.data());
        //     });
        //     this.setState({gantnerData:gantnerData});
        // });

    //   const {users} = this.props;
    //    console.log('theUsers: ', this.props.users);

    //   const userGantnerLogs = firebase.firestore().collection('gantnerLogs').where("packageGroup", "==", "BFM").get();
    //   var gantnerData = [];
    
    //   userGantnerLogs.then((querySnapshot)=>{
    //       console.log('gantners: ', querySnapshot);
    //     querySnapshot.forEach(doc=>{
    //       console.log(doc.id, '=>', doc.data());
    //       gantnerData.push(doc.data());
    //     });
    //     this.setState({gantnerData:gantnerData});
    //   }).catch(function (error) {
    //     this.setState({ gantnerData: null });
    //     console.log("Error getting document:", error);
    //   });

    }
  
    componentDidUpdate(prevProps) {
    }

    renderLoading(){
        const {classes} = this.props;
        return( 
          <div 
            className={classes.container}
            style= {{height:window.innerHeight}}
          >
             <CircularProgress style={{margin:'auto', display:'block', height:120, width:120, alignItems:'center', justifyContent:'center'}}/>
          </div>
          );
    }



    renderListView(){
        // const {
        //     classes,
        //     users,
        //   } = this.props;
        
          const {gantnerData} = this.state;

        const gantnerListLayout = [];
        gantnerData && gantnerData.forEach((gantner)=>{
            const name = gantner.name||null;
            const email = gantner.email||null;
            const dateWithFormat = gantner.dateWithFormat||null;
            const checkInFormat = gantner.checkInFormat||null;
            const checkOutFormat = gantner.checkOutFormat||null;
            const status = gantner.status;
            gantnerListLayout.push(
                <div style = {{display:'flex', flexDirection:'row', marginBottom:10}}>
                    <p>{name}</p>
                    <p>{email}</p>
                    <p>{dateWithFormat}</p>
                    <p>{checkInFormat}</p>
                    <p>{checkOutFormat}</p>
                    <p>{status}</p>
                </div>
            )
        })
        
        return(
           
            <List>
                {gantnerListLayout}
            </List>
           
        )
    }

    render() {
      const {
        classes,
        users,
      } = this.props;

      console.log('theState: ', this.state);

      // to calculate timing
      const timeElapsed1 = new Date() - this.state.startTime;
      console.log('timeElapsed1: ', timeElapsed1/1000 + 's'); 

      const timeElapsed2 = new Date() - this.state.startTime2;
      console.log('timeElapsed2: ', timeElapsed2/1000 + 's'); 
  
      // console.log('gantnerDataState: ', this.state.gantnerData);
      // const usersLoad = users && users.size>21? true:false;
      const enableDownloadBtn = users && users.size>21? true:false;

      const user = this.props.currentUser || null;
      const roles = user && user.get('roles');
      const isSuperVisor = roles && roles.get('superVisor') === true;

      if (isSuperVisor){
        return (
          <div className={classes.container}>
           
              <Grid container spacing={24}>
                <Grid container style={{marginTop:32, alignItems:'center', justifyContent:'center'}}>   
                <Grid item xs={5} style={{paddingTop:0, paddingBottom:0, margin:20}}>
                      <Typography component="h1" color="primary" style={{marginLeft:8, marginRight:8, color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
                          {'testing'}   
                      </Typography>
                     
                      <Button 
                          key='generateReport' 
                          onClick={()=>this.handleGenBFMReport()}
                          disabled = {!enableDownloadBtn}
                          margin="dense"
                          >
                          {'test'}
                      </Button>
                      {this.state.isLoading && this.renderLoading()}
                      {this.renderListView()}
                      <Button 
                          key='downloadReport' 
                          onClick={()=>this.handleDownloadBtn()}
                          disabled = {!this.state.showDownloadBtn}
                          margin="dense"
                          >
                          {'Download CSV BFM Report'}
                      </Button>
                  </Grid>
                </Grid>
              </Grid>
            
          </div>
        );
      }
      else{
        return null
      }
    }
  }
  
  testPage.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  const testPageStyled = withStyles(styles)(testPage);
  
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
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(testPageStyled)