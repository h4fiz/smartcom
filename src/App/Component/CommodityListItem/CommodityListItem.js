import React, { Component } from 'react';
//import { Container, Row, Col } from 'reactstrap';
import './CommodityListItem.style.css';
import { getLanguage } from '../../../Languages';
import { webserviceurl, activelanguage } from '../../../Config';
import { numberFormat } from '../../../Global';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '55%',
    right                 : '-20%',
    bottom                : '-30%',
    transform             : 'translate(-50%, -50%)'
  }
};

class CommodityListItem extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            id:props.id,
            name : props.name, 
            category: props.category,
            shortDesc: props.shortdesc,
            tags: props.tags === undefined ? [] : props.tags,   //array
            pic: props.pic,
            price: props.price,
            qty: props.qty,
            sold: props.sold,
            hidePlusMinus: props.hidePlusMinus === undefined ? false : props.hidePlusMinus,
			modalDescriptionIsOpen: false
        };
        this.language = getLanguage(activelanguage, 'merchantprofile');
		
		this.openModalDescription = this.openModalDescription.bind(this);
		this.closeModalDescription = this.closeModalDescription.bind(this);
    }
	
	closeModalDescription() {
		this.setState({modalDescriptionIsOpen: false});
	}
	
	openModalDescription = () => {
		this.setState({modalDescriptionIsOpen: true});
	}

    componentDidMount=()=>{

    }

    componentWillReceiveProps=(props)=>{
        this.setState({
            id:props.id,
            name : props.name, 
            category: props.category,
            shortDesc: props.shortdesc,
            tags: props.tags === undefined ? [] : props.tags,   //array
            pic: props.pic,
            price: props.price,
            qty: props.qty,
            sold: props.sold,
            hidePlusMinus: props.hidePlusMinus === undefined ? false : props.hidePlusMinus
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

        this.props.updateQty(tmpQty, this.state.id);
    }

    renderCategory=()=>{
        if(this.state.category !== undefined && this.state.category !== ''){
            return (
                <div className="category">{this.state.category}</div>
            )
        }
    }

    renderPicture=()=>{
        if(this.state.pic !== ''){
            return (
                <div className="commodity-imgitem-container" onClick={() => this.openModalDescription()}>
                    <img src={this.state.pic} alt={'imgpic'}/>
                </div>
            )
        }else{
            return (
                <div className="commodity-imgitem-container" onClick={() => this.openModalDescription()}>
                    <img src={require('../../../images/default.png')} alt={'imgpic'} className="imgdefault"/>
                </div>
            )
        }
    }

    renderPlusMinus=()=>{
        
        if(!this.state.hidePlusMinus){
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
    }
	
	renderMinusButton=()=>{
		if(this.state.qty > 0){
			return (
				<div className="minus-button" onClick={()=>this.updateQty(-1)}>-</div>
			);
		}
	}
	
	renderModalDescription() {
		return (
			<Modal
				isOpen={this.state.modalDescriptionIsOpen}
				onRequestClose={this.closeModalDescription}
				style={customStyles}
				shouldCloseOnOverlayClick={true}
			>
			<div className="main-container merchant-payment">
				<div className="close-button"onClick={()=>this.closeModalDescription()}>X</div>
                        <div className="product-content" >
							<div className="product">&nbsp;</div>
                            <div className="product-title">{this.state.name}</div>
                            <div className="product-image"><img src={this.state.pic} /></div>
                            <div className="product-price">Rp. <span>{numberFormat(this.state.price)}</span> </div>
                            <div className="product-description" dangerouslySetInnerHTML={{__html: this.state.shortDesc}}></div>
							<div>&nbsp;</div>
							<div className="product-tags-container">Tags: 
                            {
                                this.state.tags.map((tag,i)=>{
                                    if(tag !== "")
                                        return <div key={i} className="tag">{tag}</div>
                                    
                                })
                            }
                        </div>
                        </div>
					
                </div>
			</Modal>
		);
	}

    render() {
        return(
            <div className="list-item">
                <div className="relative-container" >
				{this.renderModalDescription()}
                    {/*<div className="imgitem-container">
                        <img src={this.state.pic} alt={'imgpic'}/>
                    </div>*/}
                    {this.renderPicture()}
                    <div className={`data-container commodity-data-container`}>
                        <div className="name-container commodity-name" onClick={() => this.openModalDescription()}>{/*this.renderCategory()*/}{this.state.name}</div>
                        <div className="commodity-tags-container">
                            {
                                this.state.tags.map((tag,i)=>{
                                    if(tag !== "")
                                        return <div key={i} className="tag" onClick={() => this.openModalDescription()}>{tag}</div>
                                    
                                })
                            }
                        </div>
                        {/*<div className="shortdesc-container" dangerouslySetInnerHTML={{__html: this.state.shortDesc}}></div>*/}
                        <div className="commodity-sold-container" onClick={() => this.openModalDescription()}>{this.language.sold} {this.state.sold} {this.language.units}</div>
                        <div className="commodity-price-container" onClick={() => this.openModalDescription()}>Rp. <span>{numberFormat(this.state.price)}</span> &nbsp;<span className="stroke-price">Rp. {numberFormat(this.state.price+1)}</span></div>
                        
                        {this.renderPlusMinus()}			
						
                    </div>
                </div>
            </div>
        )
    }
}

export default CommodityListItem;