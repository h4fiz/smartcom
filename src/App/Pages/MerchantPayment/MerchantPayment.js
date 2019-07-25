import React, { Component } from 'react';
//import { Link, Redirect } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import axios from 'axios';
import './MerchantPayment.style.css';

import CommodityCartItem from '../../Component/CommodityCartItem/CommodityCartItem';
import SubHeader from '../../Component/SubHeader/SubHeader';

import { getLanguage } from '../../../Languages';
import { webserviceurl, activelanguage } from '../../../Config';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert'; 
//import banner from '../../../images/fastfood.jpg';
import { numberFormat } from '../../../Global';

class MerchantPayment extends Component {

    constructor(props) {
        super(props);
        this.language = getLanguage(activelanguage, 'merchantpayment');
		this.globallang = getLanguage(activelanguage, 'global');
        this.state = {
            merchantId: props.match.params.merchantid,
            merchantName: '',
			merchantData: {},
            currentCommodityCategory:0,
            commodity:[],
            commodityShow:[],
            modal:false,
			counteritem: 0,
			counterprice: 0,
			label: "Items",
			orderdetailid: 0,
			orderid: 0,
			phoneno: '081234567890',
			status: 0,
			communityid: 1
        }
    }

    componentDidMount=()=>{
        this.waitForBridge();
        this.loadData();
    }

    loadData= () => {
		var test = window.localStorage.getItem('merchant');
		var dig = JSON.parse(test);
		
		if(dig== null){
			return false;
		}
		
		this.setState({merchantName: dig.name===undefined?"":dig.name});
		this.loadCommodity();
    }

    /*loadCartData=()=>{
		var test = window.localStorage.getItem('shopping-cart');
		var dig = JSON.parse(test);
		
		if(dig== null){
			return false;
		}
		
		let thecommodity = {};
		let tempcounter = 0;
		for(let i=0; i<dig.length;i++){
            
			tempcounter += dig[i].qty;
        }
		
		this.doCheckCount(tempcounter);
		this.loadCommodity();
    }  */  

	loadCommodity=()=>{
        let storage = window.localStorage.getItem('shopping-cart');
        var commodity = JSON.parse(storage);
		
		if(commodity === null || commodity === "null") return false;
		
        //let thecommodity = {};
		let tempcounter = 0;
		let tempprice = 0;
		let price = 0;
        for(let i=0; i<commodity.length;i++){
            /*if(commodity[i].commodityid === commodityid){
                thecommodity = commodity[i];
                commodity[i].qty = newValue;
            }*/
			tempcounter += commodity[i].qty;
			tempprice += commodity[i].qty*commodity[i].price;
        }

        let lbl = this.state.label;
        if(tempcounter == 1)
            lbl = "Item";

		this.setState({commodity: commodity, counteritem: tempcounter,counterprice: tempprice, label: lbl });
    }
	
	updateQty=(newValue, commodityid)=>{
        let commodity = this.state.commodity;
        let thecommodity = {};
		let tempcounter = 0;
		let tempprice = 0;
		let price = 0;
        for(let i=0; i<commodity.length;i++){
            if(commodity[i].commodityid === commodityid){
                thecommodity = commodity[i];
                commodity[i].qty = newValue;
            }
			tempcounter += commodity[i].qty;
			
			tempprice += commodity[i].qty*commodity[i].price;
        }
        this.setState({commodity: commodity});
		this.setState({counteritem: tempcounter});
		this.setState({counterprice: tempprice});

        //update localstorage shopping-cart
        let isExist = false;
        let cart = JSON.parse(localStorage.getItem('shopping-cart'));
        for(let i=0; i<cart.length;i++){
            if(cart[i].commodityid === commodityid){
                isExist = true;
                cart[i].qty = newValue;
                if(newValue === 0){
                    cart.splice(i,1);   
                }
                break;
            }
        }
		
        if(!isExist){
            cart.push(thecommodity);
        }
        localStorage.setItem('shopping-cart', JSON.stringify(cart));
    }

    waitForBridge() {
        //the react native postMessage has only 1 parameter
        //while the default one has 2, so check the signature
        //of the function

        if (window.postMessage.length !== 1) {
            setTimeout(function () {
                this.waitForBridge();
            }
                .bind(this), 200);
        }
        else {
            let param = '{"title":"' + this.language.title + '","canGoBack":false, "showCommunityName":true, "hideTopbar":true, "hideFooterMenu":true}';
            window.postMessage(param, "*");
        }
    }

    createMarkup = (content) => {
        return { __html: content };
    }

    toggle=()=> {
        this.setState({
          modal: !this.state.modal
        });
    }

    goBack=()=>{
        /*let cart = JSON.parse(localStorage.getItem('shopping-cart'));
        if(cart.length > 0){
            this.toggle();
        }else{*/
            this.props.history.goBack();
        //}
    }

    confirmBack=()=>{
        this.toggle();
        this.props.history.goBack();
    }
	
	

    doPay = () =>{
		confirmAlert({
		  message: 'Are you sure want to pay this cart?',
		  buttons: [
              {
                  label: this.globallang.yes,
                  onClick: () => {
                      let param = {
                          orderid: this.state.orderid,
                          phoneno: this.state.phoneno,
						  total: this.state.counterprice,
						  status: this.state.status,
						  communityid: this.state.communityid,
						  orderdetailid: this.state.orderdetailid,
						  merchantid: this.state.merchantId,
                          orderdetail: this.state.commodity
                      }
                      axios.post(webserviceurl + '/app_insert_order.php', param,
                        {headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
                            .then((response) => {
                                let result = response.data;
                                
                                if (result.status === "OK") {
                                    alert(this.language.success);
                                    this.props.history.push('/onlinestore/0');
                                }else{
                                    alert(result.message);
                                }
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                      
                }
              },
              {
                label: this.globallang.no,
                
              }
            ]
		})
	}

	renderCategory=()=>{
        if(this.state.merchantData.merchantcategoryname !== undefined && this.state.merchantData.merchantcategoryname !== ''){
            return (
                <div className="category">{this.state.merchantData.merchantcategoryname}</div>
            )
        }
    }
	
    renderCategoryList=()=>{
        if(this.state.merchantData.category !== undefined){
            return (
                <div>
                {this.state.merchantData.category.map((category, i)=>
                    <div  key={i} onClick={()=>this.changeCategory(category.commoditycategoryid)} className={`category-item ${category.commoditycategoryid === this.state.currentCommodityCategory ? 'active': ''}`}>
                        {category.commoditycategoryname}
                    </div>
                )}
                </div>
            )
        }
    }

    renderCommodity=()=>{
        if(this.state.commodity !== undefined && this.state.commodity.length>0){
            return (
                <div className="commodity-list-container">
                {this.state.commodity.map((item, i)=>
                    <CommodityCartItem key={i} id={item.commodityid} name={item.commodityname} shortdesc={item.shortdesc} category={item.commoditycategoryname} tags={item.tags} pic={item.commoditypic[0]} price={item.price} qty={item.qty} updateQty={this.updateQty} sold={0}  />
                )}
                </div>
            )
        }else{
            return (
                
                    <div className="no-data-available">{this.language.nodata}</div>
                
            )
        }
    }

    renderTab=()=>{
            return (
                <div>
                    <div className="menu-section-container" >
                        <table style={{minHeight: window.innerHeight - (252 + 45) + 'px', maxWidth: window.innerWidth+'px', tableLayout:'fixed' }}>
                            <tbody>
                                <tr>
                                    <td className="menu-column">
                                        {this.renderCommodity()}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )
    }

    render() {
        if (this.state.redirect) {
            /*if (this.state.page == "newspage") {
                return <Redirect to='/news' />;
            }*/
        }

        let listtags = [];
        if(this.state.merchantData.tags !== undefined)
            listtags = this.state.merchantData.tags;

        let profileimg = require('../../../images/default.png');
        if(this.state.merchantData.merchantpic !== undefined && this.state.merchantData.merchantpic[0] !== "")
        profileimg = this.state.merchantData.merchantpic[0]

        return (
            <div className="main-container merchant-payment">
                <SubHeader history={this.props.history} goBack={this.goBack}/>
                <div >
                    <div className="profile-outer-container">
                        <div className="profile-inner-container">
                            <div className="profile-name">{this.state.merchantName}</div>
                            <div className="profile-desc">Rp. {numberFormat(this.state.counterprice)}</div>
                            <div className="profile-items">
							{this.state.counteritem} {this.state.label}
                            </div>
                        </div>
                    </div>
                    {this.renderTab()}
					
                </div>
				
				<div className="payment-button-container">
                    <Button color="primary" className="fullbutton" onClick={() => this.doPay()}>{this.language.pay}</Button>
                </div>
				
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>{this.language.confirmation}</ModalHeader>
                <ModalBody>
                    {this.language.areyousure}
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.confirmBack}>{this.language.yes}</Button>{' '}
                    <Button color="secondary" onClick={this.toggle}>{this.language.no}</Button>
                </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default MerchantPayment;