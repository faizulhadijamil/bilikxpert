import React from 'react';
import Carousel from 'nuka-carousel';
import CloseIcon from '@material-ui/icons/Close';
import {IconButton, Typography, } from '@material-ui/core';

export default class extends React.Component {
  state = {
    slideIndex: 0
  };

  constructor(props) {
    super(props);
    this.state = { width: window.innerWidth || 0, height: window.innerHeight || 0, slideIndex:0 };
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
  }

componentDidMount(){
  this.updateWindowDimensions();
  window.addEventListener('resize', this.updateWindowDimensions);
}

componentWillUnmount() {
  window.removeEventListener('resize', this.updateWindowDimensions);
}

updateWindowDimensions() {
  this.setState({ width: window.innerWidth, height: window.innerHeight });
}

  render() {
    const {width, height} = this.state;

    // const Decorators = [{
    //     component: createReactClass({
    //       render() {
    //         return (
    //           <IconButton className={classNames(classes.root, this.props.currentSlide === 0 && !this.props.wrapAround && classes.disabled)} disabled={this.props.currentSlide === 0 && !this.props.wrapAround} onClick={this.handleClick}>
    //             <ChevronLeftIcon className={classes.chevron}/>
    //           </IconButton>
    //         )
    //       },
    //       handleClick(e) {
    //         e.preventDefault();
    //         this.props.previousSlide();
    //       }
    //     }),
    //     position: 'TopLeft'
    //   },
    //   {
    //     component: createReactClass({
    //       render() {
    //         return (
    //           <IconButton className={classNames(classes.root, this.props.currentSlide + this.props.slidesToScroll >= this.props.slideCount && !this.props.wrapAround && classes.disabled)} disabled={this.props.currentSlide + this.props.slidesToScroll >= this.props.slideCount && !this.props.wrapAround} onClick={this.handleClick}>
    //             <ChevronRightIcon className={classes.chevron}/>
    //           </IconButton>
    //
    //         )
    //       },
    //       handleClick(e) {
    //         e.preventDefault();
    //         this.props.nextSlide();
    //       }
    //     }),
    //     position: 'TopRight'
    //   }
    // ];

    // var Decorators = [];
    var images = [];
    Object.keys(facilities).forEach(key=>{
      images.push(
        <div key={`${images.length}`}>
          <Typography type="display3" component="h1" color="primary" style={{color:'#fff', position:'absolute', bottom:64, width:'100%', textAlign:'center', backgroundColor:'rgba(0,0,0,0.54)', padding:8}}>
            {key.replace(' 2', '')}
          </Typography>
          <img style={{width, height, objectFit: 'cover'}} src={facilities[key]} />
        </div>
      );
    })
    Object.keys(classes).forEach(key=>{
      images.push(
        <div key={`${images.length}`}>
          <Typography type="display3" component="h1" color="primary" style={{color:'#fff', position:'absolute', bottom:64, width:'100%', textAlign:'center', backgroundColor:'rgba(0,0,0,0.54)', padding:8}}>
            {key.replace(' 2', '')}
          </Typography>
          <img style={{width, height, objectFit: 'cover'}} src={classes[key]} />
        </div>
      );
    })


    return (
      <div>
      <Carousel
        initialSlideHeight={this.state.height}
        initialSlideWidth={this.state.width}
        wrapAround={true}
        autoplay={true}
        autoplayInterval={5000}
        swiping={true}
        decorators={null}
      >
        {images}





      </Carousel>
        <IconButton style={{position:'absolute', top: 8, right:4, color:'#fde298'}} onClick={()=>{
            this.props.handleClose && this.props.handleClose();
          }
        }>
          <CloseIcon style={{width:44, height:44}}/>
        </IconButton>
      </div>
    );
  }
}

const facilities = {
'Reception' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_1_Reception.jpg?alt=media&token=fed9891c-1bbd-4c60-b8c6-8344d39fabe0",
'Lounge' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_2_Lounge.jpg?alt=media&token=85e2418f-92a4-4168-ada4-c53cffc74a3f",
'Lounge 2' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_Lounge2.jpg?alt=media&token=3df00d79-8869-40fd-8300-1b337c3fc44e",
'8oz' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_4_8oz.jpg?alt=media&token=b52fdeef-1107-49bf-bb5d-73b13a277adb",
'Outdoor Lounge' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_5_OutdoorLounge.jpg?alt=media&token=e808a210-a33b-42ce-8593-6ed77afd2869",
'Gym' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_7_Gym1.jpg?alt=media&token=d21f2edd-58aa-40f2-b807-8ef9ac2088b2",
'Treadmill' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_8_Treadmill.jpg?alt=media&token=c0cc04d8-4ec2-479a-91df-e07850de870e",
'Poolside' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_9_Poolside%20copy.jpg?alt=media&token=df3db5b1-86ab-4955-bc80-92c15e0f2177",
'Poolside 2' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_10_Hanna.jpg?alt=media&token=946e9c18-85dd-4ceb-9e27-ee5fcc1ed06d",
'Zen' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_11_Zen.jpg?alt=media&token=90c26cd8-e1a7-4e76-8d9e-090c2dbe1400",
'Decor' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_12_Decor1.jpg?alt=media&token=9efadef5-6afc-4309-8274-c8f8e1259822",
'Gym 2' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_13_Gym2.jpg?alt=media&token=4315a5c0-983f-42bb-aafb-1f040180392d",
'Main Studio' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_14_MainStudio.jpg?alt=media&token=c31e14d1-fdbc-4338-b2c2-72a39023da8f",
'HIIT Room' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_15_HIIT%20Room.jpg?alt=media&token=fbc810f8-4d48-4940-adec-6764b601c481",
'Spin Room' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_16_SpinRoom.jpg?alt=media&token=7c42f928-2feb-4d72-aa0a-a959d6d4155c",
'Lockers' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_17_Lockers.jpg?alt=media&token=048dbb85-6d29-4e26-b3df-cc854961b33f",
'Vanity Area' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_18_VanityArea.jpg?alt=media&token=a71ba41b-3d37-4e41-9866-ec73b16c429d",
'Changing Room' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_Changing-Rooms.jpg?alt=media&token=14707b99-ad17-435c-add7-fa54c8d1c22a",
}

const classes = {
  'Boga' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_Boga.jpg?alt=media&token=876de544-64c5-4150-ad94-65d3069a26dd",
  'Boga Flow' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_2_BogaFlow1.jpg?alt=media&token=3dd4e58a-4555-4602-9d94-7f4e45c7b283",
  'Boga Series' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_BogaSeries.jpg?alt=media&token=182e3184-4f66-4c88-a24b-fcc07d631921",
  'Aqua Fit' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_3_AquaFit1.jpg?alt=media&token=334ca26e-7690-4dda-a925-c54f0f8366ee",
  'Animal Flow' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_4_AnimalFlow.jpg?alt=media&token=c735e876-9910-4e6d-8e12-8057599d4513",
  'Budokon' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_5_Budokon.jpg?alt=media&token=33cd9ee1-57d4-4152-b50b-926514cd3ae7",
  'Suspension' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_6_Suspension1.jpg?alt=media&token=694821b8-f52c-4aee-b0ac-3a956fab7a64",
  'RnR' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_7_RnR1.jpg?alt=media&token=96f45259-e708-45b2-b5b8-eadec1e45982",
  'Snooze Class' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_8_SnoozeClass1.jpg?alt=media&token=64f555ee-a6ff-4d13-a44c-b148ded577bc",
  'Slo Flo Yoga' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_9_SloFloYoga1.jpg?alt=media&token=2a36830c-aec9-4e9b-842a-b39108ac9f08",
  'Power Flo Yoga' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_10_PowerFloYoga1.jpg?alt=media&token=81a1fc3e-7ab4-48eb-82a2-15a1b6bca627",
  'Choreography By Mayhem' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_Choreography.jpg?alt=media&token=9b125f30-bd87-4b59-a7ad-eed0de7f3e5a",
  'Groove' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_12_Groove1.jpg?alt=media&token=4e2f3345-68d1-4157-ba9a-c1adc423a277",
  'GRIIND' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_13_GRIIND1.jpg?alt=media&token=9210ded8-06b0-4ece-ba85-d95934613518",
  'Sandbags' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_14_Sandbags1.jpg?alt=media&token=3db3fc4e-4bb0-4c94-81a9-65d6876559d4",
  'Circuit' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_15_Circuit1.jpg?alt=media&token=b84adb17-104d-4d7d-b03a-c515d50838cd",
  'HIIT' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_16_HIIT1.jpg?alt=media&token=ad16ea0c-ada9-4192-8eee-a76cab077aad",
  'Peloton' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_17_Peloton1.jpg?alt=media&token=2c1b6883-6b0a-4585-ae84-52b976a650a0",
  'Cync' : "https://firebasestorage.googleapis.com/v0/b/babel-2c378.appspot.com/o/Intro%2Fthumb_2048_18_Cync1.jpg?alt=media&token=b627430c-b4b0-4883-9431-3b8246af7892"
}
