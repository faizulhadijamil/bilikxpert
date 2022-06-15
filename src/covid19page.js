import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as Actions from './actions';
import moment from 'moment';
import SmallButton from './components/CurveButton';
import {withStyles, Typography, CircularProgress} from '@material-ui/core';

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;

const styles = theme => ({
  pageStyle:{
    height:screenHeight, display:'flex', flex:1, flexDirection:'column', 
    //justifyContent:'center', 
    alignItems:'center', marginBottom:0
  },
  subheadingText:{
    marginBottom:5, marginLeft:'10%', marginRight:'10%', color:'#414141', textAlign:'center', letterSpacing:'0px', lineHeight: (screenWidth<=500)? '27px':'35px',
    fontSize: (screenWidth<=500)? '1.2rem':'1.7rem'
  },
  buttonText:{
    letterSpacing:1, fontSize:(screenWidth<=500)?'1.2rem':'1.4rem', color:'#525252', textAlign:'center'
  }
});


class covid19page extends React.Component {

  state = {
    showLoading:false,
    screenWidth:screenWidth,
    screenHeight:screenHeight,
    vaccinated:false,
    allowed:true
  };

  componentDidMount() {
    window.scrollTo(0, 0)
    // console.log('theprops: ', this.props);
    const urlPathName = this.props.location.pathname;
    const splitThePath = urlPathName && urlPathName.split('/covidform/');
    // console.log('splitThePath: ', splitThePath);
    const selectedUserId = (splitThePath.length === 2) && splitThePath[1];
    // console.log('selectedUserId: ', selectedUserId);
    // const userDetail = selectedUserId && this.props.actions.getUser(selectedUserId, response => {
    //   console.log('theresponse: ', response); 
    //   const covid19DeclarationAt = response && response.covid19DeclarationAt;
    //   const covid19Declaration = response && response.covid19Declaration;
    //   if (response){
    //     this.setState({userDetail:response, showLoading:false});
    //   }
    // });
    // console.log('theuserdetails: ', userDetail);
    // if (selectedUserId){
      
    // }
    // console.log('currentUser: ', this.props);

    this.setState({selectedUserId, showLoading:false});
  }

  handleAddCovid19 = () =>{
    console.log('selectedUserIdState: ', this.state);
    const {visitOtherGym, homeClub, CV19Agree, vaccinated} = this.state;
    console.log('vaccinated: ', vaccinated);
    
    if (!vaccinated){
      window.scrollTo({
        top: screenHeight*4,
        behavior: "smooth"
      });
    }
    else if (!visitOtherGym){
      window.scrollTo({
        top: screenHeight*5,
        behavior: "smooth"
      });
    }
    // else if (!homeClub){
    //   window.scrollTo({
    //     top: screenHeight*6,
    //     behavior: "smooth"
    //   });
    // }
    else if (!CV19Agree){
      window.scrollTo({
        top: screenHeight*6,
        behavior: "smooth"
      });
    }
    
    if (vaccinated && vaccinated === 'no'){
      window.scrollTo({
        top: screenHeight*0,
        behavior: "smooth"
      });
      this.setState({allowed:false});
    }
    else if (visitOtherGym && CV19Agree && vaccinated && vaccinated === 'yes'){
      this.setState({showLoading:true});
      this.props.actions.addCovid19ToUser(this.state.selectedUserId, vaccinated, visitOtherGym, CV19Agree);
    }

  }

  renderLoading(){
    // const {classes} = this.props;
    return( 
      <div 
        // className={classes.container}
        style= {{height:window.innerHeight}}
      >
         <CircularProgress style={{margin:'auto', display:'block', height:120, width:120, alignItems:'center', justifyContent:'center'}}/>
      </div>
      );
  }

  onStartClick = (pageNumber = 1, answer = null) => {

    // view next page
    window.scrollTo({
      top: screenHeight*pageNumber,
      behavior: "smooth"
    });
    if (pageNumber === 3){this.setState({vaccinated:answer})}
    else if (pageNumber === 4){this.setState({visitOtherGym:answer})}
    else if (pageNumber === 5){this.setState({CV19Agree:answer})}
   //  else if (pageNumber === 6){this.setState({CV19Agree:answer})}
  }

  renderPage1(){
    const {classes} = this.props;
    return(
      <div className={classes.pageStyle}
        style={{ marginBottom:0 }}>
        <img src ={require("./assets/babel-icon-blue.png")} alt="logo" style={{width:screenWidth*0.25, height:screenWidth*0.25, marginBottom:50, marginTop:150}} />
        <Typography type="display1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'#414141', textAlign:'center'}}>
          {`BABEL MEMBER DECLARATION`}
        </Typography>
        <SmallButton text = {'Start'} key = {'cv19No1'} 
            onClick={()=>this.onStartClick(1)}
            style = {{backgroundColor:'white', width:screenWidth*0.5}}
            textStyle = {{fontSize:'20px'}}
        />
      </div>
    )
  }

  renderPage2(){
    const {classes} = this.props;
    return(
      <div className={classes.pageStyle}
      style = {{justifyContent:'center'}}
      >
        <Typography type="title" component="h1" className = {classes.subheadingText} style = {{marginTop:0}}>
          {`In light of recent rising Covid-19 cases, we encourage you to fill up the following declaration form with full transparency and honesty.`}
        </Typography>
        {false && <Typography type="title" component="h1" className = {classes.subheadingText}>
          {`All information submitted is to purposefully observe and monitor the ins and outs of everyone in Babel to ensure the safety of our valued community.`}
        </Typography>}
        <SmallButton text = {'Continue'} key = {'cv19Continue1'} 
          onClick={()=>this.onStartClick(2)}
        />
      </div>
    )
  }

  renderPage3(){
    const {classes} = this.props;
    return(
      <div className={classes.pageStyle}
        style = {{justifyContent:'center'}}
      >
        <Typography type="title" component="h1" className = {classes.subheadingText} style = {{marginTop:0}}>
          {`1. Have you received 2 doses of the Covid-19 vaccination more than 14 days ago? `}
        </Typography>
        <Typography type="title" component="h1" className = {classes.subheadingText} style = {{marginTop:0}}>
          {`(Please show the Customer Relations Team your vaccination certificate)`}
        </Typography>
       
        <SmallButton text = {'Yes'} key = {'vaccinated'} 
            onClick={()=>this.onStartClick(3, 'yes')}
        />
        <SmallButton text = {'No'} key = {'notVaccinated'} 
            onClick={()=>this.onStartClick(3, 'no')}
        />
      </div>
    )
  }

  renderPage4(){
    const {classes} = this.props;
    return(
      <div className={classes.pageStyle}
        style = {{justifyContent:'center'}}
      >
        <Typography type="title" component="h1" className = {classes.subheadingText} style = {{marginTop:0}}>
          {`2. Within last 10 days, have you come into contact with/attended any of below:`}
        </Typography>
      
        <div style = {{backgroundColor:'black', padding:12, margin:'7%'}}>
          <Typography type="title" component="h1" className = {classes.subheadingText} style = {{color:'white'}}>
            {`Any other fitness class and large gathering`}
          </Typography>
          {/* <Typography type="title" component="h1" className = {classes.subheadingText} style = {{color:'white'}}>
            {`A large gathering (more than 10pax)`}
          </Typography> */}
          <Typography type="title" component="h1" className = {classes.subheadingText} style = {{color:'white'}}>
            {`Remain contact with positive case.`}
          </Typography>
        </div>
       
        <SmallButton text = {'Yes'} key = {'cv19Yes1'} 
            onClick={()=>this.onStartClick(4, 'yes')}
        />
        <SmallButton text = {'No'} key = {'cv19No1'} 
            onClick={()=>this.onStartClick(4, 'no')}
        />
      </div>
    )
  }

  // renderPage5(){
  //   const {classes} = this.props;
  //   return(
  //     <div className={classes.pageStyle}
  //       style = {{justifyContent:'center'}}
  //     >
  //        <Typography type="title" component="h1" className = {classes.subheadingText} style = {{marginTop:0}}>
  //         {`3. Choose your Home Club `}
  //       </Typography>
  //       <Typography type="title" component="h1" className = {classes.subheadingText}>
  //         {`As part of our enhanced SOPs, you will only be able to visit your designated home club for the time being.`}
  //       </Typography>
  //       <div style = {{flexDirection:'row', display:'flex'}}>
  //         {true && <div 
  //             color={'primary'} 
  //             key={'KLCCButton'} 
  //             onClick={()=>this.onStartClick(5, 'yes')} 
  //             style = {{width:'35%',  marginTop: 2,
  //             marginLeft: 2,
  //             marginRight: 2,
  //             marginBottom: 2,
  //             backgroundColor: "white",
  //             color: '#062845',
  //             borderRadius: 25,
  //             cursor: 'pointer',
  //             paddingLeft:5, paddingRight:5, paddingTop:5, paddingBottom:5,
  //             width:screenWidth*0.3,
  //             margin:10
  //           }}
  //             >
  //             <Typography type="title" component="h1" className = {classes.buttonText}>
  //                 {'KLCC'}
  //             </Typography>
  //         </div>}
  //         {true && <div 
  //             color={'primary'} 
  //             key={'TTDIButton'} 
  //             onClick={()=>this.onStartClick(5, 'no')} 
  //             style = {{width:'35%',  marginTop: 2,
  //             marginLeft: 2,
  //             marginRight: 2,
  //             marginBottom: 2,
  //             backgroundColor: "white",
  //             color: '#062845',
  //             borderRadius: 25,
  //             cursor: 'pointer',
  //             paddingLeft:5, paddingRight:5, paddingTop:5, paddingBottom:5,
  //             margin:10,
  //             width:screenWidth*0.3
  //           }}
  //           >
  //           <Typography type="title" component="h1" className = {classes.buttonText}>
  //               {'TTDI'}
  //           </Typography>
  //       </div>}

  //         {false && <SmallButton 
  //           text = {'KLCC'} key = {'KLCCHOMECLUB'} 
  //           onClick={()=>this.onStartClick(5, 'yes')}
  //           style = {{width:'35%'}}
  //         />}
  //         {false && <SmallButton text = {'TTDI'} key = {'TTDIHOMECLUB'} 
  //             onClick={()=>this.onStartClick(5, 'no')}
  //             style = {{width:'35%'}}
  //         />}
  //       </div>
       
  //     </div>
  //   )
  // }

  renderPage5(){
    const {classes} = this.props;
    return(
      <div className={classes.pageStyle}
        style = {{justifyContent:'center'}}
      >
         <Typography type="title" component="h1" className = {classes.subheadingText} style = {{marginTop:0}}>
          {`3. I hereby certify that the above information is accurate and true to the best of my knowledge. I understand that the above information is solely for the purpose of ensuring the safety of myself and those in Babel. I acknowledge that Babel has the right to refuse any individuals who have not filled up this form.`}
        </Typography>
        <div style = {{flexDirection:'row', display:'flex'}}>
          {true && <div 
              color={'primary'} 
              key={'cv19Yes1'} 
              onClick={()=>this.onStartClick(5, true)} 
              style = {{width:'35%',  marginTop: 2,
              marginLeft: 2,
              marginRight: 2,
              marginBottom: 2,
              backgroundColor: "white",
              color: '#062845',
              borderRadius: 25,
              cursor: 'pointer',
              paddingLeft:5, paddingRight:5, paddingTop:5, paddingBottom:5,
              width:screenWidth*0.3,
              margin:10
            }}
              >
              <Typography type="title" component="h1" className = {classes.buttonText}>
                  {'I Agree'}
              </Typography>
          </div>}
          {true && <div 
              color={'primary'} 
              key={'cv19No7'} 
              onClick={()=>this.onStartClick(5, false)} 
              style = {{width:'35%',  marginTop: 2,
              marginLeft: 2,
              marginRight: 2,
              marginBottom: 2,
              backgroundColor: "white",
              color: '#062845',
              borderRadius: 25,
              cursor: 'pointer',
              paddingLeft:5, paddingRight:5, paddingTop:5, paddingBottom:5,
              margin:10,
              width:screenWidth*0.3
            }}
            >
            <Typography type="title" component="h1" className = {classes.buttonText}>
                {'I Disagree'}
            </Typography>
        </div>}
        </div>
        {false && <SmallButton text = {'I Agree'} key = {'cv19Yes1'} 
            onClick={()=>this.onStartClick(5, true)}
        />}
        {false && <SmallButton text = {'I Disagree'} key = {'cv19No7'} 
            onClick={()=>this.onStartClick(5, false)}
        />}
      </div>
    )
  }

  renderPage6(){
    const {classes} = this.props;
    return(
      <div className={classes.pageStyle}
        style = {{justifyContent:'center'}}
      >
        <Typography type="title" component="h1" className = {classes.subheadingText} style = {{marginTop:0}}>
          {`Thank You for your honesty in safeguarding yourself and our community.`}
        </Typography>
        <SmallButton text = {'SUBMIT'} key = {'cv19No8'} 
            onClick={()=>{this.handleAddCovid19()}}
        />
      </div>
    )
  }

  // renderPage8(){
  //   const {classes} = this.props;
  //   return(
  //     <div className={classes.pageStyle}>
  //       <Typography type="display1" component="h1" className = {classes.subheadingText}>
  //         {`Thank You for your honesty in safeguarding yourself and our community.`}
  //       </Typography>
  //       <Typography type="display1" component="h1" className = {classes.subheadingText}>
  //         {`Enjoy Your Workout`}
  //       </Typography>
       
  //       <SmallButton text = {'SUBMIT'} key = {'cv19No8'} 
  //           onClick={()=>{this.handleAddCovid19()}}
  //       />
  //     </div>
  //   )
  // }

  render(){
      
    // const user = this.props.state.get('user');

    // console.log('user state: ', this.state);

    const {selectedUserId, screenWidth, allowed} = this.state;
    // for desktop
    // var backgroundImg = 'https://firebasestorage.googleapis.com/v0/b/babelasia-37615.appspot.com/o/cv19%2FCovid-Announcement01-04.png?alt=media&token=9d1e30da-d3f9-487c-85f7-f984a3a0f11c';
    // var backgroundImg = (screenWidth >= 500)? 'https://firebasestorage.googleapis.com/v0/b/babelasia-37615.appspot.com/o/cv19%2FCovid-Announcement01-04.png?alt=media&token=9d1e30da-d3f9-487c-85f7-f984a3a0f11c':
    // 'https://firebasestorage.googleapis.com/v0/b/babelasia-37615.appspot.com/o/cv19%2FCovid%20Announcement%20mobile%20background-04.png?alt=media&token=1048d73e-e859-48b4-b282-14445168f4ec';
    // const {userDetail} = this.state;
    // const covid19Declaration = userDetail && userDetail.covid19Declaration;
    // const covid19DeclarationAt = userDetail && userDetail.covid19DeclarationAt;

    var covid19Declaration, covid19DeclarationAt = null;

    const userDetail = selectedUserId && this.props.actions.getUser(selectedUserId, response => {
      //console.log('theresponse: ', response); 
      // const covid19DeclarationAt = response && response.covid19DeclarationAt;
      // const covid19Declaration = response && response.covid19Declaration;
      if (response){
        // this.setState({userDetail:response, showLoading:false});
        covid19DeclarationAt = response.covid19DeclarationAt;
        covid19Declaration = response.covid19Declaration;
      }
    });

    // console.log('cv19 declaration: ', covid19Declaration);

    if (this.state.showLoading){
        return (
            <div>
                {this.renderLoading()}
            </div>
        )
    }
    else if (covid19Declaration && covid19DeclarationAt && moment(Actions.getTheDate(covid19DeclarationAt)).add(14, 'days').isSameOrBefore(moment())){
      return(
        <div>
          <Typography type="display1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
              {`member already filled-in the COVID-19 form declaration`}
          </Typography>
      </div>
      )
    }
    else if (!allowed){
      return(
        <div style={{margin:0, width:'100%', height:screenHeight, display:'flex', flex:1, justifyContent:'center', flexDirection:'column', marginLeft:'auto', marginRight:'auto',
        backgroundColor:'#F1F2F2'}}>
          <Typography type="display1" component="h1" color="primary" style={{marginBottom:16, marginLeft:'auto', marginRight:'auto', color:'rgba(0, 0, 0, 0.54)', textAlign:'center'}}>
              {`Access Denied`}
          </Typography>
        </div>
      )
    }
    else{
        return (
            <div style={{margin:0, width:'100%', display:'flex', flex:1, justifyContent:'center', flexDirection:'column', marginLeft:'auto', marginRight:'auto',
              backgroundColor:'#F1F2F2'
              // backgroundColor:'#A5DAE3', 
              // backgroundImage: `url("${backgroundImg}")`, 
              // // backgroundSize: 'cover',  
              // backgroundSize:'contain',
              // backgroundRepeat: 'repeat-y',
              }}
            >
              <div style = {{width:screenWidth}}>
               
                {this.renderPage1()}
                {this.renderPage2()}
                {this.renderPage3()}
                {this.renderPage4()}
                {this.renderPage5()}
                {this.renderPage6()}
                {false && this.renderPage7()}
                {false && this.renderPage8()}

              </div>
            </div>
          );
    }
    
  }
}

const covid19pageStyled = withStyles(styles)(covid19page);

const mapStateToProps = state => ({
    ...state
});
  
function mapDispatchToProps(dispatch) {
    return {
      actions: bindActionCreators(Actions, dispatch)
    }
}
  
export default connect(mapStateToProps, mapDispatchToProps)(covid19pageStyled)