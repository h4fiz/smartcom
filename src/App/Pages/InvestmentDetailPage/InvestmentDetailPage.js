import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';

import { Container, Row, Col } from 'reactstrap';

import axios from 'axios';
import './InvestmentDetailPage.style.css';

import { getLanguage } from '../../../Languages';
import { webserviceurl, activelanguage } from '../../../Config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SubHeader from '../../Component/SubHeader/SubHeader';
import PictureGallery from '../../Component/pictureGallery';

class InvestmentDetailPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            investmentId: props.match.params.investmentid,
            investmentData:{},
            currentTab:0,
        }
        this.language = getLanguage(activelanguage, 'investmentdetailpage');
        this.waitForBridge();
    }

    componentDidMount=()=>{
        this.loadData();
    }

    loadData= () => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_investmentdetail.php',
            data: {
                investmentid: this.state.investmentId
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
        .then((response) => {
            let result = response.data;
            if (result.status === "OK") {
                /*for (var i = 0; i < result.records.length; i++) {
                    result.records[i].shortdesc = decodeURIComponent(result.records[i].shortdesc);
                }*/

                this.setState({ investmentData: result.record });
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

    goToCompany=()=>{
        this.props.history.push('/companyprofile/'+this.state.investmentData.companyid);
    }

    changeTab=(idx)=>{
        //this.setState({currentTab: idx});
    }

    renderPic=()=>{
        if(this.state.investmentData.investmentpic !== undefined && this.state.investmentData.investmentpic[0] !== ""){
            return (
                <div className="investment-detail-img-container">
                    <img src={this.state.investmentData.investmentpic[0]} />
                </div>
            )
        }
    }

    renderAboutUs=()=>{
        if(this.state.investmentData.about !== '' && this.state.investmentData.about !== undefined){
            return <span className="aboutus-link" onClick={()=>this.goToAbout()}>{this.language['about']}</span>
        }
    }

    renderInfo=()=>{
        if(this.state.investmentData.info !== undefined && this.state.investmentData.info.length>0){
            return (
                <div className="investment-detail-info">
                    <table>
                        <tbody>
                            {
                                this.state.investmentData.info.map((item,i)=>
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
			const imagesrc = this.state.companyData.gallery== undefined?[]:this.state.companyData.gallery;
            return (
                <div>
                    {this.renderInfo()}
                    <div className="investment-detail-description">
                        <div className="description-label">{this.language['description']}</div>
                        <div dangerouslySetInnerHTML={{ __html: this.state.investmentData.fulldesc }}></div>
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
                <div className="main-container investment-detail">
                    <div className="investment-detail-header">
                        
                            {this.renderPic()}
                        
                        <div className="investment-detail-name-container">
                            {this.state.investmentData.name} {/*this.renderAboutUs()*/}
                        </div>
                        <div className="investment-detail-company" onClick={()=>this.goToCompany()}>
                            {this.state.investmentData.companyname}
                        </div>
                    </div>
                    {this.renderTabContent()}
                </div>
            </div>
        );
    }
}

export default InvestmentDetailPage;