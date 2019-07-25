import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { Container, Row, Col } from 'reactstrap';

import ServiceListItem from '../../Component/ServiceListItem/ServiceListItem';

import axios from 'axios';
import './CompanyProfilePage.style.css';

import { getLanguage } from '../../../Languages';
import { webserviceurl, activelanguage } from '../../../Config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SubHeader from '../../Component/SubHeader/SubHeader';
import PictureGallery from '../../Component/pictureGallery';

class CompanyProfilePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
        this.loadData();
    }

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
            let param = '{"title":"' + this.language.title + '","canGoBack":false, "showCommunityName":true, "hideTopbar":true, "hideFooterMenu":true}';
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
            this.props.history.push('/service/'+this.state.companyId);
        }else if(idx === 2){
            this.props.history.push('/product/'+this.state.companyId);
        }
    }

    renderCompanyPic=()=>{
        if(this.state.companyData.companypic !== undefined){
            return <img src={this.state.companyData.companypic[0]}/>
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
			const imagesrc = this.state.companyData.gallery== undefined?[]:this.state.companyData.gallery;
            return (
                <div>
                    {this.renderInfo()}
                    <div className="company-profile-description">
                        <div className="description-label">{this.language['description']}</div>
                        <div dangerouslySetInnerHTML={{ __html: this.state.companyData.fulldesc }}></div>
                    </div>
					<br></br>
					<div>
						<PictureGallery 
							images = {imagesrc} theme = ""
						/>
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
                <SubHeader history={this.props.history} />
                <div className="main-container company-profile">
                <div className="company-profile-header">
                    <div className="company-profile-img-container">
                        {this.renderCompanyPic()}
                    </div>
                    <div className="company-profile-name-container">
                        {this.state.companyData.name} {this.renderAboutUs()}
                    </div>
                    <div className="company-profile-like-container">
                        <table>
                            <tbody>
                                <tr>
                                    <td>{this.language['like']} 0</td>
                                    <td>{this.language['follower']} 0</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="company-profile-tab-container">
                        <table>
                            <tbody>
                                <tr>
                                    <td style={{width:'33%', verticalAlign:'middle'}} className={`${this.state.currentTab === 0 ? 'tab-active': ''}`} onClick={()=>this.changeTab(0)}>
                                        <div className={`company-profile-tab-item `}>
                                            <div className="company-profile-tab-icon">
                                                <FontAwesomeIcon icon="user-circle" />
                                            </div>
                                            <div className="company-profile-tab-name">
                                                {this.language['information']}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{width:'33%', verticalAlign:'middle'}} className={`${this.state.currentTab === 1 ? 'tab-active': ''}`} onClick={()=>this.changeTab(1)}>
                                        <div className="company-profile-tab-item">
                                            <div className="company-profile-tab-icon">
                                                {this.state.companyData.service}
                                            </div>
                                            <div className="company-profile-tab-name">
                                                {this.language['service']}
                                            </div>
                                        </div>
                                    </td>
                                    <td style={{width:'33%', verticalAlign:'middle'}} className={`${this.state.currentTab === 2 ? 'tab-active': ''}`} onClick={()=>this.changeTab(2)}>
                                        <div className="company-profile-tab-item">
                                            <div className="company-profile-tab-icon">
                                                {this.state.companyData.product}
                                            </div>
                                            <div className="company-profile-tab-name">
                                                {this.language['product']}
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {this.renderTabContent()}
            </div>
            </div>
        );
    }
}

export default CompanyProfilePage;