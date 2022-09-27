import './App.css';
import {MuiThemeProvider,createMuiTheme, withStyles} from '@material-ui/core/styles';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {BottomNavigation, BottomNavigationAction} from '@material-ui/core';
import {Dashboard, DateRange, Check, ShoppingCart} from '@material-ui/icons';
import PeopleIcon from '@material-ui/icons/People';
import PersonIcon from '@material-ui/icons/Person';
import React, {
  Component
} from 'react';
import {
  Route,
  Switch
} from 'react-router'
import PropTypes from 'prop-types';

import * as Actions from './actions';
import Booking from './Booking'
import Buy from './Buy'
import Classes from './Classes';
import createClass from './gymClass/createClass';
import Feed from './Feed'
// import Payments from './Payments';
//import PaymentsAdyen from './PaymentsAdyen';
// import PaymentsAdyenDropIn from './PaymentsAdyenDropIn';
import People from './People'
import Person from './Person'
import Registration from './Registration';
import RegistrationWhatsapp from './RegisterWhatsappNumber';
import SelfRegistration from './SelfRegistration';
import UserRegByCRO from './UserRegByCRO';
// import FBLogin from './FBLogin';
// import Settings from './Settings'
import Profile from './Profile'
import UserProfile from './UserProfile';
// import TermsConditions from './TermsConditions'
// import PrivacyPolicy from './PrivacyPolicy'
//import Report from './Report'
// import UserReport from './UserReport'
// import Referral from './Referral'
// import CNYangpow from './promoPage/cnyangpow'
//import PaymentReport from './reportPage/PaymentReport'
//import BFMReport from './reportPage/BFMReport';
// import testPage from './testPage';
// import Members from './Members';
// import vendProductPage from './vendProductPage';
import createInvoice from './CreateInvoice';
// import renewMembershipPage from './buyPage/renewMembership';
// import buyMembershipPage from './buyPage/buyMembership';
import buyVirtualPT from './buyPage/buyVirtualPT3';
import buyVirtualClass from './buyPage/buyVirtualClass';
import bookBabelExclusiveClass from './bookPage/bookBabelExclusive';
// import buySpinBikeRental from './buyPage/buySpinBikeRental';
import buyVirtualHomeAssist from './buyPage/buyvirtualhomeassist';
// import buyPT from './buyPage/buyPT';
import buyPT2 from './buyPage/buyPT2';
import buyBabelLive from './buyPage/buyBabelLive';
import buyBabelWellness from './buyPage/buyBabelWellness';
import buyFLX from './buyPage/buyFLX';
// import buyAugustPromo from './buyPage/buyAugust2020Promo';
// import buySep20Promo from './buyPage/buySep20Promo';
// import buyMidSep20Promo from './buyPage/buyMidSep2020Promo';
// import covid19form from './covid19page';
// import vidConfPage from './zoomPage/vidConfPage';
// import verifyzoom from './zoomverify/verifyzoom';
import buyAngpow2022 from './buyPage/buyAngpow2022';
import buyklccexperience from './buyPage/buyKLCCExperience';

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: 0,
    MozUserSelect:'none',
    WebkitUserSelect:'none',
    msUserSelect:'none'
  },
  bottomNav: {
    bottom: 0,
    position: 'fixed',
    zIndex: 1200,
    width: '100%',
    flex: 1
  }
});

class App extends Component {

  state = {
    bottomNavValue: 0
  }

  // handleChangeNav = (event, value) => {
  //   console.log(this.props.location);
  //   this.setState({
  //     bottomNavValue: value
  //   });
  // };

  shouldComponentUpdate(nextProps, nextState) {
    if (((this.props.state && nextProps.state) && this.props.state.get('user') !== nextProps.state.get('user')) ||
      this.props.location !== nextProps.location) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    const {classes} = this.props;


    
    const user = this.props.state && this.props.state.has('user') && this.props.state.hasIn(['user', 'id']) ? this.props.state.get('user') : null;
    // const roles = user && user.get('roles');
    // const isAdmin = roles && roles.get('admin') === true;
    // const isTrainer = roles && roles.get('trainer') === true;
    // const isMC = roles && roles.get('mc') === true;
    // const peopleLabel = (isAdmin || isTrainer || isMC) ? 'People' : 'Trainers';
    const isStaff = user && user.get('isStaff');
    const peopleLabel = 'People';

    const pathname = this.props.location.pathname;
    var bottomNavValue = 0;
    if (pathname.includes('classes')) {
      bottomNavValue = 1;
    } else if (pathname.includes('people')) {
      const userId = pathname.replace('/people/', '');
      if (userId && userId.length > 0 && this.props.state.hasIn(['user', 'id']) && userId === this.props.state.getIn(['user', 'id'])) {
        bottomNavValue = 4;
      } else {
        bottomNavValue = 2;
      }
    } else if (pathname.includes('profile') || pathname.includes('userprofile')) {
      const userId = pathname.replace('/profile/', '');
      if ((pathname === '/profile' || pathname === '/profile/') || (userId && userId.length > 0 && this.props.state.hasIn(['user', 'id']) && userId === this.props.state.getIn(['user', 'id']))) {
        bottomNavValue = 3;
      } else if(userId) {
        bottomNavValue = 2;
      }else{
        bottomNavValue = 3;
      }
    }

    const showBottomNav = pathname.indexOf('payments') === -1 &&
     pathname.indexOf('registrationbycro') === -1 &&
     pathname.indexOf('registration') === -1 &&
     pathname.indexOf('fblogin') === -1 &&
      pathname.indexOf('promo') === -1 &&
      pathname.indexOf('login') === -1 &&
      pathname.indexOf('buy') === -1 &&
      pathname.indexOf('tnc') === -1 &&
      pathname.indexOf('privacy-policy') === -1 &&
      pathname.indexOf('referral') === -1 &&
      pathname.indexOf('CNYangpow') === -1 &&
      pathname.indexOf('join') === -1 &&
      pathname.indexOf('paymentreport') === -1 &&
      pathname.indexOf('renewmembership') === -1 &&
      pathname.indexOf('buymembership') === -1 &&
      pathname.indexOf('buyvpt') === -1 &&
      pathname.indexOf('buyprivatevirtualclass') === -1 &&
      pathname.indexOf('buyvirtualhomeassist') === -1 &&
      pathname.indexOf('buySpinBikeRental') === -1 &&
      pathname.indexOf('babellive') === -1 &&
      pathname.indexOf('buyFLX12month') === -1 &&
      pathname.indexOf('buyflx12month') === -1 &&
      pathname.indexOf('babelathome') === -1 &&
      pathname.indexOf('buyaug20promo') === -1 &&
      pathname.indexOf('buysep20promo') === -1 &&
      pathname.indexOf('buymalaysiadaypromo') === -1 &&
      // pathname.indexOf('covidform') === -1 &&
      pathname.indexOf('babelexclusive') === -1 &&
      pathname.indexOf('angpau2022') === -1 &&
      pathname.indexOf('klccexperience') === -1 &&
      pathname.indexOf('userprofile') === -1;
    const showDoneNav = pathname.indexOf('tnc') !== -1 || pathname.indexOf('privacy-policy') !== -1;
    const showUserBottomNav = 
      pathname.indexOf('payments') === -1 &&
      pathname.indexOf('registrationbycro') === -1 &&
      pathname.indexOf('registration') === -1 &&
      pathname.indexOf('fblogin') === -1 &&
      pathname.indexOf('promo') === -1 &&
      pathname.indexOf('login') === -1 &&
      pathname.indexOf('buy') === -1 &&
      pathname.indexOf('tnc') === -1 &&
      pathname.indexOf('privacy-policy') === -1 &&
      pathname.indexOf('referral') === -1 &&
      pathname.indexOf('CNYangpow') === -1 &&
      pathname.indexOf('join') === -1 &&
      pathname.indexOf('paymentreport') === -1 &&
      pathname.indexOf('renewmembership') === -1 &&
      pathname.indexOf('buymembership') === -1 &&
      pathname.indexOf('buyvpt') === -1 &&
      pathname.indexOf('buyprivatevirtualclass') === -1 &&
      pathname.indexOf('buyvirtualhomeassist') === -1 &&
      pathname.indexOf('buySpinBikeRental') === -1 &&
      pathname.indexOf('babellive') === -1 &&
      pathname.indexOf('buyFLX12month') === -1 &&
      pathname.indexOf('buyflx12month') === -1 &&
      pathname.indexOf('buyaug20promo') === -1 &&
      pathname.indexOf('buysep20promo') === -1 &&
      pathname.indexOf('buymidsep20promo') === -1 &&
      pathname.indexOf('babelathome') === -1 &&
      // pathname.indexOf('covidform') === -1 &&
      pathname.indexOf('babelexclusive') === -1 &&
      pathname.indexOf('angpau2022') === -1 &&
      pathname.indexOf('klccexperience') === -1 &&
      pathname.indexOf('userprofile') === -1;
    // console.log("showDoneNav",showDoneNav, pathname);
    // console.log(pathname, bottomNavValue);

    // switch (this.props.location.pathname) {
    //   case pathName.includes(classes):
    //     bottomNavValue = 1;
    //     break;
    //   default:
    //
    // }

    return (

      <MuiThemeProvider theme={theme}>
        <div id="your-payment-div"></div>
        <div className={classes.root}>
          <Switch>
          {<Route exact path='/' component={Feed} />}
            {<Route exact path='/classes' component={Classes} />}
            {/*Route path='/classes/:name' component={Booking} />*/}
            {/* Route exact path='/report' component={Report} /> */}
            {/*Route exact path='/userreport' component={UserReport} />*/}
            {/*Route exact path='/createclass' component={createClass} />*/}
            {/*Route exact path='/paymentreport' component={PaymentReport} /> */}
            {/*Route exact path='/bfmreport' component={BFMReport} /> */}
            {/*Route exact path='/fblogin' component={FBLogin} />*/}
            {/* <Route exact path='/testpage' component={testPage} /> */}
            {/* <Route exact path='/vendproductpage' component={vendProductPage} /> */}
            {/* <Route path='/referral' component={Referral} /> */}
            {/* <Route path='/cnyangpow' component={CNYangpow} /> */}
            <Route path='/createinvoice' component={createInvoice} />
            <Route exact path='/people' component={People} />
            {<Route path='/people/:userId' component={Person} />}
            {/* <Route exact path='/member' component={Members} /> */}
            <Route path='/next' component={Feed} />
            <Route path='/userregistrationbycro' component={UserRegByCRO} />
            {/* <Route path='/settings' component={Settings} /> */}
            {/*<Route path='/payments/:invoiceId' component={PaymentsAdyen} />
            {/* <Route path='/PaymentsAdyenDropIn/:invoiceId' component={PaymentsAdyenDropIn} />
            <Route path='/paymentsPB/:invoiceId' component={Payments} /> */}
            <Route path='/registration' component={SelfRegistration} />
            <Route path='/registrationbycro' component={Registration} />
            <Route path='/login' component={Registration} />
            <Route path='/registrationwhatsapp' component={RegistrationWhatsapp} />
            <Route exact path='/promo' component={Registration} />
            <Route path='/join/:vendProductId' component={Buy} />
            <Route path='/join' component={Buy} />
            <Route path='/buypromo/:vendProductId' component={Buy} />
            <Route path='/buypromo' component={Buy} />
            <Route path='/buy/:vendProductId' component={Buy} />
            <Route path='/buy' component={Buy} />

            <Route path='/babellive' component={buyBabelLive} />
            <Route path='/babelathome' component={buyBabelWellness} />
            {/* <Route path='/buyaug20promo' component={buyAugustPromo} />
            <Route path='/buysep20promo' component={buySep20Promo} />
            <Route path='/buymalaysiadaypromo' component={buyMidSep20Promo} /> */}
            <Route path='/buyvpt' component={buyVirtualPT} />
            <Route path='/buyflx12month' component={buyFLX} />
            <Route path='/buyFLX12month' component={buyFLX} />
            <Route path='/buyprivatevirtualclass' component={buyVirtualClass} />
            <Route path='/babelexclusive' component={bookBabelExclusiveClass} />
            <Route path='/buyvirtualhomeassist' component={buyVirtualHomeAssist} />
            {/* <Route path='/buySpinBikeRental' component={buySpinBikeRental} /> */}
            <Route path='/buypt' component={buyPT2} />
            <Route path='/angpau2022' component={buyAngpow2022} />
            <Route path='/klccexperience' component={buyklccexperience} />
            {/* <Route path='/renewmembership' component={renewMembershipPage} />
            <Route path='/buyMembership' component={buyMembershipPage} /> */}
            <Route path='/profile/:userId' component={Profile} />
            <Route path='/profile' component={Profile} />

            <Route path='/userprofile/:userId' component={UserProfile} />
            <Route path='/userprofile' component={UserProfile} />
            {/* <Route path='/tnc' component={TermsConditions} />
            <Route path='/privacy-policy' component={PrivacyPolicy} /> */}
            {/* <Route path='/covidform' component={covid19form} /> */}
            {/* <Route path='/vidconf' component={vidConfPage} />
            <Route path='/verifyzoom' component={verifyzoom} /> */}
           
          </Switch>
        </div>
        {(user && showBottomNav && isStaff) &&
          <BottomNavigation
            value={bottomNavValue}
            showLabels
            classes={{root:classes.bottomNav}}
          >
            <BottomNavigationAction label="Register" icon={<DateRange />} onClick={()=>this.props.actions.viewRegister()} />
            <BottomNavigationAction label="Classes" icon={<Dashboard />} onClick={()=>this.props.actions.viewClasses()}/>
            { /*<BottomNavigationAction label={peopleLabel} icon={<PeopleIcon />} onClick={()=>this.props.actions.viewPeople()}/> */}
            {(user) &&
              <BottomNavigationAction label="Profile" icon={<PersonIcon />} onClick={()=>this.props.actions.viewProfile()}/>
            }
          </BottomNavigation>
        }
        {(user && showDoneNav) &&
          <BottomNavigation
            value={0}
            showLabels
            classes={{root:classes.bottomNav}}
          >
            <BottomNavigationAction label="Done" icon={<Check />} onClick={()=>{
                this.props.actions.goBackOnce();
                setTimeout(()=>{
                  window.location.reload(false);
                }, 500)
              }} />
          </BottomNavigation>
        }
        {false && (user && !isStaff && showUserBottomNav) && 
          <BottomNavigation
          value={bottomNavValue}
          showLabels
          classes={{root:classes.bottomNav}}
          >
          <BottomNavigationAction label="Book" icon={<DateRange />} onClick={()=>this.props.actions.viewPT()} />
          <BottomNavigationAction label="Shop" icon={<ShoppingCart />} onClick={()=>this.props.actions.viewClasses()}/>
          { /* <BottomNavigationAction label={"Profile"} icon={<PeopleIcon />} onClick={()=>this.props.actions.viewProfile()}/> */}
        </BottomNavigation>}
      </MuiThemeProvider>
    );
  }
}

App.propTypes = {classes: PropTypes.object.isRequired};

const AppStyled = withStyles(styles)(App);

const mapStateToProps = (state, ownProps) => ({
  ...state
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppStyled)
// export default connect(mapStateToProps, mapDispatchToProps)(App)

const theme = createMuiTheme({
  "direction": "ltr",
  "palette": {
    "common": {
      "black": "#000",
      "white": "#fff",
      "transparent": "rgba(0, 0, 0, 0)",
      "fullBlack": "rgba(0, 0, 0, 1)",
      "darkBlack": "rgba(0, 0, 0, 0.87)",
      "lightBlack": "rgba(0, 0, 0, 0.54)",
      "minBlack": "rgba(0, 0, 0, 0.26)",
      "faintBlack": "rgba(0, 0, 0, 0.12)",
      "fullWhite": "rgba(255, 255, 255, 1)",
      "darkWhite": "rgba(255, 255, 255, 0.87)",
      "lightWhite": "rgba(255, 255, 255, 0.54)"
    },
    "type": "light",
    "primary": {
      "50": "#062845",
      "100": "#062845",
      "200": "#062845",
      "300": "#062845",
      "400": "#062845",
      "500": "#062845",
      "600": "#062845",
      "700": "#062845",
      "800": "#062845",
      "900": "#062845",
      "A100": "#062845",
      "A200": "#062845",
      "A400": "#062845",
      "A700": "#062845",
      "contrastDefaultColor": "light"
    },
    "secondary": {
      "50": "#2E639C",
      "100": "#2E639C",
      "200": "#2E639C",
      "300": "#2E639C",
      "400": "#2E639C",
      "500": "#2E639C",
      "600": "#2E639C",
      "700": "#2E639C",
      "800": "#2E639C",
      "900": "#2E639C",
      "A100": "#2E639C",
      "A200": "#2E639C",
      "A400": "#2E639C",
      "A700": "#2E639C",
      "contrastDefaultColor": "light"
    },
    "error": {
      "50": "#ffebee",
      "100": "#ffcdd2",
      "200": "#ef9a9a",
      "300": "#e57373",
      "400": "#ef5350",
      "500": "#f44336",
      "600": "#e53935",
      "700": "#d32f2f",
      "800": "#c62828",
      "900": "#b71c1c",
      "A100": "#ff8a80",
      "A200": "#ff5252",
      "A400": "#ff1744",
      "A700": "#d50000",
      "contrastDefaultColor": "light"
    },
    "grey": {
      "50": "#fafafa",
      "100": "#f5f5f5",
      "200": "#eeeeee",
      "300": "#e0e0e0",
      "400": "#bdbdbd",
      "500": "#9e9e9e",
      "600": "#757575",
      "700": "#616161",
      "800": "#424242",
      "900": "#212121",
      "A100": "#d5d5d5",
      "A200": "#aaaaaa",
      "A400": "#303030",
      "A700": "#616161",
      "contrastDefaultColor": "dark"
    },
    "shades": {
      "dark": {
        "text": {
          "primary": "rgba(255, 255, 255, 1)",
          "secondary": "rgba(255, 255, 255, 0.7)",
          "disabled": "rgba(255, 255, 255, 0.5)",
          "hint": "rgba(255, 255, 255, 0.5)",
          "icon": "rgba(255, 255, 255, 0.5)",
          "divider": "rgba(255, 255, 255, 0.12)",
          "lightDivider": "rgba(255, 255, 255, 0.075)"
        },
        "input": {
          "bottomLine": "rgba(255, 255, 255, 0.7)",
          "helperText": "rgba(255, 255, 255, 0.7)",
          "labelText": "rgba(255, 255, 255, 0.7)",
          "inputText": "rgba(255, 255, 255, 1)",
          "disabled": "rgba(255, 255, 255, 0.5)"
        },
        "action": {
          "active": "rgba(255, 255, 255, 1)",
          "disabled": "rgba(255, 255, 255, 0.3)"
        },
        "background": {
          "default": "#303030",
          "paper": "#424242",
          "appBar": "#212121",
          "contentFrame": "#212121"
        },
        "line": {
          "stepper": "#bdbdbd"
        }
      },
      "light": {
        "text": {
          "primary": "rgba(0, 0, 0, 0.87)",
          "secondary": "rgba(0, 0, 0, 0.54)",
          "disabled": "rgba(0, 0, 0, 0.38)",
          "hint": "rgba(0, 0, 0, 0.38)",
          "icon": "rgba(0, 0, 0, 0.38)",
          "divider": "rgba(0, 0, 0, 0.12)",
          "lightDivider": "rgba(0, 0, 0, 0.075)"
        },
        "input": {
          "bottomLine": "rgba(0, 0, 0, 0.42)",
          "helperText": "rgba(0, 0, 0, 0.54)",
          "labelText": "rgba(0, 0, 0, 0.54)",
          "inputText": "rgba(0, 0, 0, 0.87)",
          "disabled": "rgba(0, 0, 0, 0.42)"
        },
        "action": {
          "active": "rgba(0, 0, 0, 0.54)",
          "disabled": "rgba(0, 0, 0, 0.26)"
        },
        "background": {
          "default": "#fafafa",
          "paper": "#fff",
          "appBar": "#f5f5f5",
          "contentFrame": "#eeeeee"
        },
        "line": {
          "stepper": "#bdbdbd"
        }
      }
    },
    "text": {
      "primary": "rgba(0, 0, 0, 0.87)",
      "secondary": "rgba(0, 0, 0, 0.54)",
      "disabled": "rgba(0, 0, 0, 0.38)",
      "hint": "rgba(0, 0, 0, 0.38)",
      "icon": "rgba(0, 0, 0, 0.38)",
      "divider": "rgba(0, 0, 0, 0.12)",
      "lightDivider": "rgba(0, 0, 0, 0.075)"
    },
    "input": {
      "bottomLine": "rgba(0, 0, 0, 0.42)",
      "helperText": "rgba(0, 0, 0, 0.54)",
      "labelText": "rgba(0, 0, 0, 0.54)",
      "inputText": "rgba(0, 0, 0, 0.87)",
      "disabled": "rgba(0, 0, 0, 0.42)"
    },
    "action": {
      "active": "rgba(0, 0, 0, 0.54)",
      "disabled": "rgba(0, 0, 0, 0.26)"
    },
    "background": {
      "default": "#fafafa",
      "paper": "#fff",
      "appBar": "#f5f5f5",
      "contentFrame": "#eeeeee"
    },
    "line": {
      "stepper": "#bdbdbd"
    }
  },
  typography: {
    fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    display4: {
      fontSize: "7rem",
      fontWeight: 300,
      fontFamily: "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      letterSpacing: "-.04em",
      lineHeight: "1.14286em",
      marginLeft: "-.06em",
      color: "rgba(0, 0, 0, 0.54)"
    },
    // equal to headline
    h2:{
      fontSize: "1.5rem",
      fontWeight: 400,
      fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
      lineHeight: "1.35417em",
      color: "rgba(0, 0, 0, 0.87)"
    },
    h3: {
      fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
      fontSize: "2.125rem",
      fontWeight: 700,
      color: "rgba(0, 0, 0, 0.54)",
      lineHeight: "1.20588em",
      marginLeft: "-.04em"
    },
    h4: {
      fontSize: "1.3125rem",
      fontWeight: 500,
      fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
      lineHeight: "1.16667em",
      color: "rgba(0, 0, 0, 0.87)"
    },
    "display3": {
      "fontSize": "3.5rem",
      "fontWeight": 400,
      "fontFamily": "\"Inknut Antiqua\",\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      "letterSpacing": "-.02em",
      "lineHeight": "1.30357em",
      "marginLeft": "-.04em",
      "color": "rgba(0, 0, 0, 0.54)"
    },
    "display2": {
      "fontSize": "2.8125rem",
      "fontWeight": 400,
      "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      "lineHeight": "1.06667em",
      "marginLeft": "-.04em",
      "color": "rgba(0, 0, 0, 0.54)"
    },
    "display1": {
      "fontSize": "2.125rem",
      "fontWeight": 700,
      "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      "lineHeight": "1.20588em",
      "marginLeft": "-.04em",
      "color": "rgba(0, 0, 0, 0.54)"
    },
    
    headline: {
      fontSize: "1.5rem",
      fontWeight: 400,
      fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
      lineHeight: "1.35417em",
      color: "rgba(0, 0, 0, 0.87)"
    },
    "title": {
      "fontSize": "1.3125rem",
      "fontWeight": 500,
      "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      "lineHeight": "1.16667em",
      "color": "rgba(0, 0, 0, 0.87)"
    },
    "subheading": {
      "fontSize": "1rem",
      "fontWeight": 400,
      "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      "lineHeight": "1.5em",
      "color": "rgba(0, 0, 0, 0.87)"
    },
    "body2": {
      "fontSize": "0.875rem",
      "fontWeight": 500,
      "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      "lineHeight": "1.71429em",
      "color": "rgba(0, 0, 0, 0.87)"
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
      fontFamily: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
      lineHeight: "1.5em",
      color: "rgba(0, 0, 0, 0.87)"
    },
    "caption": {
      "fontSize": "0.75rem",
      "fontWeight": 400,
      "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif",
      "lineHeight": "1.375em",
      "color": "rgba(0, 0, 0, 0.54)"
    },
    "button": {
      "fontSize": "0.875rem",
      "textTransform": "uppercase",
      "fontWeight": 500,
      "fontFamily": "\"Roboto\", \"Helvetica\", \"Arial\", sans-serif"
    }
  },
  "mixins": {
    "toolbar": {
      "minHeight": 56,
      "@media (min-width:1px) and (orientation: landscape)": {
        "minHeight": 48
      },
      "@media (min-width:600px)": {
        "minHeight": 64
      }
    }
  },
  "breakpoints": {
    "keys": [
      "xs", "sm", "md", "lg", "xl"
    ],
    "values": {
      "xs": 1,
      "sm": 600,
      "md": 960,
      "lg": 1280,
      "xl": 1920
    }
  },
  "shadows": [
    "none",
    "0px 1px 3px 0px rgba(0, 0, 0, 0.2),0px 1px 1px 0px rgba(0, 0, 0, 0.14),0px 2px 1px -1px rgba(0, 0, 0, 0.12)",
    "0px 1px 5px 0px rgba(0, 0, 0, 0.2),0px 2px 2px 0px rgba(0, 0, 0, 0.14),0px 3px 1px -2px rgba(0, 0, 0, 0.12)",
    "0px 1px 8px 0px rgba(0, 0, 0, 0.2),0px 3px 4px 0px rgba(0, 0, 0, 0.14),0px 3px 3px -2px rgba(0, 0, 0, 0.12)",
    "0px 2px 4px -1px rgba(0, 0, 0, 0.2),0px 4px 5px 0px rgba(0, 0, 0, 0.14),0px 1px 10px 0px rgba(0, 0, 0, 0.12)",
    "0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 5px 8px 0px rgba(0, 0, 0, 0.14),0px 1px 14px 0px rgba(0, 0, 0, 0.12)",
    "0px 3px 5px -1px rgba(0, 0, 0, 0.2),0px 6px 10px 0px rgba(0, 0, 0, 0.14),0px 1px 18px 0px rgba(0, 0, 0, 0.12)",
    "0px 4px 5px -2px rgba(0, 0, 0, 0.2),0px 7px 10px 1px rgba(0, 0, 0, 0.14),0px 2px 16px 1px rgba(0, 0, 0, 0.12)",
    "0px 5px 5px -3px rgba(0, 0, 0, 0.2),0px 8px 10px 1px rgba(0, 0, 0, 0.14),0px 3px 14px 2px rgba(0, 0, 0, 0.12)",
    "0px 5px 6px -3px rgba(0, 0, 0, 0.2),0px 9px 12px 1px rgba(0, 0, 0, 0.14),0px 3px 16px 2px rgba(0, 0, 0, 0.12)",
    "0px 6px 6px -3px rgba(0, 0, 0, 0.2),0px 10px 14px 1px rgba(0, 0, 0, 0.14),0px 4px 18px 3px rgba(0, 0, 0, 0.12)",
    "0px 6px 7px -4px rgba(0, 0, 0, 0.2),0px 11px 15px 1px rgba(0, 0, 0, 0.14),0px 4px 20px 3px rgba(0, 0, 0, 0.12)",
    "0px 7px 8px -4px rgba(0, 0, 0, 0.2),0px 12px 17px 2px rgba(0, 0, 0, 0.14),0px 5px 22px 4px rgba(0, 0, 0, 0.12)",
    "0px 7px 8px -4px rgba(0, 0, 0, 0.2),0px 13px 19px 2px rgba(0, 0, 0, 0.14),0px 5px 24px 4px rgba(0, 0, 0, 0.12)",
    "0px 7px 9px -4px rgba(0, 0, 0, 0.2),0px 14px 21px 2px rgba(0, 0, 0, 0.14),0px 5px 26px 4px rgba(0, 0, 0, 0.12)",
    "0px 8px 9px -5px rgba(0, 0, 0, 0.2),0px 15px 22px 2px rgba(0, 0, 0, 0.14),0px 6px 28px 5px rgba(0, 0, 0, 0.12)",
    "0px 8px 10px -5px rgba(0, 0, 0, 0.2),0px 16px 24px 2px rgba(0, 0, 0, 0.14),0px 6px 30px 5px rgba(0, 0, 0, 0.12)",
    "0px 8px 11px -5px rgba(0, 0, 0, 0.2),0px 17px 26px 2px rgba(0, 0, 0, 0.14),0px 6px 32px 5px rgba(0, 0, 0, 0.12)",
    "0px 9px 11px -5px rgba(0, 0, 0, 0.2),0px 18px 28px 2px rgba(0, 0, 0, 0.14),0px 7px 34px 6px rgba(0, 0, 0, 0.12)",
    "0px 9px 12px -6px rgba(0, 0, 0, 0.2),0px 19px 29px 2px rgba(0, 0, 0, 0.14),0px 7px 36px 6px rgba(0, 0, 0, 0.12)",
    "0px 10px 13px -6px rgba(0, 0, 0, 0.2),0px 20px 31px 3px rgba(0, 0, 0, 0.14),0px 8px 38px 7px rgba(0, 0, 0, 0.12)",
    "0px 10px 13px -6px rgba(0, 0, 0, 0.2),0px 21px 33px 3px rgba(0, 0, 0, 0.14),0px 8px 40px 7px rgba(0, 0, 0, 0.12)",
    "0px 10px 14px -6px rgba(0, 0, 0, 0.2),0px 22px 35px 3px rgba(0, 0, 0, 0.14),0px 8px 42px 7px rgba(0, 0, 0, 0.12)",
    "0px 11px 14px -7px rgba(0, 0, 0, 0.2),0px 23px 36px 3px rgba(0, 0, 0, 0.14),0px 9px 44px 8px rgba(0, 0, 0, 0.12)",
    "0px 11px 15px -7px rgba(0, 0, 0, 0.2),0px 24px 38px 3px rgba(0, 0, 0, 0.14),0px 9px 46px 8px rgba(0, 0, 0, 0.12)"
  ],
  "transitions": {
    "easing": {
      "easeInOut": "cubic-bezier(0.4, 0, 0.2, 1)",
      "easeOut": "cubic-bezier(0.0, 0, 0.2, 1)",
      "easeIn": "cubic-bezier(0.4, 0, 1, 1)",
      "sharp": "cubic-bezier(0.4, 0, 0.6, 1)"
    },
    "duration": {
      "shortest": 150,
      "shorter": 200,
      "short": 250,
      "standard": 300,
      "complex": 375,
      "enteringScreen": 225,
      "leavingScreen": 195
    }
  },
  spacing:8,
  // spacing: [0, 8, 16, 24, 32, 40, 48, 56, 64, 72],
  // spacing: {
  //   "unit": 8
  // },
  "zIndex": {
    "mobileStepper": 900,
    "menu": 1000,
    "appBar": 1100,
    "drawerOverlay": 1200,
    "navDrawer": 1300,
    "dialogOverlay": 1400,
    "dialog": 1500,
    "layer": 2000,
    "popover": 2100,
    "snackbar": 2900,
    "tooltip": 3000
  }
});
