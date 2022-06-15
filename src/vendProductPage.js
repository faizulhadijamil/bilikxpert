
  import {bindActionCreators} from 'redux';
  import {CircularProgress} from 'material-ui/Progress'
  import {List} from 'material-ui';
  import {connect} from 'react-redux';
  import {withStyles} from '@material-ui/core';

  // import Grid from 'material-ui/Grid';
  import React from 'react';
  import Button from 'material-ui/Button';
  import Typography from 'material-ui/Typography';
  
  import PropTypes from 'prop-types';
  
  import {
    makeGetCurrentUser,
  } from './selectors'
  import * as Actions from './actions';
  import BabelLogo from './BabelLogo';
  import MenuAppBar from './MenuAppBar';
  import moment from 'moment';
  import * as firebase from 'firebase';
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
  
  class vendProductPage extends React.Component {

    state = {
      selectedUserId: null,
      editData: {},
      vendProductData:null,
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

      var vendProductData = [];
      const vendRef = firebase.firestore().collection('vendProducts').where('active', '==', true);
       
        vendRef.get().then((querySnapshot) => {
            querySnapshot.forEach(doc=>{
                // console.log(doc.id, '=>', doc.data());
                vendProductData.push(doc.data());
            });
            this.setState({vendProductData:vendProductData});
        });
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
        const {vendProductData} = this.state;
        var finalData = []
        if (vendProductData.length>=1){
            console.log('vendProductData: ', vendProductData);
            vendProductData && vendProductData.forEach(data=>{
                const name = data.name||null;
                const type = data.product_type? data.product_type.name?data.product_type.name :null:null;
                const supply_price = data.supply_price||null;
                const id = data.id||null;
                const brandName = data.brand? data.brand.name? data.brand.name : null : null;
                finalData.push({
                    name, type, supply_price, id, brandName
                });
            });

            var theCSVformat = this.ConvertToCSV(finalData);
            var blob = new Blob([theCSVformat], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, "vendProductReport.csv");
        }
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
        // const {
        //     classes,
        //     users,
        //   } = this.props;
        
          const {vendProductData} = this.state;

        const vendProductListLayout = [];
        vendProductData && vendProductData.forEach((product)=>{
            const name = product.name||null;
            const type = product.product_type? product.product_type.name?product.product_type.name :null:null;
            const supply_price = product.supply_price||null;
            const id = product.id || null;
            const brandName = product.brand? product.brand.name? product.brand.name : null : null;
           
            vendProductListLayout.push(
                <div style = {{display:'flex', flexDirection:'row', marginBottom:10}}>
                    <p>{name}</p>
                    <p>{type}</p>
                    <p>{supply_price}</p>
                    <p>{id}</p>
                    <p>{brandName}</p>
                </div>
            );
        })
        
        return(
           
            <List>
                {vendProductListLayout}
            </List>
           
        )
    }

    render() {
      const {
        classes,
        users,
      } = this.props;
  
      // console.log('gantnerDataState: ', this.state.gantnerData);
      // const usersLoad = users && users.size>21? true:false;
      const enableDownloadBtn = users && users.size>21? true:false;

      const user = this.props.currentUser || null;
      const roles = user && user.get('roles');
      const isSuperVisor = roles && roles.get('superVisor') === true;

      if (isSuperVisor){
        return (
          <div className={classes.container}>
            <MenuAppBar />
             
                      <Typography component="h1" color="primary" style={{marginLeft:8, marginRight:8, color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
                          {'Vend Product ID'}   
                      </Typography>
                     
                      <Button 
                          key='generateReport' 
                          onClick={()=>this.handleGenBFMReport()}
                          disabled = {!enableDownloadBtn}
                          margin="dense"
                          >
                          {'Generate BFM Report'}
                      </Button>
                      {this.state.isLoading && this.renderLoading()}
                      <Button 
                          key='downloadReport' 
                          onClick={()=>this.handleDownloadBtn()}
                          // disabled = {!this.state.showDownloadBtn}
                          margin="dense"
                          >
                          {'Download CSV Vend Product Report'}
                      </Button>
                      {this.renderListView()}
                
              <BabelLogo />
          </div>
        );
      }
      else{
        return null
      }
    }
  }
  
  vendProductPage.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  const vendProductPageStyled = withStyles(styles)(vendProductPage);
  
  const makeMapStateToProps = () => {
    const getCurrentUser = makeGetCurrentUser();
    const mapStateToProps = (state, props) => {
      return {
        currentUser: getCurrentUser(state, props),
      }
    }
    return mapStateToProps
  }
  function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
  }
  
  export default connect(makeMapStateToProps, mapDispatchToProps)(vendProductPageStyled)