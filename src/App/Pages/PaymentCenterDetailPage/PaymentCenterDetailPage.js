import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
import {Button, Form, FormGroup, Label, Input, Container, Row, Col, Modal, ModalHeader, ModalFooter, ModalBody } from 'reactstrap';
import axios from 'axios';
import './PaymentCenterDetailPage.style.css';
import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { confirmAlert } from 'react-confirm-alert';
import ReactModal from 'react-modal';
/* import 'react-confirm-alert/src/react-confirm-alert.css'; */
import Popup from "reactjs-popup";
import PaymentForm from './PaymentForm/PaymentForm';
import PaymentFormBCA from './PaymentForm/PaymentFormBCA';
//import Modal from '../../Component/Modal/Modal';
// import Modal from 'react-bootstrap/Modal';
import '../../Component/Modal/Modal.css';


class PaymentCenterDetailPage extends Component {

    constructor(props) {
        super(props);
        this.language = getLanguage(activelanguage, 'paymentcenterdetail');
        this.globallang = getLanguage(activelanguage, 'global');
        this.toggle = this.toggle.bind(this);
		
		
        this.state = {
            page: "",
            redirect: false,
            id: props.match.params.paymentid,
            currentTab: 0,
			data:{},
            billingstatus: 0,
            isShowing: false,
            modal: false,
            activeTab: '1'
        }

        
    }

    toggle() {
        this.setState(prevState => ({
          modal: !prevState.modal
        }));
      }

    loadBillingDetail = () => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_userbillingdetail.php',
            data: { userbillingid : this.state.id },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
        .then((response) => {
            let result = response.data;
            if (result.status === "OK") {
                let data = result.record;
                let monthName = '';
                switch(parseInt(data.periodmonth)){
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
                data.monthname = monthName;
				
                this.setState({data: data});
				this.setState({billingstatus: data.billingstatus});
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    
    componentDidMount=()=>{
        this.waitForBridge();
        this.loadBillingDetail();
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

    openModalHandler = () => {
        this.setState({
            isShowing: true,
            modal:false
        });
    }

    closeModalHandler = () => {
        this.setState({
            isShowing: false
        });
    }
    openModalBCA = () => {
        this.setState({
            isShowing2: true,
            modal:false
        });
    }

    closeModalBCA = () => {
        this.setState({
            isShowing2: false
        });
    }

	/* doPay = () =>{
		confirmAlert({
		  message: 'Are you sure want to pay this billing?',
		  buttons: [
			{
				label: 'XENDIT',
				onClick: () => {
					//alert('Thank you. Your payment has been saved and will be processed soon.');
                    // this.props.history.go(-1);
                    this.openModalHandler();				
			   }
			},
			{
			  label: 'BCA',
			  onClick: () => {
                  this.openModalBCA();
              }
			}
		  ]
		})
    } */
	renderPayButton=()=>{

		if(this.state.billingstatus !== 1){
            return (
                <div className="payment-button-container">
                    {/* <Button color="primary" className="fullbutton" onClick={() => this.doPay()}>{this.language.pay}</Button> */}
                    <Button color="primary" className="fullbutton" onClick={this.toggle}>{this.language.pay}</Button>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>Select Payment</ModalHeader>
                        <ModalBody>
                            <Row className="text-center">
                                <Col xs="6"><Button color="secondary" size="lg" block onClick={() => this.openModalHandler()}>XENDIT</Button></Col>
                                <Col xs="6"><Button color="primary" size="lg" block onClick={() => this.openModalBCA()}>BCA</Button></Col>
                            </Row>                          
                        </ModalBody>
                    </Modal>
                </div>
                
            )
        }
    }

    renderPaidDate=()=>{
        if(this.state.data.billingstatus === 1){
            return (
                <tr>
                    <td className="payment-info-label">{this.language.paiddate}</td>
                    <td className="payment-info-value paid">{this.state.data.paiddate}</td>
                </tr>
            )
        }
    }

    renderStatus=()=>{
        if(this.state.data.billingstatus === 0){
            return(
                <tr>
                    <td className="payment-info-label">{this.language.status}</td>
                    <td className="payment-info-value pending">{this.language.pending}</td>
                </tr>
            )
        }else if(this.state.data.billingstatus === 1){
            return (
                <tr>
                    <td className="payment-info-label">{this.language.status}</td>
                    <td className="payment-info-value paid">{this.language.paid}</td>
                </tr>
            )
        }
    }

    render() {
        if (this.state.redirect) {
            /*if (this.state.page == "newspage") {
                return <Redirect to='/news' />;
            }*/
        }

        return (
        
            <div className="main-container payment-page">
            <PaymentForm
                isShowing={this.state.isShowing} 
                billingamount={this.state.data.billingamount}
                onClose={this.closeModalHandler}
            />
            <div>
                {/* <ReactModal>
                    tes
                </ReactModal> */}
                 <PaymentFormBCA 
                isShowing2={this.state.isShowing2} 
                billingamount={this.state.data.billingamount}
                onClose={this.closeModalBCA}
            />
            </div>
           
                
            <SubHeader history={this.props.history} hideSearch={true} title={this.language.title} />
                <div className="park-introduction"> 
                    <div className="payment-title">
                        {this.state.data.billingcategoryname+' '+this.state.data.monthname+' '+this.state.data.periodyear}
                    </div>
                    <div className="payment-amount">
                        Rp. {this.state.data.billingamount}
                        <div className="payment-amount-label">{this.language.amount} :</div>
                    </div>
                    <div className="payment-issuedate">
                        {this.state.data.insert}
                    </div>
                    <table className="payment-info-container">
                        <tbody>
                            <tr>
                                <td className="payment-info-label">{this.language.periode}</td>
                                <td className="payment-info-value">{this.state.data.monthname+' '+this.state.data.periodyear}</td>
                            </tr>
                            <tr>
                                <td className="payment-info-label">{this.language.type}</td>
                                <td className="payment-info-value">{this.state.data.billingcategoryname}</td>
                            </tr>
                            <tr>
                                <td className="payment-info-label">{this.language.name}</td>
                                <td className="payment-info-value">{this.state.data.name}</td>
                            </tr>
                            <tr>
                                <td className="payment-info-label">{this.language.phone}</td>
                                <td className="payment-info-value">{this.state.data.phoneno}</td>
                            </tr>
                            <tr>
                                <td className="payment-info-label">{this.language.address}</td>
                                <td className="payment-info-value">{this.state.data.address}</td>
                            </tr>
                            {this.renderStatus()}
                            {this.renderPaidDate()}
                        </tbody>
                    </table>
                    {this.renderPayButton()}
                </div>
            </div>
        );
    }
}

export default PaymentCenterDetailPage;