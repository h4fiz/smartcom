import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import './PaymentCenterPage.style.css';
import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import more from '../../../images/marketplace/more.png';

import PaymentCenterListItem from '../../Component/PaymentCenterListItem/PaymentCenterListItem';


class PaymentCenterPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: "",
            redirect: false,
            //list:[{name:'PLN Billing', category:'', tags:[], pic:"bulp", shortdesc:"October pln billing payment"},
			//	  {name:'Water Billing', category:'', tags:[], pic:"tint", shortdesc:"October water billing payment"}],
			list: [],
            icons: [],
			all: [
                { id: 0, image: more, label: "All"}
            ],
            currentCategory: 0,
			start: 0,
			loadPaymentFinished: false
        }

        this.language = getLanguage(activelanguage, 'paymentcenter');
		this.listel = null;
    }

	loadPayment = (id) =>{
        this.state.currentCategory = id;
		axios.post(webserviceurl + '/app_load_payment.php', {
            id: id,
			start: this.state.start
		},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) => {
                let result = response.data;
                let limitafterload = this.state.start + 10;
                if (result.status === "ok") {
					if(result.records.length == 0){
						this.setState({loadPaymentFinished: true});
					}
					
					let tmp = this.state.list;
					
					for(var i=0; i<result.records.length;i++){
						tmp.push(result.records[i]);
					}
					
					this.setState({ list: tmp });
					this.setState({ start: limitafterload});
				}
				
            })
            .catch((error) => {
                console.log(error);
            });
	}
	
	loadPaymentCategory = () => {
		axios.post(webserviceurl + '/app_load_paymentcategory.php', {
			
		},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				var tmp = [];
				
				for(var i = 0; i < response.data.records.length; i++){	
					var a = {};
					
					a.id = response.data.records[i].billingcategoryid;
					a.image = response.data.records[i].icon;
					a.label = response.data.records[i].billingcategoryname;
					
					tmp.push(a);
				}
				
				this.setState({icons: tmp});
            })
            .catch((error) =>{
                console.log(error);
				alert(error);
            });
	}

	componentDidMount = () => {
        this.waitForBridge();
		this.loadPayment(0);
		this.loadPaymentCategory();
		this.listel = document.getElementById('list-payment');
        this.listel.addEventListener('scroll', (e)=>{
            this.scrollCheck();
        });
	}
	
	componentWillUnmount=()=>{
        this.listel.removeEventListener('scroll', (e)=>{
            this.scrollCheck();
        });
    }
	
	scrollCheck = ()=>{
        if(this.listel.scrollTop + this.listel.clientHeight >= this.listel.scrollHeight){
            if(this.state.loadPaymentFinished == false){
				this.loadPayment(this.state.currentCategory, this.state.start);
			}
        }
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
            let param = '{"title":"' + this.language.title + '","canGoBack":true, "showCommunityName":true, "hideTopbar":true, "hideFooterMenu":true}';
            window.postMessage(param, "*");
        }
    }

    createMarkup = (content) => {
        return { __html: content };
    }

    goToDetail=(item)=>{
        this.props.history.push('/paymentcenterdetail/'+item.userbillingid);
    }

    renderTab = () => {
        return (
                <div className="body-section payment-scroll-view">
                    {this.state.list.map((item, i) =>
                        <div key={i} onClick={()=>this.goToDetail(item)}>
                            <PaymentCenterListItem key={i} category={item.billingcategoryname} billingamount={item.billingamount} periodmonth={item.periodmonth} periodyear={item.periodyear} customerid={item.customerid}  pic={item.pic} billingstatus={item.billingstatus} paiddate={item.paiddate} address={item.address} onClick={()=>this.goToDetail(item)}/>
                        </div>
                    )}
                </div>
            )
    }

    renderLink = (icon)=>{
        if(icon.id === this.state.currentCategory){
            return (<div className="payment-link-label payment-link-active" onClick={() => this.loadPayment(icon.id)}><img src={icon.image} /><br />{icon.label} </div>)
        }else{
            return (<div className="payment-link-label" onClick={() => this.loadPayment(icon.id)}><img src={icon.image} /><br />{icon.label} </div>)
        }
    }

    render() {
        if (this.state.redirect) {
            /*if (this.state.page == "newspage") {
                return <Redirect to='/news' />;
            }*/
        }

        return (
            <div className="main-container">
                <SubHeader history={this.props.history} hideSearch={true} title={this.language.title}/>
                
                <div className="payment-icons" id="list-payment">
                    <div className="payment-icons-container">
                        <table className="table-icon">
                            <tbody>
                                <tr>
                                {this.state.all.map((icon, i) => 
                                    <td>
                                        <div key={i} className="payment-icon-column">
                                            {this.renderLink(icon)}
                                        </div>
                                    </td>
                                )}
                                {this.state.icons.map((icon, i) => 
                                    <td>
                                        <div key={i} className="payment-icon-column">
                                            {this.renderLink(icon)}
                                        </div>
                                    </td>
                                )}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {this.renderTab()}
                
            </div>
        );
    }
}

export default PaymentCenterPage;