import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/functions';
  import {bindActionCreators} from 'redux';
  import {connect} from 'react-redux';
  import {withStyles, Grid, Button, Typography, CircularProgress} from '@material-ui/core';

  import React from 'react';
  
  import {getTheDate, getGantnerLogsByUId} from './actions'; 

  import DropDown from './Cards/DropDown';
  import moment from 'moment';
  
  import PropTypes from 'prop-types';
  
  import {
    makeGetCurrentUser,
    makeGetAllUsers,
    makeGetSelectedUserGantnerLogs,
  } from './selectors'
  import * as Actions from './actions';
  import BabelLogo from './BabelLogo';
  import MenuAppBar from './MenuAppBar';
  
  var FileSaver = require('file-saver');

  const styles = theme => ({
    container: {
      overflow: 'hidden',
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: theme.spacing(10),
      paddingBottom: theme.spacing(10),
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
    selectedUser: {
      position: 'fixed',
      zIndex: 1200
    },
    title: {
      marginBottom: theme.spacing(1)
    },
    addButton: {
      marginTop: theme.spacing(2),
      marginLeft: theme.spacing(2),
      marginRight: theme.spacing(2),
      marginBottom: theme.spacing(2),
      backgroundColor: "#fde298",
      color: '#fff',
    },
    fileInput: {
      display: 'none'
    },
    fab: {
      position: 'fixed',
      bottom: 56 + theme.spacing(2),
      right: theme.spacing(2),
      zIndex: 1300
    },
    media: {
      minHeight: 32,
      backgroundColor: 'rgba(6,40,69,0.62)'
    },
    card: {
      marginTop: theme.spacing(8),
      marginRight: theme.spacing(3),
      overflow: 'hidden',
    },
  });
  
  class UserReport extends React.Component {
  
    state = {
      selectedUserId: null,
      editData: {},
      isLoading:true
    }
  
    componentWillMount() {
      this.timer = null;
    }
  
    componentWillUnmount() {
      clearTimeout(this.timer);
    }
  
    componentDidMount() {
      window.scrollTo(0, 0);
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

    handleSelectPerson = (userId, viewPerson = false) => {
      const user = this.props.currentUser || null;
      const roles = user && user.get('roles');
      const isAdmin = roles && roles.get('admin') === true;
      const isMC = roles && roles.get('mc') === true;
      const isTrainer = roles && roles.get('trainer') === true;
      if (!(isAdmin || isMC || isTrainer)) {
        return;
      }
      this.setState({
        selectedUserId: userId
      })
      this.props.actions.getInvoicesByUserId(userId);
      this.props.actions.getPaymentsByUserId(userId);
      const selectedUser = this.props.users.get(userId);
      const selectedUserRoles = selectedUser && selectedUser.get('roles');
      const selectedUserIsTrainer = selectedUserRoles && selectedUserRoles.get('trainer') === true;
     
      console.log('handleSelectPerson: ', userId);
      // // this.props.actions.removeCardToRegister();
      // window.scrollTo(0, 0);
  
      // console.log(window.innerWidth, window.innerHeight);
    }

    handleDownload = (duplicateUser) => {
      console.log('handleDownload: ', duplicateUser);
      var finalData = [];
      duplicateUser && duplicateUser.forEach((user, id)=>{
        const {duplicateData} = user;
        const membershipStartDate = moment(getTheDate(user.memberStartDate)).isValid? moment(getTheDate(user.memberStartDate)).format('YYYYMMDD'):'No start date'
        const email = user.email;
        const name = user.name;
        const phone = user.phone;
        const userId = user.userId;
        const vendCustomerId = user.vendCustomerId;
        const duplicateMemberStartDate = moment(getTheDate(duplicateData.memberStartDate)).isValid? moment(getTheDate(duplicateData.memberStartDate)).format('YYYYMMDD'):'no start date';
        const duplicateEmail = duplicateData.email;
        const duplicateName = duplicateData.name;
        const duplicatePhone = duplicateData.phone;
        const duplicateUserId = duplicateData.userId;
        const duplicateVendCustomerId = duplicateData.vendCustomerId;

        finalData.push({userId, email, name, phone, vendCustomerId, membershipStartDate, 
          duplicateUserId, duplicateEmail, duplicateName, duplicatePhone, duplicateVendCustomerId, duplicateMemberStartDate
        })
       
      });
      var theCSVformat = this.ConvertToCSV(finalData);
      var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
      FileSaver.saveAs(blob, "duplicateMembers.csv");
    }

  // JSON to CSV Converter
  ConvertToCSV = (objArray) => {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';

    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','
            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
  }

    render() {
      const {
        classes,
        selectedUserGanterLogs,
      } = this.props;

      // console.log('theProps: ', this.props);
      // console.log('theState: ', this.state);

      const user = this.props.currentUser || null;
      const roles = user && user.get('roles');
      const isAdmin = roles && roles.get('admin') === true;
      const isMC = roles && roles.get('mc') === true;
      const isTrainer = roles && roles.get('trainer') === true;
      const email = user && user.get('email');
      const isKLCC = email && email.indexOf('+klcc@babel.fit') !== -1 ? true : false;

      // let duplicateVend = [];
      let notDuplicateUser = [];
      let duplicateUserDetails = [];
      let originalUserDetail = [];
      let duplicateList = [];
  
      const users = this.props.users || null;
      let count = 0;

      // users && users.forEach((user, index)=>{
      //   const vendCustomerId = user.get('vendCustomerId') || null;
      //   const userEmail = user.get('email')||null;
      //   const name = user.get('name')||null;
      //   const userId = index;
      //   const memberStartDate = user.get('autoMembershipStarts') ? user.get('autoMembershipStarts') : user.get('membershipStarts')?user.get('membershipStarts'):null;
      //   if (vendCustomerId && (notDuplicateUser.includes(vendCustomerId) || (notDuplicateUser.includes(userEmail)))){
      //     // duplicateVend.push(vendCustomerId);
      //     // duplicateUsers.push({name, email: userEmail, vendCustomerId, key:userId})
      //     count += 1;
      //     duplicateUserDetails.push({
      //       userId, 
      //       name, 
      //       email: userEmail, 
      //       vendCustomerId, 
      //       memberStartDate,
      //       key:userId, 
      //       count
      //     });
      //   }
      //   else{
      //     vendCustomerId && notDuplicateUser.push({
      //       userId, 
      //       name, 
      //       email: userEmail, 
      //       vendCustomerId, 
      //       memberStartDate,
      //       key:userId
      //     }, vendCustomerId, userEmail);
      //   }
      // });

      // notDuplicateUser && notDuplicateUser.forEach((user, index)=>{
      //   const vendCustomerIdNot = user.vendCustomerId || null;
      //   const userEmail = user.email || null;
      //   duplicateUserDetails && duplicateUserDetails.forEach((duplicateUser, index) => {
      //     const vendCustomerIdYes = duplicateUser.vendCustomerId||null;
      //     if(vendCustomerIdNot === vendCustomerIdYes){
      //       duplicateUserDetails[index].duplicateData = user; 
      //     }
          
      //   });
      // });
      
      // console.log('duplicateUserDetails: ', duplicateUserDetails);

      users && users.forEach((user, index)=>{
        const vendCustomerId = user.get('vendCustomerId') || null;
        const email = user.get('email')||null;
        const name = user.get('name')||null;
        const userId = index;
        const phone = user.get('phone')||null;
        const memberStartDate = user.get('autoMembershipStarts') ? user.get('autoMembershipStarts') : user.get('membershipStarts')?user.get('membershipStarts'):null; 

        //if (memberStartDate){
          if (name && email && vendCustomerId && (notDuplicateUser.includes(vendCustomerId) 
           || notDuplicateUser.includes(email) 
           // || notDuplicateUser.includes(name)
            )){
          
            // console.log('notDuplicateUser.includes(email): ', notDuplicateUser.includes(email));
            count += 1;
            duplicateUserDetails.push({
              userId, 
              name, 
              email, 
              vendCustomerId, 
              memberStartDate,
              phone:phone? phone: '',
              key:userId, 
              count
            });
          }
          else{
            name && vendCustomerId && email && notDuplicateUser.push({
              userId, 
              name, 
              email, 
              vendCustomerId, 
              phone:phone? phone: '',
              // memberStartDate:moment(getTheDate(memberStartDate)).format('DD MM YYYY'),
              memberStartDate,
              key:userId
            }, vendCustomerId, email, name);
          }     
        //}
      });

      notDuplicateUser && notDuplicateUser.forEach((user, index)=>{
        // console.log('theUser: ', user);
        const vendCustomerIdNot = user.vendCustomerId || null;
        const emailNot = user.email || null;
        const nameNot = user.name || null;
        const phoneNot = user.phone || null;
        duplicateUserDetails && duplicateUserDetails.forEach((duplicateUser, index) => {
          const vendCustomerIdYes = duplicateUser.vendCustomerId||null;
          const emailYes = duplicateUser.email||null;
          const nameYes = duplicateUser.name||null;
          const phoneYes = duplicateUser.phone||null;
          if(vendCustomerIdNot === vendCustomerIdYes || emailNot === emailYes || nameNot === nameYes || phoneNot === phoneYes){
            duplicateUserDetails[index].duplicateData = user; 
          }
        });
      });
      
      duplicateUserDetails && duplicateUserDetails.forEach(item => {
        duplicateList.push(
          <DropDown 
            selectAction={this.handleSelectPerson} 
            item = {item}
          />
        );
      });

      let loadingLayout = <CircularProgress style={{margin:'auto', display:'block', marginTop:120, height:120, width:120}}/>;
      // const loadingLayout = <CircularProgress style={{margin:'auto', display:'block', marginTop:120, height:120, width:120}}/>;
      // if (users && users.size>0){
      //     tableLayout = 
      //       <Grid item xs={12} style={{paddingTop:0, paddingBottom:0}}>
      //         <DropDown title ={'Users'} type={'vendCustomers'} selectAction={this.handleSelectPerson} />
      //       </Grid>
      // }
      let isLoading = duplicateList.length>0? false:true;

      return (
        <div className={classes.container}>
            <MenuAppBar />
              <div style={{padding:20}}>
                <Grid item xs={12}>
                  {isLoading && loadingLayout}
                  {!isLoading && duplicateList}
                  {!isLoading && <Button onClick={()=>this.handleDownload(duplicateUserDetails)}> download </Button>}
                </Grid>
              </div>
            <BabelLogo />
        </div>
      );
    }
  }
  
  UserReport.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  const ReportStyled = withStyles(styles)(UserReport);
  
  const makeMapStateToProps = () => {
    const getCurrentUser = makeGetCurrentUser();
    const getAllUsers = makeGetAllUsers();
    
    const mapStateToProps = (state, props) => {
      return {
        currentUser: getCurrentUser(state, props),
        users: getAllUsers(state, props),
      }
    }
    return mapStateToProps
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(ReportStyled)