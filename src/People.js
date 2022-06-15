import {InputAdornment, Avatar, Chip, TextField, IconButton, Grid} from '@material-ui/core';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import React from 'react';
import SearchIcon from '@material-ui/icons/Search';
import PropTypes from 'prop-types';
import {makeGetCurrentUser,makeGetAllUsers} from './selectors'
import * as Actions from './actions';
import BabelLogo from './BabelLogo';
import MenuAppBar from './MenuAppBar';
import PersonCard from './PersonCard';
import UserList from './UserList';
import SearchTextInput from './components/SearchText';

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
    // marginTop: theme.spacing(10),
    // paddingBottom: theme.spacing(10),
    marginTop:10,
    paddingBottom:10,
    flexGrow: 1,
  },
  search: {
    // marginTop: 64,
    marginTop: -48,
    marginBottom: 32,
    position: 'fixed',
    // top: 64,
    backgroundColor: '#fff',
    zIndex: 1200,
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    width: '90%',
    // alignItems: 'end'
    // borderRadius: 8,
    // padding: 8
  },
  selectedUser: {
    position: 'fixed',
    zIndex: 1200
  },
  listSection: {
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
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    marginBottom: theme.spacing(2),
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
  media: {
    minHeight: 32,
    backgroundColor: 'rgba(6,40,69,0.62)'
  },
  card: {
    marginTop: theme.spacing(8),
    marginRight: theme.spacing(3),
    overflow: 'hidden',
    // position:'fixed'
    // zIndex: 1200,
    // position: 'fixed',
    // maxWidth: 300
  },
  cardSmall: {
    marginTop: theme.spacing(8),
    marginLeft: theme.spacing(2),
    maxWidth: '90%',
    // zIndex: 1200,
    // position: 'fixed'
    overflow: 'hidden'
  },
  userDetailChip: {
    marginLeft: theme.spacing(2)
  }
});

class People extends React.Component {

  state = {
    selectedUserId: null,
    search: '',
    searchDisplay: ''
  }

  // componentWillMount() {
  //   this.timer = null;
  // }

  // componentWillUnmount() {
  //   clearTimeout(this.timer);
  // }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps || this.state !== nextState) {
      return true;
    }
    return false;
  }

  handleSearch = name => event => {
    window.scrollTo(0, 0);
    this.setState({
      searchDisplay: event.target.value
    });
    clearTimeout(this.timer);
    event.persist();
    this.timer = setTimeout(() => {
      this.setState({
        search: event.target.value,
      });
    }, 250);
  }

  handleSelectPerson = (userId, viewPerson = false) => {
    const user = this.props.currentUser || null;
    // const roles = user && user.get('roles');
    // const isAdmin = roles && roles.get('admin') === true;
    // const isMC = roles && roles.get('mc') === true;
    // const isTrainer = roles && roles.get('trainer') === true;
    const roles = user && user.get('staffRole');
    const isAdmin = roles && roles === 'admin';
    const isCRO = roles && roles === 'CRO';
    const isTrainer = roles && roles === 'trainer';
    const isSuperUser = roles && roles === 'superUser';
    const isSuperVisor = roles && roles === 'supervisor';
    const isSeniorCRO = roles && roles === 'seniorCRO';
    const isShared = roles && roles === 'shared';
    if (!(isAdmin || isCRO || isTrainer || isSuperUser || isSeniorCRO || isSuperVisor)) {
      return;
    }
    this.setState({
      selectedUserId: userId
    })
    this.props.actions.getGantnerLogsByUserId(userId);
    this.props.actions.getInvoicesByUserId(userId);
    this.props.actions.getPaymentsByUserId(userId);
    const selectedUser = this.props.users.get(userId);
    const selectedUserRoles = selectedUser && selectedUser.get('roles');
    const selectedUserIsTrainer = selectedUserRoles && selectedUserRoles.get('trainer') === true;
    if(viewPerson || (window.innerWidth < window.innerHeight && !selectedUserIsTrainer && userId !== null)){
      this.props.actions.viewPerson(userId);
    }
    // // console.log(userId);
    // // this.props.actions.removeCardToRegister();
    // window.scrollTo(0, 0);

    // console.log(window.innerWidth, window.innerHeight);
  }

  handleClickSearchCloseIcon = () => {
    window.scrollTo(0, 0);
    this.setState({
      searchDisplay: ''
    });
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.setState({
        search: '',
      });
    }, 250);
  }

  renderUserList(title, type, searchText, filteredStaffId, useNew=false, open=false, backgroundColor){
    return(
      <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0, margin:0}}>
        <UserList title ={title} type={type} searchText={searchText} filteredStaffId={filteredStaffId} useNew={useNew} open={open} selectAction={this.handleSelectPerson} headerBackgroundColor={backgroundColor}/>
      </Grid>
    )
  }

  render() {
    const {classes} = this.props;

    const user = this.props.currentUser || null;
    const roles = user && user.get('staffRole');
    const isStaff = (user && user.get('isStaff'));
    // const isAdmin = roles && roles.get('admin') === true;
    // const isMC = roles && roles.get('mc') === true;
    // const isTrainer = roles && roles.get('trainer') === true;
    // const isSuperUser = roles && roles.get('superUser') === true;
    // const isSuperVisor = roles && roles.get('superVisor') === true;
    // const isseniorCRO = roles && roles.get('seniorCRO') === true;
    // const isShared = roles && roles.get('shared') === true;
    const isAdmin = roles && roles === 'admin';
    const isCRO = roles && roles === 'CRO';
    const isTrainer = roles && roles === 'trainer';
    const isSuperUser = roles && roles === 'superUser';
    const isSuperVisor = roles && roles === 'supervisor';
    const isSeniorCRO = roles && roles === 'seniorCRO';
    const isShared = roles && roles === 'shared';
    const email = user && user.get('email');
    // const isKLCC = email && ((email.indexOf('+klcc@babel.fit') !== -1))? true : false;
    const staffBranch = user && user.get('staffBranch');
    const isTTDIStaff = roles && staffBranch && (staffBranch === 'TTDI');
    const isKLCCStaff = roles && staffBranch && (staffBranch === 'KLCC');
    // console.log('theroles: ', roles);

     // define the staff level
     const staffLevel0 = isSuperUser;
     const staffLevel1 = isSuperUser || isAdmin;
     const staffLevel2 = isSuperUser || isAdmin || isSuperVisor;
     const staffLevel3 = isSuperUser || isAdmin || isSuperVisor || isSeniorCRO;
     const staffLevel4 = isSuperUser || isAdmin || isSuperVisor || isSeniorCRO || isCRO;
     const staffLevel5 = isSuperUser || isAdmin || isSuperVisor || isSeniorCRO || isCRO || isTrainer;
     const staffLevel6 = isSuperUser || isAdmin || isSuperVisor || isSeniorCRO || isCRO || isTrainer || isShared;

    const users = this.props.users || null;
    // console.log('isTrainer: ', isTrainer);
    // console.log('staffLevel5: ', staffLevel5);

    const searchText = this.state.search && this.state.search.trim().length > 1 ? this.state.search.trim().toLowerCase() : '';

    const selectedUserId = this.state.selectedUserId;
    var userData = users && selectedUserId ? users.get(selectedUserId) : null;
    var selectedStaffId = null;
    // if(!isAdmin && !isCRO && isTrainer){
    if(!isAdmin && !isCRO && !isTrainer && !isSeniorCRO && !isShared && !isSuperUser && !isSuperVisor){
      selectedStaffId = user.get('id');
    }
    var selectedStaffChip = null;
    const selectedUserRoles = (userData && userData.get('staffRole')) || null;
    const selectedUserRolesIsSuperUser = selectedUserRoles && selectedUserRoles === 'superUser';
    const selectedUserRolesIsSupervisor = selectedUserRoles && selectedUserRoles === 'supervisor';
    const selectedUserRolesIsAdmin = selectedUserRoles && selectedUserRoles === 'admin';
    const selectedUserRolesIsCRO = selectedUserRoles && selectedUserRoles === 'mc';
    const selectedUserRolesIsTrainer = selectedUserRoles && selectedUserRoles === 'trainer';
    const selectedUserRolesIsSeniorCRO = selectedUserRoles && selectedUserRoles === 'seniorCRO';
    const selectedUserRolesIsStaff = selectedUserRolesIsAdmin || selectedUserRolesIsCRO || selectedUserRolesIsTrainer || selectedUserRolesIsSuperUser || selectedUserRolesIsSupervisor || selectedUserRolesIsSeniorCRO;
    if (selectedUserRolesIsStaff) {
      selectedStaffId = selectedUserId;
      const selectedStaffName = userData && userData.get('name');
      const selectedStaffImage = (userData && userData.get('image')) || null;
      const selectedStaffAvatar = selectedStaffName || (selectedStaffName && selectedStaffName.length > 0) ?
        (selectedStaffImage ? (<Avatar src={selectedStaffImage} />) : (<Avatar>{selectedStaffName.charAt(0).toUpperCase()}</Avatar>)) :
        null;
      // disable the selectedstaffchip
      selectedStaffChip = false && (
        <Chip
          avatar={selectedStaffAvatar}
          label={selectedStaffName}
          style={{marginLeft:'auto', marginRight:'auto', marginTop:16, fontSize:'1rem', fontWeight:'500'}}
          onDelete={()=>this.handleSelectPerson(null)}
        />
      );
    }

    // this.props.users && console.log(this.props.users.toJS());

    return (
      <div className={classes.container}>
        <MenuAppBar />
        {/* <Grid container spacing={10}>
          <Grid item xs={12} sm={8} >
          {true && <SearchTextInput
              searchLabel = {(isStaff) ? "Search Name, Email, ID" : "Search Trainers"}
              value = {this.state.searchDisplay}
              onChange={this.handleSearch('search')}
              onIconClick={this.handleClickSearchCloseIcon}
              // style = {normalSearchTextBoxStyle}
              selectedStaffChip = {selectedStaffChip? selectedStaffChip:null}
            />}
          </Grid>
        </Grid> */}
          <Grid container spacing={10}>
            <Grid item xs={12} sm={8}>
              <Grid container style={{marginTop:32}}>
              <Grid item xs={12} sm={12} style = {{marginTop:85}}>
              {true && <SearchTextInput
                searchLabel = {(isStaff) ? "Search Name, Email, ID" : "Search Trainers"}
                value = {this.state.searchDisplay}
                onChange={this.handleSearch('search')}
                onIconClick={this.handleClickSearchCloseIcon}
                // style = {normalSearchTextBoxStyle}
                selectedStaffChip = {selectedStaffChip? selectedStaffChip:null}
              />}
                {false && !selectedStaffChip &&
                    <TextField
                      id="search"
                      label={(isStaff) ? "Search Name, Email, ID" : "Search Trainers"}
                      value={this.state.searchDisplay}
                      onChange={this.handleSearch('search')}
                      className={classes.search}
                      InputProps={{
                        endAdornment:(
                          <InputAdornment position="end">
                          <IconButton
                            onClick={this.handleClickSearchCloseIcon}
                          >
                            {this.state.searchDisplay.length > 0 ? <CloseIcon color='disabled'/> : <SearchIcon color='disabled'/>}
                          </IconButton>
                        </InputAdornment>
                      ),
                      }}
                      style={{borderRadius:3}}
                      onFocus={()=>window.scrollTo(0, 0)}
                    />
                  }
            {false && selectedStaffChip &&
                <TextField
                  id="search"
                  value={this.state.searchDisplay}
                  label={(isAdmin || isCRO || isTrainer) ? "Search Name, Email, ID.." : "Search Trainers"}
                  onChange={this.handleSearch('search')}
                  className={classes.search}
                  InputProps={{
                    startAdornment:(
                      <InputAdornment position="start">
                        {selectedStaffChip && selectedStaffChip}
                      </InputAdornment>
                    ),
                    endAdornment:(
                      <InputAdornment position="end">
                        <IconButton
                          onClick={this.handleClickSearchCloseIcon}
                        >
                          {this.state.searchDisplay.length > 0 ? <CloseIcon color='disabled'/> : <SearchIcon color='disabled'/>}
                        </IconButton>
                      </InputAdornment>
                    ),
                    style:{alignItems : 'end', paddingTop:8, paddingLeft:8, paddingBottom:8}
                  }}
                  style={{borderRadius:3}}
                  onFocus={()=>window.scrollTo(0, 0)}
                />
              }
            </Grid>
                {false && isAdmin && this.renderUserList('All Users', 'allUsers', searchText, selectedStaffId, true, true, 'rgb(255, 117, 27)')}
                {staffLevel6 && this.renderUserList('In Gym Needs Attention (KLCC)', 'inGymNeedsAttentionKLCC', searchText, selectedStaffId, true, true, 'rgb(255, 117, 27)')}
                {staffLevel6 && this.renderUserList('In Gym Needs Attention (TTDI)', 'inGymNeedsAttentionTTDI', searchText, selectedStaffId, true, true, 'rgb(255, 117, 27)')}
                {staffLevel6 && this.renderUserList('In Gym (KLCC)', 'inGymKLCC', searchText, selectedStaffId, true, true)}
                {staffLevel6 && this.renderUserList('In Gym (TTDI)', 'inGymTTDI', searchText, selectedStaffId, true, true)}
                {true && (isSuperUser || isAdmin) && this.renderUserList('New', 'new', searchText, selectedStaffId, true, false)}
                {staffLevel6 && this.renderUserList('New visitor KLCC', 'newklcc', searchText, selectedStaffId, true, false)}
                {staffLevel6 && this.renderUserList('New visitor TTDI', 'newttdi', searchText, selectedStaffId, true, false)}
                {staffLevel2 && this.renderUserList('Active', 'active', searchText, selectedStaffId, true, false)}
                {staffLevel6 && this.renderUserList('Active KLCC', 'activeKLCC', searchText, selectedStaffId, true, false)}
                {staffLevel6 && this.renderUserList('Active TTDI', 'activeTTDI', searchText, selectedStaffId, true, false)}
                {staffLevel6 && this.renderUserList('Billing Today/Overdue', 'expired', searchText, selectedStaffId, true, false, 'rgb(247, 26, 56)')}
                {staffLevel6 && this.renderUserList('Billing Today/Overdue (KLCC)', 'expiredKLCC', searchText, selectedStaffId, true, false, 'rgb(247, 26, 56)')}
                {staffLevel6 && this.renderUserList('Billing Today/Overdue (TTDI)', 'expiredTTDI', searchText, selectedStaffId, true, false, 'rgb(247, 26, 56)')}

                {false &&
                  <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                    <UserList title ={'Members'} type={'activeExpired'} searchText={searchText} filteredStaffId={selectedStaffId} useNew={true} selectAction={this.handleSelectPerson} />
                  </Grid>
                }
                {staffLevel6 &&
                  <Grid item xs={12} sm={6} lg={4} style={{paddingTop:0, paddingBottom:0}}>
                    <UserList title ={'Freeze'} type={'freeze'} searchText={searchText} filteredStaffId={selectedStaffId} useNew={true} selectAction={this.handleSelectPerson} headerBackgroundColor={'rgb(1, 186, 239)'}/>
                  </Grid>
                }
                {true && staffLevel6 && this.renderUserList('Needs Membership Card', 'needsMembershipCard', searchText, selectedStaffId, true, false)}
                {false && (isAdmin || isCRO) && this.renderUserList('Needs Trainer', 'needsTrainer', searchText, selectedStaffId, true, true)}
                {false && (isAdmin || isCRO || isTrainer) && this.renderUserList('Needs Induction', 'needsInduction', searchText, selectedStaffId, true, false)}
                {staffLevel6 && this.renderUserList('Complimentary', 'complementary', searchText, selectedStaffId, true, false)}
                {false && (isAdmin || isCRO || isSuperUser) && this.renderUserList('Complimentary Promo', 'complementaryPromo', searchText, selectedStaffId, true, false)}
                {staffLevel6 && this.renderUserList('Cancelled', 'cancelled', searchText, selectedStaffId, true, false)}
                {staffLevel6 && this.renderUserList('Visitors', 'prospects', searchText, selectedStaffId, true, false)}
                {roles && this.renderUserList('Staff', 'staffs', searchText, selectedStaffId, true, false)}
                {staffLevel6 && this.renderUserList('Trainers', 'trainers', searchText, selectedStaffId, true, false)}
                {false && (isSuperUser || isCRO || isSuperVisor || isAdmin || isSeniorCRO) && this.renderUserList('Ops', 'ops', searchText, selectedStaffId, true)}
                {false && (isSuperUser || isAdmin) && this.renderUserList('Admins', 'admins', searchText, selectedStaffId, true, false)}
              </Grid>
              </Grid>
            <Grid item xs={12} sm={4}>
              <Grid container style = {{marginTop:120}}>
              {staffLevel6  &&
                <Grid item xs={12} sm={12} 
                  //hidden={{xsDown:true}}
                >
                  <PersonCard userId={selectedUserId} clearAction={()=>this.handleSelectPerson(null)} elevation={2} />
                </Grid>
                // <PersonCard userId={selectedUserId} clearAction={()=>this.handleSelectPerson(null)} elevation={2} />
              }
              </Grid>
            </Grid>
          </Grid>
          <BabelLogo/>
      </div>
    );
  }

}


People.propTypes = {
  classes: PropTypes.object.isRequired,
};

const PeopleStyled = withStyles(styles)(People);

const makeMapStateToProps = () => {
  const getCurrentUser = makeGetCurrentUser();
  const getAllUsers = makeGetAllUsers();
  const mapStateToProps = (state, props) => {
    return {
      currentUser: getCurrentUser(state, props),
      users: getAllUsers(state, props)
    }
  }
  return mapStateToProps
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(makeMapStateToProps, mapDispatchToProps)(PeopleStyled)
