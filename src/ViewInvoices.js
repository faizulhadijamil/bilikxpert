
  import {bindActionCreators} from 'redux';
  import {connect} from 'react-redux';
  import {withStyles, Button, Typography, Card, CardMedia, TextField, CircularProgress, IconButton, Avatar
  } from '@material-ui/core';
  
  import ArrowBackIcon from '@material-ui/icons/ArrowBack';

  import React from 'react';

  import AddIcon from '@material-ui/icons/Add';
  import RemoveIcon from '@material-ui/icons/Remove';
  import moment from 'moment';
  import BabelLogo from './BabelLogo';
  import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';

  import InvoiceCard from './Cards/InvoiceCard';
  
  import PropTypes from 'prop-types';
  
  import {makeGetStaff,  makeGetCurrentUser, makeGetSelectedUser, makeGetAllUsers,  makeGetBranch, makeGetRoom, makeGetSelectedUserInvoices, getBranchesList, getRoomsList} from './selectors';
  import * as Actions from './actions';

  import firebase from 'firebase/app';
  import 'firebase/firestore';

  import {getTheDate} from './actions'; 

  // import ReactPixel from 'react-facebook-pixel';
  
const screenWidth = window.innerWidth;
var ismobile = window.innerWidth<=550?true:false;
  
  const styles = theme => ({
    container: {
        // width: '100%',
        // // maxWidth:'1080px',
        // justifyContent:'center', 
        // alignItems:'center', 
        // display:'flex', 
        // flexDirection:'column',
        // backgroundColor: "#fcebbe",

        overflow: 'hidden',
        // background: theme.palette.background.paper,
        // boxSizing: 'border-box',
        maxWidth: theme.spacing(120),
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: theme.spacing(2),
        //paddingBottom: 56
    },
    topContainer:{
        // width: screenWidth*0.9,
        justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        backgroundColor: "#fcebbe",
        paddingBottom: theme.spacing(5),
    },
    secondContainer:{
        width: '100%',
        justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        paddingBottom: theme.spacing(5),
        paddingTop: theme.spacing(3),
    },
    keyInDetailscontainer:{
        width: '100%',
        justifyContent:'center', 
        alignItems:'center', 
        display:'flex', 
        flexDirection:'column',
        backgroundColor: "#fcebbe",
        flex:1,
    },

    boldMontSerrat:{
        color:'#464646', 
        fontFamily: "Montserrat",
        // fontFamily :'sans-serif', 
        fontWeight: 800,
        textTransform: "uppercase",
    },
    smallMontSerrat:{
        color:'#464646', 
        fontFamily: "Montserrat",
        fontWeight: 400,
        textAlign:'center', marginLeft:'10%', marginRight:'10%', marginTop:10, letterSpacing:1
        // textTransform: "uppercase",
    },
    mainImgClass:{
        alignItems:'center', justifyContent:'center', width:'90%', maxWidth:'600px', maxHeight:'750px', resizeMode: 'stretch', boxShadow: '0px 4px 10px 8px rgba(0, 0, 0, 0.2), 0px 1px 20px 8px rgba(0, 0, 0, 0.3)', borderRadius: 15
    },
    bottomImgClass:{
        alignItems:'center', justifyContent:'center', width:'100%', resizeMode: 'stretch', marginTop:20
    },
    buttonStyle:{
        paddingLeft: 25,
        paddingRight: 25,
        paddingTop:1,
        paddingBottom:1,
        alignItems:'center', justifyContent:'center',
        // minWidth: 100,
        // border: '1.5px solid white',
        borderRadius: 30,
        // boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    },
    boxContainer:{
        // paddingLeft: '5%',
        // paddingRight: '5%',
        padding:'2%',
        backgroundColor: "#fcebbe",
        borderRadius: 20,
        marginLeft: "auto",
        marginRight: "auto",
        // marginLeft:'6%',
        // marginRight:'5%',
        // marginLeft:5,
        // marginRight:5,
        // width:'90%',
        width: screenWidth * 0.85,
        height: screenWidth * 0.22,
        boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
    },
    fontTermNCond: {
        marginBottom:7, color:'rgba(0, 0, 0, 0.54)'
    },
    card: {
      paddingBottom: theme.spacing(10)
    },
    content: {
      // maxWidth: 8 * 50,
      marginRight: 'auto',
      marginLeft: 'auto',
    },
    termNConditionContainer:{
        maxWidth:screenWidth * 0.9,
        marginRight: 'auto',
        marginLeft: 'auto',
    },
    contentInner: {
      maxWidth: 8 * 50,
      marginRight: 'auto',
      marginLeft: 'auto',
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
    buttonLarge: {
      fontSize: "1.5rem",
      textTransform: "capitalize",
      fontWeight: 500,
      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
        backgroundColor: "#fde298",
        // backgroundColor: "#FFF",
      color: '#062845',
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 16,
      paddingRight: 16,
      borderRadius: 20,
      minHeight: 36,
      minWidth: 88,
      width: '100%',
      maxWidth:300,
      boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)',
      justifyContent: 'flexEnd'
    },
    buttonRed: {
      fontSize: "0.875rem",
      textTransform: "uppercase",
      fontWeight: 500,
      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      backgroundColor: "#F71A38",
      color: '#fff',
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
    buttonDisabled: {
      fontSize: "0.875rem",
      textTransform: "uppercase",
      fontWeight: 500,
      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      backgroundColor: "#ccc",
      color: '#fff',
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
    red: {
      color: 'red',
      // backgroundColor:'red',
    },
    media: {
      // height: 0,
      // paddingTop: '56.25%', // 16:9
      width: 100,
      height: 100,
      marginRight: 'auto',
      marginLeft: 'auto'
    },
    snackbarMessage: {
      textAlign: 'center',
      flex: 1,
      fontSize: '1.3125rem',
      padding: theme.spacing(2)
    },
    snackbarRoot: {
      backgroundColor: 'rgba(6,40,69,0.96)'
    },
    fileInput: {
      display: 'none'
    },
    quantityInput:{
      fontSize: '2rem',
      alignItems: 'center'
    },
    formControl: {
      overflow: 'hidden',
      marginLeft: 'auto',
      marginRight: 'auto',
      minWidth: 88,
      width: '100%',
      // paddingTop: 8,
      paddingBottom: 8,
      borderRadius: 2,
      minHeight: 36,
      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      marginTop: theme.spacing(2),
      marginBottom: theme.spacing(2),
      justifyContent: 'flexEnd'
    },
    
  });

  let lastScrollY = 0;

  class ViewInvoices extends React.Component {
  
    state = {
        currentSelectedUserId:null,
        currentSelectedRoomId:null,
      email: null,
      name: null,
      phone: '',
      currentBranch: '',
      currentRoomId: '',
      package: '',
      monthlyDeposit: null,
      roomPrice: '',
      startDate: '',
      endDate: '',
      mcId:null,
      icnumber: '',
      className: '',
      classDate: '',
      image: null,
      imagePath:null,
      invoice:null,
      addUserInvoice:null,
      dialogOpen: false,
      checked:false,
      refSource: null,
      mcId: null,
      paymentType:'Cash',
      paymentStatus:'PAID',

      mainImgUrl:null,
      bottomImgUrl:null,
      showSelection:true,
      showKLCC:true,
      showTTDI:false,
      showTermNCondition:false,
      showKeyInDetails:false,
      showLoading:false,
      isMobile: false,
      vendProductId: null,
      showErrorDialog:false,
    }
  
    componentDidMount() {
        const pathname = this.props.location && this.props.location.pathname;
        const pathStringSplit = pathname && pathname.split("/");
        if (pathStringSplit && pathStringSplit.length===3){
            this.setState({currentSelectedUserId:pathStringSplit[2]});
            // this.props.actions.getInvoicesByUserId(pathStringSplit[2]);
            // for invoices
            const invoicesRef = firebase.firestore().collection('invoices').where('userId', '==', pathStringSplit[2]).get();

            var invoicesArray = [];
            invoicesRef && invoicesRef.then((querySnapshot)=>{
                querySnapshot.forEach(doc=>{
                const invoiceData = doc.data();
                invoicesArray.push(invoiceData);
                });
                this.setState({invoicesArray});
            });
        }

        
    }
  
    componentWillUnmount() {
        // window.removeEventListener('scroll', this.handleScroll);
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (this.props !== nextProps || this.state !== nextState) {
        if (this.props.uploadedImageURL || this.props.uploadedImagePath || this.props.addUserInvoice) {
          var updatedState = {};
          updatedState.image = this.props.uploadedImageURL;
          updatedState.imagePath = this.props.uploadedImagePath;
          updatedState.invoice = this.props.addUserInvoice;
          updatedState.completeRegistration = true;
          this.setState({ ...updatedState })
          this.props.actions.setUploadedImage(null, null);
        }
        return true;
      }
      return false;
    }
  
    handleScroll = () => {lastScrollY = window.scrollY}

    handleChange = name => event => {
      var updatedState = {};
      var value = event.target.value;
      if (name === 'image') {

        const imageFile = event.target.files[0];
        if (imageFile) {
          console.log('imageFile: ', imageFile);
          this.props.actions.uploadInvoiceImage(imageFile, (imageURL, imagePath, addUserInvoice) => {
            if (imageURL) {
              console.log('imageURL: ', imageURL);
              console.log('imagePath: ', imagePath);
              console.log('addUserInvoice: ', addUserInvoice);

              updatedState.image = imageURL;
              updatedState.imagePath = imagePath;
              updatedState.invoice = addUserInvoice;
              updatedState.completeRegistration = true;
            }
            this.setState({ ...updatedState});
          });
        }
      }
      else if(name === 'quantity' && value < 1){
        value = 1;
      }else if(name === 'checked'){
        value = event.target.checked;
      }
   
      updatedState[name] = value;
      this.setState({ ...updatedState
      });
    }

    handleCompleteSignUp = () => {
      if (this.props.currentUser && this.props.currentUser.get('id')) {
        //console.log('savingData');
        this.props.actions.saveUserData(this.props.currentUser.get('id'), {
          image: this.state.image,
          uploadImage: this.state.uploadImage,
          imagePath: this.state.imagePath,
          addUserInvoice: this.state.uploadInvoiceImage
        });
      } else {
        // every new registration will have to key in too
        this.props.actions.signUp(this.state.email, this.state.password, this.state.name, this.state.phone, this.state.mcId, this.state.refSource, this.state.image, this.state.imagePath, this.state.uploadImage, this.state.uploadInvoiceImage, this.state.postcode, true);
      }
    }

    
    scrollTo(number){
        window.scrollTo({
            top: number,
            behavior: "smooth"
        });
    }

    render() {
        console.log('theState: ', this.state);
        const {classes} = this.props;
        const currentUser = this.props.currentUser;
        const roles = currentUser && currentUser.get('roles');
        const selectedUser = this.props.selectedUser;
        // console.log('currentUser: ', currentUser);
        // console.log('selectedUser: ', selectedUser);
        // const selectedUserId = (this.props && this.props.match && this.props.match.params && this.props.match.params.userId) || (currentUser && currentUser.get('id'));
        const selectedUserId = (this.props && this.props.match && this.props.match.params);
        // console.log('selectedUserId: ', selectedUserId);
        // console.log('currentState: ', this.state);
        const {currentSelectedUserId} = this.state;
        //const {currentSelectedRoomId} = this.state;

        const users = this.props.users || null;
        console.log('theUsers: ', users);
        const selectedUserData = users && users.get(selectedUserId);

        console.log('selectedUserData: ', selectedUserData);
        const {currentSelectedBranchId} = this.state;
        //console.log('currentSelectedBranchId: ', currentSelectedBranchId);

        const {currentSelectedRoomNumber} = this.state;
        //console.log('currentSelectedRoomNumber: ', currentSelectedRoomNumber);

        const branch = this.props.branch || null;
        const selectedUserCurrentBranch = (selectedUserData && selectedUserData.has('currentBranch'))? selectedUserData.get('currentBranch'):this.state.branch;
        const selectedBranchData = branch && branch.get(selectedUserCurrentBranch);
        console.log('selectedBranchData: ', selectedBranchData);
        const selectedUserBranchName = (selectedBranchData && selectedBranchData.has('name'))? selectedBranchData.get('name'):'';
        console.log('selectedUserBranchName: ', selectedUserBranchName);

        const rooms = this.props.rooms || null;
        const selectedUserCurrentRoom = (selectedUserData && selectedUserData.has('currentRoomId'))? selectedUserData.get('currentRoomId'):this.state.roomId;
        const selectedRoomData = rooms && rooms.get(selectedUserCurrentRoom);
        //console.log('selectedRoomData: ', selectedRoomData);
        const selectedUserRoomNumber = (selectedUserData && selectedUserData.has('currentRoomId'))? selectedRoomData.get('roomNumber'):'';
        //console.log('selectedUserRoomNumber: ', selectedUserRoomNumber);

        //const selectedUserDeposit = this.state.monthlyDeposit? this.state.monthlyDeposit:(selectedUserData && selectedUserData.has('currentRoomId'))? selectedRoomData.has('monthlyDeposit')? selectedRoomData.get('monthlyDeposit'):'':'';
       // console.log('selectedUserDeposit: ', selectedUserDeposit);

        const selectedCurrentRoomNumber = rooms && rooms.get(currentSelectedRoomNumber);
        //const selectedRoomData = users && users.get(currentSelectedUserId);
        //const currentRoomId = users && users.get(currentRoomId);
        //console.log('selectedUserData: ', selectedUserData);
        const selectedUserEmail = this.state.email? this.state.email:(selectedUserData && selectedUserData.has('email'))? selectedUserData.get('email'):'';
        console.log('selectedUserEmail: ', selectedUserEmail);
        const selectedUserName = (selectedUserData && selectedUserData.has('name'))? selectedUserData.get('name'):this.state.name;
        console.log('selectedUserName: ', selectedUserName);
        const selectedUserPhone = (selectedUserData && selectedUserData.has('phone'))? selectedUserData.get('phone'):this.state.phone;
        
        const selectedUserPackage = this.state.package? this.state.package:(selectedUserData && selectedUserData.has('package'))? selectedUserData.get('package'):'Monthly';
        
        //const selectedUserDeposit = this.state.deposit? this.state.deposit:(selectedRoomData && selectedRoomData.has('monthlyDeposit'))? selectedRoomData.get('monthlyDeposit'):'';
        const selectedRoomPrice = this.state.roomPrice? this.state.roomPrice:(selectedUserData && selectedUserData.has('currentRoomId'))? selectedRoomData.get('monthlyPrice'):'';
        //console.log('selectedRoomPrice: ', selectedRoomPrice);
        //const selectedRoomPrice = this.state.roomPrice? this.state.roomPrice:(selectedRoomData && selectedRoomData.has('monthlyPrice'))? selectedRoomData.get('monthlyPrice'):'RM650';
        const selectedUserStartDate = this.state.startDate? this.state.startDate:(selectedUserData && selectedUserData.has('autoMembershipStarts'))? selectedUserData.get('autoMembershipStarts'):'';
        // console.log('selectedUserStartDate: ', selectedUserStartDate);

        // var endDate = new Date();
        // endDate.setDate(endDate.get('autoMembershipStarts') + 30);
        // const selectedUserEndDate = this.state.endDate? this.state.endDate:(selectedUserData && selectedUserData.has('autoMembershipStarts'))? new Date((selectedUserData.get('autoMembershipStarts'))).getMonth()+1:null;
        const selectedUserEndDate = this.state.endDate? this.state.endDate:(selectedUserData && selectedUserData.has('autoMembershipStarts'))? moment(selectedUserData.get('autoMembershipStarts')).add(1, 'months').format('YYYY-MM-DD'):moment().format('YYYY-MM-DD');
        //console.log('autoMembershipStarts: ', selectedUserData && selectedUserData.has('autoMembershipStarts') && moment(selectedUserData.get('autoMembershipStarts')).add(1, 'months').format('YYYYMMDD'))
        //const selectedUserCRO = (selectedUserData && selectedUserData.has('mcId'))? selectedUserData.get('name'):this.state.mcId;
        //console.log('selectedUserCRO: ', selectedUserCRO);
        //  console.log('selectedUserCurrentBranch: ', selectedUserCurrentBranch);
        const selectedUserCRO = (selectedUserData && selectedUserData.has('mcId'))? selectedUserData.get('mcId'):this.state.mcId;
        const selectedCROData = users && users.get(selectedUserCRO);
        //console.log('selectedRoomData: ', selectedRoomData);
        const selectedUserMcId = (selectedUserData && selectedUserData.has('mcId'))? selectedUserData.get('mcId'):null;
        //console.log('selectedUserRoomNumber: ', selectedUserRoomNumber);

        // console.log('selectedUserName: ', selectedUserName);
        // console.log('selectedUserPhone: ', selectedUserPhone);
        var addUserInvoice = editUserInvoice && editUserInvoice.has('image') ? editUserInvoice.get('image') : null;
        var editUserInvoice = <PhotoCameraIcon style={{width:64, height:64}} />;
        if (addUserInvoice) {
          editUserInvoice = <Avatar  style={{width:64, height:64, marginLeft:'auto', marginRight:'auto'}} src={addUserInvoice} />;
        }
        
        const image = this.state.image;
        var editUserInvoice = <PhotoCameraIcon style={{width:128, height:128}} />;
        if (image) {
          addUserInvoice = <Avatar  style={{width:128, height:128, marginLeft:'auto', marginRight:'auto'}} src={image} />;
        }

        
       console.log('this.props.invoices: ', this.props);
        const {invoicesArray} = this.state;

        return (
            <div className={classes.container}>
            <Card className={classes.content} elevation={0}>
            <CardMedia
                className={classes.media}
                image={require('./assets/bilikxpert_logos_black.png')}
            />
           <div>
          <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginBottom:32}}>
            Welcome to BilikXpert Invoices
          </Typography>

            
            {invoicesArray && invoicesArray.length>0 && invoicesArray.map((invoice, index)=>{
                const paymentStatus = invoice.paymentStatus;

                console.log('invoices: ', invoice);
                const startDate = invoice.startDate? moment(getTheDate(invoice.startDate)).format('DD/MM/YYYY'):'';
                const endDate = invoice.endDate? moment(getTheDate (invoice.endDate)).format('DD/MM/YYYY'):'';
                const transDate = invoice.transDate? moment(getTheDate(invoice.transDate)).format('DD/MM/YYYY'):'';
                const branchId = invoice.branchId;
                const roomNumber = invoice.roomNumber;
                const totalPrice = invoice.totalPrice;
                
                return (
                    <div>
                        <InvoiceCard
                          key={index}
                          text={`invoice ${index+1}`}
                          startDate={startDate}
                          endDate={endDate}
                          transDate={transDate}
                          branchId={branchId }
                          roomNumber={roomNumber}
                          totalPrice={totalPrice}
                          defaultEmail = {selectedUserEmail}
                        />
                         <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginTop:20}}>
                            {`Invoice ${index+1}:`}
                        </Typography>

                        <div>
          {this.state.imageURLToUpload}
            {this.state.addUserInvoice}
            <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
              <IconButton color="primary" component="span" style={{marginTop:32, marginBottom:48}} disabled={this.props.isUploadingImage} onClick={()=>this.props.actions.useNativeCamera()}>
                {addUserInvoice}
              </IconButton>
            </div>
            <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
              <input accept="/*" className={classes.fileInput} id="icon-button-file" type="file" onChange={this.handleChange('image')} />
              <label htmlFor="icon-button-file" >
                <Button raised component="span" color='primary' key={'uploadPhoto'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} disabled={this.props.isUploadingImage} style={{marginBottom:32}}>
                  {this.state.image ? 'Change Photo' : 'Upload Photo' }
                  {this.props.isUploadingImage &&
                    <CircularProgress style={{color:'white', marginLeft:8}}/>
                  }
                </Button>
              </label>
            </div>
          </div>
  

                        <TextField
                            margin="dense"
                            id="email"
                            label="Email Address"
                            type="email"
                            defaultValue={selectedUserEmail}
                            value={selectedUserEmail}
                            fullWidth
                            onChange={this.handleChange('email')}
                            // disabled={!roles || isShared || isTrainer}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="name"
                            label="Name"
                            defaultValue={selectedUserName}
                            value={selectedUserName}
                            fullWidth
                            onChange={this.handleChange('name')}
                            //disabled={true}
                            // required
                        />

                        <TextField
                            margin="dense"
                            id="phone"
                            label="Phone Number"
                            type="number"
                            defaultValue={selectedUserPhone}
                            value={selectedUserPhone}
                            fullWidth
                            onChange={this.handleChange('phone')}
                            //disabled={true}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="branch"
                            label="Branch"
                            defaultValue={selectedUserBranchName}
                            value={selectedUserBranchName}
                            fullWidth
                            onChange={this.handleChange('currentBranchName')}
                            //disabled={true}
                            // required
                        />
                        <TextField
                            margin="dense"
                            id="roomNumber"
                            label="Room Number"
                            defaultValue={selectedUserRoomNumber}
                            value={selectedUserRoomNumber}
                            fullWidth
                            onChange={this.handleChange('roomNumber')}
                            //disabled={true}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="package"
                            label="Package"
                            defaultValue={selectedUserPackage}
                            value={selectedUserPackage}
                            fullWidth
                            onChange={this.handleChange('package')}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="deposit"
                            label="Deposit"
                            //defaultValue={selectedUserDeposit}
                            //value={selectedUserDeposit}
                            fullWidth
                            onChange={this.handleChange('monthlyDeposit')}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="roomPrice"
                            label="Room Price"
                            type="price"
                            defaultValue={selectedRoomPrice}
                            value={selectedRoomPrice}
                            fullWidth
                            onChange={this.handleChange('roomPrice')}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="startDate"
                            label="Start Date"
                            type="date"
                            defaultValue={selectedUserStartDate}
                            value={selectedUserStartDate}
                            fullWidth
                            onChange={this.handleChange('startDate')}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="endDate"
                            label="End Date"
                            type="date"
                            defaultValue={selectedUserEndDate}
                            value={selectedUserEndDate}
                            fullWidth
                            onChange={this.handleChange('endDate')}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="paymentType"
                            label="Cash / online transfer / cash deposit"
                            defaultValue={'Cash'}
                            value={this.state.paymentType}
                            fullWidth
                            onChange={this.handleChange('paymentType')}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="paymentStatus"
                            label="status: PAID/UNPAID"
                            value={paymentStatus}
                            fullWidth
                            onChange={this.handleChange('paymentStatus')}
                            required
                        />
                        <TextField
                            margin="dense"
                            id="mcId"
                            label="Customer's Relation Officer"
                            defaultValue={selectedUserMcId}
                            value={(selectedCROData && selectedCROData.has('name'))? selectedCROData.get('name'):''}
                            fullWidth
                            onChange={this.handleChange('mcId')}
                            disabled={true}
                            // required
                        />

                        <TextField
                            margin="dense"
                            id="remarks"
                            label="notes/remark"
                            value={this.state.remark}
                            fullWidth
                            onChange={this.handleChange('remark')}
                            required
                        />
                       
                      


                    </div>
                )}
            )}
            </div>
            </Card>
            <BabelLogo hideLogo={true}/>
        </div>

           
        );
      
    }
  }
  
  ViewInvoices.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  const ViewInvoicesStyled = withStyles(styles)(ViewInvoices);
  
  // const mapStateToProps = (state, ownProps) => ({
  //   ...state
  // });
  
  const makeMapStateToProps = () => {
    const mapStateToProps = (state, props) => {
      const getStaff = makeGetStaff();
      const getCurrentUser = makeGetCurrentUser();
      const getSelectedUser = makeGetSelectedUser();
      const getUsers = makeGetAllUsers()
      const getBranch = makeGetBranch();
      const getRooms = makeGetRoom();
      // const getInvoices = makeGetSelectedUserInvoices();
      return {
        isAddingInvoice: state && state.state && state.state.get('isAddingInvoice') ? true : false,
        currentUser: getCurrentUser(state, props),
        selectedUser: getSelectedUser(state,props),
        // vendProducts: getVendProducts(state, props),
        staff: getStaff(state, props),
        users: getUsers(state, props),
        branch: getBranch(state, props),
        rooms: getRooms(state, props),
        // invoices: getInvoices(state, props),
        // invoices: state && state.state && state.state.get(['invoices', 'invoicesByUserId'])?  state.state.get(['invoices', 'invoicesByUserId']):null,
        isUploadingImage: state && state.state && state.state.get('isUploadingImage') ? true : false,
        uploadedImageURL: state && state.state && state.state.get('uploadedImageURL') ? state.state.get('uploadedImageURL') : null,
        uploadedImagePath: state && state.state && state.state.get('uploadedImagePath') ? state.state.get('uploadedImagePath') : null,
        uploadedAddUserInvoice: state && state.state && state.state.get('addUserInvoice') ? state.state.get('addUserInvoice') : null,
      }
    }
    return mapStateToProps
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(ViewInvoicesStyled)
  