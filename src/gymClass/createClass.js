import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/functions';
  import {bindActionCreators} from 'redux';
  import {connect} from 'react-redux';
  import {withStyles, TextField, Grid, Button, Typography, CircularProgress} from '@material-ui/core';

  import React from 'react';
  import moment from 'moment';
  
  import PropTypes from 'prop-types';
  
  import {makeGetCurrentUser} from '../selectors'
  import * as Actions from '../actions';
  import BabelLogo from '../BabelLogo';
  import MenuAppBar from '../MenuAppBar';
  
  var FileSaver = require('file-saver');

  const styles = theme => ({
    container: {
      overflow: 'hidden',
      marginLeft: 'auto',
      marginRight: 'auto',
      // paddingTop: theme.spacing(8),
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
  
  class createClass extends React.Component {
  
    constructor(props){
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    state = {
        name:'',
        description:'',
        instructorName:'',
        maxCapacity:'',
        venue:'',
        classDuration:'',

        availableDate:null,
        classDate:null,
        expiredDate:null,

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

    shouldComponentUpdate(nextProps, nextState) {
      if (this.props !== nextProps || this.state !== nextState) {
        return true;
      }
      return false;
    }

    handleChange = name => event => {
        var updatedState = {};
    
        if (name === 'image') {
    
          const imageFile = event.target.files[0];
          if (imageFile) {
            this.props.actions.uploadImage(imageFile, (imageURL, imagePath) => {
              if (imageURL) {
                updatedState.image = imageURL;
                updatedState.imagePath = imagePath;
                updatedState.completeRegistration = true;
              }
              this.setState({ ...updatedState});
            });
          }
        } else {
          var value = event.target.value;
          if (name === 'availableDate' || name === 'classDate' || name === 'expiredDate') {
            value = moment(value).toDate();
          } 
          updatedState[name] = value;
        }
        this.setState({ ...updatedState });
    }
    
    handleContinue = () => {
        console.log('handleContinue: ', this.state);
        const {name, description, instructorName, maxCapacity, venue, classDuration, availableDate, classDate, expiredDate, vendProductId} = this.state;
        this.props.actions.addClass(name, description, instructorName, maxCapacity, venue, classDuration, availableDate, classDate, expiredDate, vendProductId);
    }

    render() {
      const {classes,currentUser} = this.props;

      // console.log('theProps: ', this.props);
      // console.log('theState: ', this.state);

      const user = this.props.currentUser || null;
      const roles = user && user.get('roles');
      const isAdmin = roles && roles.get('admin') === true;
      const isMC = roles && roles.get('mc') === true;
      const isTrainer = roles && roles.get('trainer') === true;
      const email = user && user.get('email');
      const isKLCC = email && email.indexOf('+klcc@babel.fit') !== -1 ? true : false;

    // define the layout
    const className =  
        <TextField margin="dense" id="className" label={'Class Name'} fullWidth
        onChange={this.handleChange('name')} required autoComplete='off'
        value={this.state.name}
        />;
    
    const classDescription =  
    <TextField margin="dense" id="classdescription" label={'Class Description'} fullWidth
    onChange={this.handleChange('description')} required autoComplete='off'
    value={this.state.description}
    />;

    const classInstructorName =  
    <TextField margin="dense" id="classInstructorName" label={'Class Instructor Name'} fullWidth
    onChange={this.handleChange('instructorName')} required autoComplete='off'
    value={this.state.instructorName}
    />;

    const classVenue =  
    <TextField margin="dense" id="classVenue" label={'Venue'} fullWidth
    onChange={this.handleChange('venue')} required autoComplete='off'
    value={this.state.venue}
    />;

    const classMaxCapacity =  
    <TextField margin="dense" id="classMaxCapacity" label={'maximum capacity'} fullWidth
    onChange={this.handleChange('maxCapacity')} required autoComplete='off'
    value={this.state.maxCapacity}
    />;

    const classDuration =  
    <TextField margin="dense" id="classDuration" label={'Class Duration'} fullWidth
    onChange={this.handleChange('classDuration')} required autoComplete='off'
    value={this.state.classDuration}
    />;

    const classVendProductId =  
    <TextField margin="dense" id="classVendProductId" label={'vend product ID'} fullWidth
    onChange={this.handleChange('vendProductId')} required autoComplete='off'
    value={this.state.vendProductId}
    />;

      return (
        <div className={classes.container}>
            <MenuAppBar />
              <div style={{padding:20}}>
                <Grid item xs={12}>
                    <Typography type="display1" component="h1" color="primary" style={{textAlign:'center', marginBottom:32}}>
                        {'CREATE CLASS'}
                    </Typography>
                    {className}
                    {classDescription}
                    {classInstructorName}
                    {classVenue}
                    {classMaxCapacity}
                    {classDuration}
                    {classVendProductId}
                    <TextField
                        id="availableDate"
                        label="Available Date"
                        type="date"
                        required
                        value={moment(this.state.availableDate).format('YYYY-MM-DD')}
                        margin="dense"
                        fullWidth
                        onChange={this.handleChange('availableDate')}
                        InputLabelProps={{shrink: true}}
                        disabled={false}
                    />
                     <TextField
                        id="classDate"
                        label="Class Date"
                        type="date"
                        required
                        value={moment(this.state.classDate).format('YYYY-MM-DD')}
                        margin="dense"
                        fullWidth
                        onChange={this.handleChange('classDate')}
                        InputLabelProps={{shrink: true}}
                        disabled={false}
                    />
                     <TextField
                        id="expiredDate"
                        label="Expired Date"
                        type="date"
                        required
                        value={moment(this.state.expiredDate).format('YYYY-MM-DD')}
                        margin="dense"
                        fullWidth
                        onChange={this.handleChange('expiredDate')}
                        InputLabelProps={{shrink: true}}
                        disabled={false}
                    />

                <Button raised key={'createClass'} classes={{raisedPrimary:classes.button, disabled:classes.buttonDisabled}} 
                    onClick={this.handleContinue} color="primary" 
                    disabled={this.props.isAddingInvoice}>
                        Create Class
                    {this.props.isAddingInvoice &&
                        <CircularProgress style={{color:'white', marginLeft:8}}/>
                    }
                </Button>

                </Grid>
              </div>
            <BabelLogo />
        </div>
      );
    }
  }
  
  createClass.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  const createClassStyled = withStyles(styles)(createClass);
  
  const makeMapStateToProps = () => {
    const getCurrentUser = makeGetCurrentUser();
    
    const mapStateToProps = (state, props) => {
      return {
        currentUser: getCurrentUser(state, props),
        // users: getAllUsers(state, props),
      }
    }
    return mapStateToProps
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(createClassStyled)