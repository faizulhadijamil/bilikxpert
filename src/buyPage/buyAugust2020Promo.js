
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
  import ArrowBackIcon from '@material-ui/icons/ArrowBack';
  import Card, {
    CardContent,
    CardMedia
  } from 'material-ui/Card';
  import Grid from 'material-ui/Grid';
  import React from 'react';
  import Snackbar from 'material-ui/Snackbar';
  import TextField from 'material-ui/TextField';
  import Typography from 'material-ui/Typography';
  import {FormGroup, FormControlLabel} from 'material-ui/Form';
  import Checkbox from 'material-ui/Checkbox';
  import AddIcon from '@material-ui/icons/Add';
  import RemoveIcon from '@material-ui/icons/Remove';
  import moment from 'moment';
  import BabelLogo from '../BabelLogo';
  import {FormControl} from 'material-ui/Form';
  import Select from 'material-ui/Select';
  import {MenuItem} from 'material-ui/Menu';
  
  import PropTypes from 'prop-types';
  
  import {
    getVendProducts,
    makeGetStaff
  } from '../selectors';
  import * as Actions from '../actions';

  // import ReactPixel from 'react-facebook-pixel';

  import * as firebase from 'firebase';
  import 'firebase/firestore';
  
const backgroundImg = 'gs://babel-2c378.appspot.com/virtualTrainer/vt.png';
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

  const vBuyAug2020Single = '83d318ff-64ab-3cc8-9ba4-98f740bc48f2'; // need to change
  const vBuyAug2020AllAccess = '211aad2d-0a2a-fdc7-d79a-7eabc28d5994'; // need to change

  class buyAugust2020Promo extends React.Component {
  
    state = {
      email: '',
      name: '',
      phone: '',
      icnumber: '',
      className: '',
      classDate: '',
      dialogOpen: false,
      checked:false,
      refSource: null,
      mcId: null,

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

    }
  
    componentWillUnmount() {
        // window.removeEventListener('scroll', this.handleScroll);
    }

    shouldComponentUpdate(nextProps, nextState) {
      if (this.props !== nextProps || this.state !== nextState) {
        return true;
      }
      return false;
    }
  
    handleScroll = () => {lastScrollY = window.scrollY}

    handleChange = name => event => {
      var updatedState = {};
      var value = event.target.value;
      if(name === 'quantity' && value < 1){
        value = 1;
      }else if(name === 'checked'){
        value = event.target.checked;
      }
      // else if (name === 'checkedPromo'){
      //   value = event.target.checked;
      //   //console.log('thecheckedValue: ', value);
      // }
      updatedState[name] = value;
      this.setState({ ...updatedState
      });
    }
  
    handlePress = (text = null) => {
        // this.props.actions.buyVT(text);
        if(text === 'KLCC') this.setState({showKLCC:true, showTTDI:false, showSelection:false})
        else if (text === 'TTDI') this.setState({showKLCC:false, showTTDI:true, showSelection:false});

        this.scrollTo(900);
    }

    scrollTo(number){
        window.scrollTo({
            top: number,
            behavior: "smooth"
        });
    }

    render() {
      const {classes} = this.props;

      return (
        <div className={classes.container}>
            <Card className={classes.content} elevation={0}>
            <CardMedia
                className={classes.media}
                image={require('../assets/babel-icon-blue.png')}
                title="Babel - Inspire. Change"
            />
            <div>   
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <Typography type="display1" component="h1" color='primary' style={{textAlign:'center', marginTop:70, marginBottom:16}}>
                            MERDEKA 
                        </Typography>
                    </Grid>
                    <Grid item xs={12} style = {{justifyContent:'center', alignItems:'center'}}>
                        <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                            <img src ={require("../assets/63promomerdeka.png")} alt="logo" style={{width:300, height:230}} />
                        </div>
                    </Grid>
                </Grid>
               
            
                <Grid container spacing={24}>

                    <Grid item xs={12} sm={12} lg={12}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                      <Button raised color='primary' key={'allAccessKlcc'} classes={{raisedPrimary:classes.buttonLarge, disabled:classes.buttonDisabled}} onClick={()=>this.props.actions.viewVendItem(vBuyAug2020AllAccess)}>All Access</Button>
                    </div>
                    <Typography type="subheading" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                      {`Membership access to KLCC & TTDI`}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={12} lg={12}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
                      <Button raised color='primary' key={'singleTTDI'} classes={{raisedPrimary:classes.buttonLarge, disabled:classes.buttonDisabled}} style = {{backgroundColor: "#FFF"}} onClick={()=>this.props.actions.viewVendItem(vBuyAug2020Single)}>Single Access</Button>
                    </div>
                    <Typography type="subheading" component="h1" color="primary" style={{textAlign:'center', marginTop:0, marginBottom:0}}>
                        Membership access to TTDI only
                    </Typography>
                  </Grid>

                </Grid>
            </div>
            </Card>
        
          
            <BabelLogo hideLogo={true}/>
           
        
        </div>

      );
    }
  }
  
  buyAugust2020Promo.propTypes = {
    classes: PropTypes.object.isRequired,
  };

  const buyAugust2020PromoStyled = withStyles(styles)(buyAugust2020Promo);
  
  // const mapStateToProps = (state, ownProps) => ({
  //   ...state
  // });
  
  const makeMapStateToProps = () => {
    const mapStateToProps = (state, props) => {
      const getStaff = makeGetStaff();
      return {
        isAddingInvoice: state && state.state && state.state.get('isAddingInvoice') ? true : false,
        vendProducts: getVendProducts(state, props),
        // staff: getStaff(state, props),
      }
    }
    return mapStateToProps
  }
  
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(buyAugust2020PromoStyled)
  