import React, { Component } from 'react';
import { Button, Container, Row, Col, Form, FormGroup, Label, Input, InputGroup, InputGroupAddon, FormText} from 'reactstrap';
import ReactModal from 'react-modal';
import  BCA  from '../../../../images/BCA.png';
import './Stylebca.css';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Countdown from 'react-countdown-now';

class PaymentFormBCA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nama_rekening: 'HAFIZ PRASETYO',
            nomor_VA: '1076613291419',
            copied: false,
        }
    }
    /* onChange = (name)=> (event) => {
        this.setState({
            [name]:event.target.value
        })  
    } */
    
    render() {
        return (
            <ReactModal isOpen={this.props.isShowing2} className="modal_payment" >
                <div className="header">
                    <h3>Pembayaran Virtual Account BCA</h3>
                </div>
                <div className="body">
                    <Row>
                        <Col>
                        <Form>
                            <FormGroup>
                                <img src={BCA} alt=""/>
                            </FormGroup>

                            <FormGroup>
                                <h3 className="text-danger text-center">
                                    <Countdown 
                                        date={Date.now() + 7200000} 
                                        daysInHours={true}
                                    />
                                </h3>
                                
                            </FormGroup>

                            <FormGroup>
                                <Label>Nomor Virtual BCA</Label>
                                <InputGroup>
                                    <Input value={this.state.nomor_VA} onChange={({target: {nomor_VA}}) => this.setState({nomor_VA, copied: false})} disabled/>
                                    <InputGroupAddon addonType="append" >
                                        <CopyToClipboard text={this.state.nomor_VA} onCopy={() => this.setState({copied: true})}>
                                            <button color="secondary">Copy</button>
                                        </CopyToClipboard>
                                    </InputGroupAddon>
                                    <br></br>
                                    <FormText>
                                        {this.state.copied ? <span style={{color: 'red'}}>Copied.</span> : null}
                                    </FormText>
                                </InputGroup>
                                <Input value={this.state.nomor_VA} disabled/>
                            </FormGroup>

                            <FormGroup>
                                <Label>Nama Rekening</Label>
                                <Input value={this.state.nama_rekening} disabled/>
                            </FormGroup>
                        </Form>
                        </Col>
                    </Row>
                    
                </div>
                <div className="footer">
                    <Button type="button" color="primary" onClick={this.props.onClose}>Done</Button>
                </div>
            </ReactModal>
        );
    }
}

export default PaymentFormBCA;