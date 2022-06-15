import React from 'react';
import Button from 'material-ui/Button';
// import './Business.css';

class CalendarCard extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
      }

    handleViewDetail(data){
        // console.log('handleViewUserDetail: ', data);
    }

    handleSelect(){
        // this.props.selectCalendar();
        console.log('handleSelect: ', this.props);
        this.props.onPress();
    }

    render(){
        const {data} = this.props;
        console.log('theprops: ', this.props)
        return(
            <div style = {{ cursor: 'pointer'}} onClick = {()=>this.handleViewDetail(data)}>
                <img src = {data.image} width={100} height={100}/>
                <p>{data.email}</p>
                <Button 
                  raised color='primary' 
                  key={'okButton'} 
                  style={{textAlign:'center', marginBottom:8, alignItems:'center', justifyContent:'center', backgroundColor:'#fcebbe', fontWeight:800}} 
                  onClick={this.handleSelect}>
                    SELECT
                </Button>
            </div>
        )
    //     return (
    //         <div className="Business">
    //             <div className="image-container">
    //                 <img src={businessObj.imageSrc} alt=''/>
    //             </div>
    //             <h2>{businessObj.name}</h2>
    //             <div className="Business-information">
    //                 <div className="Business-address">
    //                     <p>{businessObj.address}</p>
    //                     <p>{businessObj.city}</p>
    //                     <p>{businessObj.state}</p>
    //                     <p>{businessObj.zipCode}</p>
    //                 </div>
    //                 <div className="Business-reviews">
    //                     <h3>{businessObj.category}</h3>
    //                     <h3 className="rating">{businessObj.rating}</h3>
    //                     <p>{businessObj.reviewCount}</p>
    //                 </div>
    //             </div>
    //         </div>
    //     )
    }
}

export default CalendarCard;
