import React, { Component } from 'react';
//import { Link, Redirect } from 'react-router-dom';

//import { Container, Row, Col } from 'reactstrap';

import axios from 'axios';
import './ServiceDetailPage.style.css';

import { getLanguage } from '../../../Languages';
import { webserviceurl, activelanguage } from '../../../Config';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SubHeader from '../../Component/SubHeader/SubHeader';
import PictureGallery from '../../Component/pictureGallery';

class ServiceDetailPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            serviceId: props.match.params.serviceid,
            serviceData:{},
            currentTab:0,
        }
        this.language = getLanguage(activelanguage, 'servicedetailpage');
        this.waitForBridge();
    }

    componentDidMount=()=>{
        this.loadData();
    }

    loadData= () => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_servicedetail.php',
            data: {
                serviceid: this.state.serviceId
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
        .then((response) => {
            let result = response.data;
            if (result.status === "OK") {
                /*for (var i = 0; i < result.records.length; i++) {
                    result.records[i].shortdesc = decodeURIComponent(result.records[i].shortdesc);
                }*/

                this.setState({ serviceData: result.record });
                console.log(result.record);
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
    }

    renderPic=()=>{
        if(this.state.serviceData.servicepic !== undefined && this.state.serviceData.servicepic[0] !== ""){
            return (
                <div className="service-detail-img-container">
                    <img src={this.state.serviceData.servicepic[0]} />
                </div>
            )
        }
    }

    renderAboutUs=()=>{
        if(this.state.serviceData.about !== '' && this.state.serviceData.about !== undefined){
            return <span className="aboutus-link" onClick={()=>this.goToAbout()}>{this.language['about']}</span>
        }
    }

    renderInfo=()=>{
        if(this.state.serviceData.info !== undefined && this.state.serviceData.info.length>0){
            return (
                <div className="service-detail-info">
                    <table>
                        <tbody>
                            {
                                this.state.serviceData.info.map((item,i)=>
                                    <tr>
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
			const imagesrc = this.state.serviceData.gallery== undefined?[]:this.state.serviceData.gallery;
            return (
                <div>
                    {this.renderInfo()}
                    <div className="service-detail-description">
                        <div className="description-label">{this.language['description']}</div>
                        <div dangerouslySetInnerHTML={{ __html: this.state.serviceData.fulldesc }}></div>
                    </div>
					<br></br>
					<div>
						<PictureGallery 
							images = {imagesrc} theme = ""
						/>
					</div>
                </div>
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
            <div>
                <SubHeader history={this.props.history} />
                <div className="main-container service-detail">
                    <div className="service-detail-header">
                        
                            {this.renderPic()}
                        
                        <div className="service-detail-name-container">
                            {this.state.serviceData.name} {/*this.renderAboutUs()*/}
                        </div>
                        {/*<div className="service-detail-like-container">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>{this.language['like']} 0</td>
                                        <td>{this.language['follower']} 0</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>*/}
                        {/*<div className="service-detail-tab-container">
                            <table>
                                <tbody>
                                    <tr>
                                        <td style={{width:'33%', verticalAlign:'middle'}} className={`${this.state.currentTab === 0 ? 'tab-active': ''}`} onClick={()=>this.changeTab(0)}>
                                            <div className={`service-detail-tab-item `}>
                                                <div className="service-detail-tab-icon">
                                                    <FontAwesomeIcon icon="user-circle" />
                                                </div>
                                                <div className="service-detail-tab-name">
                                                    {this.language['information']}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{width:'33%', verticalAlign:'middle'}} className={`${this.state.currentTab === 1 ? 'tab-active': ''}`} onClick={()=>this.changeTab(1)}>
                                            <div className="service-detail-tab-item">
                                                <div className="service-detail-tab-icon">
                                                    0
                                                </div>
                                                <div className="service-detail-tab-name">
                                                    {this.language['service']}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{width:'33%', verticalAlign:'middle'}} className={`${this.state.currentTab === 2 ? 'tab-active': ''}`} onClick={()=>this.changeTab(2)}>
                                            <div className="service-detail-tab-item">
                                                <div className="service-detail-tab-icon">
                                                    0
                                                </div>
                                                <div className="service-detail-tab-name">
                                                    {this.language['service']}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>*/}
                    </div>
                    {this.renderTabContent()}
                </div>
            </div>
        );
    }
}

export default ServiceDetailPage;