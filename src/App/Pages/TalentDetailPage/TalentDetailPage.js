import React, { Component } from 'react';
//import { Link, Redirect } from 'react-router-dom';

//import { Container, Row, Col } from 'reactstrap';

import axios from 'axios';
import './TalentDetailPage.style.css';

import { getLanguage } from '../../../Languages';
import { webserviceurl, activelanguage } from '../../../Config';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SubHeader from '../../Component/SubHeader/SubHeader';
import PictureGallery from '../../Component/pictureGallery';

class TalentDetailPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            talentId: props.match.params.talentid,
            talentData:{},
            currentTab:0,
        }
        this.language = getLanguage(activelanguage, 'talentdetailpage');
        this.waitForBridge();
    }

    componentDidMount=()=>{
        this.loadData();
    }

    loadData= () => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_talentdetail.php',
            data: {
                talentid: this.state.talentId
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
        .then((response) => {
            let result = response.data;
            if (result.status === "OK") {
                /*for (var i = 0; i < result.records.length; i++) {
                    result.records[i].shortdesc = decodeURIComponent(result.records[i].shortdesc);
                }*/

                this.setState({ talentData: result.record });
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
        this.props.history.push('/companyprofile/'+this.state.talentData.companyid);
    }

    changeTab=(idx)=>{
        //this.setState({currentTab: idx});
    }

    renderPic=()=>{
        if(this.state.talentData.talentpic !== undefined && this.state.talentData.talentpic[0] !== ""){
            return (
                <div className="talent-detail-img-container">
                    <img src={this.state.talentData.talentpic[0]} />
                </div>
            )
        }
    }

    renderAboutUs=()=>{
        if(this.state.talentData.about !== '' && this.state.talentData.about !== undefined){
            return <span className="aboutus-link" onClick={()=>this.goToAbout()}>{this.language['about']}</span>
        }
    }

    renderInfo=()=>{
        if(this.state.talentData.info !== undefined && this.state.talentData.info.length>0){
            return (
                <div className="talent-detail-info">
                    <table>
                        <tbody>
                            {
                                this.state.talentData.info.map((item,i)=>
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
			const imagesrc = this.state.talentData.gallery== undefined?[]:this.state.talentData.gallery;
            return (
                <div>
                    {this.renderInfo()}
                    <div className="talent-detail-description">
                        <div className="description-label">{this.language['description']}</div>
                        <div dangerouslySetInnerHTML={{ __html: this.state.talentData.fulldesc }}></div>
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
                <div className="main-container talent-detail">
                    <div className="talent-detail-header">
                        
                            {this.renderPic()}
                        
                        <div className="talent-detail-name-container">
                            {this.state.talentData.name} {/*this.renderAboutUs()*/}
                        </div>
                        <div className="talent-detail-company" onClick={()=>this.goToCompany()}>
                            {this.state.talentData.companyname}
                        </div>
                        
                    </div>
                    {this.renderTabContent()}
                </div>
            </div>
        );
    }
}

export default TalentDetailPage;