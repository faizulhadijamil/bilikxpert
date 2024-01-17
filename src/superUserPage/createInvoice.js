import {
    CircularProgress
  } from 'material-ui/Progress'
  import {
    Dialog,
    DialogActions,
    DialogContent,
    List,
  } from 'material-ui';
  import {
    bindActionCreators
  } from 'redux';
  import {
    connect
  } from 'react-redux';
  import {
    withStyles
  } from '@material-ui/core';
  import Button from 'material-ui/Button';
  import Grid from 'material-ui/Grid';
  import React from 'react';
  import TextField from 'material-ui/TextField';
  import Typography from 'material-ui/Typography';
  import BabelLogo from '../BabelLogo';
  import PropTypes from 'prop-types';
  import moment from 'moment-timezone';
  import Card, {
    CardContent,
    CardMedia
  } from 'material-ui/Card';
  
  import {
    makeGetCnyRef,
    makeGetAllUsers,
    makeGetActiveMemberItems,
  } from '../selectors';
  import * as Actions from '../actions';

  import * as firebase from 'firebase';
  import 'firebase/firestore';


  const styles = theme => ({
    container: {
        width: '100%',
        justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        // backgroundPosition: 'center',
        backgroundSize: 'cover',
        // height:'100%',
        backgroundRepeat:'repeat-y'
        // backgroundRepeat: 'no-repeat',
        // position:'fixed',
      // maxWidth: 360,
      // backgroundColor: theme.palette.background.paper,
      // position: 'relative',
      // overflow: 'auto',
      // maxHeight: 300,
      //  overflow: 'hidden',
    //   // maxWidth: theme.spacing(7)5,
    //   marginLeft: 'auto',
    //   marginRight: 'auto',
    //   // paddingTop: theme.spacing(8),
    //   marginTop: theme.spacing(5),
    //   // paddingBottom: theme.spacing(10),
    //   padding: 16
    },
    contentInner: {
        maxWidth: 15 * 50,
        marginRight: 'auto',
        marginLeft: 'auto',
        alignItems:'center',
        justifyContent:'center',
        boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
        backgroundColor: 'rgba(0, 0, 0, 0.26)',
    },
    button: {
      fontSize: "0.875rem",
      textTransform: "uppercase",
      fontWeight: 500,
      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      backgroundColor: "#fde298",
      color: '#062845',
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16,
      borderRadius: 2,
      minHeight: 36,
      minWidth: 88,
      width: '100%',
      boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
      justifyContent: 'flexEnd'
    },
    extraLightMontSerrat:{
        fontFamily: "Montserrat",
        fontWeight: 200,
        color:'#fff',
    },
    mediumMontSerrat:{
        color:'#fff', 
        fontFamily: "Montserrat",
        fontWeight: 400,
        fontSize:15.6,
        // letterSpacing:0
    },
    boldMontSerrat:{
        color:'#fff', 
        fontFamily: "Montserrat",
        // fontFamily :'sans-serif', 
        fontWeight: 800,
    },
    floatingLabelStyle:{
        color:'#fff'
    },
    sendButtonStyle:{
        // marginTop: theme.spacing(2),
        marginTop:25,
        // marginBottom: theme.spacing(2),
        // paddingTop: 3,
        // paddingBottom: 3,
        paddingLeft: 80,
        paddingRight: 80,
        borderRadius: 10,
        // minHeight: 25,
        minWidth: 28,
        border: '1.5px solid white',
        // width: '100%',
        boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
      },
      avatarList:{
        width: '100%',
        // backgroundColor: 'transparent',
        position: 'relative',
        overflow: 'auto',
        // overflow: 'hidden',
        // height:800 - 20, // because borderradius = 20
        // istStyle: "none",
        marginLeft:10, 
        marginRight:10
      }
  });
  
  class createInvoice extends React.Component {
  
    state = {
      
      currentUserEmail:'',
      currentUserName:'',
     
   

        amount:0, // need to convert to string like 000000025000
        billingDate:null,
        createdAt:null,
        hasSST:true,
        packageId:'',
        quantity:1,
        totalPrice:0, //need to convert to string
        type:'membership',
        unitPrice:0, //need to convert to string
        userId:'',
    }
  
    componentDidMount() {
      this.setState({isMobile:(window.innerWidth<=550)?true:false});
        const urlPathName = this.props.location.pathname;
        console.log('urlPathName: ', urlPathName);
        const stringSplit = urlPathName.split('/');
        console.log('stringSplit: ', stringSplit);
        const userId = stringSplit[2];
        this.setState({userId});
     
      // cnyData.then((querySnapshot)=>{

      // });
      // userData.then((doc)=>{
      //   if (doc.exists) {
      //     let data = doc.data();
      //     this.setState({ theUser: data });
      //     console.log("Document data:", data);
      //   } else {
      //     // doc.data() will be undefined in this case
      //     this.setState({ theUser: null });
      //     console.log("No such document!");
      //   }
      // }).catch(function (error) {
      //   this.setState({ theUser: null });
      //   console.log("Error getting document:", error);
      // });
      // var theUserData = [];
      // userData.then(function(querySnapshot){
      //   querySnapshot.forEach(function(doc){
      //     console.log(doc.id, '=>', doc.data());
      //     // this.setState({theUser: doc.data()});
      //     theUserData.push(doc.data());
      //     console.log('theUserData1: ', theUserData);
      //   });
      //   this.setState({theUser:theUserData});
      //   console.log('theUserData1: ', theUserData);
      // }).catch(error=>console.log("Error getting documents: ", error));
    }

    componentWillMount() {
    //   const urlSearchString = this.props.location.search;
    //   const urlEmailandName = urlSearchString && urlSearchString.indexOf('?name=' === -1) ? urlSearchString.replace('?name=', '') : null;
    //   const currentUserEmailandName = urlEmailandName && urlEmailandName.split('&email=');
    //   const currentUserEmail = currentUserEmailandName && currentUserEmailandName[1] || '';
    //   let currentUserName = currentUserEmailandName && currentUserEmailandName[0] || '';
    //   currentUserName = currentUserName.replace(/%20/g, " ");
    //   const theDate = moment().format('DD-MM-YYYY');
    //   const theTime = moment().format('hh:mm:ss');

    }
  
    shouldComponentUpdate(nextProps, nextState) {
      if (this.props !== nextProps || this.state !== nextState) {
        return true;
      }
      return false;
    }
  
    handleChange = name => event => {
      var updatedState = {};
      var value = event.target.value;
    //   var amount = 0;
    //   var totalPrice = 0;
      if (name === 'billingDate' || name === 'createdAt') {
        value = moment(value).toDate();
      }
      else if (name === 'quantity' || name === 'unitPrice'){
        value = parseInt(value);
      }
    //   else if (name === 'amount'){
    //       value = 
    //   }
      console.log('theName: ', name);
      console.log('value: ', value);

      updatedState[name] = value;
      this.setState({ ...updatedState
      });
    }
  
  
    handleAutosuggest = (name, value) => {
      var valueMap = {};
      valueMap[name] = value;
      this.setState({ ...valueMap
      });
    }
  
    handleClose = () => {
      this.setState({
        dialogOpen: false
      });
    }
  
  

    renderSaveUserInfo(){
        const {classes} = this.props;
        const {currentUserEmail, currentUserName, selectedAvatar, referralUsers} = this.state;
        return(
            <div 
                className={classes.sendButtonStyle}
                style = {{cursor: 'pointer', marginTop:40, justifyContent:'center', alignItem:'center'}}
                onClick = {()=>this.onSaveUserInfo(currentUserEmail, currentUserName, this.state.selectedAvatar)}
                >
                <p className={classes.mediumMontSerrat}>SAVE</p>
            </div>
        )
    }

    handleCloseDialog = () => this.setState({showErrorDialog:false, showSuccessDialog:false});

    renderShowSuccessDialog = () => {
        const {classes} = this.props;
        return(
          <Dialog onClose={this.handleCloseDialog} aria-labelledby="simple-dialog-title" open={this.state.showSuccessDialog}>
            <DialogContent 
              style = {{backgroundColor:'#d4c5b9', borderRadius:10, paddingBottom:10, border: '1.5px solid white', paddingLeft:50, paddingRight:50}}
              className = {classes.contentInner}
              >
              <Typography type="title" component="h1" color="primary" style={{textAlign:'center', marginBottom:8}}>
                (Success! Once they sign up we'll seal the deal ;)
              </Typography>
              <div style = {{alignItems:'center', justifyContent:'center', flexDirection:'row', display:'flex',}}>
                <Button 
                  raised color='primary' 
                  key={'okButton'} 
                  style={{textAlign:'center', marginBottom:8, alignItems:'center', justifyContent:'center'}} 
                  className={classes.fontRegularWhite}
                  onClick={this.handleCloseDialog}
                  >
                  OK
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )
      };
    
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
    
    renderShowSuccessPage (){
        const {classes} = this.props;
        return (
            <div 
                className={classes.container}
            >
                <Typography 
                    className = {classes.extraLightMontSerrat}
                    style={{textAlign:'center', fontSize:this.state.isMobile? '1.0rem':'1.2rem', letterSpacing:3, marginTop:15}}>
                      COMPLETE
                </Typography>
            </div>
        )
    }


    manualCharge = () => {
        
    }

    generateInvoice = (totalPrice, amount) => {

        // console.log('generate Invoice: ', this.state);

        firebase.firestore().collection('invoices').add({
            totalPrice,
            amount,
            billingDate:this.state.billingDate,
            createdAt:this.state.createdAt,
            hasSST:true,
            packageId:this.state.packageId,
            quantity:this.state.quantity,
            type:this.state.type,
            unitPrice:this.state.unitPrice,
            userId:this.state.userId,
            manualAdd:true,
            manualAddOn:new Date()
        }).then(function(docRef) {
            console.log("Document written with ID: ", docRef.id);
        })
        .catch(function(error) {
            console.error("Error adding document: ", error);
        });
        
        // const userData = firebase.firestore().collection('users').where("email", "==", currentUserEmail).limit(1).get();
        // const cnyRefData = firebase.firestore().collection('cnyReferralList').where("email", "==", currentUserEmail).limit(1).get();
  
        // var theUserData = [];
        // userData.then((querySnapshot)=>{
        //   querySnapshot.forEach(doc=>{
        //     console.log(doc.id, '=>', doc.data());
        //     theUserData.push(doc.data());
        //   });
        //   this.setState({theUser:theUserData});
        // }).catch(function (error) {
        //   this.setState({ theUser: null });
        //   console.log("Error getting document:", error);
        // });
  
    }

    render() {
     
        console.log('theprops: ', this.props);
        console.log('theState: ', this.state);
        const {classes} = this.props;
        const {quantity, unitPrice} = this.state;

        var amount;
        var totalPrice = unitPrice*quantity;
        // console.log('totalPrice: ', totalPrice);
        amount = `${totalPrice}00`;
        const concatLength = 12-amount.length;
        for (var x = 0; x < concatLength; x++) {
          amount = '0'.concat(amount);
        }
        // console.log('theAmount: ', amount);

        
        var userItem = null;

        userItem = (
            <div>
              {false && <TextField
                margin="dense"
                id="amount"
                label="Amount"
                fullWidth
                onChange={this.handleChange('amount')}
                required
                autoComplete='off'
                type="number"
                value={this.state.amount}
                // error={!isValidPassword}
              />}
            <TextField
                id="billingDate"
                label="Billing Date"
                type="date"
                required
                value={moment(this.state.billingDate).format('YYYY-MM-DD')}
                margin="dense"
                fullWidth
                onChange={this.handleChange('billingDate')}
                InputLabelProps={{
                    shrink: true,
                }}
                />
            <TextField
                id="createdAt"
                label="createdAt Date"
                type="date"
                required
                value={moment(this.state.createdAt).format('YYYY-MM-DD')}
                margin="dense"
                fullWidth
                onChange={this.handleChange('createdAt')}
                InputLabelProps={{
                    shrink: true,
                }}
                />
            <TextField
                margin="dense"
                id="packageId"
                label="package ID"
                fullWidth
                onChange={this.handleChange('packageId')}
                required
                autoComplete='off'
                value={this.state.packageId}
              />
              <TextField
                margin="dense"
                id="quantity"
                label="Quantity"
                fullWidth
                onChange={this.handleChange('quantity')}
                required
                autoComplete='off'
                type="number"
                value={this.state.quantity}
                // error={!isValidPassword}
              />
                {false && <TextField
                margin="dense"
                id="totalPrice"
                label="Total Price"
                fullWidth
                onChange={this.handleChange('totalPrice')}
                required
                autoComplete='off'
                type="number"
                value={this.state.totalPrice}
                // error={!isValidPassword}
              />}
               <TextField
                margin="dense"
                id="unitPrice"
                label="Unit Price"
                fullWidth
                onChange={this.handleChange('unitPrice')}
                required
                autoComplete='off'
                type="number"
                value={this.state.unitPrice}
                // error={!isValidPassword}
              />
               <TextField
                margin="dense"
                id="userId"
                label="user ID"
                fullWidth
                onChange={this.handleChange('userId')}
                required
                autoComplete='off'
                // type="number"
                value={this.state.userId}
                // error={!isValidPassword}
              />
                <Button key={'createInvoice'} onClick={()=>this.generateInvoice(totalPrice, amount)} color="primary">
                    CREATE INVOICE
                </Button>
                <Button key={'manualCharge'} onClick={()=>this.manualCharge()} color="primary">
                    Manual Charge
                </Button>
            </div>
            );

        return(
            <div 
            // className={classes.container}
            >
                <Typography 
                    // className = {classes.extraLightMontSerrat}
                    style={{textAlign:'center', fontSize:this.state.isMobile? '1.0rem':'1.2rem', letterSpacing:3, marginTop:15}}>
                    CREATE INDIVIDUAL INVOICE
                </Typography>
                <CardContent >
                    {userItem}
                </CardContent>
            </div>
        );
    }
  }
  
  createInvoice.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  const createInvoiceStyled = withStyles(styles)(createInvoice);
  
//   const mapStateToProps = (state, ownProps) => ({
//     ...state
//   });
  
//   const makeMapStateToProps = () => {
//     // const mapStateToProps = (state, props) => {
//     // //   const getCnyRef = makeGetCnyRef();
//     // //   const getUsers = makeGetAllUsers();
//     // //   const getActiveMembers = makeGetActiveMemberItems();
//     //   return {
//     //     // isAddingInvoice: state && state.state && state.state.get('isAddingInvoice') ? true : false,
//     //     // cnyRef: getCnyRef(state, props),
//     //     // users: getUsers(state, props),
//     //     // activeMember: getActiveMembers(state, props)
//     //   }
//     // }
//     return mapStateToProps
//   }

  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }
  export default connect(mapDispatchToProps)(createInvoiceStyled)