import React, { Component } from 'react';
import './CommodityCartItem.style.css';
import { getLanguage } from '../../../Languages';
import { webserviceurl, activelanguage } from '../../../Config';
import { numberFormat } from '../../../Global';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class CommodityCartItem extends Component {

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
            hidePlusMinus: props.hidePlusMinus === undefined ? false : props.hidePlusMinus
        };
        this.language = getLanguage(activelanguage, 'merchantprofile');
    }

    componentDidMount=()=>{
		this.calculatePrice();
    }
	
	calculatePrice=()=>{
		let tmp;
		tmp = this.state.qty*this.state.price;
		this.setState({totalprice: tmp});
	}
	
	removeCart=()=>{
		
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
            hidePlusMinus: props.hidePlusMinus === undefined ? false : props.hidePlusMinus,
			totalprice: props.qty*props.price
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

    renderPicture=()=>{
        if(this.state.pic !== ''){
            return (
                <div className="commodity-imgitem-container">
                    <img src={this.state.pic} alt={'imgpic'}/>
                </div>
            )
        }else{
            return (
                <div className="commodity-imgitem-container">
                    <img src={require('../../../images/default.png')} alt={'imgpic'} className="imgdefault"/>
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
	
	/* renderSelectedCart=()=>{
		if(this.state.qty <= 0){
			return (
				<div className={`data-container commodity-data-container commodity-cart-container`}></div>
			);
		}
		
		else{
			return(	
				<div className={`data-container commodity-data-container commodity-cart-container`}></div>
			);
		}
	} */

    render() {
        return(
            <div className="list-item">
				<div className="relative-container">
                    {/*<div className="imgitem-container">
                        <img src={this.state.pic} alt={'imgpic'}/>
                    </div>*/}
					
                    {this.renderPicture()}
                    <div className={`data-container commodity-data-container commodity-cart-container`}>
                        <table>
                            <tr>
								{/*this.renderSelectedCart()*/}
                                <td>
                                    <div className="name-container commodity-name">{this.state.name}</div>
                                    <div className="price-amount">Rp. <span>{numberFormat(this.state.price)}</span></div>
                                </td>
                               
                                <td className="subtotal-col">
                                    {/*<div className="name-container commodity-name">Subtotal</div><br/>*/}
									 <div className="qty-col">
										{/*<div className="qty-label">Qty</div>*/}
										{/*<div className="qty-amount" >{this.state.qty}</div>*/}
										
										<div className="plus-minus-button">
											<div className="plus-button" onClick={()=>this.updateQty(1)}>+</div>
											<div className="qty-value">{this.state.qty}</div>
											{this.renderMinusButton()}
										</div>
									</div>
                                    <div className="subtotal-amount" >Rp. {numberFormat(this.state.totalprice)}</div>
                                </td>
                            </tr>
                        </table>

                    </div>
                </div>
            </div>
        )
    }
}

export default CommodityCartItem;