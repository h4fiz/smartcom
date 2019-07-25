import React, { Component } from 'react';
//import { Container, Row, Col } from 'reactstrap';
import './RoomAddOn.style.css';
import { getLanguage } from '../../../Languages';
import { webserviceurl, activelanguage } from '../../../Config';
import { numberFormat } from '../../../Global';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

class RoomAddOn extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            roomaddonid:props.roomaddonid,
            roomaddonname : props.roomaddonname, 
            qty: props.qty
        };
        this.language = getLanguage(activelanguage, 'roomreservationform');
    }

    componentDidMount=()=>{

    }

    componentWillReceiveProps=(props)=>{
        this.setState({
            roomaddonid:props.roomaddonid,
            roomaddonname : props.roomaddonname, 
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

        this.props.updateQty(tmpQty, this.state.roomaddonid);
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
                        <div className="name-container">{this.state.roomaddonname}</div>          
                        {this.renderPlusMinus()}			
                </div>
            </div>
        )
    }
}

export default RoomAddOn;