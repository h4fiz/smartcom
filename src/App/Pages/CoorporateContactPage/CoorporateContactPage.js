import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import './CoorporateContactPage.style.css';

import Picture from '../../Component/pictureGallery';

import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';

import DefaultUserImg from '../../../images/user.jpeg';

class CoorporateContactPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: "",
            redirect: false,
            community: props.match.params.communityid,

            introduction: {
                image: '',
                title: '',
                description: ''
            },
            business: {
                list: [],
                currentIndex: 0
            },
            contact: {
                list: [],
                currentIndex: 0
            },
            currentTab: 2,
            limitList: 10
        }

        this.language = getLanguage(activelanguage, 'coorporatecontact');

        

        
        this.loadContact();

        this.waitForBridge();
    }

    
    loadContact = () => {
        axios.get(webserviceurl + '/app_load_corporatecontact.php?community='+this.state.community)
            .then((response) => {
                let result = response.data;
                if (result.status === "OK") {
                    this.setState({ contact: { list: result.records } });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    currentActiveTab(idx) {
        if (idx === this.state.currentTab)
            return "tab-item active-tab";
        else
            return "tab-item";
    }

    changeTab(idx) {
        this.setState({ currentTab: idx });
    }

    goToDetail(business) {

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

    renderTab = () => {
        if (this.state.currentTab === 0) {
            return (
                <div className="body-section">
                    <div className="img-container">
                        <img src={this.state.introduction.image} />
                    </div>
                    <div className="title">
                        {this.state.introduction.title}
                    </div>
                    <div className="description" dangerouslySetInnerHTML={this.createMarkup(this.state.introduction.description)}>
                    </div>
                </div>
            )
        } else if (this.state.currentTab === 1) {
            return (
                <div className="body-section">
                    {this.state.business.list.map((item, i) =>
                        <div className="list" key={item.id} onClick={() => this.goToDetail(item)}>
                            <div className="title">{item.title}
                            </div>
                            <Picture images={item.images} theme={"full"} />
                            <div className="time">{item.time}
                            </div>
                        </div>)}
                </div>
            )
        } else if (this.state.currentTab === 2) {
            return (
                <div className="body-section">
                    <table className="table-contact">
                        <tbody>
                        {this.state.contact.list.map((item, i) =>
                            <tr key={i}>
                                <td className="column-pic">
                                    <img src={item.image === '' ? DefaultUserImg : item.image } className="contact-pic" />
                                </td>
                                <td>
                                    <div className="contact-name">{item.name} ({item.phone})</div>
                                    <div className="contact-position">{item.position}</div>
                                </td>
                                <td className="column-icon">
                                    <a href={"tel:" + item.phone + ""}>
                                        <img src={require("../../../images/btn_phone_n@2x.png")} />
                                    </a>
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            )
        }
    }

    render() {
        if (this.state.redirect) {
            
        }

        return (
            <div>
                <SubHeader history={this.props.history} />
                <div className="main-container park-enterprise">
                    {this.renderTab()}
                </div>
            </div>
        );
    }
}

export default CoorporateContactPage;