import 'react-credit-cards/es/styles-compiled.css';
import moment from 'moment-timezone';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles, Collapse, List, ListItem, ListItemText, Typography, CircularProgress} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';
import PropTypes from 'prop-types';
import {makeGetSelectedUserGantnerLogs} from '../selectors';
import * as Actions from '../actions';

const styles = theme => ({
  title: {
  },
  margin: {
    marginRight: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
});

class UserGantner extends React.Component {

  state = {
    open: this.props.isOpen? this.props.isOpen:false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps || this.state !== nextState) {
      return true;
    }
    return false;
  }

  handleOpen = () => {
    this.setState({
      open: !this.state.open,
    });

  };

  subHeadingText(theText, theStyle = {padding:6}){
    return(
      <Typography type="subheading" component="p" gutterBottom color="primary" style={theStyle}>
        {theText}
      </Typography>
    )
  }
  
  checkInLocation = (deviceId) => {
    var location = null; 
    if (deviceId === 'App - Registration' || deviceId === 'App - Manual' || deviceId === 'Check In'){
      location = 'TTDI';
    }
    else if (deviceId === 'App - Registration (KLCC)' || deviceId === 'App - Manual (KLCC)' || deviceId === 'Check In - KLCC'){
      location = 'KLCC'
    }
    return location
  }

  render() {
    // const {
    //   userId
    // } = this.props;

    // console.log('selectedUserGanterLogsUID: ', userId);
    var userVisitItems = [];
    // let selectedUserLastVisit = null;

    const selectedUserGanterLogs = this.props.selectedUserGanterLogs ? this.props.selectedUserGanterLogs.sort((a, b) => {
      const nameA = a.get('createdAt');
      const nameB = b.get('createdAt');
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    }) : null;

    // console.log('selectedUserGanterLogs: ', selectedUserGanterLogs);

    if (selectedUserGanterLogs && selectedUserGanterLogs.size > 0) {
        // const selectedUserLastVisitDate = selectedUserGanterLogs && selectedUserGanterLogs.last().get('createdAt') ? Actions.getTheDate(selectedUserGanterLogs.last().get('createdAt')) : null;
        // if (selectedUserLastVisitDate) {
        //   selectedUserLastVisit = moment(selectedUserLastVisitDate).format('Do MMM YYYY')
        // }

        var previousCheckinMoment = null;
        selectedUserGanterLogs.toKeyedSeq().forEach((v, k) => {
          const createdAt = v.get('createdAt') ? Actions.getTheDate(v.get('createdAt')) : null;
          const deviceId = v.get('deviceId')||null;
          // console.log('deviceId: ', deviceId);
          const memberLocation = this.checkInLocation(deviceId);
          // console.log('memberLocation: ', memberLocation);

          const createdAtMoment = createdAt && moment(createdAt);
          if (createdAtMoment) {
            if (previousCheckinMoment && previousCheckinMoment.isSame(createdAtMoment, 'day')) {
              //check out
              userVisitItems.pop();
              userVisitItems.push(
                <ListItem divider button key={k} >
                  <ListItemText primary={`${createdAtMoment.format('D MMM YYYY')} (${memberLocation})`} secondary={`${previousCheckinMoment.format('h:mm A')} - ${createdAtMoment.format('h:mm A')} (${deviceId})`} />
                </ListItem>
              );
              previousCheckinMoment = null;

            } else {
              //check in
              previousCheckinMoment = createdAtMoment;
              userVisitItems.push(
                <ListItem divider button key={k} >
                  <ListItemText primary={`${createdAtMoment.format('D MMM YYYY')} (${memberLocation})`} secondary={`${createdAtMoment.format('h:mm A')} (${deviceId})`} />
                </ListItem>
              );
            }
          }
        });
        if (userVisitItems.length > 1) {
          userVisitItems.reverse();
        }
      }


      return(
        <List component="div">
          <div 
            style={{flexDirection:'row', display:'flex', alignItems:'center', justifyContent:'space-between', cursor: 'pointer'}}
            // onClick={this.handleOpen}
          >
          {(selectedUserGanterLogs && selectedUserGanterLogs.size > 0) && 
          <List>
              <ListItem button onClick={this.handleOpen}>
                  <ListItemText primary={`Visits (${userVisitItems.length})`} />
                  {this.state.open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </ListItem>
              <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {userVisitItems}
                  </List>
              </Collapse>
          </List>}
          {!selectedUserGanterLogs && this.state.open && <CircularProgress style={{margin:'auto', display:'block', marginTop:16, marginBottom:16, height:120, width:120}}/>}
        </div>
      </List>
      )
    //}
  }
}

UserGantner.propTypes = {
  classes: PropTypes.object.isRequired,
};

UserGantner.defaultProps = {
  open: false,
  title: "No title",
  items: [],
  type: 'none',
  headerBackgroundColor: '#062845'
}

const UserGantnerStyled = withStyles(styles)(UserGantner);

const makeMapStateToProps = () => {
  const getSelectedUserGantnerLogs = makeGetSelectedUserGantnerLogs();
  const mapStateToProps = (state, props) => {
    return {
      selectedUserGanterLogs: getSelectedUserGantnerLogs(state, props),
    }
  }
  return mapStateToProps
}
function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}
export default connect(makeMapStateToProps, mapDispatchToProps)(UserGantnerStyled)
