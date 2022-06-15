import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles, Typography} from '@material-ui/core';
 
import React from 'react';
import moment from 'moment';

import PropTypes from 'prop-types';

import * as Actions from './actions';
import MenuAppBar from './MenuAppBar';
import { FacebookProvider, Like, Share, LoginButton, Login, Status } from 'react-facebook';
  
  const styles = theme => ({
    container: {
      // width: '100%',
      // maxWidth: 360,
      // backgroundColor: theme.palette.background.paper,
      // position: 'relative',
      // overflow: 'auto',
      // maxHeight: 300,
      overflow: 'hidden',
      maxWidth: theme.spacing(75),
      marginLeft: 'auto',
      marginRight: 'auto',
      marginTop: theme.spacing(10),
      paddingBottom: 112
    },
    content: {
      maxWidth: 600,
      marginRight: theme.spacing(2),
      marginLeft: theme.spacing(2)
    },
    listSection: {
      marginBottom: theme.spacing(2),
    },
    title: {
      marginBottom: theme.spacing(1)
    },
    bookButton: {
      margin: theme.spacing(2),
      backgroundColor: "#fde298",
      color: '#fff',
    },
    addButton: {
      backgroundColor: "#fde298",
      color: '#fff',
    },
    fileInput: {
      display: 'none'
    },
    fileLabel: {
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    fab: {
      position: 'fixed',
      bottom: 56 + theme.spacing(2),
      right: theme.spacing(2),
      zIndex: 1300
    },
  });
  
  class FBLogin extends React.Component {
  
    state = {
      editDialogOpen: false,
      editUserId: null,
      editUserData: {},
      fbData: null,
    }
  
    componentDidMount() {
      window.scrollTo(0, 0);
    //   FB.login(function(response) {
    //     if (response.authResponse) {
    //      console.log('Welcome!  Fetching your information.... ');
    //      FB.api('/me', function(response) {
    //        console.log('Good to see you, ' + response.name + '.');
    //      });
    //     } else {
    //      console.log('User cancelled login or did not fully authorize.');
    //     }
    //     });
    }
  
    handleEdit = (userId) => {
      if (!userId) {
        userId = 'NEW';
      }
      this.setState({
        editDialogOpen: true,
        editUserId: userId
      });
    };
  
    handleClose = () => {
      this.setState({
        open: false,
        editUserId: null,
        editUserData: {}
      });
    };
  
    handleSearch = name => event => {
      this.setState({
        search: event.target.value
      });
    }
  
    handleChange = name => event => {
      var editUserData = this.state.editUserData;
      var value = event.target.value;
      if (name === 'membershipStarts' || name === 'membershipEnds') {
        value = moment(value).toDate();
      } else if (name === 'freeMonths' || name === 'freeMonthsReferrals' || name === 'joiningFee' || name === 'monthlyFee' || name === 'prepaidAmount') {
        value = parseInt(value);
      } else if (name === 'image') {
        const imageFile = event.target.files[0];
        if (imageFile) {
          this.props.actions.uploadImage(imageFile, (imageURL) => {
            editUserData.image = imageURL;
            this.setState({
              editUserData: {
                ...editUserData
              },
            });
          });
        }
        return;
      }
      editUserData[name] = value;
      this.setState({
        editUserData: {
          ...editUserData
        },
      });
    }
  
    handleSaveEdit = () => {
      const cardToRegister = this.props.state.get('cardToRegister');
      if (cardToRegister && cardToRegister.length > 0) {
        this.props.actions.saveUserData(this.state.editUserId, { ...this.state.editUserData,
          gantnerCardNumber: cardToRegister
        });
      } else {
        this.props.actions.saveUserData(this.state.editUserId, this.state.editUserData);
      }
      this.handleClose();
    }
  
    handleRegisterCard = () => {
      if (this.props.state.has('cardToRegister')) {
        this.props.actions.removeCardToRegister();
      }
      this.props.actions.getCardToRegister();
    }
  
    cancelRegisterCard = () => {
      this.props.actions.removeCardToRegister();
    }
  
    // for FB
    handleResponse = (data) => {
        console.log('fb data:', data);
        this.setState({fbData: data});
      }
    
      handleError = (error) => {
        console.log('fb error: ', error);
        this.setState({ error });
      }

      handleFBClick = (data) =>{
        console.log('handleFBClick: ', data);
      }
    render() {
      const {classes} = this.props;
        const {fbData} = this.state;

        console.log('fbdatastate: ', fbData);
      return (
        <div className={classes.container}>
              <MenuAppBar />
            {/* <FacebookProvider appId="123456789">
                <Like href="http://www.facebook.com" colorScheme="dark" showFaces share />
            </FacebookProvider>
            <FacebookProvider appId="123456789">
                <Share href="http://www.facebook.com">
                {({ handleClick, loading }) => (
                    <button type="button" disabled={loading} onClick={handleClick}>Share</button>
                )}
                </Share>
            </FacebookProvider> */}

            <FacebookProvider appId="476078559432892">
                <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center', cursor:'pointer', backgroundColor:'#4968ad', padding:20, marginTop:100, marginBottom:20, width:'50%'}}>
                    <Login
                        scope="email"
                        onCompleted={this.handleResponse}
                        onError={this.handleError}
                    >
                    {({ loading, handleFBClick, error, data }) => (
                        <span onClick={handleFBClick}>
                        Login via Facebook
                        {loading && (
                            <span>Loading...</span>
                        )}
                        {error && (
                            <span>{`error: ${error}`}</span>
                        )}
                        {data && (
                            <span>{`thedata: ${data}`}</span>
                        )}
                        </span>
                    )}
                    </Login>
                </div>
                <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center', cursor:'pointer', backgroundColor:'#4968ad', padding:20, marginBottom:20, width:'50%'}}>
                <Status>
                {({ loading, status }) => (
                    <div>
                        {loading && (
                            <span>Loading...</span>
                        )}
                        <Typography>{`STATUS: ${status}`}</Typography>
                    </div>
                   
                )}
                </Status>
                </div>
            </FacebookProvider>
         
        
          {/* <div style={{display:'flex', flex:1, marginLeft:'auto', marginRight:'auto', justifyContent:'center', cursor:'pointer', backgroundColor:'#4968ad', padding:20, width:'50%'}}>
            <FacebookProvider appId="476078559432892">
                <Status>
                {({ loading, status }) => (
                    <div>
                        <Typography>{`STATUS: ${status}`}</Typography>
                    </div>
                )}
                </Status>
            </FacebookProvider>
          </div> */}
          {fbData && 
             <div style={{display:'flex', flex:1, flexDirection:'column', marginLeft:'auto', marginRight:'auto', justifyContent:'center'}}>
                 <Typography> connected to FB</Typography>
                 <Typography> {`Token: ${fbData.tokenDetail.accessToken}`} </Typography>
                 <Typography> {`email: ${fbData.profile.email}`} </Typography>
                 <Typography> {`name: ${fbData.profile.first_name}`} </Typography>
                 <Typography> {`fbId: ${fbData.profile.id}`} </Typography>
            </div>
          }
        </div>
      );
    }
  }
  
  FBLogin.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  const FBLoginStyled = withStyles(styles)(FBLogin);
  
  const mapStateToProps = (state, ownProps) => ({
    ...state
  });
  
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(FBLoginStyled)