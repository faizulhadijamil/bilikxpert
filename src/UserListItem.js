import {ListItem, ListItemText, ListItemSecondaryAction, Button, Avatar} from '@material-ui/core';
import {withStyles} from '@material-ui/core';
import Moment from 'react-moment';
import React from 'react';

import PropTypes from 'prop-types';

const styles = theme => ({
  button: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(2),
    backgroundColor: "#fde298",
    color: '#062845',
    minWidth: 0
  }
});

class UserListItem extends React.Component {

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps) {
      return true;
    }
    return false;
  }

  render() {
    const {
      primaryText,
      secondaryText,
      avatarImage,
      avatarName,
      avatarRoomNumber,
      id,
      selectAction,
      viewAction,
      backgroundColor,
      type,
      classes
    } = this.props;

    var avatar; // = <PersonIcon />
    avatar = (<Avatar style={{width:44, height:44, marginRight:15, backgroundColor:'#062845', color:'white'}}> {avatarRoomNumber} </Avatar>)
    // if (avatarImage) {
    //   avatar = (<Avatar style={{width:44, height:44, marginRight:15}} src={avatarImage} />);
    // } else {

    //   avatar = (<Avatar style={{width:44, height:44, marginRight:15}}>{avatarName}</Avatar>);
    // }

    // console.log('render', viewAction);

    return (
      <ListItem style={{backgroundColor:backgroundColor}} button key={id} onClick={()=>selectAction(id)} >
        {avatar}
        {(secondaryText && typeof secondaryText.getMonth !== 'function') &&
          <ListItemText primary={primaryText} secondary={secondaryText}/>
        }
        {(secondaryText && typeof secondaryText.getMonth === 'function') &&
          <ListItemText primary={primaryText} secondary={<Moment fromNow>{secondaryText}</Moment>}/>
        }
        {!secondaryText &&
          <ListItemText primary={primaryText}/>
        }
        {type === 'trainers' &&
          <ListItemSecondaryAction>
            <Button className={classes.button} raised onClick={()=>viewAction(id)}>
              Book
            </Button>
          </ListItemSecondaryAction>
        }
      </ListItem>
    );
  }
}

UserListItem.propTypes = {
  classes: PropTypes.object.isRequired,
};

UserListItem.defaultProps = {

}

export default withStyles(styles)(UserListItem);
