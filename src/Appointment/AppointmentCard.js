import React from 'react';
import Button from 'material-ui/Button';
// import './Business.css';

class AppointmentCard extends React.Component {
    constructor(props) {
        super(props);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleShowReschedule = this.handleShowReschedule.bind(this);
      }

    state = {
        showRescheduleLayout:false
    }
    handleCancel = () => {
        this.props.onCancel();
    }

    handleShowReschedule = (data) => {
        this.setState({showRescheduleLayout:true});
        this.props.onShowRescheduleAppointment();
    }

    handleSelectDate = (data) => {

    }

    render(){
        const {data} = this.props;
        console.log('theprops: ', this.props)
        return(
            <div>
                <h3>date created: {data.dateCreated}</h3>
                <h3>location: {data.location}</h3>
                <h3>appoinment date: {data.datetime}</h3>
                <h3>type: {data.type}</h3>
                <h3>calendar: {data.calendar}</h3>
                <div style = {{flexDirection:'row'}}> 
               {/* <Button onClick={()=>{this.handleRescheduleAppoinment(data.id, "2020-05-21T13:00:00+0800")}}>reschedule</Button> */}
                    
                    <Button onClick = {()=>this.handleShowReschedule(data)}>reschedule</Button>

                    <Button onClick={this.handleCancel}>cancel</Button>
                </div>
                
                {this.state.showRescheduleLayout && <div>
                    <h2>showReschedule layout</h2>
                    <Button 
                      raised color='primary' 
                      key={'okButton'} 
                      style={{textAlign:'center', marginBottom:8, alignItems:'center', justifyContent:'center', backgroundColor:'#fcebbe', fontWeight:800}} 
                      onClick={()=>this.handleSelectDate(data)}>
                        {data.date}
                    </Button> 
                </div>}

                <br/>
                
            </div>
        )
    }
}

export default AppointmentCard;
