import {
  CircularProgress
} from 'material-ui/Progress';
import {
  InputAdornment
} from 'material-ui/Input';
import {
  bindActionCreators
} from 'redux';
import {
  connect
} from 'react-redux';
import {
  withStyles
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Avatar from 'material-ui/Avatar';
import Button from 'material-ui/Button';
import List, {
  ListItem,
  ListItemText
} from 'material-ui/List';
import PersonIcon from '@material-ui/icons/Person';
import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import TextField from 'material-ui/TextField';
import Typography from 'material-ui/Typography';
import moment from 'moment';

import PropTypes from 'prop-types';

import * as Actions from './actions';
import MenuAppBar from './MenuAppBar';

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

class Settings extends React.Component {

  state = {
    editDialogOpen: false,
    editUserId: null,
    editUserData: {}
  }

  componentDidMount() {
    window.scrollTo(0, 0)
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

  render() {
    const {
      classes
    } = this.props;

    const user = this.props.state && this.props.state.has('user') && this.props.state.hasIn(['user', 'id']) ? this.props.state.get('user') : null;
    const roles = user && user.get('roles');
    const isAdmin = roles && roles.get('admin') === true;
    const isMC = roles && roles.get('mc') === true;

    const searchText = this.state.search && this.state.search.length > 0 ? this.state.search.toLowerCase() : null;

    const packages = this.props.state && this.props.state.hasIn(['packages', 'packagesById']) ? this.props.state.getIn(['packages', 'packagesById']) : null;
    var packageOptions = [];
    if ((isAdmin || isMC) && packages) {
      packages.sort((a, b) => {
        const nameA = a.get('name');
        const nameB = b.get('name');
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        if (nameA === nameB) {
          return 0;
        }
        return 0;
      }).toOrderedMap().mapEntries(([key, value]) => {
        // console.log(key, value);
        const monthlyFee = value.get('monthlyFee');
        const prepaidAmount = value.get('prepaidAmount');
        var display;
        if (prepaidAmount && parseInt(prepaidAmount) > 0) {
          display = `${value.get('name')} - RM ${prepaidAmount} Prepaid`;
        } else {
          display = `${value.get('name')} - RM ${monthlyFee} Monthly`;
        }
        packageOptions.push(
          <option key={key} value={key}>
            {display}
          </option>
        );
      });

      packageOptions.splice(0, 0,
        <option key={'nullOption'} value={''}>
        </option>);
    }

    var packageItems = [];
    packages && packages.toKeyedSeq().forEach((v, k) => {
      // if (items >= this.state.itemsToLoad) {
      //   return;
      // }
      const name = v.has('name') ? v.get('name') : null;
      // const email = v.has('email') ? v.get('email') : null;
      // const membershipId = v.has('nric') && v.get('nric') ? v.get('nric') : (v.has('passport') && v.get('passport') ? v.get('passport') : null);
      // const image = v.has('image') ? v.get('image') : null;

      if (!searchText || name.toLowerCase().indexOf(searchText) !== -1) {

        var avatar = <PersonIcon />
        if ((name && name.length > 0)) {
          avatar = (<Avatar style={{width:44, height:44}}>{name.charAt(0).toUpperCase()}</Avatar>);
        }
        packageItems.push(
          <ListItem button key={k} onClick={()=>console.log('click')}>
          {avatar}
          <ListItemText primary={name} />
        </ListItem>
        );

        // items = items + 1;
      }
    });


    return (
      <div className={classes.container}>
        <MenuAppBar />
        <List className={classes.content} subheader={<div />}>
        {(packages && packages.count() === 0) &&
          <CircularProgress style={{margin:'auto', display:'block', marginTop:120, height:120, width:120}}/>
        }
        <TextField
          id="search"
          label={"Search Packages"}
          fullWidth
          onChange={this.handleSearch('search')}
          style={{marginBottom:32}}
          InputProps={{
            endAdornment:(
              <InputAdornment style={{marginTop:0}} position="end"><SearchIcon color='disabled'/></InputAdornment>
            )
          }}
        />
        {(isAdmin || isMC) && packages && packages.count() > 0 &&
          <div className={classes.listSection}>
          <Typography type="title" className={classes.title}>
            Packages
          </Typography>
          {packageItems}
          </div>
        }
        </List>
        {(isAdmin || isMC) &&
          <Button fab className={classes.fab} color='primary' onClick={()=>this.handleEdit()}>
            <AddIcon/>
          </Button>
        }
      </div>
    );
  }

}

// <FormGroup>
// <FormControlLabel
//   control={
//     <Switch
//       checked={this.state.editClassData ? this.state.editClassData.active : false}
//       onChange={(event, checked) => {
//         var editClassData = this.state.editClassData;
//         editClassData.active = checked;
//         this.setState({ editClassData:{...editClassData}});
//       }}
//     />
//   }
//   label={this.state.editClassData && this.state.editClassData.active === true ? 'Active' : 'Coming Soon'}
// />
// </FormGroup>
// <TextField
//   margin="dense"
//   id="name"
//   label="Name"
//   required
//   fullWidth
//   disabled={this.state.isScheduling}
//   onChange={this.handleChange('class-name')}
//   defaultValue={classData.get('name')}
//   autoFocus={false}
// />
// <TextField
//   margin="dense"
//   id="description"
//   label="Short Description"
//   type='text'
//   multiline
//   required
//   fullWidth
//   disabled={this.state.isScheduling}
//   onChange={this.handleChange('class-description')}
//   defaultValue={classData.get('description')}
//   autoFocus={false}
// />
// <TextField
//   margin="dense"
//   id="longDescription"
//   label="Long Description"
//   type='text'
//   multiline
//   required
//   fullWidth
//   disabled={this.state.isScheduling}
//   onChange={this.handleChange('class-longDescription')}
//   defaultValue={classData.get('longDescription')}
//   autoFocus={false}
// />
// <TextField
//   margin="dense"
//   id="remarks"
//   label="Remarks"
//   type='text'
//   required
//   fullWidth
//   disabled={this.state.isScheduling}
//   onChange={this.handleChange('class-remarks')}
//   defaultValue={classData.get('remarks')}
//   autoFocus={false}
// />
// <TextField
//   margin="dense"
//   id="duration"
//   label="Duration (minutes)"
//   type="number"
//   required
//   fullWidth
//   disabled={this.state.isScheduling}
//   onChange={this.handleChange('class-duration')}
//   defaultValue={`${classData.get('duration')}`}
//   autoFocus={false}
// />
// <TextField
//   margin="dense"
//   id="capacity"
//   label="Max Capacity"
//   type='number'
//   required
//   fullWidth
//   disabled={this.state.isScheduling}
//   onChange={this.handleChange('class-maxCapacity')}
//   defaultValue={`${classData.get('maxCapacity')}`}
//   autoFocus={false}
// />
// <TextField
//   margin="dense"
//   id="venue"
//   label="Venue"
//   type='text'
//   required
//   fullWidth
//   disabled={this.state.isScheduling}
//   onChange={this.handleChange('class-venue')}
//   defaultValue={classData.get('venue')}
//   autoFocus={false}
// />
// <TextField
//   margin="dense"
//   id="slug"
//   label="URL slug (/classes/slug)"
//   type='text'
//   required
//   fullWidth
//   disabled={this.state.isScheduling}
//   onChange={this.handleChange('class-slug')}
//   defaultValue={classData.get('slug')}
//   autoFocus={false}
// />
// <TextField
//   margin="dense"
//   id="image"
//   label="Image URL"
//   type='text'
//   required
//   fullWidth
//   disabled={this.state.isScheduling}
//   onChange={this.handleChange('class-image')}
//   defaultValue={classData.get('image')}
//   autoFocus={false}
// />

// class PersonItem extends React.Component{
//   render(){
//
//   }
// }


Settings.propTypes = {
  classes: PropTypes.object.isRequired,
};

const SettingsStyled = withStyles(styles)(Settings);

const mapStateToProps = (state, ownProps) => ({
  ...state
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SettingsStyled)