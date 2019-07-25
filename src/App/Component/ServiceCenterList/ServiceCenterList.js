import React, { Component } from 'react';
//import { Container, Row, Col } from 'reactstrap';
import './ServiceCenterList.style.css';
import { getLanguage } from '../../../Languages';
import { webserviceurl, activelanguage } from '../../../Config';
import { numberFormat } from '../../../Global';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

class ServiceCenterList extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            servicecenterid:props.servicecenterid,
            servicecentername : props.servicecentername, 
            qty: props.qty,
			price: props.price,
        };
        this.language = getLanguage(activelanguage, 'servicecenterform');
    }

    componentDidMount=()=>{

    }

    componentWillReceiveProps=(props)=>{
        this.setState({
            servicecenterid:props.servicecenterid,
            servicecentername : props.servicecentername, 
            qty: props.qty,
			price: props.price,
        });
    }

    updateQty=(value)=>{
        let tmpQty = this.state.qty;
        if(value > 0){
            tmpQty += value;
			
        }else{
            if(tmpQty > 0){
                tmpQty += value
            }
        }

        this.props.updateQty(tmpQty, this.state.servicecenterid);
    }

    renderPlusMinus=()=>{
            return (
                <div className="qty-container">
                    <div className="plus-minus-button">
						<div className="plus-button" onClick={()=>this.updateQty(1)}>+</div>
						<div className="qty-value">{this.state.qty}</div>
						{this.renderMinusButton()}	
                    </div>
                </div>	
            )
    }
	
	renderMinusButton=()=>{
		if(this.state.qty > 0){
			return (
				<div className="minus-button" onClick={()=>this.updateQty(-1)}>-</div>
			);
		}
	}

    render() {
        return(
            <div className="addon-item">
                <div className="relative-container" >
                        <div className="name-container">{this.state.servicecentername}</div>          
                        {this.renderPlusMinus()}			
                </div>
            </div>
        )
    }
}

export default ServiceCenterList;