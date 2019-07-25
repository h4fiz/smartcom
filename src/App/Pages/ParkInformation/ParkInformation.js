import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import './style.css';
import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';


class ParkInformation extends Component {

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
            service: {
                image: '',
                title: '',
                description: ''
            },
            positioning: {
                image: '',
                title: '',
                description: ''
            },
            currentTab: 0
        }

        this.language = getLanguage(activelanguage, 'parkinformation');

        this.loadIntroduction();
        this.loadService();
        this.loadPositioning();

        this.waitForBridge();
    }

    loadIntroduction = () => {
        axios.get(webserviceurl + '/app_load_introduction.php?community='+this.state.community)
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
    loadService = () => {
        axios.get(webserviceurl + '/app_load_service.php?community='+this.state.community)
            .then((response) => {
                let result = response.data;
                if (result.status === "OK") {
                    result.record.description = decodeURIComponent(result.record.description);
                    this.setState({ service: result.record });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    loadPositioning = () => {
        axios.get(webserviceurl + '/app_load_positioning.php?community='+this.state.community)
            .then((response) => {
                let result = response.data;
                if (result.status === "OK") {
                    result.record.description = decodeURIComponent(result.record.description);
                    this.setState({ positioning: result.record });
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
                        {/*this.state.introduction.description*/}
                    </div>
                </div>
            )
        } else if (this.state.currentTab === 1) {
            return (
                <div className="body-section">
                    <div className="img-container">
                        <img src={this.state.service.image} />
                    </div>
                    <div className="title">
                        {this.state.service.title}
                    </div>
                    <div className="description" dangerouslySetInnerHTML={this.createMarkup(this.state.service.description)}>
                        {/*this.state.service.description*/}
                    </div>
                </div>
            )
        } else if (this.state.currentTab === 2) {
            return (
                <div className="body-section">
                    <div className="img-container">
                        <img src={this.state.positioning.image} />
                    </div>
                    <div className="title">
                        {this.state.positioning.title}
                    </div>
                    <div className="description" dangerouslySetInnerHTML={this.createMarkup(this.state.positioning.description)}>
                        {/*this.state.positioning.description*/}
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
                <div className="main-container park-introduction">
                    <div className="tab-section">
                        <Container>
                            <Row>
                                <Col md="4" sm="4" xs="4" className={this.currentActiveTab(0)} onClick={() => this.changeTab(0)}>
                                    {this.language.parkintroduction}
                                </Col>
                                <Col md="4" sm="4" xs="4" className={this.currentActiveTab(1)} onClick={() => this.changeTab(1)}>
                                    {this.language.servicephilosophy}
                                </Col>
                                <Col md="4" sm="4" xs="4" className={this.currentActiveTab(2)} onClick={() => this.changeTab(2)}>
                                    {this.language.parkpositioning}
                                </Col>
                            </Row>
                        </Container>
                    </div>
                    { /*<div className="body-section">
                        <div className="img-container">
                            <img src={this.state.introduction.image} />
                        </div>
                        <div className="title">
                            {this.state.introduction.title}
                        </div>
                        <div className="description">
                            {this.state.introduction.description}
                        </div>
                    </div>*/}

                    {this.renderTab()}
                </div>
            </div>
        );
    }
}

export default ParkInformation;