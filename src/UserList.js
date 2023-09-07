import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from '@material-ui/core';
import {Button, Collapse, List, ListItem, Typography} from '@material-ui/core';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';

import PropTypes from 'prop-types';

import {
  getFilteredStaffIdState,
  getSearchTextState,
  makeGetHansonMemberItems,
  makeGetMidahMemberItems,
  makeGetMelawatiMemberItems,
  makeGetMelawati2MemberItems,
  makeGetMelawati3MemberItems,
  makeGetCempakaMemberItems,
  makeGetIndahMemberItems,
  makeGetMajuMemberItems,
  makeGetWarisanMemberItems,
  makeGetTenagaMemberItems,
  makeGetWangsa1MemberItems,
  makeGetWangsa2MemberItems,
  makeGetWangsa3MemberItems,
  makeGetWangsa4MemberItems,
  makeGetWangsa5MemberItems,
  makeGetWangsa6MemberItems,
  makeGetWangsa7MemberItems,
  makeGetCahaya1MemberItems,
  makeGetCahaya2MemberItems,
  makeGetCahaya3MemberItems,
  makeGetCahaya4MemberItems,
  makeGetCahaya5MemberItems,
  makeGetCahaya6MemberItems,
  makeGetCahaya7MemberItems,
  makeGetWatanMemberItems,
  makeGetActiveMemberItems,
  makeGetActiveMemberItemsKLCC,
  makeGetActiveMemberItemsTTDI,
  makeGetAdminItems,
  makeGetCancelledMemberItems,
  makeGetComplementaryMemberItems,
  makeGetComplementaryPromoMemberItems,
  makeGetExpiredMemberItems,
  makeGetExpiredMemberItemsKLCC,
  makeGetExpiredMemberItemsTTDI,
  makeGetFreezeMemberItems,
  makeGetInGymItems,
  makeGetInGymNeedsAttentionItems,
  makeGetInGymKLCCItems,
  makeGetInGymKLCCNeedsAttentionItems,
  makeGetInGymTTDIItems,
  makeGetInGymTTDINeedsAttentionItems,
  makeGetNeedsInductionItems,
  makeGetNeedsMembershipCardItems,
  makeGetNeedsTrainerItems,
  makeGetNewUserItems,
  makeGetNewUserItemsKLCC,
  makeGetNewUserItemsTTDI,
  makeGetOpsItems,
  makeGetStaffItems,
  makeGetProspectItems,
  makeGetTrainerItems,
  makeGetAllUsers
} from './selectors';
import * as Actions from './actions';
import UserListItem from './UserListItem';

const styles = theme => ({
  listSection: {},
  contentFirstRow: {
    maxWidth: 600,
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(8),
  },
  title: {},
  titleBadge: {
    // borderRadius: '50%',
    borderRadius: 8,
    backgroundColor: '#062845',
    color: '#fff',
    width: 44,
    // height: 44,
    textAlign: 'center',
    padding: 8,
    marginRight: 8,
    // float: 'left'
  },
  grayTitleBadge: {
    // borderRadius: '50%',
    borderRadius: 8,
    backgroundColor: '#ccc',
    color: '#fff',
    width: 44,
    // height: 44,
    textAlign: 'center',
    padding: 8,
    marginRight: 8,
    // float: 'left'
  },
  margin: {
    marginRight: theme.spacing(2),
    paddingRight: theme.spacing(2)
  }
});

class UserList extends React.Component {

  state = {
    // open: true,
    itemsToLoad: 5
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props !== nextProps || this.state !== nextState) {
      return true;
    }
    return false;
  }

  handleOpen = () => {
    var isOpen = this.state && typeof this.state.open !== 'undefined' ? this.state.open : this.props.open;

    this.setState({
      open: !(isOpen),
      itemsToLoad: 5
    });

  };

  render() {
    const {
      classes,
      open,
      title,
      items,
      useNew,
      selectAction,
      viewAction,
      headerBackgroundColor
    } = this.props;

    const isOpen = this.state && typeof this.state.open !== 'undefined' ? this.state.open : open;

    var header = (
      <div style={{flex:1, flexDirection:'row', display:'flex', alignItems:'center'}}>
        <Typography variant="h4" style={{backgroundColor : items && items.length ? headerBackgroundColor : '#ccc'}} className={items && items.length ? classes.titleBadge : classes.grayTitleBadge}>{items ? items.length : null}</Typography>
        <Typography variant="h4" className={classes.title}>{title}</Typography>
        {isOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
      </div>
    )

    // console.log('render', title);

    var newItems = items;
    if (useNew && items) {
      newItems = [];
     
      // var listMap = {};
      (items) && items.forEach(item => {
        // console.log('theItemsUserList: ', item)
        if (!this.props.showAll && (newItems.length >= this.state.itemsToLoad || (!isOpen && !(items && (items.length < 5))))) {
          return;
        }
        newItems.push(<UserListItem key={item.id} id={item.id} primaryText={item.primaryText} secondaryText={item.secondaryText} avatarImage={item.avatarImage} avatarName={item.avatarName} avatarNumber={item.avatarRoomNumber} selectAction={this.props.showAll ? viewAction : selectAction} viewAction={viewAction} backgroundColor={item.backgroundColor} type={this.props.type}/>)
      });
    }

    return (
      <List style = {{margin:8}}>
        <ListItem button onClick={this.handleOpen}>
          <div className={classes.listSection}>
            {header}
          </div>
        </ListItem>
        <Collapse in={this.props.showAll || (items && (items.length < 5)) ? true : isOpen} timeout="auto" unmountOnExit>
          <List component="div">
            {newItems}
          </List>
          {(items && items.length > this.state.itemsToLoad && !this.props.showAll) &&
            <Button onClick={()=>this.setState({itemsToLoad:this.state.itemsToLoad*2})}>Show More</Button>
          }
        </Collapse>
      </List>
    );
  }
}

UserList.propTypes = {
  classes: PropTypes.object.isRequired,
};

UserList.defaultProps = {
  open: false,
  title: "No title",
  items: [],
  type: 'none',
  headerBackgroundColor: '#062845'
}

const UserListStyled = withStyles(styles)(UserList);

const makeMapStateToProps = () => {
  const mapStateToProps = (state, props) => {
    var items;
    switch (props.type) {
      case 'inGymNeedsAttention':{
        const getInGymNeedsAttentionItems = makeGetInGymNeedsAttentionItems();
        items = getInGymNeedsAttentionItems(state, props);
        break;
      }
      case 'inGym':{
        const getInGymItems = makeGetInGymItems();
        items = getInGymItems(state, props);
        break;
      }
      case 'inGymNeedsAttentionKLCC':{
        const getInGymKLCCNeedsAttentionItems = makeGetInGymKLCCNeedsAttentionItems();
        items = getInGymKLCCNeedsAttentionItems(state, props);
        break;
      }
      case 'inGymKLCC':{
        const getInGymKLCCItems = makeGetInGymKLCCItems();
        items = getInGymKLCCItems(state, props);
        break;
      }
      case 'inGymNeedsAttentionTTDI':{
        const getInGymTTDINeedsAttentionItems = makeGetInGymTTDINeedsAttentionItems();
        items = getInGymTTDINeedsAttentionItems(state, props);
        break;
      }
      case 'inGymTTDI':{
        const getInGymTTDIItems = makeGetInGymTTDIItems();
        items = getInGymTTDIItems(state, props);
        break;
      }
      case 'new':{
        const getNewUserItems = makeGetNewUserItems();
        items = getNewUserItems(state, props);
        break;
      }
      // new klcc member
      case 'newklcc':{
        const getNewUserItemsklcc = makeGetNewUserItemsKLCC();
        items = getNewUserItemsklcc(state, props);
        break;
      }
      // new ttdi member
      case 'newttdi':{
        const getNewUserItems = makeGetNewUserItemsTTDI();
        items = getNewUserItems(state, props);
        break;
      }
      case 'active':{
        const getActiveMembersItems = makeGetActiveMemberItems();
        items = getActiveMembersItems(state, props)
        break;
      }
      case 'hansonMember':{
        const getCahayaHansonItems = makeGetHansonMemberItems();
        items = getCahayaHansonItems(state, props)
        break;
      }
      case 'melawatiMember':{
        const getMelawatiItems = makeGetMelawatiMemberItems();
        items = getMelawatiItems(state, props)
        break;
      }
      case 'melawati2Member':{
        const getMelawati2Items = makeGetMelawati2MemberItems();
        items = getMelawati2Items(state, props)
        break;
      }
      case 'melawati3Member':{
        const getMelawati2Items = makeGetMelawati3MemberItems();
        items = getMelawati2Items(state, props)
        break;
      }            
      case 'midahMember':{
        const getMidahItems = makeGetMidahMemberItems();
        items = getMidahItems(state, props)
        break;
      }      
      case 'cempakaMember':{
        const getCempakaItems = makeGetCempakaMemberItems();
        items = getCempakaItems(state, props)
        break;
      }
      case 'indahMember':{
        const getIndahItems = makeGetIndahMemberItems();
        items = getIndahItems(state, props)
        break;
      }
      case 'majuMember':{
        const getMajuItems = makeGetMajuMemberItems();
        items = getMajuItems(state, props)
        break;
      }
      case 'warisanMember':{
        const getWarisanItems = makeGetWarisanMemberItems();
        items = getWarisanItems(state, props)
        break;
      }
      case 'tenagaMember':{
        const getTenagaItems = makeGetTenagaMemberItems();
        items = getTenagaItems(state, props)
        break;
      }
      case 'wangsa1Member':{
        const getWangsa1Items = makeGetWangsa1MemberItems();
        items = getWangsa1Items(state, props)
        break;
      }
      case 'wangsa2Member':{
        const getWangsa2Items = makeGetWangsa2MemberItems();
        items = getWangsa2Items(state, props)
        break;
      }
      case 'wangsa3Member':{
        const getWangsaMaju3Items = makeGetWangsa3MemberItems();
        items = getWangsaMaju3Items(state, props)
        break;
      }
      case 'wangsa4Member':{
        const getWangsaMaju4Items = makeGetWangsa4MemberItems();
        items = getWangsaMaju4Items(state, props)
        break;
      }
      case 'wangsa5Member':{
        const getWangsaMaju5Items = makeGetWangsa5MemberItems();
        items = getWangsaMaju5Items(state, props)
        break;
      }
      case 'wangsa6Member':{
        const getWangsaMaju6Items = makeGetWangsa6MemberItems();
        items = getWangsaMaju6Items(state, props)
        break;
      }
      case 'wangsa7Member':{
        const getWangsaMaju7Items = makeGetWangsa7MemberItems();
        items = getWangsaMaju7Items(state, props)
        break;
      }
      case 'cahaya1Member':{
        const getCahaya1Items = makeGetCahaya1MemberItems();
        items = getCahaya1Items(state, props)
        break;
      }
      case 'cahaya2Member':{
        const getCahaya2Items = makeGetCahaya2MemberItems();
        items = getCahaya2Items(state, props)
        break;
      }
      case 'cahaya3Member':{
        const getCahaya3Items = makeGetCahaya3MemberItems();
        items = getCahaya3Items(state, props)
        break;
      }
      case 'cahaya4Member':{
        const getCahaya4Items = makeGetCahaya4MemberItems();
        items = getCahaya4Items(state, props)
        break;
      }
      case 'cahaya5Member':{
        const getCahaya5Items = makeGetCahaya5MemberItems();
        items = getCahaya5Items(state, props)
        break;
      }
      case 'cahaya6Member':{
        const getCahaya6Items = makeGetCahaya6MemberItems();
        items = getCahaya6Items(state, props)
        break;
      }
      case 'cahaya7Member':{
        const getCahaya7Items = makeGetCahaya7MemberItems();
        items = getCahaya7Items(state, props)
        break;
      }
      case 'watanMember':{
        const getWatanItems = makeGetWatanMemberItems();
        items = getWatanItems(state, props)
        break;
      }
      case 'activeKLCC':{
        const getActiveMembersItemsKLCC = makeGetActiveMemberItemsKLCC();
        items = getActiveMembersItemsKLCC(state, props)
        break;
      }
      case 'activeTTDI':{
        const getActiveMembersItemsTTDI = makeGetActiveMemberItemsTTDI();
        items = getActiveMembersItemsTTDI(state, props)
        break;
      }
      case 'complementary':{
        const getComplementaryMembersItems = makeGetComplementaryMemberItems();
        items = getComplementaryMembersItems(state, props)
        break;
      }
      case 'complementaryPromo':{
        const getComplementaryMembersPromoItems = makeGetComplementaryPromoMemberItems();
        items = getComplementaryMembersPromoItems(state, props)
        break;
      }
      case 'expired':{
        const getExpiredMembersItems = makeGetExpiredMemberItems();
        items = getExpiredMembersItems(state, props)
        break;
      }
      case 'expiredKLCC':{
        const getExpiredMembersItemsKLCC = makeGetExpiredMemberItemsKLCC();
        items = getExpiredMembersItemsKLCC(state, props)
        break;
      }
      case 'expiredTTDI':{
        const getExpiredMembersItemsTTDI = makeGetExpiredMemberItemsTTDI();
        items = getExpiredMembersItemsTTDI(state, props)
        break;
      }
      case 'activeExpired':{
        const getActiveMembersItems = makeGetActiveMemberItems();
        const getExpiredMembersItems = makeGetExpiredMemberItems();
        items = getActiveMembersItems(state, props) || [];
        items = items.concat(getExpiredMembersItems(state, props) || []);
        break;
      }
      case 'freeze':{
        const getFreezeMembersItems = makeGetFreezeMemberItems();
        items = getFreezeMembersItems(state, props)
        break;
      }
      case 'needsMembershipCard':{
        const getNeedsMembershipCardItems = makeGetNeedsMembershipCardItems();
        items = getNeedsMembershipCardItems(state, props)
        break;
      }
      case 'needsTrainer':{
        const getNeedsTrainerItems = makeGetNeedsTrainerItems();
        items = getNeedsTrainerItems(state, props)
        break;
      }
      case 'needsInduction':{
        const getNeedsInductionItems = makeGetNeedsInductionItems();
        items = getNeedsInductionItems(state, props)
        break;
      }
      case 'cancelled':{
        const getCancelledMembersItems = makeGetCancelledMemberItems();
        items = getCancelledMembersItems(state, props)
        break;
      }
      case 'prospects':{
        const getProspectItems = makeGetProspectItems();
        items = getProspectItems(state, props)
        break;
      }
      case 'trainers':{
        const getTrainersItems = makeGetTrainerItems();
        items = getTrainersItems(state, props)
        break;
      }
      case 'staffs':{
        const getStaffItems = makeGetStaffItems();
        // console.log('getStaffItems', getStaffItems);
        items = getStaffItems(state, props)
        break;
      }
      case 'ops':{
        const getOpsItems = makeGetOpsItems();
        items = getOpsItems(state, props)
        break;
      }
      case 'admins':{
        const getAdminItems = makeGetAdminItems();
        items = getAdminItems(state, props);
        break;
      }
      // case 'allUsers':{
      //   const getAllUsers = makeGetAllUsers();
      //   items = getAllUsers(state, props);
      //   break;
      // }
      default:{
        items = [];
      }
    }
    return {
      searchText: getSearchTextState(state, props),
      filteredStaffId: getFilteredStaffIdState(state, props),
      items: items
    }
  }
  return mapStateToProps
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(makeMapStateToProps, mapDispatchToProps)(UserListStyled)
