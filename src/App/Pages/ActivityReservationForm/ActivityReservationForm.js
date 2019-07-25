import React, { Component } from 'react';
//import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
import { Container, Row, Col, Input } from 'reactstrap';
import axios from 'axios';
import './ActivityReservationForm.style.css';
import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//import { numberFormat } from '../../../Global';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

import ActivityAddOn from '../../Component/ActivityAddOn/ActivityAddOn';

import { confirmAlert } from 'react-confirm-alert'; 

class ActivityReservationForm extends Component {

    constructor(props) {
        super(props);
        this.language = getLanguage(activelanguage, 'activityreservationform');
        this.globallang = getLanguage(activelanguage, 'global');

        this.state = {
			activitycategoryid: props.match.params.activitycategoryid,
			activities: [],
			activityid: '',
			activityname: '',
			phoneno: '',
			name: '',
			datecheckin: moment(),
			datecheckout: moment(),
			hourin: 7,
			minutein: 0,
			hourout: 7,
			minuteout: 0,
            page: "",
            redirect: false,
            title: this.language.title,
			activityreservationid: 0,
			price: 0,
			status: 0,
			communityid: 1,
			addon: [],
			activityaddonid: 0,
			activityaddonname: '',
			qty: 0
        }
        
    }

    componentDidMount=()=>{
        this.waitForBridge();
        this.loadActivity();
		this.loadUser();
		this.loadAddOn();
    }

    loadActivity = () => {
        axios.post(webserviceurl + '/app_load_activity.php', {
			activitycategoryid: this.state.activitycategoryid
        },
        {headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) => {
                let result = response.data;
                
                if (result.status === "OK") {
                    this.setState({ activities: result.records, type: result.records.length > 0 ? result.records[0].activityid : 0 });
					this.setState({ activityid: result.records[0].activityid});
                }
                
            })
            .catch((error) => {
                console.log(error);
            });
    }
	
	loadUser=()=>{
		if(localStorage.getItem('smart-app-id-login') != undefined && localStorage.getItem('smart-app-id-login') != 'undefined'){
			var com = window.localStorage.getItem('smart-app-id-login');
			var login = JSON.parse(com);
			this.setState({phoneno : login[0].phonenumber===undefined?"":login[0].phonenumber});
			this.setState({name : login[0].name===undefined?"":login[0].name});				
		}
	}
	
	loadAddOn = () => {
        axios.post(webserviceurl + '/app_load_activityaddon.php', {
        },
        {headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) => {
                let result = response.data;
                
                if (result.status === "OK") {
                    this.setState({ addon: result.records});
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

    createMarkup = (content) => {
        return { __html: content };
    }

    updateCheckInDate = (date) => {
        this.setState({ datecheckin: date });
    }
	
	updateCheckOutDate = (date) => {
        this.setState({ datecheckout: date });
    }
	
	handleHourInChange(e){
		this.setState({
		  hourin: e.target.value
		})
	}
	
	handleHourOutChange(e){
		this.setState({
		  hourout: e.target.value
		})
	}
	
	handleMinuteInChange(e){
		this.setState({
		  minutein: e.target.value
		})
	}
	
	handleMinuteOutChange(e){
		this.setState({
		  minuteout: e.target.value
		})
	}

    doSubmit=()=>{
		var checkin = "";
		var checkout = "";
		
		var i = new Date(this.state.datecheckin);
		var yearin = i.getFullYear();
		var monthin = i.getMonth();
		var datein = i.getDate();
		
		var o = new Date(this.state.datecheckout);
		var yearout = o.getFullYear();
		var monthout = o.getMonth();
		var dateout = o.getDate();
		
		checkin = yearin+"-"+(monthin+1)+"-"+datein+" "+this.state.hourin+':'+this.state.minutein+":00";
		checkout = yearout+"-"+(monthout+1)+"-"+dateout+" "+this.state.hourout+':'+this.state.minuteout+":00";
		
        confirmAlert({
            message: this.language.areyousure,
            buttons: [
              {
                  label: this.globallang.yes,
                  onClick: () => {
                      let param = {
                          activityreservationid: this.state.activityreservationid,
                          phoneno: this.state.phoneno,
						  checkin: checkin,
						  checkout: checkout,
						  activityid: this.state.activityid,
						  price: this.state.price,
						  status: this.state.status,
						  communityid: this.state.communityid,
						  addon: this.state.addon
                          //requestdate : this.state.requestdate.format('YYYY-MM-DD'),
                          
                      }
                      axios.post(webserviceurl + '/app_insert_activityreservationrequest.php', param,
                        {headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
                            .then((response) => {
                                let result = response.data;
                                
                                if (result.status === "OK") {
                                    alert(this.language.success);
                                    this.props.history.push('/spacebookings');
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
	
	checkIfExist=()=>{
		var checkin = "";
		var checkout = "";
		
		var i = new Date(this.state.datecheckin);
		var yearin = i.getFullYear();
		var monthin = i.getMonth();
		var datein = i.getDate();
		
		var o = new Date(this.state.datecheckout);
		var yearout = o.getFullYear();
		var monthout = o.getMonth();
		var dateout = o.getDate();

		checkin = yearin+'-'+(monthin+1 > 9 ? monthin+1 : '0'+(monthin+1))+'-'+(datein > 9 ? datein : '0'+datein)+" "+(this.state.hourin > 9 ? this.state.hourin : '0'+this.state.hourin)+':'+(this.state.minutein > 9 ? this.state.minutein : '0'+this.state.minutein);
		checkout = yearout+'-'+(monthout+1 > 9 ? monthout+1 : '0'+(monthout+1))+'-'+(dateout > 9 ? dateout : '0'+dateout)+" "+(this.state.hourout > 9 ? this.state.hourout : '0'+this.state.hourout)+':'+(this.state.minuteout > 9 ? this.state.minuteout : '0'+this.state.minuteout);
		
        axios({
            method: 'post',
            url: webserviceurl + '/app_check_activityreservationdate.php',
            data: {
                checkin: checkin,
				checkout: checkout,
				activityid: this.state.activityid
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
            .then((response) => {
                let result = response.data;
                if (result.records === 1) {
                    alert(this.language.alreadybooked);
                }
				
				else{
					this.doSubmit();
				}
            })
            .catch(function (error) {
                console.log(error);
            });
    }
	
	validate=()=>{
		var checkin = "";
		var checkout = "";
		
		var i = new Date(this.state.datecheckin);
		var yearin = i.getFullYear();
		var monthin = i.getMonth();
		var datein = i.getDate();
		
		var o = new Date(this.state.datecheckout);
		var yearout = o.getFullYear();
		var monthout = o.getMonth();
		var dateout = o.getDate();
		
		checkin = yearin+"-"+monthin+"-"+datein;
		checkout = yearout+"-"+monthout+"-"+dateout;
		
		if(this.state.datecheckout._d >= this.state.datecheckin._d){
			if(checkin == checkout){
				if(this.state.hourin>this.state.hourout){
					alert(this.language.error);
					return 0;
				}
				
				else if(this.state.hourin==this.state.hourout){
					if(this.state.minutein>=this.state.minuteout){
						alert(this.language.error);
						return 0;
					}
					
					else{
						this.checkIfExist();
					}
				}
				
				else{
					this.checkIfExist();
				}
			}
			
			else{
				this.checkIfExist();
			}
		}
		
		else{
			alert(this.language.error);
		}
    }
	
	updateQty=(newValue, activityaddonid)=>{
        let addon = this.state.addon;
        let theaddon = {};
		let tempcounter = 0;
        for(let i=0; i<addon.length;i++){
            if(addon[i].activityaddonid === activityaddonid){		
                theaddon = addon[i];
                addon[i].qty = newValue;
            }
			tempcounter += addon[i].qty;
        }
		
        this.setState({addon: addon});
		this.setState({qty: tempcounter});
    }

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
                            <div className="field-label">{this.language.user}</div>
                            <div className="field-value">
                                <Input type="text"  value={this.state.name} disabled="disabled"/>
                            </div>
                        </div>
						<div className="field-container">
                            <div className="field-label">{this.language.activity}</div>
                            <div className="field-value">
                                <select value={this.state.activityid} onChange={(event)=>this.setState({activityid: event.target.value})}>
								{this.state.activities.map((activities,i)=>
                                        <option value={activities.activityid}>{activities.activityname}</option>
                                        )}
								</select>
                            </div>
                        </div>
						<div className="field-container">
                            <div className="field-label">{this.language.datecheckin}</div>
                            <div className="field-value">
                                <DatePicker selected={this.state.datecheckin} onChange={this.updateCheckInDate} className="date-picker" />
                            </div>
                        </div>
                        <div className="field-container">
                            <div className="field-label">{this.language.datecheckout}</div>
                            <div className="field-value">
                                <DatePicker selected={this.state.datecheckout} onChange={this.updateCheckOutDate} className="date-picker" />
                            </div>
                        </div>
						<div className="field-container">
                            <div className="field-label">{this.language.timecheckin}</div>
                            <div className="field-value">
                                <div className="time">
									<table>
										<tr>
											<td>
												<select onChange = {this.handleHourInChange.bind(this)} value={this.state.hourin}>
													<option value="07">07</option>
													<option value="08">08</option>
													<option value="09">09</option>
													<option value="10">10</option>
													<option value="11">11</option>
													<option value="12">12</option>
													<option value="13">13</option>
													<option value="14">14</option>
													<option value="15">15</option>
													<option value="16">16</option>
													<option value="17">17</option>
													<option value="18">18</option>
													<option value="19">19</option>
													<option value="20">20</option>
													<option value="21">21</option>
												</select>
											</td>
											<td>
												&nbsp;&nbsp;:&nbsp;&nbsp;
											</td>
											<td>
												<select onChange = {this.handleMinuteInChange.bind(this)} value={this.state.minutein}>
													<option value="00">00</option>
													<option value="30">30</option>
												</select>
											</td>
										</tr>
									</table>
								</div>
                            </div>
                        </div>
						<div className="field-container">
                            <div className="field-label">{this.language.timecheckout}</div>
                            <div className="field-value">
								<div className="time">
									<table>
									<tr>
										<td>
											<select onChange = {this.handleHourOutChange.bind(this)} value={this.state.hourout}>
												<option value="07">07</option>
												<option value="08">08</option>
												<option value="09">09</option>
												<option value="10">10</option>
												<option value="11">11</option>
												<option value="12">12</option>
												<option value="13">13</option>
												<option value="14">14</option>
												<option value="15">15</option>
												<option value="16">16</option>
												<option value="17">17</option>
												<option value="18">18</option>
												<option value="19">19</option>
												<option value="20">20</option>
												<option value="21">21</option>
											</select>
										</td>
										<td>
											&nbsp;&nbsp;:&nbsp;&nbsp;
										</td>
										<td>
											<select onChange = {this.handleMinuteOutChange.bind(this)} value={this.state.minuteout}>
												<option value="00">00</option>
												<option value="30">30</option>
											</select>
										</td>
										</tr>
									</table>
								</div>
                            </div>
                        </div>
						<div className="field-container">
                            <div className="field-label">{this.language.addon}</div>
                            <div className="field-value">
								{this.state.addon.map((item, i)=>
									<ActivityAddOn key={i} activityaddonid={item.activityaddonid} activityaddonname={item.activityaddonname} qty={item.qty} updateQty={this.updateQty}  />
								)}
                            </div>
                        </div>
                    </div>

                </div>
                <div className="next-button" onClick={()=>this.validate()}>
                    {this.globallang.next}
                </div>
            </div>
        );
    }
}

export default ActivityReservationForm;