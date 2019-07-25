import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
import {Button, Form, FormGroup, Label, Input, Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import './VisitorAccessDetailPage.style.css';
import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class VisitorAccessDetailPage extends Component {

    constructor(props) {
        super(props);
        this.language = getLanguage(activelanguage, 'visitoraccessdetail');
		this.globallang = getLanguage(activelanguage, 'global');
		
		
        this.state = {
            page: "",
            redirect: false,
            uservisitid: props.match.params.uservisitid,
			data:{}
        }

        
    }

    loadUserVisitDetail = () => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_uservisitdetail.php',
            data: { uservisitid : this.state.uservisitid },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
        .then((response) => {
            let result = response.data;
            if (result.status === "OK") {
                let data = result.record;		
                this.setState({data: data});
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }
    
    componentDidMount=()=>{
        this.waitForBridge();
        this.loadUserVisitDetail();
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

    render() {
        if (this.state.redirect) {
            /*if (this.state.page == "newspage") {
                return <Redirect to='/news' />;
            }*/
        }

        return (
            <div className="main-container uservisit-page">
                <SubHeader history={this.props.history} hideSearch={true} title={this.language.title} />
                <div className="park-introduction">
                    <div className="uservisit-title">
                        A Visit by {this.state.data.visitorusername} to {this.state.data.hostusername}
                    </div>
                    <table className="uservisit-info-container">
                        <tbody>
                            <tr>
                                <td className="uservisit-info-label">{this.language.name}</td>
                                <td className="uservisit-info-value">{this.state.data.visitorname}</td>
                            </tr>
							<tr>
                                <td className="uservisit-info-label">{this.language.identity}</td>
                                <td className="uservisit-info-value">{this.state.data.visitoric}</td>
                            </tr>
							<tr>
                                <td className="uservisit-info-label">{this.language.phone}</td>
                                <td className="uservisit-info-value">{this.state.data.visitorcontact}</td>
                            </tr>
							<tr>
                                <td className="uservisit-info-label">{this.language.period}</td>
                                <td className="uservisit-info-value">{this.state.data.visit} - {this.state.data.leave}</td>
                            </tr>
                            <tr>
                                <td className="uservisit-info-label">{this.language.address}</td>
                                <td className="uservisit-info-value">{this.state.data.address}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default VisitorAccessDetailPage;