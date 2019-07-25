import React, { Component } from 'react';
import {Button, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
import ReactModal from 'react-modal';
//import Xendit from 'xendit-js-node';
const Xendit= window.Xendit;
class PaymentForm extends Component{
    constructor(props){
        super(props)

        this.state ={
            creditcard:'4000000000000002',
            amount: props.billingamount,
            expmonth:'12',
            expyear:'2020',
            cvn:'123',
            showconfirm: false,
            paymenturl: ''
        }
    }

    onChange = (name)=> (event) => {
        this.setState({
            [name]:event.target.value
        })  
    }

    onSubmit = () =>{
        Xendit.setPublishableKey('xnd_public_development_OYqIfOUth+GowsY6LeJOHzLCZtSj84J9kXDn+Rxj/mbf/LCoCQdxgA==');
       // alert('123');
        const tokenData= {     
            // amount: parseInt(this.props.billingamount),
            // cardNumber: this.state.creditcard,
            // cardExpMonth: this.state.expmonth,
            // cardExpYear: this.state.expyear,
            // cardCvn: this.state.cvn,
            // isMultipleUse: false,
            // isSkip3DS: false,
            // isTokenizing: false,
            // isRenderWebview: false,
            // webviewUrl: ''
            "amount": parseInt(this.props.billingamount),
            "card_number": this.state.creditcard,
            "card_exp_month": this.state.expmonth,
            "card_exp_year": this.state.expyear,
            "card_cvn": this.state.cvn,
            "is_multiple_use": false,
            "should_authenticate": true,
            "meta_enabled": false
      } 
        //console.log(this.props.billingamount);
        // console.log(tokenData);
        // return false;
        Xendit.card.createToken(tokenData,this._tokenResponseHandler)
    }

    _tokenResponseHandler =(err, token) => {
        if (err) {
          alert(JSON.stringify(err));
    
          return;
        }
       
        console.log("------ "+JSON.stringify(token));
        console.log("Toekn status : "+token.status);
        switch (token.status) {
          case 'APPROVED':
          case 'VERIFIED':
                alert('Sukses');
            this.props.onClose();
                break;
          case 'FAILED':
            alert(JSON.stringify(token));
            this.props.onClose();
            break;
            
          case 'IN_REVIEW':  
            this.showPaymentframe(token.payer_authentication_url);    
            break;
          default:
            alert('Unknown token status');
            break;
        }
      }
      showPaymentframe = (url) =>{
        this.setState({
            showconfirm: true,
            paymenturl: url
        })
    }


    hidePaymentframe = () =>{
        this.setState({
            showconfirm: false,
            
        })
    }


    render(){
        return(
        <ReactModal isOpen={this.props.isShowing} className="modal_payment">
 {this.state.showconfirm &&  <iframe id="payerxendit" name="payerxendit" src={this.state.paymenturl} height="500" width="500"/> ||
 <Form className="formpayment">
           <FormGroup>
               <Label className="labelpayment" for="creditcard">Credit Card</Label>
               <Input type="text" name="creditcard" id="creditcard"  value={this.state.creditcard} onChange={this.onChange('creditcard')}/>
           </FormGroup>
           <FormGroup>
               <Label className="labelpayment" for="Amount">Amount</Label>
               <Input readOnly="readonly" name="Amount" id="Amount" value={this.props.billingamount} />
           </FormGroup>
           <Row form>
           <Col md={4}>
           <FormGroup> 
               <Label className="labelpayment" for="exp">Exp Month</Label>
               <Input type="number" name="expmonth" id="exp"  value={this.state.expmonth} onChange={this.onChange('expmonth')}/>
           </FormGroup>
           </Col>
           <Col md={4}>
           <FormGroup>
               <Label className="labelpayment" for="year">Exp Year</Label>
               <Input type="number" name="expyear" id="year"  value={this.state.expyear} onChange={this.onChange('expyear')} />
           </FormGroup>
           </Col>
           <Col md={4}>
           <FormGroup>
               <Label className="labelpayment" for="cvn">CVN</Label>
               <Input type="password" name="cvn" id="cvn" maxLength="3" value={this.state.cvn} onChange={this.onChange('cvn')}/>
           </FormGroup>
           </Col>
           </Row>
   <Button type="button" onClick={this.onSubmit}>Submit</Button>
   &nbsp;
   <Button type="button" onClick={this.props.onClose}>Cancel</Button>
 </Form>
}
 </ReactModal>
)

    }


}
export default PaymentForm; 