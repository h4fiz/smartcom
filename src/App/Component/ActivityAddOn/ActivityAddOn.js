import React, { Component } from 'react';
//import { Container, Row, Col } from 'reactstrap';
import './ActivityAddOn.style.css';
import { getLanguage } from '../../../Languages';
import { webserviceurl, activelanguage } from '../../../Config';
import { numberFormat } from '../../../Global';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

class ActivityAddOn extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            activityaddonid:props.activityaddonid,
            activityaddonname : props.activityaddonname, 
            qty: props.qty
        };
        this.language = getLanguage(activelanguage, 'activityreservationform');
    }

    componentDidMount=()=>{

    }

    componentWillReceiveProps=(props)=>{
        this.setState({
            activityaddonid:props.activityaddonid,
            activityaddonname : props.activityaddonname, 
            qty: props.qty
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

        this.props.updateQty(tmpQty, this.state.activityaddonid);
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
                        <div className="name-container">{this.state.activityaddonname}</div>          
                        {this.renderPlusMinus()}			
                </div>
            </div>
        )
    }
}

export default ActivityAddOn;