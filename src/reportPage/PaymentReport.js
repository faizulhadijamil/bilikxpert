
  import {bindActionCreators} from 'redux';
  import {connect} from 'react-redux';
  import {withStyles, Avatar, Grid, Button, TextField, Typography} from '@material-ui/core';
  
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
      // maxWidth: theme.spacing(7)5,
      marginLeft: 'auto',
      marginRight: 'auto',
      // paddingTop: theme.spacing(8),
      marginTop: theme.spacing(10),
      paddingBottom: theme.spacing(10),
    },
  });
  
  class PaymentReport extends React.Component {
  
    state = {
      selectedUserId: null,
      editData: {},
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

    generateAllAdyenPaymentReport = () => {
        const usersWithPayment = this.props.usersWithPayment||null;
        const users = this.props.users || null;
        var allAdyenReport = [];
        
        const startDateAllAdyen = this.state.editData.allAdyenStartDate || null;
        const endDateAllAdyen = this.state.editData.allAdyenEndDate || null;

        if (startDateAllAdyen && endDateAllAdyen){
          const adyenPayment = usersWithPayment && usersWithPayment.filter((v,k)=>{
            const isAdyenPayment = v.get('source')? (v.get('source') === 'adyen')?true:false:false; 
            const isPaymentSuccess = v.get('status')? (v.get('status')==='CLOSED')?true:false:false;
            const dateCreated = v.get('createdAt')||null;
            const isValidDate = dateCreated && moment(getTheDate(dateCreated)).isBetween(moment(this.state.editData.allAdyenStartDate), moment(this.state.editData.allAdyenEndDate))
            //if (isAdyenPayment && isPaymentSuccess && isValidDate){
            if (isPaymentSuccess && isValidDate){
                // console.log('usersWithPayment: ', v.get('createdAt'));
                return true;
            }
        });

        adyenPayment && adyenPayment.forEach((a,b)=>{
            const userId = a.get('userId') || null;
            const userData = users.get(userId)||null;
            const email = userData? userData.get('email'):null;
            const name = userData? userData.get('name'):null;
            const totalPrice = a.get('totalPrice') || null;
            const productName = a.get('productName') || null;
            const quantity = a.get('quantity')||1;
            const invoiceId = a.get('invoiceId')||null;
            const type = a.get('type')||null;
            const detailName = a.get('detailName')||null;
            const dateCreated = a.get('createdAt')||null;
            const theDateCreated = dateCreated? moment(getTheDate(dateCreated)).format('DD MMM YYYY'):null
            const source = a.get('source')||null;

            allAdyenReport.push({
                theDateCreated,
                email,
                name,
                detailName,
                productName,
                type,
                quantity,
                invoiceId:'https://app.babel.fit/payments/'+invoiceId,
                totalPrice,
                source
            })
        });
        console.log('allAdyenReport: ', allAdyenReport);
        var theCSVformat = this.ConvertToCSV(allAdyenReport);
        var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, "allAdyenReport.csv");
        }
        else{
          console.log('no startdate or enddate');
        }
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
                if (line != '') line += ','
                line += array[i][index];
            }
            str += line + '\r\n';
        }
        return str;
    }

    handleChange = name => event => {
        var editData = this.state.editData;
        var value = event.target.value;
        
        if (name === 'startDate' || name === 'endDate') {
          value = moment(value).toDate();
        }
        editData[name] = value;
        this.setState({
            editData: {
            ...editData
            },
        });
        console.log('editData: ', this.state.editData);
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
      const isKLCC = email && email.indexOf('+klcc@babel.fit') !== -1 ? true : false;
  
      const users = this.props.users || null;
  
      const selectedUserId = this.state.selectedUserId;
      var userData = users && selectedUserId ? users.get(selectedUserId) : null;
      var selectedStaffId = null;
      if(!isAdmin && !isMC && isTrainer){
        selectedStaffId = user.get('id');
      }
      const selectedUserRoles = (userData && userData.get('roles')) || null;
      const selectedUserRolesIsAdmin = selectedUserRoles && roles.get('admin') === true;
      const selectedUserRolesIsMC = selectedUserRoles && selectedUserRoles.get('mc') === true;
      const selectedUserRolesIsTrainer = selectedUserRoles && selectedUserRoles.get('trainer') === true;
      const selectedUserRolesIsStaff = selectedUserRolesIsAdmin || selectedUserRolesIsMC || selectedUserRolesIsTrainer;
      if (selectedUserRolesIsStaff) {
        selectedStaffId = selectedUserId;
        const selectedStaffName = userData && userData.get('name');
        const selectedStaffImage = (userData && userData.get('image')) || null;
        const selectedStaffAvatar = selectedStaffName || (selectedStaffName && selectedStaffName.length > 0) ?
          (selectedStaffImage ? (<Avatar src={selectedStaffImage} />) : (<Avatar>{selectedStaffName.charAt(0).toUpperCase()}</Avatar>)) :
          null;
      }

  
      return (
        <div className={classes.container}>
          <MenuAppBar />
            <Grid container spacing={24}>
              <Grid item xs={12} sm={8}>
              <Grid container style={{marginTop:32}}>   
                <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0, margin:20}}>
                    <Typography component="h1" color="primary" style={{marginLeft:8, marginRight:8, color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
                        {'Generate All Payment Report'}   
                    </Typography>
                    <TextField
                        id="startDate"
                        label="Start Date"
                        type="date"
                        required
                        // defaultValue={(editUser && editUser.get('cancellationDate')) && moment(editUser.get('cancellationDate')).format('YYYY-MM-DD')}
                        //defaultValue = {this.props.selectedUser && this.props.selectedUser.get('cancellationDate') && moment(getTheDate(this.props.selectedUser.get('cancellationDate'))).format('YYYY-MM-DD')}
                        margin="dense"
                        fullWidth
                        onChange={this.handleChange('allAdyenStartDate')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id="endDate"
                        label="End Date"
                        type="date"
                        required
                        // defaultValue={(editUser && editUser.get('cancellationDate')) && moment(editUser.get('cancellationDate')).format('YYYY-MM-DD')}
                        //defaultValue = {this.props.selectedUser && this.props.selectedUser.get('cancellationDate') && moment(getTheDate(this.props.selectedUser.get('cancellationDate'))).format('YYYY-MM-DD')}
                        margin="dense"
                        fullWidth
                        onChange={this.handleChange('allAdyenEndDate')}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <Button 
                        key='generateReport' 
                        onClick={()=>this.generateAllAdyenPaymentReport()}
                        disabled = {!this.props.usersWithPayment}
                        margin="dense"
                        >
                        {'download'}
                    </Button>
                    </Grid>
                </Grid>
              </Grid>
            </Grid>
            <BabelLogo />
        </div>
      );
    }
  }
  
  PaymentReport.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  const PaymentReportStyled = withStyles(styles)(PaymentReport);
  
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
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(PaymentReportStyled)