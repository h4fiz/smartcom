import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import './PaymentCenterListItem.style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getLanguage } from '../../../Languages';
import { activelanguage } from '../../../Config';

class PaymentCenterListItem extends Component {

    constructor(props) {
        super(props);
        let monthName = '';

        this.globallang = getLanguage(activelanguage, 'global');
        this.language = getLanguage(activelanguage, 'paymentcenterlist');

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
            name : props.name, 
            category: props.category,
            shortDesc: props.shortdesc,
            price: props.billingamount,
            pic: props.pic,
            month: props.periodmonth,
            year: props.periodyear,
            monthname : monthName,
            customerid: props.customerid,
			billingstatus: props.billingstatus,
			billingcategoryid: props.billingcategoryid,
            paiddate: props.paiddate,
            address: props.address
        };
    }

    componentDidMount=()=>{
		
    }

    componentWillReceiveProps=(props)=>{
        this.setState({
			name : props.name, 
            category: props.category,
            shortDesc: props.shortdesc,
            price: props.billingamount,
            pic: props.pic,
            month: props.periodmonth,
            year: props.periodyear,
            customerid: props.customerid,
			billingstatus: props.billingstatus,
			billingcategoryid: props.billingcategoryid,
            paiddate: props.paiddate,
            address: props.address
			});
    }


    renderBillingStatus=()=>{
		if(this.state.billingstatus == 1){
            return (
                <div className="paiddate-container">{this.language.paid}: {this.state.paiddate}</div>
            )
        }else{
            return (
                <div className="unpaid-container">{this.language.pending}</div>
            )
        }
    }
	
	renderBulletStatus=()=>{
		if(this.state.billingstatus == 1){
            return (
                <span className="paid">●&nbsp;&nbsp;&nbsp;</span>
            )
        }
		
		else if(this.state.billingstatus == 0){
            return (
                <span className="pending">●&nbsp;&nbsp;&nbsp;</span>
            )
        }
    }

    renderPicture=()=>{
        let icon;
        if(this.state.category === "PLN")
            icon = <FontAwesomeIcon icon="lightbulb" className="list-icon" />;
        else if(this.state.category === "Water")
            icon = <FontAwesomeIcon icon="tint" className="list-icon" />;
        else if(this.state.category === "IPKL")
            icon = <FontAwesomeIcon icon="business-time" className="list-icon" />;
        if(this.state.category !== ''){
            return (
                <div className="imgitem-container">
                    {icon}
                </div>
            )
        }else{
            return (
                <div className="imgitem-container">
                    <img src={require('../../../images/default.png')} alt={'imgpic'} className="imgdefault"/>
                </div>
            )
        }
    }

    render() {
        return(
            <div className="list-item">
                <div className="relative-container">
                    {/*<div className="imgitem-container">
                        <img src={this.state.pic} alt={'imgpic'}/>
                    </div>*/}
                    {/*this.renderPicture()*/}
                    <div className="payment-list-item">
                        <table>
                            <tbody>
                                <tr>
                                    <td style={{width:'30px'}}>
                                        {this.renderBulletStatus()}
                                    </td>
                                    <td>
                                        <div className="name-container">{this.state.monthname} {this.state.year}</div>
                                        <div className="category-container">{this.state.category}</div>
                                        {/*<div className="customerid-container">{this.state.customerid}</div>*/}
                                    </td>
                                    <td style={{width:'150px'}}>
                                        <div className="amount-container">Rp. {this.state.price}</div>
                                        {this.renderBillingStatus()}
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

export default PaymentCenterListItem;