/*import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../Languages';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import './style.css';

import Picture from '../Component/pictureGallery';

import { webserviceurl, activelanguage } from '../../Config';


class ParkInformation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: "",
            redirect: false,

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
            currentTab: 0,
            limitList: 10
        }

        this.language = getLanguage(activelanguage, 'parkenterprise');

        this.loadBusiness = this.loadBusiness.bind(this);

        this.loadIntroduction();
        this.loadBusiness();
        this.loadContact();

        this.waitForBridge();
    }

    loadIntroduction = () => {
        axios.get(webserviceurl + '/app_load_companyintroduction.php')
            .then((response) => {
                let result = response.data;
                if (result.status === "OK") {
                    result.record.description = decodeURIComponent(result.record.description);
                    this.setState({ introduction: result.record });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    loadBusiness = () => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_businesscase.php',
            data: {
                currentIndex: this.state.business.currentIndex,
                limit: this.state.limitList
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
            .then((response) => {
                let result = response.data;
                if (result.status === "OK") {
                    for (var i = 0; i < result.records.length; i++) {
                        result.records[i].description = decodeURIComponent(result.records[i].description);
                    }

                    this.setState({ business: { list: result.records } });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    loadContact = () => {
        axios.get(webserviceurl + '/app_load_corporatecontact.php')
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
            let param = '{"title":"' + this.language.parkenterprise + '","canGoBack":true}';
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
                        {this.state.contact.list.map((item, i) =>
                            <tr>
                                <td className="column-pic">
                                    <img src={item.image} class="contact-pic" />
                                </td>
                                <td>
                                    <div className="contact-name">{item.name} ({item.phone})</div>
                                    <div className="contact-position">{item.position}</div>
                                </td>
                                <td className="column-icon">
                                    <a href={"tel:" + item.phone + ""}>
                                        <img src={require("../../images/btn_phone_n@2x.png")} />
                                    </a>
                                </td>
                            </tr>)}
                    </table>
                </div>
            )
        }
    }

    render() {
        if (this.state.redirect) {
            
        }

        return (
            <div className="main-container park-enterprise">
                <div className="tab-section">
                    <Container>
                        <Row>
                            <Col md="4" sm="4" xs="4" className={this.currentActiveTab(0)} onClick={() => this.changeTab(0)}>
                                {this.language.companyintroduction}
                            </Col>
                            <Col md="4" sm="4" xs="4" className={this.currentActiveTab(1)} onClick={() => this.changeTab(1)}>
                                {this.language.businesscase}
                            </Col>
                            <Col md="4" sm="4" xs="4" className={this.currentActiveTab(2)} onClick={() => this.changeTab(2)}>
                                {this.language.corporatecontact}
                            </Col>
                        </Row>
                    </Container>
                </div>
                {this.renderTab()}
            </div>
        );
    }
}

export default ParkInformation;*/

import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import './style.css';

//import Picture from '../../Component/pictureGallery';
import CompanyListItem from '../../Component/CompanyListItem/CompanyListItem';

import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';


class ParkEnterprise extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: "",
            redirect: false,
            community: props.match.params.communityid,
            company: {
                list: [],
                currentIndex: 0
            },
            limitList: 10
        }

        this.language = getLanguage(activelanguage, 'companypage');
    }

    componentDidMount=()=>{
        this.loadCompany();
        this.waitForBridge();
    }

    loadCompany = () => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_company.php',
            data: {
                currentIndex: this.state.company.currentIndex,
                limit: this.state.limitList,
                community: this.state.community
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
            .then((response) => {
                let result = response.data;
                if (result.status === "OK") {
                    for (var i = 0; i < result.records.length; i++) {
                        result.records[i].shortdesc = decodeURIComponent(result.records[i].shortdesc);
                    }
                    this.setState({ company: { list: result.records } });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    goToDetail=(company)=>{
        this.props.history.push('/companyprofile/'+company.id);
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

    renderList = () => {
        if (this.state.company.list.length > 0) {
            return (
                <div className="body-section">
                    {/*this.state.company.list.map((item, i) =>
                        <div className="list" key={item.id} onClick={() => this.goToDetail(item)}>
                            <div className="title">{item.name}
                            </div>
                            <Picture images={item.companypic} theme={"full"} />
                            <div className="time">{item.shortdesc}
                            </div>
                    </div>)*/}
                    {this.state.company.list.map((item, i) =>
                        <div key={i} onClick={()=>this.goToDetail(item)}>
                            <CompanyListItem key={i} name={item.name} shortdesc={item.shortdesc} category={item.category} tags={item.tags} pic={item.companypic[0]}  />
                        </div>
                    )}
                </div>
            )

        } else {
            return (
                <div className="no-data-available">{this.language.nodata}</div>
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
                <div className="main-container park-enterprise">
                    {this.renderList()}
                </div>
            </div>
        );
    }
}

export default ParkEnterprise;