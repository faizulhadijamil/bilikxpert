import './App.css';

import {
  bindActionCreators
} from 'redux';
import {
  connect
} from 'react-redux';
import {
  withStyles
} from '@material-ui/core';
import React, {
  Component
} from 'react';
import moment from 'moment';

import PropTypes from 'prop-types';

import * as Actions from './actions';
import MenuAppBar from './MenuAppBar';
import PersonCard from './PersonCard';
import BabelLogo from './BabelLogo';

// import PersonCard from './PersonCard'

const styles = theme => ({
  root: {
    flexGrow: 1,
    marginTop: theme.spacing(10)
  },
  paper: {
    padding: 16,
    textAlign: 'center',
    color: theme.palette.text.secondary
  },
  card: {
    // width:'auto'
  },
  media: {
    minHeight: 336,
    backgroundColor: 'rgba(6,40,69,0.62)'
  },
  gridList: {
    minWidth: 280,
    alignSelf: 'center',
    height: 'auto',
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: theme.spacing(10),
    // flexWrap: 'nowrap',
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    // transform: 'translateZ(0)',
  },
  subtitle: {
    paddingBottom: theme.spacing(2),
    fontSize: 15,
    lineHeight: '18px',
    fontWeight: 300
  },
  title: {
    paddingTop: theme.spacing(2),
    fontSize: 19,
    lineHeight: '22px',
    fontWeight: 700
  },
  button: {
    margin: theme.spacing(1),
    color: theme.palette.text.primary
  },
  leftIcon: {
    marginRight: theme.spacing(1),
  },
  rightIcon: {
    marginLeft: theme.spacing(1),
  },
  bookButton: {
    margin: theme.spacing(2),
    backgroundColor: "#fde298",
    color: '#fff',
  },
  addButton: {
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: 0,
    backgroundColor: "#fde298",
    color: '#fff',
  },
  adminButton: {
    margin: theme.spacing(0.5),
    backgroundColor: "#fde298",
    color: '#fff',
    // alignSelf: 'flex-end'
  },
  roundButton: {
    width: 44,
    height: 44,
    margin: 0,
    padding: 0,
    borderRadius: '50%',
    minWidth: 0,
    color: '#fff',
    backgroundColor: '#fff',
    '&:hover': {
      background: theme.palette.primary['50']
    },
  },
  content: {
    maxWidth: 600,
    marginRight: 'auto',
    marginLeft: 'auto',
    marginBottom: 56
  },
  bottomBar: {
    width: '100%',
    maxWidth: 600,
    marginRight: 'auto',
    marginLeft: 'auto',
    zIndex: 1200,
    minHeight: 56,
    position: 'fixed',
    backgroundColor: '#fff',
    // bottom: 56,
    right: 0,
    left: 0,
    boxShadow: '0px 4px 5px 0px rgba(0, 0, 0, 0.14), 0px 1px 10px 0px rgba(0, 0, 0, 0.12)'
  },
  bottomRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    display: 'flex',
  },
  bottomRowCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  chevron: {
    color: '#fde298',
    fontSize: 64,
  },
  disabled: {
    color: '#fde298',
    opacity: 0.3
  },
  snack: {
    color: '#fde298'
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flex: 1,
    alignItems: 'center',
    padding: 0,
    display: 'flex',
    minHeight: 0
  },
  textField: {
  },
  fileInput: {
    display: 'none'
  },
  fileLabel: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
});

class Person extends Component {

  state = {
    editDialogOpen: false,
    editUserId: null,
    editUserData: {}
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps || this.state !== nextState) {
      return true;
    }
    return false;
  }

  handleEdit = (userId) => {
    // console.log(userId);
    this.setState({
      editDialogOpen: true,
      editUserId: userId
    });
  };

  handleClose = () => {
    this.setState({
      editDialogOpen: false,
      editUserId: null,
      editUserData: {}
    });
    this.props.actions.removeCardToRegister();
  };

  componentDidMount() {
    window.scrollTo(0, 0)
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
    // this.setState({
    //   [name]: event.target.value,
    // });
  }

  handleAutosuggest = (name, value) => {
    var editUserData = this.state.editUserData;
    editUserData[name] = value;
    this.setState({
      editUserData: { ...editUserData
      }
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
    this.props.actions.getCardToRegister(this.state.editUserId);
  }

  cancelRegisterCard = () => {
    this.props.actions.removeCardToRegister();
  }

  render() {

    const {
      classes,
      state
    } = this.props;

    const userId = this.props.match.params.userId;

    return (

      <div>
        <MenuAppBar/>
        <div style={{maxWidth:336, marginLeft:'auto', marginRight:'auto', paddingTop:32}}>
          <PersonCard userId={userId} elevation={0} addHidden={true}/>
        </div>
        <BabelLogo/>
      </div>
    );
  }
}

// <IntegrationAutosuggest selections='trainers' placeholder='Trainer' onSelectionChange={selectedUserId => this.handleAutosuggest('trainerId', selectedUserId)}/>

Person.propTypes = {
  classes: PropTypes.object.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  // ...state
});

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

const PersonStyled = withStyles(styles)(Person);

export default connect(mapStateToProps, mapDispatchToProps)(PersonStyled)