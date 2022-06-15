import React from 'react';
// import './BusinessList.css';
import CalendarCard from './CalendarCard';


class CalendarList extends React.Component {

    onPress(data){
        console.log('CalendarListonpress: ', data);
    }

    render(){
        // console.log('calendarList: ', this.props);
        return(
            <div>
               {this.props.data.map((data)=>{
                    return <CalendarCard key={data.id} data = {data} onPress = {()=>this.onPress(data)}/>
                })}
            </div>
        )
    }
}

export default CalendarList;