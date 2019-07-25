import React, { Component } from 'react';
//import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
import { Container, Row, Col, Input } from 'reactstrap';
import axios from 'axios';
import './ServiceCenterForm.style.css';
import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//import { numberFormat } from '../../../Global';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

import ServiceCenterList from '../../Component/ServiceCenterList/ServiceCenterList';

import { confirmAlert } from 'react-confirm-alert'; 

class ServiceCenterForm extends Component {

    constructor(props) {
        super(props);
        this.language = getLanguage(activelanguage, 'servicecenterform');
        this.globallang = getLanguage(activelanguage, 'global');

        this.state = {
            page: "",	
            redirect: false,
			servicecentercategoryid: props.match.params.servicecentercategoryid,
			servicecenter: [],
			servicecenterid: '',
			servicecentername: '',
            title: 'Service Center',
			userserviceid: 0,
			userservicedetailid: 0,
			counterprice: 0,
            requestdate: moment(),
            note:'',
			communityid: 1
        }
        
    }

    componentDidMount=()=>{
        this.waitForBridge();
        this.loadServiceCenter();
		this.loadUser();
    }
	
	loadServiceCenter = () => {
        axios.post(webserviceurl + '/app_load_servicecenterlist.php', {
			servicecentercategoryid: this.state.servicecentercategoryid
        },
        {headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) => {
                let result = response.data;
                
                if (result.status === "OK") {
                    this.setState({ servicecenter: result.records});
                }
                
            })
            .catch((error) => {
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
            let param = '{"title":"' + this.language.title + '","canGoBack":true, "showCommunityName":true, "hideTopbar":true, "hideFooterMenu":true}';
            window.postMessage(param, "*");
        }
    }
	
	loadUser=()=>{
		if(localStorage.getItem('smart-app-id-login') != undefined && localStorage.getItem('smart-app-id-login') != 'undefined'){
			var com = window.localStorage.getItem('smart-app-id-login');
			var login = JSON.parse(com);
			
			this.setState({phoneno : login[0].phonenumber===undefined?"":login[0].phonenumber});
		}
	}

    createMarkup = (content) => {
        return { __html: content };
    }
	
	updateQty=(newValue, servicecenterid)=>{
        let servicecenter = this.state.servicecenter;
        let theaddon = {};
		let tempcounter = 0;
		let tempprice = 0;
		let price = 0;
        for(let i=0; i<servicecenter.length;i++){
            if(servicecenter[i].servicecenterid === servicecenterid){		
                theaddon = servicecenter[i];
                servicecenter[i].qty = newValue;
            }
			tempcounter += servicecenter[i].qty;
			
			tempprice += servicecenter[i].qty*servicecenter[i].price;
        }
		
        this.setState({servicecenter: servicecenter});
		this.setState({qty: tempcounter});
		this.setState({counterprice: tempprice});
    }

    updateDate = (date) => {
        this.setState({ requestdate: date });
    }

    doSubmit=()=>{
        confirmAlert({
            message: this.language.areyousure,
            buttons: [
              {
                  label: this.globallang.yes,
                  onClick: () => {
                      let param = {
						  userserviceid: this.state.userserviceid,
                          price: this.state.counterprice,
                          requestdate : this.state.requestdate.format('YYYY-MM-DD'),
                          note: this.state.note,
                          phoneno: this.state.phoneno,
						  communityid: this.state.communityid,
						  userservicedetailid: this.state.userservicedetailid,
						  servicecentercategoryid: this.state.servicecentercategoryid,
						  servicecenter: this.state.servicecenter
                      }
                      axios.post(webserviceurl + '/app_insert_servicecenterrequest.php', param,
                        {headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
                            .then((response) => {
                                let result = response.data;
                                
                                if (result.status === "OK") {
                                    alert(this.language.success);
                                    this.props.history.goBack();
									this.props.history.push('/servicecenter');
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
    /*goNext=()=>{
        this.props.history.push('/servicecenterconfirmation/'+this.state.serviceid);
    }*/


    render() {
        
        return (
            <div className="main-container">
                <SubHeader history={this.props.history} hideSearch={true} title={this.state.title} />
                <div className="service-center-form">
                    <div className="service-center-form-title">
                        {this.language.title}
                    </div>
                    <div className="form-container">
                        <div className="field-container">
                            <div className="field-label">{this.language.type}</div>
                            <div className="field-value">
								{this.state.servicecenter.map((item, i)=>
									<ServiceCenterList key={i} servicecenterid={item.servicecenterid} servicecentername={item.servicecentername} qty={item.qty} updateQty={this.updateQty}  />
								)}
                            </div>
                        </div>
						<div className="field-container">
                            <div className="field-label">{this.language.price}</div>
                            <div className="field-value">
                                <Input disabled="disabled" value={this.state.counterprice} />
                            </div>
                        </div>
                        <div className="field-container">
                            <div className="field-label">{this.language.requestdate}</div>
                            <div className="field-value">
                                <DatePicker selected={this.state.requestdate} onChange={this.updateDate} className="date-picker" />
                            </div>
                        </div>
                        <div className="field-container">
                            <div className="field-label">{this.language.note}</div>
                            <div className="field-value">
                                <textarea rows="5" placeholder={this.language.inputnote} value={this.state.note} onChange={(event)=>this.setState({note: event.target.value})}>
                                    
                                </textarea>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="next-button" onClick={()=>this.doSubmit()}>
                    {this.globallang.next}
                </div>
            </div>
        );
    }
}

export default ServiceCenterForm;