import React, { Component } from 'react';
//import { Link, Redirect } from 'react-router-dom';

//import { Container, Row, Col } from 'reactstrap';

import axios from 'axios';
import './ProjectDetailPage.style.css';

import { getLanguage } from '../../../Languages';
import { webserviceurl, activelanguage } from '../../../Config';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SubHeader from '../../Component/SubHeader/SubHeader';
import PictureGallery from '../../Component/pictureGallery';

class ProjectDetailPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            projectId: props.match.params.projectid,
            projectData:{},
            currentTab:0,
        }
        this.language = getLanguage(activelanguage, 'projectdetailpage');
        this.waitForBridge();
    }

    componentDidMount=()=>{
        this.loadData();
    }

    loadData= () => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_projectdetail.php',
            data: {
                projectid: this.state.projectId
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
        .then((response) => {
            let result = response.data;
            if (result.status === "OK") {
                /*for (var i = 0; i < result.records.length; i++) {
                    result.records[i].shortdesc = decodeURIComponent(result.records[i].shortdesc);
                }*/

                this.setState({ projectData: result.record });
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
        this.props.history.push('/companyprofile/'+this.state.projectData.companyid);
    }

    changeTab=(idx)=>{
        //this.setState({currentTab: idx});
    }

    renderPic=()=>{
        if(this.state.projectData.projectpic !== undefined && this.state.projectData.projectpic[0] !== ""){
            return (
                <div className="project-detail-img-container">
                    <img src={this.state.projectData.projectpic[0]} />
                </div>
            )
        }
    }

    renderAboutUs=()=>{
        if(this.state.projectData.about !== '' && this.state.projectData.about !== undefined){
            return <span className="aboutus-link" onClick={()=>this.goToAbout()}>{this.language['about']}</span>
        }
    }

    renderInfo=()=>{
        if(this.state.projectData.info !== undefined && this.state.projectData.info.length>0){
            return (
                <div className="project-detail-info">
                    <table>
                        <tbody>
                            {
                                this.state.projectData.info.map((item,i)=>
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
			const imagesrc = this.state.projectData.gallery== undefined?[]:this.state.projectData.gallery;
            return (
                <div>
                    {this.renderInfo()}
                    <div className="project-detail-description">
                        <div className="description-label">{this.language['description']}</div>
                        <div dangerouslySetInnerHTML={{ __html: this.state.projectData.fulldesc }}></div>
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
                <div className="main-container project-detail">
                    <div className="project-detail-header">
                        
                            {this.renderPic()}
                        
                        <div className="project-detail-name-container">
                            {this.state.projectData.name} {/*this.renderAboutUs()*/}
                        </div>
                        <div className="project-detail-company" onClick={()=>this.goToCompany()}>
                            {this.state.projectData.companyname}
                        </div>
                        
                    </div>
                    {this.renderTabContent()}
                </div>
            </div>
        );
    }
}

export default ProjectDetailPage;