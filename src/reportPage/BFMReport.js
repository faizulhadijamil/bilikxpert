
  import {bindActionCreators} from 'redux';
  import {connect} from 'react-redux';
  import {withStyles, CircularProgress, List, Grid, Button, TextField, Typography} from '@material-ui/core';

  import React from 'react';
  import {getTheDate} from '../actions'; 
  
  import PropTypes from 'prop-types';
  
  import {
    makeGetCurrentUser,
    makeGetAllUsers,
    makeGetPaymentsMembersItems,
  } from '../selectors'
  import * as Actions from '../actions';
  import BabelLogo from '../BabelLogo';
  import MenuAppBar from '../MenuAppBar';
  import moment from 'moment';
  // import * as firebase from 'firebase';
  import firebase from 'firebase/app'
  import 'firebase/firestore';

  var FileSaver = require('file-saver');

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
  
  class BFMReport extends React.Component {

    state = {
      selectedUserId: null,
      editData: {},
      gantnerData:null,
      isLoading:false,
      showDownloadBtn:false,
      enableGenerateReport:false,
    }
  
    componentWillMount() {
      this.timer = null;
    }
  
    componentWillUnmount() {
      clearTimeout(this.timer);
    }
  
    componentDidMount() {
      window.scrollTo(0, 0);

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

  ConvertArrayToCSV = (array) => {
    var theArray = '';
    var theArrayCol = '';
    console.log('theArray: ', array);
    console.log('arrayLength: ', array.length);

    for (var i = 0; i < array.length; i++) {
      theArray += array[i] + ',';
      // console.log('theArray: ', theArray)
    }

    for (var j = 0; j<theArray.length; j++){
      theArrayCol += theArray[j] + '\n';
    }
    return theArrayCol;
  }

    // JSON to CSV Converter
    ConvertToCSV = (objArray) => {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                if (line !== '') line += ','
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return str;
    }

    handleDownloadBtn = () => {
        const {gantnerData, noVisitData} = this.state;
        var finalData = []
        if (gantnerData.length>=1){
            console.log('bfmGantnerReport: ', gantnerData);
            gantnerData && gantnerData.forEach(data=>{
                const name = data.name||null;
                const email = data.email||null;
                const date = data.dateWithFormat||null;
                const checkInCount = data.checkInCount || null;
                const checkIn = data.checkInFormat||null;
                const checkOut = data.checkOutFormat||null;
                const paymentStatus = data.status||null;
                const deviceId = data.deviceId||null;
                finalData.push({
                    name, email, date, checkInCount, checkIn, checkOut, paymentStatus, deviceId
                });
            });

            noVisitData && noVisitData.forEach(data=>{
              const name = data.name||null;
                const email = data.email||null;
                const date = null
                const checkInCount = 0
                const checkIn = null
                const checkOut = null
                const deviceId = null
                const paymentStatus = data.status||null;
                finalData.push({
                    name, email, date, checkInCount, checkIn, checkOut, paymentStatus, deviceId
                });
            })

            var theCSVformat = this.ConvertToCSV(finalData);
            var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, "BFMReport.csv");
        }
    }

    isTTDIPackage(packageId){
      var isTTDIPackage = false;
      if ((packageId === 'DjeVJskpeZDdEGlcUlB1') || (packageId === 'VWEHvdhNVW0zL8ZAeXJX') || (packageId === 'WmcQo1XVXehGaxhSNCKa') ||
      (packageId === 'ZEDcEHZp3fKeQOkDxCH8') || (packageId === 'duz1AkLuin8nOUd7r66L') || (packageId === 'dz8SAwq99GWdEvHCKST2') ||
      (packageId === 'vf2jCUOEeDDiIQ0S42BJ') || (packageId === 'wpUO5vxWmme7KITqSITo') || (packageId === 'yQFACCzpS4DKcDyYftBx')){
        isTTDIPackage = true;
      }
      return isTTDIPackage;
    };

    handleGenDKSHReport = () => {
      const startDateDKSHMember = this.state.editData.BFMStartDate || null;
      const endDateDKSHMember = this.state.editData.BFMEndDate || null;
      this.setState({isLoading:true});
     
      console.log('handleGenDKSHReportStart: ', startDateDKSHMember);
      console.log('handleGenDKSHReportEnd: ', endDateDKSHMember);
   
      const users = this.props.users || null;
      // console.log('theusers: ', users);
      var DKSHUserArray = [];

      const DKSHUsers = users && users.filter((user, id)=>{
          // const packageGroup = user.get('packageGroup')||null;
          const userEmail = user.get('email')||null;
          const userName = user.get('name')||null;
          const memberEndDate = user.get('autoMembershipEnds')? user.get('autoMembershipEnds'): user.get('membershipEnds')? user.get('membershipEnds'):null;
          const packageId = user.get('packageId')||null;
          const TTDIPkg = packageId && this.isTTDIPackage(packageId);

          if (userEmail && userEmail.includes('@dksh.com')){
            DKSHUserArray.push({
                  userId: id,
                  name:userName,
                  email:userEmail,
                  memberEndDate
              })
              return true;
          }
      });

      console.log('DKSHUsers: ', DKSHUsers);
      console.log('DKSHUserArray: ', DKSHUserArray);

      var gantnerData = [];
      var DKSHGantnerArray = [];
      var DKSHNoVisitsRecord = [];
      var userVisitItem = [];

      // get gantnerLogs for each user
      DKSHUserArray.forEach((user, index)=>{
          const userId = user.userId||null;
          const userData = users.get(userId)||null;
          // console.log('user.memberEndate: ', moment(getTheDate(user.memberEndDate)).format('DD MM YYYY'));
          const paidStatus = user.memberEndDate? moment(getTheDate(user.memberEndDate)).isSameOrAfter(endDateDKSHMember)? 'PAID':'UNPAID':'UNPAID';
          const terminatedStatus = userData? userData.get('cancellationDate')? 'TERMINATED':null:null;

          const userGantnerLogs = firebase.firestore().collection('gantnerLogs').where("userId", "==", userId)
              .where("createdAt", ">=", startDateDKSHMember)
              .where("createdAt", "<=", endDateDKSHMember)
              // .where("deviceId", "==", "Check In")
              .orderBy('createdAt')
              .get();
          var checkInCount = 0;
          userGantnerLogs.then((querySnapshot)=>{
           
            querySnapshot.forEach(doc=>{
              console.log(doc.id, '=>', doc.data());
              const data = doc.data();
              gantnerData.push(doc.data());
              const createdAt = data.createdAt;
              
              if (createdAt) {
                  // if (DKSHGantnerArray.length>=1 && DKSHGantnerArray[DKSHGantnerArray.length-1].checkIn && moment(getTheDate(DKSHGantnerArray[DKSHGantnerArray.length-1].checkIn)).isSame(moment(getTheDate(createdAt)), 'day')){
                  //     // console.log('contains check out');
                  //     // BFMGantnerArray.pop();
                  //     DKSHGantnerArray[DKSHGantnerArray.length-1].checkOut = createdAt;
                  //     DKSHGantnerArray[DKSHGantnerArray.length-1].checkOutFormat = moment(getTheDate(data.createdAt)).format('hh:mm');
                  // }
                  // else{
                      //checkInCount = checkInCount + 1;
                      DKSHGantnerArray.push({
                          userId:userId, 
                          name:user.name, 
                          email:user.email,
                          //checkInCount, 
                          dateWithFormat:moment(getTheDate(data.createdAt)).format('DD MM YYYY'),
                          checkIn:createdAt,
                          checkInFormat:moment(getTheDate(data.createdAt)).format('hh:mm'),
                          checkOut:null,
                          checkOutFormat:null,
                          status:terminatedStatus? terminatedStatus:paidStatus,
                          visitFound:true,

                      });
                  //}
              }
            });
          
            console.log('DKSHGantnerArray: ', DKSHGantnerArray);
            this.setState({gantnerData:DKSHGantnerArray, noVisitData:DKSHNoVisitsRecord, isLoading:false, showDownloadBtn:true});
          }).catch(function (error) {
              // this.setState({ gantnerData: null });
              console.log("Error getting document:", error);
          });
      });
    }

    handleGenBFMReport = () => {
     
        const startDateBFMMember = this.state.editData.BFMStartDate || null;
        const endDateBFMMember = this.state.editData.BFMEndDate || null;
        this.setState({isLoading:true});
       
        console.log('handleGenBFMReportStart: ', startDateBFMMember);
        console.log('handleGenBFMReportEnd: ', endDateBFMMember);
     
        const users = this.props.users || null;
        // console.log('theusers: ', users);
        var BFMUserArray = [];

        const BFMUsers = users && users.filter((user, id)=>{
            const packageGroup = user.get('packageGroup')||null;
            const userEmail = user.get('email')||null;
            const userName = user.get('name')||null;
            const memberEndDate = user.get('autoMembershipEnds')? user.get('autoMembershipEnds'): user.get('membershipEnds')? user.get('membershipEnds'):null;
            if ((userEmail && userEmail.includes('@bfm')) || packageGroup==='BFM'){
                BFMUserArray.push({
                    userId: id,
                    name:userName,
                    email:userEmail,
                    memberEndDate
                })
                return true;
            }
        });

        console.log('BFMUsers: ', BFMUsers);
        console.log('BFMUserArray: ', BFMUserArray);

        var gantnerData = [];
        var BFMGantnerArray = [];
        var BFMNoVisitsRecord = [];
        var userVisitItem = [];

        // get gantnerLogs for each user
        BFMUserArray.forEach((user, index)=>{
            const userId = user.userId||null;
            const userData = users.get(userId)||null;
            // console.log('user.memberEndate: ', moment(getTheDate(user.memberEndDate)).format('DD MM YYYY'));
            const paidStatus = user.memberEndDate? moment(getTheDate(user.memberEndDate)).isSameOrAfter(endDateBFMMember)? 'PAID':'UNPAID':'UNPAID';
            const terminatedStatus = userData? userData.get('cancellationDate')? 'TERMINATED':null:null;

            const userGantnerLogs = firebase.firestore().collection('gantnerLogs').where("userId", "==", userId)
                .where("createdAt", ">=", startDateBFMMember)
                .where("createdAt", "<=", endDateBFMMember)
                .orderBy('createdAt')
                .get();
            var checkInCount = 0;
            userGantnerLogs.then((querySnapshot)=>{
              if (querySnapshot.empty){
                console.log('no visit found!');
                BFMNoVisitsRecord.push({
                  key:userId,
                  userId:userId, 
                  name:user.name, 
                  email:user.email,
                  checkInCount:0, 
                  dateWithFormat:null,
                  checkIn:null,
                  checkInFormat:null,
                  checkOut:null,
                  checkOutFormat:null,
                  status:terminatedStatus? terminatedStatus:paidStatus,
                  visitFound:false,
                });
              }
              else{
                querySnapshot.forEach(doc=>{
                  // console.log(doc.id, '=>', doc.data());
                  const data = doc.data();
                  gantnerData.push(doc.data());
                  const createdAt = data.createdAt;
                  if (createdAt) {
                      if (BFMGantnerArray.length>=1 && BFMGantnerArray[BFMGantnerArray.length-1].checkIn && moment(getTheDate(BFMGantnerArray[BFMGantnerArray.length-1].checkIn)).isSame(moment(getTheDate(createdAt)), 'day')){
                          // console.log('contains check out');
                          // BFMGantnerArray.pop();
                          BFMGantnerArray[BFMGantnerArray.length-1].checkOut = createdAt;
                          BFMGantnerArray[BFMGantnerArray.length-1].checkOutFormat = moment(getTheDate(data.createdAt)).format('hh:mm');
                      }
                      else{
                          checkInCount = checkInCount + 1;
                          BFMGantnerArray.push({
                              userId:userId, 
                              name:user.name, 
                              email:user.email,
                              checkInCount, 
                              dateWithFormat:moment(getTheDate(data.createdAt)).format('DD MM YYYY'),
                              checkIn:createdAt,
                              checkInFormat:moment(getTheDate(data.createdAt)).format('hh:mm'),
                              checkOut:null,
                              checkOutFormat:null,
                              status:terminatedStatus? terminatedStatus:paidStatus,
                              visitFound:true
                          });
                      }
                  }
                });
              } 
              this.setState({gantnerData:BFMGantnerArray, noVisitData:BFMNoVisitsRecord, isLoading:false, showDownloadBtn:true});
            }).catch(function (error) {
                // this.setState({ gantnerData: null });
                console.log("Error getting document:", error);
            });
        });
    }
  
    handleGenAllUniqueReport = () => {
      const startDateBFMMember = this.state.editData.BFMStartDate || null;
      const endDateBFMMember = this.state.editData.BFMEndDate || null;
      this.setState({isLoading:true});
     
      console.log('handleGenBFMReportStart: ', startDateBFMMember);
      console.log('handleGenBFMReportEnd: ', endDateBFMMember);
   
      const users = this.props.users || null;
      // console.log('theusers: ', users);
      var BFMUserArray = [];

      const BFMUsers = users && users.forEach((user, id)=>{
        const packageGroup = user.get('packageGroup')||null;
        const userEmail = user.get('email')||null;
        const userName = user.get('name')||null;
        const memberEndDate = user.get('autoMembershipEnds')? user.get('autoMembershipEnds'): user.get('membershipEnds')? user.get('membershipEnds'):null;
        //if ((userEmail && userEmail.includes('@bfm')) || packageGroup==='BFM'){
            BFMUserArray.push({
                userId: id,
                name:userName,
                email:userEmail,
                memberEndDate
            })  
            // return true;
        //}
      });

      var gantnerData = [];
      var finalGantnerData = [];

      const userGantnerLogs = firebase.firestore().collection('gantnerLogs')
      .where("createdAt", ">=", startDateBFMMember)
      .where("createdAt", "<=", endDateBFMMember)
      .where("authorized", '==', true)
      .orderBy('createdAt')
      // .orderBy('userId')
      .get();

      userGantnerLogs.then((querySnapshot)=>{
        if (querySnapshot.empty){
          console.log('no visit found!');
        }
        else{
          querySnapshot.forEach(doc=>{
            // console.log(doc.id, '=>', doc.data());
            var data = doc.data();
            const userId = data && data.userId;
            const createdAt = data && data.createdAt;
            const gantnerLogId = doc.id;
            const userData = users.get(userId)||null;
            const name = (userData && userData.get('name'))? userData.get('name'):'';
            const email = (userData && userData.get('email'))? userData.get('email'):'';
            data.key = doc.id;
            data.name = name;
            data.email = email;
            const checkIn = data.createdAt;
            const checkInFormat = moment(getTheDate(data.createdAt)).format('HH:mm');
            data.checkIn = checkIn;
            data.checkInFormat = checkInFormat;

            if (createdAt && userId && gantnerLogId && data) {
              gantnerData.push(data);
            }
          
          });
          // console.log('gantnerData: ', gantnerData);
          // console.log('userGantnerMap: ', userGantnerMap);
          // sort the gantnerdata
          gantnerData && gantnerData.sort((a,b)=>{
            var userIdA = a.userId;
            var userIdB = b.userId;
            if (userIdA < userIdB) {return -1}
            if (userIdA > userIdB) {return 1}
            // var createdAtA = new Date(a.createdAt);
            // var createdAtB = new Date(b.createdAtB);
            // if (createdAtA < createdAtB) {return -1}
            // if (createdAtA > createdAtB) {return 1}
            else{
              return 0;
            } 
          });
          // console.log('gantnerData: ', gantnerData);
        } 

        gantnerData && gantnerData.forEach((gantner)=>{
          const email = gantner.email;
          const createdAt = gantner.createdAt;
          const userId = gantner.userId;

          // console.log('gantneremail: ', email);

          
          if (finalGantnerData.length>=1 && finalGantnerData[finalGantnerData.length-1].userId === userId
          ){
            console.log('skip')
          }
          else{
            finalGantnerData.push(gantner);
            finalGantnerData[finalGantnerData.length-1].dateWithFormat = moment(getTheDate(createdAt)).format('DD MM YYYY');
          }
        });
        console.log('finalGantnerData: ', finalGantnerData);
        this.setState({gantnerData:finalGantnerData, isLoading:false, showDownloadBtn:true});
      }).catch(function (error) {
          // this.setState({ gantnerData: null });
          console.log("Error getting document:", error);
      });
    }

    handleGenAllReport = () => {
     
      const startDateBFMMember = this.state.editData.BFMStartDate || null;
      const endDateBFMMember = this.state.editData.BFMEndDate || null;
      this.setState({isLoading:true});
     
      console.log('handleGenBFMReportStart: ', startDateBFMMember);
      console.log('handleGenBFMReportEnd: ', endDateBFMMember);
   
      const users = this.props.users || null;
      // console.log('theusers: ', users);
      var BFMUserArray = [];

      const BFMUsers = users && users.forEach((user, id)=>{
          const packageGroup = user.get('packageGroup')||null;
          const userEmail = user.get('email')||null;
          const userName = user.get('name')||null;
          const memberEndDate = user.get('autoMembershipEnds')? user.get('autoMembershipEnds'): user.get('membershipEnds')? user.get('membershipEnds'):null;
          //if ((userEmail && userEmail.includes('@bfm')) || packageGroup==='BFM'){
              BFMUserArray.push({
                  userId: id,
                  name:userName,
                  email:userEmail,
                  memberEndDate
              })  
              // return true;
          //}
      });

      console.log('BFMUsers: ', BFMUsers);
      console.log('BFMUserArray: ', BFMUserArray);

      var gantnerData = [];
      var finalGantnerData = [];
      var BFMGantnerArray = [];
      var BFMNoVisitsRecord = [];
      var userVisitItem = [];

      const userGantnerLogs = firebase.firestore().collection('gantnerLogs')
      .where("createdAt", ">=", startDateBFMMember)
      .where("createdAt", "<=", endDateBFMMember)
      .where("authorized", '==', true)
      .orderBy('createdAt')
      // .orderBy('userId')
      .get();

      var userGantnerMap = {};
      var checkInCount = 0;
      userGantnerLogs.then((querySnapshot)=>{
        if (querySnapshot.empty){
          console.log('no visit found!');
          // BFMNoVisitsRecord.push({
          //   key:userId,
          //   userId:userId, 
          //   name:user.name, 
          //   email:user.email,
          //   checkInCount:0, 
          //   dateWithFormat:null,
          //   checkIn:null,
          //   checkInFormat:null,
          //   checkOut:null,
          //   checkOutFormat:null,
          //   status:terminatedStatus? terminatedStatus:paidStatus,
          //   visitFound:false,
          // });
        }
        else{
          querySnapshot.forEach(doc=>{
            // console.log(doc.id, '=>', doc.data());
            var data = doc.data();
            const userId = data && data.userId;
            const createdAt = data && data.createdAt;
            const gantnerLogId = doc.id;
            const userData = users.get(userId)||null;
            const name = (userData && userData.get('name'))? userData.get('name'):'';
            const email = (userData && userData.get('email'))? userData.get('email'):'';
            data.key = doc.id;
            data.name = name;
            data.email = email;
            const checkIn = data.createdAt;
            const checkInFormat = moment(getTheDate(data.createdAt)).format('HH:mm');
            data.checkIn = checkIn;
            data.checkInFormat = checkInFormat;

            if (createdAt && userId && gantnerLogId && data) {
              gantnerData.push(data);
              // userGantnerMap[userId] = data;
                // if (BFMGantnerArray.length>=1 && BFMGantnerArray[BFMGantnerArray.length-1].checkIn && moment(getTheDate(BFMGantnerArray[BFMGantnerArray.length-1].checkIn)).isSame(moment(getTheDate(createdAt)), 'day')){
                //     // console.log('contains check out');
                //     // BFMGantnerArray.pop();
                //     BFMGantnerArray[BFMGantnerArray.length-1].checkOut = createdAt;
                //     BFMGantnerArray[BFMGantnerArray.length-1].checkOutFormat = moment(getTheDate(data.createdAt)).format('hh:mm');
                // }
                // else{
                //     checkInCount = checkInCount + 1;
                //     BFMGantnerArray.push({
                //         userId:userId, 
                //         name:user.name, 
                //         email:user.email,
                //         checkInCount, 
                //         dateWithFormat:moment(getTheDate(data.createdAt)).format('DD MM YYYY'),
                //         checkIn:createdAt,
                //         checkInFormat:moment(getTheDate(data.createdAt)).format('hh:mm'),
                //         checkOut:null,
                //         checkOutFormat:null,
                //         status:terminatedStatus? terminatedStatus:paidStatus,
                //         visitFound:true
                //     });
                // }
            }
          
          });
          // console.log('gantnerData: ', gantnerData);
          // console.log('userGantnerMap: ', userGantnerMap);
          // sort the gantnerdata
        gantnerData && gantnerData.sort((a,b)=>{
          var userIdA = a.userId;
          var userIdB = b.userId;
          if (userIdA < userIdB) {return -1}
          if (userIdA > userIdB) {return 1}
          var createdAtA = new Date(a.createdAt);
          var createdAtB = new Date(b.createdAtB);
          if (createdAtA < createdAtB) {return -1}
          if (createdAtA > createdAtB) {return 1}
          return 0;
        });
          // console.log('gantnerData: ', gantnerData);
        } 

        gantnerData && gantnerData.forEach((gantner)=>{
          const email = gantner.email;
          const createdAt = gantner.createdAt;
          const userId = gantner.userId;

          // console.log('gantneremail: ', email);

          
          if (finalGantnerData.length>=1 && finalGantnerData[finalGantnerData.length-1].checkIn 
            && moment(getTheDate(finalGantnerData[finalGantnerData.length-1].checkIn)).isSame(moment(getTheDate(createdAt)), 'day')
            && (finalGantnerData[finalGantnerData.length-1].userId === userId) 
          ){
            console.log('contains checkout')
            finalGantnerData[finalGantnerData.length-1].checkOut = createdAt;
            finalGantnerData[finalGantnerData.length-1].checkOutFormat = moment(getTheDate(createdAt)).format('HH:mm');
            finalGantnerData[finalGantnerData.length-1].dateWithFormat = moment(getTheDate(createdAt)).format('DD MM YYYY');
            
            //                   // console.log('contains check out');
            //                   // BFMGantnerArray.pop();
            //                   BFMGantnerArray[BFMGantnerArray.length-1].checkOut = createdAt;
            //                   BFMGantnerArray[BFMGantnerArray.length-1].checkOutFormat = moment(getTheDate(data.createdAt)).format('hh:mm');
            //               }
            //               else{
            //                   checkInCount = checkInCount + 1;
            //                   BFMGantnerArray.push({
            //                       userId:userId, 
            //                       name:user.name, 
            //                       email:user.email,
            //                       checkInCount, 
            //                       dateWithFormat:moment(getTheDate(data.createdAt)).format('DD MM YYYY'),
            //                       checkIn:createdAt,
            //                       checkInFormat:moment(getTheDate(data.createdAt)).format('hh:mm'),
            //                       checkOut:null,
            //                       checkOutFormat:null,
            //                       status:terminatedStatus? terminatedStatus:paidStatus,
            //                       visitFound:true
            //                   });
          }
          else{
            finalGantnerData.push(gantner);
            finalGantnerData[finalGantnerData.length-1].dateWithFormat = moment(getTheDate(createdAt)).format('DD MM YYYY');
          }
        });
        console.log('finalGantnerData: ', finalGantnerData);
        this.setState({gantnerData:finalGantnerData, isLoading:false, showDownloadBtn:true});
      }).catch(function (error) {
          // this.setState({ gantnerData: null });
          console.log("Error getting document:", error);
      });

      // console.log('gantnerData: ', gantnerData);
    

      // get gantnerLogs for each user
      // BFMUserArray.forEach((user, index)=>{
      //     const userId = user.userId||null;
      //     const userData = users.get(userId)||null;
      //     // console.log('user.memberEndate: ', moment(getTheDate(user.memberEndDate)).format('DD MM YYYY'));
      //     const paidStatus = user.memberEndDate? moment(getTheDate(user.memberEndDate)).isSameOrAfter(endDateBFMMember)? 'PAID':'UNPAID':'UNPAID';
      //     const terminatedStatus = userData? userData.get('cancellationDate')? 'TERMINATED':null:null;

      //     const userGantnerLogs = firebase.firestore().collection('gantnerLogs').where("userId", "==", userId)
      //         .where("createdAt", ">=", startDateBFMMember)
      //         .where("createdAt", "<=", endDateBFMMember)
      //         .orderBy('createdAt')
      //         .get();
      //     var checkInCount = 0;
      //     userGantnerLogs.then((querySnapshot)=>{
      //       if (querySnapshot.empty){
      //         console.log('no visit found!');
      //         BFMNoVisitsRecord.push({
      //           key:userId,
      //           userId:userId, 
      //           name:user.name, 
      //           email:user.email,
      //           checkInCount:0, 
      //           dateWithFormat:null,
      //           checkIn:null,
      //           checkInFormat:null,
      //           checkOut:null,
      //           checkOutFormat:null,
      //           status:terminatedStatus? terminatedStatus:paidStatus,
      //           visitFound:false,
      //         });
      //       }
      //       else{
      //         querySnapshot.forEach(doc=>{
      //           // console.log(doc.id, '=>', doc.data());
      //           const data = doc.data();
      //           gantnerData.push(doc.data());
      //           const createdAt = data.createdAt;
      //           if (createdAt) {
      //               if (BFMGantnerArray.length>=1 && BFMGantnerArray[BFMGantnerArray.length-1].checkIn && moment(getTheDate(BFMGantnerArray[BFMGantnerArray.length-1].checkIn)).isSame(moment(getTheDate(createdAt)), 'day')){
      //                   // console.log('contains check out');
      //                   // BFMGantnerArray.pop();
      //                   BFMGantnerArray[BFMGantnerArray.length-1].checkOut = createdAt;
      //                   BFMGantnerArray[BFMGantnerArray.length-1].checkOutFormat = moment(getTheDate(data.createdAt)).format('hh:mm');
      //               }
      //               else{
      //                   checkInCount = checkInCount + 1;
      //                   BFMGantnerArray.push({
      //                       userId:userId, 
      //                       name:user.name, 
      //                       email:user.email,
      //                       checkInCount, 
      //                       dateWithFormat:moment(getTheDate(data.createdAt)).format('DD MM YYYY'),
      //                       checkIn:createdAt,
      //                       checkInFormat:moment(getTheDate(data.createdAt)).format('hh:mm'),
      //                       checkOut:null,
      //                       checkOutFormat:null,
      //                       status:terminatedStatus? terminatedStatus:paidStatus,
      //                       visitFound:true
      //                   });
      //               }
      //           }
      //         });
      //       } 
      //       this.setState({gantnerData:BFMGantnerArray, noVisitData:BFMNoVisitsRecord, isLoading:false, showDownloadBtn:true});
      //     }).catch(function (error) {
      //         // this.setState({ gantnerData: null });
      //         console.log("Error getting document:", error);
      //     });
      // });
  }

    handleChange = name => event => {
        var editData = this.state.editData;
        var value = event.target.value;
        
        if (name === 'BFMStartDate' || name === 'BFMEndDate') {
          value = moment(value).startOf('today').toDate();
        }
        editData[name] = value;
        this.setState({
            editData: {
            ...editData
            },
        });
    }

    renderListView(){
        const {
            classes,
            users,
          } = this.props;
        
          const {gantnerData} = this.state;

        const gantnerListLayout = [];
        gantnerData && gantnerData.forEach((gantner)=>{
            const name = gantner.name||null;
            console.log('name: ', name);
            const email = gantner.email||null;
            const dateWithFormat = gantner.dateWithFormat||null;
            const checkInFormat = gantner.checkInFormat||null;
            const checkOutFormat = gantner.checkOutFormat||null;
            const status = gantner.status;
            gantnerListLayout.push(
                <div key = {gantner.key} style = {{display:'flex', flexDirection:'row', marginBottom:10}}>
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
  
      // console.log('gantnerDataState: ', this.state.gantnerData);
      const usersLoad = users && users.size>21? true:false;
      const enableDownloadBtn = users && users.size>21? true:false;

      const user = this.props.currentUser || null;
      const roles = user && user.get('roles');
      const isSuperVisor = roles && roles.get('superVisor') === true;

      if (isSuperVisor){
        return (
          <div className={classes.container}>
            <MenuAppBar />
              <Grid container spacing={24}>
                <Grid container style={{marginTop:32, alignItems:'center', justifyContent:'center'}}>   
                <Grid item xs={5} style={{paddingTop:0, paddingBottom:0, margin:20}}>
                      <Typography component="h1" color="primary" style={{marginLeft:8, marginRight:8, color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
                          {'Generate BFM Report'}   
                      </Typography>
                      <TextField
                          id="startDateBFM"
                          label="Start Date"
                          type="date"
                          required
                          // defaultValue={(editUser && editUser.get('cancellationDate')) && moment(editUser.get('cancellationDate')).format('YYYY-MM-DD')}
                          //defaultValue = {this.props.selectedUser && this.props.selectedUser.get('cancellationDate') && moment(getTheDate(this.props.selectedUser.get('cancellationDate'))).format('YYYY-MM-DD')}
                          margin="dense"
                          fullWidth
                          onChange={this.handleChange('BFMStartDate')}
                          InputLabelProps={{
                              shrink: true,
                          }}
                      />
                      <TextField
                          id="endDateBFM"
                          label="End Date"
                          type="date"
                          required
                          // defaultValue={(editUser && editUser.get('cancellationDate')) && moment(editUser.get('cancellationDate')).format('YYYY-MM-DD')}
                          //defaultValue = {this.props.selectedUser && this.props.selectedUser.get('cancellationDate') && moment(getTheDate(this.props.selectedUser.get('cancellationDate'))).format('YYYY-MM-DD')}
                          margin="dense"
                          fullWidth
                          onChange={this.handleChange('BFMEndDate')}
                          InputLabelProps={{
                              shrink: true,
                          }}
                      />
                      <Button 
                          key='generateReport' 
                          onClick={()=>this.handleGenBFMReport()}
                          disabled = {!enableDownloadBtn}
                          margin="dense"
                          >
                          {'Generate BFM Report'}
                      </Button>
                      <Button 
                          key='generateDKSHReport' 
                          onClick={()=>this.handleGenDKSHReport()}
                          disabled = {!enableDownloadBtn}
                          margin="dense"
                          >
                          {'Generate DKSH Report'}
                      </Button>
                      <Button 
                          key='generateAllUnniqueReport' 
                          onClick={()=>this.handleGenAllUniqueReport()}
                          disabled = {!enableDownloadBtn}
                          margin="dense"
                          >
                          {'Generate all unique Report'}
                      </Button>
                      <Button 
                          key='generateAllReport' 
                          onClick={()=>this.handleGenAllReport()}
                          disabled = {!enableDownloadBtn}
                          margin="dense"
                          >
                          {'Generate all Report'}
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
              <BabelLogo />
          </div>
        );
      }
      else{
        return null
      }
    }
  }
  
  BFMReport.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  const BFMReportStyled = withStyles(styles)(BFMReport);
  
  const makeMapStateToProps = () => {
    const getCurrentUser = makeGetCurrentUser();
    const getAllUsers = makeGetAllUsers();
    const getPaymentsUserItem = makeGetPaymentsMembersItems();
    const mapStateToProps = (state, props) => {
      return {
        currentUser: getCurrentUser(state, props),
        users: getAllUsers(state, props),
        usersWithPayment: getPaymentsUserItem(state, props),
      }
    }
    return mapStateToProps
  }
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(BFMReportStyled)