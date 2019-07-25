import React, { Component } from 'react';

import { Link, Redirect } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { Container, Row, Col, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

import ServiceListItem from '../../Component/ServiceListItem/ServiceListItem';

import axios from 'axios';
import 'react-datepicker/dist/react-datepicker.css';
import './PersonalInformation.style.css';
//import PictureUploader from '../../Component/PictureUploader/PictureUploader';

import { getLanguage } from '../../../Languages';
import { webserviceurl, activelanguage } from '../../../Config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class PersonalInformation extends Component {

    constructor(props) {
        super(props);
        this.state = {
			phoneno: '',
			name: '',
			nickname: '',
			gender: 'Male',
			date: moment(),
			qrcode: [],
			company: '',
			location: '',
			jointime: moment(),
			isshown: false,
            companyId: props.match.params.companyid,
            companyData:{},
            currentTab:0,
            listService:[
                {name:'service1', shortdesc: 'this is testing shortdesc'}
            ]
        }
        this.language = getLanguage(activelanguage, 'companyprofilepage');
        this.waitForBridge();
    }

    componentDidMount=()=>{
        //this.loadData();
    }
	
	handleChange(e){
		this.setState({
		  gender: e.target.value
		})
	 }
	 
	updateDate = (date) => {
        this.setState({ date: date });
    }
	
	shownHandleChecked (isshown) {
		this.setState({isshown: !this.state.isshown});
		//var ischecked;
	}
	
	/*onUploadImage = (result) => {
        this.setState({ profilepic: result });
    }*/

    loadData= () => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_companyprofile.php',
            data: {
                companyid: this.state.companyId
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
        .then((response) => {
            let result = response.data;
            if (result.status === "OK") {
                /*for (var i = 0; i < result.records.length; i++) {
                    result.records[i].shortdesc = decodeURIComponent(result.records[i].shortdesc);
                }*/

                this.setState({ companyData: result.record });
                //console.log(result.record);
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
            let param = '{"title":"' + this.language.title + '","canGoBack":true, "showCommunityName":true, "hideTopbar":true, "hideFooterMenu":true}';
            window.postMessage(param, "*");
        }
    }

    createMarkup = (content) => {
        return { __html: content };
    }

    goToAbout=()=>{
        //ke about
    }

    changeTab=(idx)=>{
        //this.setState({currentTab: idx});
        if(idx === 1){
            this.props.history.replace('/service/'+this.state.companyId);
        }else if(idx === 2){
            this.props.history.replace('/product/'+this.state.companyId);
        }
    }

    renderCompanyPic=()=>{
        if(this.state.companyData.companypic !== undefined){
            return <img src={this.state.companyData.companypic[0]} />
        }
    }

    renderAboutUs=()=>{
        if(this.state.companyData.about !== '' && this.state.companyData.about !== undefined){
            return <span className="aboutus-link" onClick={()=>this.goToAbout()}>{this.language['about']}</span>
        }
    }

    renderInfo=()=>{
        if(this.state.companyData.info !== undefined && this.state.companyData.info.length>0){
            return (
                <div className="company-profile-info">
                    <table>
                        <tbody>
                            {
                                this.state.companyData.info.map((item,i)=>
                                    <tr key={i}>
                                        <td className="column-field">
                                            {item.field}
                                        </td>
                                        <td className="column-value">
                                            {item.value}
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            )
        }
    }

    renderTabContent=()=>{
        if(this.state.currentTab === 0){
            return (
                <div>
                    {this.renderInfo()}
                    <div className="company-profile-description">
                        <div className="description-label">{this.language['description']}</div>
                        <div dangerouslySetInnerHTML={{ __html: this.state.companyData.fulldesc }}></div>
                    </div>
                </div>
            )
        }else if(this.state.currentTab === 1){
            return (
                <div className="company-profile-list-container">
                    {this.state.company.list.map((item, i) =>
                        <div key={i} >
                            <ServiceListItem key={i} name={item.name} shortdesc={item.shortdesc} category={'name'} tags={['tes', 'tes1']} pic={item.servicepic[0]}  />
                        </div>
                    )}
                </div>
            )
        }else{

        }
    }

    render() {
        if (this.state.redirect) {
            /*if (this.state.page == "newspage") {
                return <Redirect to='/news' />;
            }*/
        }

        return (
		<div>
			<div className="page-header">
                    <span className="dash">&nbsp;&nbsp;</span> <span className="parent-title"></span>
                </div>
			<div className="box-container">
					<table>
						<tr>
                            <td><Label for="phoneno">Mobile Phone</Label></td>
                            <td><Input type="text" name="phoneno" id="phoneno" placeholder="08xxxxxxxxxx" value={this.state.phoneno} onChange = {(event) => this.setState({ phoneno : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="name">Name</Label></td>
                            <td><Input type="text" name="name" id="name" value={this.state.name} placeholder="Name" onChange = {(event) => this.setState({ name : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
                        <tr>
                            <td><Label for="nickname">Nickname</Label></td>
                            <td><Input type="text" name="nickname" id="nickname" value={this.state.nickname} placeholder="Nickname" onChange = {(event) => this.setState({ nickname : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="gender">Gender</Label></td>
                            <td><select onChange = {this.handleChange.bind(this)} value={this.state.gender} >
									<option value="Male">Male</option>
									<option value="Female">Female</option>
								</select>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
							<td><Label>Date</Label></td>
                            <td><DatePicker selected={this.state.date} onChange={this.updateDate} className="date-picker" /></td>
						</tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label>QR Code Business Card</Label></td>
							<td>
							</td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="company">Company</Label></td>
                            <td><Input type="text" name="company" id="company" value={this.state.company} placeholder="Company" onChange = {(event) => this.setState({ company : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="location">Location</Label></td>
                            <td><Input type="text" name="location" id="location" value={this.state.location} placeholder="Location" onChange = {(event) => this.setState({ location : event.target.value }) }/></td>
                        </tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
							<td><Label>Join Time</Label></td>
                            <td><DatePicker selected={this.state.jointime} onChange={this.updateDate} className="date-picker" /></td>
						</tr>
						<tr>
						&nbsp;
						</tr>
						<tr>
                            <td><Label for="isshown">Only my company colleagues can see my real information&nbsp;&nbsp;</Label></td>
                            <td>&nbsp;&nbsp;&nbsp;&nbsp;<Input type="checkbox" className="custom-checkbox" name="isshown" id="isshown" onChange={this.shownHandleChecked}/></td>
                        </tr>
                    </table>
                </div>
			</div>
        );
    }
}

export default PersonalInformation;