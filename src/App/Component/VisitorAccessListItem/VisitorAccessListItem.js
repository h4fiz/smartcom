import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import './VisitorAccessListItem.style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getLanguage } from '../../../Languages';
import { activelanguage } from '../../../Config';
import moment from 'moment';

class VisitorAccessListItem extends Component {

    constructor(props) {
        super(props);
        let monthName = '';

        this.globallang = getLanguage(activelanguage, 'global');
        this.language = getLanguage(activelanguage, 'visitoraccesslist');

        switch(parseInt(props.periodmonth)){
            case 1: monthName = this.globallang.january; break;
            case 2: monthName = this.globallang.february; break;
            case 3: monthName = this.globallang.march; break;
            case 4: monthName = this.globallang.april; break;
            case 5: monthName = this.globallang.may; break;
            case 6: monthName = this.globallang.june; break;
            case 7: monthName = this.globallang.july; break;
            case 8: monthName = this.globallang.august; break;
            case 9: monthName = this.globallang.september; break;
            case 10: monthName = this.globallang.october; break;
            case 11: monthName = this.globallang.november; break;
            case 12: monthName = this.globallang.december; break;
        }

        this.state = { 
            visitorname : props.visitorname, 
            month: props.periodmonth,
            year: props.periodyear,
            monthname : monthName,
			visit: props.visit,
            leave: props.leave,
            address: props.address,
			visitorpic: props.visitorpic
        };
    }

    componentDidMount=()=>{
		
    }

    componentWillReceiveProps=(props)=>{
        this.setState({
			visitorname : props.visitorname, 
            month: props.periodmonth,
            year: props.periodyear,
			visit: props.visit,
            leave: props.leave,
            address: props.address,
			visitorpic: props.visitorpic
			});
    }

    render() {
        return(
            <div >
                <div className="relative-container">
                    <div className="visitor-list-item">
                        <table>
                            <tbody>
                                <tr>
                                    <td style={{width:'90px', height:'100px', position:'relative'}}>
										<div className="image-container">
											<img src={this.state.visitorpic}/>
										</div>
                                    </td>
                                    <td>
                                        <div className="name-container">{this.state.visitorname}</div>
                                        <div className="address-container">{this.state.address}</div>
                                        <div className="date-container">{this.state.visit} - {this.state.leave}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default VisitorAccessListItem;