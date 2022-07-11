import {Avatar,IconButton,Menu,MenuItem,Snackbar,Toolbar,Typography,AppBar} from '@material-ui/core';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core/styles';
import {AccountCircle} from '@material-ui/icons';
import React from 'react';
import {Route,Switch} from 'react-router'
import PropTypes from 'prop-types';

import * as Actions from './actions';
import BackIcon from './BackIcon';
import {makeGetCurrentUser} from './selectors';
import StdText from './components/StdText';

const styles = theme => ({
  root: {
    marginTop: 0,
    width: '100%',
  },
  flex: {
    flex: 1,
    textAlign: 'center',
    // justifyContent: 'center'
  },
  menuButton: {
    // marginLeft: -12,
    // marginRight: 20,
  },
  appBar: {
    backgroundColor: 'rgba(6,40,69,0.96)'
  },
  appBarTransparent: {
    backgroundColor: 'rgba(6,40,69,0.62)'
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    alignItems: 'center',
    padding: 0
  },
  snackbarMessage: {
    textAlign: 'center',
    flex: 1,
    fontSize: '1.3125rem',
    padding: 2
  },
  snackbarRoot: {
    backgroundColor: 'rgba(6,40,69,0.96)'
  }
});



class MenuAppBar extends React.Component {
  // state = {
  //   auth: true,
  //   anchorEl: null,
  //   transparent:false
  // };

  constructor(props) {
    super(props);
    this.state = {
      dialogOpen: false,
      email: '',
      password: '',
      anchorEl: null,
      shouldSignUp: false
    };
  }

  handleLogin = () => {
    const userLoggedIn = this.props.currentUser && this.props.currentUser.isEmpty() === false;
    console.log('handlelogin', userLoggedIn);
    if (userLoggedIn) {
      this.handleMenuClose();
      this.props.actions.logout();
      this.setState({
        dialogOpen: false
      });

    } else {
      this.setState({
        dialogOpen: true
      });
    }
  };

  login = () => {
    // this.handleMenuClose();
    this.setState({
      dialogOpen: false
    });

    if (this.state.shouldSignUp) {
      this.props.actions.signUp(this.state.email, this.state.password, this.state.name, this.state.phone, (success) => this.setState({
        dialogOpen: !success,
        shouldSignUp: !success
      }));
    } else {
      this.props.actions.login(this.state.email, this.state.password, () => this.setState({
        dialogOpen: true,
        shouldSignUp: true
      }));
    }
  }


  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  // handleMenu = event => {
  //   this.setState({
  //     anchorEl: event.currentTarget
  //   });
  // };

  handleRequestClose = (e) => {
    this.setState({
      dialogOpen: false,
      shouldSignUp: false,
      password: null,
      confirmPassword: null
    });
  };

  handleMenu = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null
    });
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps || this.state !== nextState) {
      return true;
    }
    return false;
  }

  render() {
    const {
      classes,
      // state
      currentUser,
      message
    } = this.props;
    const {
      anchorEl
    } = this.state;
    const userLoggedIn = currentUser && currentUser.isEmpty() === false ? true : false;
    // console.log(userLoggedIn);
    // if (userLoggedIn) {
    //   loginLabel = 'Logout';
    // }

    // const message = this.props.message || ' ';

    const open = Boolean(anchorEl && userLoggedIn);

    const pathname = this.props.router.location.pathname;
    const notPayments = (pathname && pathname.length > 0) ? pathname.indexOf('payments') === -1 : true;

    const user = currentUser;
    const userEmail = user && user.get('email');
    const roles = user && user.get('roles');
    const isStaff = user && user.get('isStaff');
    const staffRole = user && user.get('staffRole');
    const isAdmin = user && (user.get('staffRole') === 'admin');
    const isCRO = user && (user.get('staffRole') === 'CRO');
    const isTrainer = user && (user.get('staffRole') === 'trainer');
    const isSeniorCRO = user && (user.get('staffRole') === 'seniorCRO');
    const isSuperVisor = user && (user.get('staffRole') === 'supervisor');
    const isShared = user && (user.get('staffRole') === 'shared');
    const staffBranch = user.get('staffBranch')? user.get('staffBranch'):'';

    const isAuthorized = isStaff || isAdmin || isCRO || isTrainer || isSeniorCRO || isSuperVisor || isShared;
    const image = user && user.get('image');
    const thumbImg = image && image.replace(encodeURIComponent('images/'), encodeURIComponent('images/thumb_64_'));

    return (
      <div className={classes.root} id={'no-print'}>
        <AppBar position="fixed" className={this.props.transparent ? classes.appBarTransparent : classes.appBar}>
          <Toolbar className={classes.toolbar}>
            <Switch>
              <Route exact path='/' component={BabelIcon} />
              <Route exact path='/classes' component={BabelIcon} />
              <Route exact path='/people' component={BabelIcon} />
              <Route path='/people/:userId' component={BackIcon} />
              <Route exact path='/next' component={BabelIcon} />
              <Route path='/classes/:name' component={BackIcon} />
              <Route path='/settings' component={BabelIcon} />
              {isAuthorized &&
                <Route path='/payments/:invoiceId' component={BabelIcon} />
              }
              <Route path='/profile/:userId' component={BackIcon} />
              <Route path='/profile' component={BabelIcon} />
              <Route path='/' component={BabelIcon} />
            </Switch>

            <StdText text = {'BilikXpert'} variant = 'h4' color="inherit" style={{flex: 1, textAlign: 'center'}}/>
         
            {(!userLoggedIn) && (<BabelIcon />)}
              {(userLoggedIn) && (
                 <div style = {{display:'flex', flexDirection:'row', justifyContent:'center', alignItems:'center'}}>
                    {isStaff && staffRole && userEmail && <StdText color="inherit">
                      {`${userEmail} (${staffRole}-${staffBranch})`}
                    </StdText>}
                   <IconButton
                     aria-owns={open ? 'menu-appbar' : null}
                     aria-haspopup="true"
                     onClick={this.handleMenu}
                     // color="contrast"
                   >
                    {image && <Avatar src={thumbImg} style={{marginRight:8}}/>}
                    {!image && <AccountCircle />}
                   </IconButton>
                   <Menu
                     id="menu-appbar"
                     anchorEl={anchorEl}
                     anchorOrigin={{
                       vertical: 'top',
                       horizontal: 'right',
                     }}
                     transformOrigin={{
                       vertical: 'top',
                       horizontal: 'right',
                     }}
                     open={open}
                     onClose={this.handleMenuClose}
                   >
                     {isAuthorized &&
                       <MenuItem onClick={this.props.actions.viewRegistration}>Registration</MenuItem>
                     }
                     {userLoggedIn &&
                      <MenuItem onClick={this.handleLogin}>Logout</MenuItem>
                     }
                     {!userLoggedIn &&
                      <MenuItem onClick={this.props.actions.viewLogin}>Login</MenuItem>
                     }
                   </Menu>
                 </div>
               )}
          </Toolbar>
        </AppBar>
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={message && message.trim().length > 0 }
            message={message}
            key={message}
            ContentProps={{classes:{message:classes.snackbarMessage, root:classes.snackbarRoot}}}
            autoHideDuration={200}
          />
      </div>
    );
  }
}

class BabelIcon extends React.Component {
  render() {
    return (
      <IconButton>
        <img src={require('./assets/bilikxpert_logos_white.png')} alt='BilikXpert' style={{width:44, height:44}}/>
      </IconButton>
    );
  }
}

MenuAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

const MenuBarStyled = withStyles(styles)(MenuAppBar);

const makeMapStateToProps = () => {
  const getCurrentUser = makeGetCurrentUser();
  const mapStateToProps = (state, props) => {
    return {
      router:state.router,
      message: state && state.state && state.state.get('message') ? state.state.get('message') : null,
      currentUser: getCurrentUser(state, props)
    }
  }
  return mapStateToProps
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(makeMapStateToProps, mapDispatchToProps)(MenuBarStyled)
