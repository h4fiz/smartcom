import React, { Component } from 'react';
//import { Link, Redirect } from 'react-router-dom';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

import axios from 'axios';
import './MerchantProfilePage.style.css';

import CommodityListItem from '../../Component/CommodityListItem/CommodityListItem';
import CommodityCartItem from '../../Component/CommodityCartItem/CommodityCartItem';
import SubHeader from '../../Component/SubHeader/SubHeader';

import { getLanguage } from '../../../Languages';
import { webserviceurl, activelanguage } from '../../../Config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import banner from '../../../images/fastfood.jpg';
import { numberFormat } from '../../../Global';

import { confirmAlert } from 'react-confirm-alert'; 

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '55%',
    right                 : '-20%',
    bottom                : '-30%',
    transform             : 'translate(-50%, -50%)'
  }
};

class MerchantProfilePage extends Component {

    constructor(props) {
        super(props);
        this.language = getLanguage(activelanguage, 'merchantprofile');
        this.globallang = getLanguage(activelanguage, 'global');
		this.state = {
            merchantId: props.match.params.merchantid,
            merchantData:{},
            currentCommodityCategory:0,
            commodity:[],
            commodityShow:[],
            modal:false,
            currentTab: 0,
            tabs:[{id:0, name:this.language.menu},{id:1, name:this.language.comments},{id:2, name:this.language.info}],
			counteritem: 0,
			counterprice: 0,
			modalIsOpen: false,
			label: "Items",
			orderid: 0,
			orderdetailid: 0,
			phoneno: '',
			addresslist: [],
			addresslabel: '',
			address: '',
			status: 0,
			communityid: 1
        }
        
        this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
        //localStorage.setItem('shopping-cart', JSON.stringify([]));
    }
	
	closeModal() {
		this.setState({modalIsOpen: false});
	}
	
	openModal = () => {
		this.setState({modalIsOpen: true});
	}

    componentDidMount=()=>{
		this.loadUser();
        this.waitForBridge();
        this.loadData();
    }
	
	loadUser=()=>{
		if(localStorage.getItem('smart-app-id-login') != undefined && localStorage.getItem('smart-app-id-login') != 'undefined'){
			var com = window.localStorage.getItem('smart-app-id-login');
			var login = JSON.parse(com);
			
			this.setState({phoneno : login[0].phonenumber===undefined?"":login[0].phonenumber});
		}
	}

    loadData= () => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_merchantprofile.php',
            data: {
                merchantid: this.state.merchantId
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
        .then((response) => {
            let result = response.data;
            if (result.status === "OK") {
                /*for (var i = 0; i < result.records.length; i++) {
                    result.records[i].shortdesc = decodeURIComponent(result.records[i].shortdesc);
                }*/
                let commodity = result.record.commodity;
                let storage = JSON.parse(localStorage.getItem('shopping-cart'));
				if (storage == null) storage = [];

                let qty = 0;
                let subtotal = 0;
                for(let i=0; i<commodity.length;i++){
                    commodity[i].qty = 0;
                    for(let j=0; j<storage.length;j++){
                        if(commodity[i].commodityid === storage[j].commodityid){
                            commodity[i].qty = storage[j].qty;
                            break;
                        }

                    }
                    qty += commodity[i].qty;
                    subtotal += commodity[i].qty * commodity[i].price;
                }

                this.setState({ merchantData: result.record, commodity: commodity, currentCommodityCategory: result.record.currentcategory, counteritem: qty, counterprice: subtotal });

            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    loadCommodity=(id)=>{
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_commodity.php',
            data: {
                category: id,
                merchantid: this.state.merchantId
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
        .then((response) => {
            let result = response.data;
            if (result.status === "OK") {
                /*for (var i = 0; i < result.records.length; i++) {
                    result.records[i].shortdesc = decodeURIComponent(result.records[i].shortdesc);
                }*/
                /*let commodity = result.records;
                let storage = JSON.parse(localStorage.getItem('shopping-cart'));
                for(let i=0; i<commodity.length;i++){
                    commodity[i].qty = 0;
                    for(let j=0; j<storage.length;j++){
                        
                        if(commodity[i].commodityid === storage[j].commodityid){
                            commodity[i].qty = storage[j].qty;
                            break;
                        }

                    }
                }*/
				
                this.setState({ commodity: result.records });
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }    
	
	loadAddress=(phonenumber)=>{
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_address.php',
            data: {
                phoneno: phonenumber
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
        .then((response) => {
            let result = response.data;
            if (result.status === "OK") {				
                this.setState({ addresslist: result.records });
				this.setState({ address: result.records[0].address});
            }
        })
        .catch(function (error) {
            console.log(error);
        });
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

    goToAbout=()=>{
        //ke about
    }
    goBack=()=>{
        let cart = JSON.parse(localStorage.getItem('shopping-cart'));
		if (cart == null) cart = [];
        if(cart.length > 0){
            this.toggle();
        }else{
            this.props.history.goBack();
        }
    }

    confirmBack=()=>{
        this.toggle();
        localStorage.setItem('shopping-cart', JSON.stringify([]));
        this.props.history.goBack();
    }

    changeCategory=(id)=>{
        this.setState({currentCommodityCategory: id});
        this.loadCommodity(id);
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
		
		let lbl = this.state.label;
				if(tempcounter == 1)
					lbl = "Item";
		
        this.setState({commodity: commodity});
		this.setState({counteritem: tempcounter});
		this.setState({counterprice: tempprice});

        //update localstorage shopping-cart
        let isExist = false;
        let cart = JSON.parse(localStorage.getItem('shopping-cart'));
		if (cart == null) cart = [];
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

    changeTab=(id)=>{
        this.setState({currentTab: id});
    }
	
	changeAddress=(event)=>{
		let eve = event.target.value;
		this.setState({addresslabel: eve});
		
		let check = this.state.addresslist;
		
		for(var i=0;i<check.length;i++){
			if(check[i].label == eve){
				this.setState({address: check[i].address});
			}
		}
	}
	
	goToDetail=(merchantData)=>{
		window.localStorage.setItem('merchant', JSON.stringify(this.state.merchantData));
		//this.props.history.push('/merchantpayment/'+this.state.merchantId);
		this.openModal();
	}
	
	doPay = () =>{	
		if(this.state.counteritem < 1){
			alert (this.language.validation);
			return false;
		}
		
		else {
			this.closeModal();
			confirmAlert({
			  message: 'Are you sure want to pay this cart?',
			  buttons: [
				  {
					  label: this.globallang.yes,
					  onClick: () => {
						  let param = {
							  orderid: this.state.orderid,
							  phoneno: this.state.phoneno,
							  label: this.state.addresslabel,
							  address: this.state.address,
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
	}

    /*renderBanner=()=>{
        if(this.state.merchantData.merchantpic !== undefined && this.state.merchantData.merchantpic[0] !== ""){
            return (
                <div className="picture-container">
                    <img src={this.state.merchantData.merchantpic[0]} />
                </div>
            )
        }else{
            return (
                <div className="picture-container">
                    <img src={require('../../../images/default.png')} />
                </div>
            )
        }
    }

    renderPicture=()=>{
        if(this.state.merchantData.merchantpic !== undefined && this.state.merchantData.merchantpic[0] !== "" ){
            return (
                <div className="imgitem-container">
                    <img src={this.state.merchantData.merchantpic[0]} alt={'imgpic'}/>
                </div>
            )
        }else{
            return (
                <div className="imgitem-container">
                    <img src={require('../../../images/default.png')} alt={'imgpic'} className="imgdefault"/>
                </div>
            )
        }
    }*/

    renderCategory=()=>{
        if(this.state.merchantData.merchantcategoryname !== undefined && this.state.merchantData.merchantcategoryname !== ''){
            return (
                <div className="category">{this.state.merchantData.merchantcategoryname}</div>
            )
        }
    }

    renderAboutUs=()=>{
        /*if(this.state.productData.about !== '' && this.state.productData.about !== undefined){
            return <span className="aboutus-link" onClick={()=>this.goToAbout()}>{this.language['about']}</span>
        }*/
    }

    /*renderInfo=()=>{
        let listtags = [];
        if(this.state.merchantData.tags !== undefined)
            listtags = this.state.merchantData.tags;
        return (
                <div className="merchant-info">
                    
                    <div className="relative-container">
                        {this.renderPicture()}
                        <div className="data-container">
                            <div className="name-container">{this.renderCategory()} {this.state.merchantData.name}</div>
                            <div className="shortdesc-container" dangerouslySetInnerHTML={{__html: this.state.merchantData.shortdesc}}></div>
                            <div className="tags-container">
                                {
                                    listtags.map((tag,i)=>{
                                        if(tag !== '')
                                            return <div key={i} className="tag">{tag}</div>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
        ) 
    }*/

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
                <div className="commodity-list-container"  >
                {this.state.commodity.map((item, i)=>
                    <CommodityListItem key={i} id={item.commodityid} name={item.commodityname} shortdesc={item.shortdesc} category={item.commoditycategoryname} tags={item.tags} pic={item.commoditypic[0]} price={item.price} qty={item.qty} updateQty={this.updateQty} sold={0} />
                )}
                </div>
            )
        }else{
            return (
                
                    <div className="no-data-available">{this.language.nodata}</div>
                
            )
        }
    }

    renderCartButton=()=>{
        let cart = JSON.parse(localStorage.getItem('shopping-cart'));
        if(cart.length > 0){
            return (
                <div className="shopping-cart-button-container">
                    <FontAwesomeIcon icon="shopping-cart" className="list-icon" /> {this.language.cart}
                </div>
            )

        }
    }

    renderTab=()=>{
        if(this.state.currentTab === 0){
            return (
                <div>
                    <div className="menu-banner-container">
                        <img src={banner} alt="banner"/>
                    </div>
                    <div className="menu-section-container" >
                        <table style={{minHeight: window.innerHeight - (252 + 45) + 'px', maxWidth: window.innerWidth+'px', tableLayout:'fixed' }}>
                            <tbody>
                                <tr>
                                    <td className="category-column">
                                        {this.renderCategoryList()}
                                    </td>
                                    <td className="menu-column">
                                        {this.renderCommodity()}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        }else if(this.state.currentTab === 1){
            return (
                <div className="no-info">
                    {this.language.nocomment}
                </div>
            )
        }else {
            
            let list = [];
            if(this.state.merchantData !== undefined && this.state.merchantData.info !== undefined)
                list =this.state.merchantData.info;

            //list = [{field: 'testing', value: 'hahaha'}, {field: 'testing', value: 'hahaha'}, {field: 'testing', value: 'hahaha'}, {field: 'testing', value: 'hahaha'}]

            if(list.length>0){
                return (
                    <div className="merchant-info-container">
                        <table>
                            <tbody>
                                {list.map((info, i)=>
                                <tr key={i}>
                                    <td style={{width:'100px'}}>{info.field}</td>
                                    <td style={{width:'10px'}}>:</td>
                                    <td>{info.value}</td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )
            }else{
                return (
                    <div className="no-info">
                        {this.language.noinfo}
                    </div>
                )
            }
            
        }
    }
	
	renderCart=(item, i)=>{
		if(item.qty > 0){
			return(
				<CommodityCartItem key={i} id={item.commodityid} name={item.commodityname} shortdesc={item.shortdesc} category={item.commoditycategoryname} tags={item.tags} pic={item.commoditypic[0]} price={item.price} qty={item.qty} updateQty={this.updateQty} sold={0}  />
			)
		}
	}
	
	renderAddress=()=>{
		return(
			<div>
				<div className="field-container">
                    <div className="field-label">{this.language.deliver}</div>
                        <div className="field-value">
                            <select value={this.state.addresslabel} onChange={this.changeAddress}>
								{this.state.addresslist.map((addresslist,i)=>
                                        <option value={addresslist.label}>{addresslist.label}</option>
                                        )}
							</select>
						</div>
				</div>
				<div className="field-container">
                        <div className="field-label">{this.language.address}</div>
                        <div className="field-value">
                            <textarea rows="3" disabled="disabled" value={this.state.address} >     
                            </textarea>
                        </div>
                </div>
			</div>
		)
	}
	
	renderCommodityCart=()=>{
        if(this.state.commodity !== undefined && this.state.commodity.length>0){
            return (
                <div className="commodity-list-container">
                {this.state.commodity.map((item, i)=>
                    this.renderCart(item, i)
                )}
				{this.renderAddress()}
                </div>
            )
        }else{
            return (
                
                    <div className="no-data-available">{this.language.nodata}</div>
                
            )
        }
    }

    renderTabCart=()=>{
            return (
                <div>
                    <div className="menu-section-container" >
                        <table style={{minHeight: window.innerHeight - (252 + 45) + 'px', maxWidth: window.innerWidth+'px', tableLayout:'fixed' }}>
                            <tbody>
                                <tr>
                                    <td className="menu-column">
                                        {this.renderCommodityCart()}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )
    }
	
	renderModal() {
		return (
			<Modal
				isOpen={this.state.modalIsOpen}
				onRequestClose={this.closeModal}
				style={customStyles}
			>
			<div className="main-container merchant-payment">
				<div className="close-button"onClick={()=>this.closeModal()}>X</div>
                    <div className="profile-outer-container">
                        <div className="profile-inner-container">			
                            <div className="profile-name">{this.state.merchantData.name}</div>
                            <div className="profile-desc">Rp. {numberFormat(this.state.counterprice)}</div>
                            <div className="profile-items">
							{this.state.counteritem} {this.state.label}
                            </div>
                        </div>
                    </div>
                    {this.renderTabCart()}
					
                </div>
				
				<div className="payment-button-container">
                    <Button color="primary" className="fullbutton" onClick={() => this.doPay()}>{this.language.pay}</Button>
                </div>
			</Modal>
		);
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
        profileimg = this.state.merchantData.merchantpic[0];

        let floatingDiv = "";
        if(this.state.counteritem > 0)
            floatingDiv = (
                <div className="floating-cart" onClick={() => this.goToDetail()}>
                    <table className="table-cart">
                        <tr>
                            <td >
                                <FontAwesomeIcon icon="shopping-cart" className="list-icon cart-icon" />&nbsp;&nbsp; {this.state.counteritem} item(s)
                            </td>
                            <td className="total-col">
                                Rp. {numberFormat(this.state.counterprice)}
                            </td>
                        </tr>
                    </table>
                </div>
            )

        return (
            <div className="main-container merchant-profile">
                <SubHeader history={this.props.history} goBack={this.goBack}/>
                <div className=" merchant-profile">

                    {/*this.renderBanner()*/}
                    {/*this.renderInfo()*/}
                    <div className="profile-outer-container">
                        <div className="profile-inner-container">
                            <div className="profile-name">{this.state.merchantData.name}</div>
                            <div className="profile-desc" dangerouslySetInnerHTML={{__html: this.state.merchantData.shortdesc}}></div>
                            <div className="profile-tags">
                                {
                                    listtags.map((tag,i)=>{
                                        if(tag !== '')
                                            return <div key={i} className="tag">{tag}</div>
                                    })
                                }
                            </div>
                            <div className="profile-img">
                                <img src={profileimg} alt="img-profile" />
                            </div>
                        </div>
                    </div>
                    <div className="tabs-container">
                        {this.state.tabs.map((tab,i)=>
                            <div key={i} className={`tab ${this.state.currentTab === tab.id ? 'tab-active' : ''}`} onClick={()=>this.changeTab(tab.id)}>
                                {tab.name}
                            </div>    
                        )}
                    </div>
                    {this.renderTab()}
					
					
					
                </div>
				
				{this.renderModal()}
				
				{floatingDiv}
				
                {/*this.renderCartButton()*/}
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

export default MerchantProfilePage;