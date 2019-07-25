import React, { Component } from 'react';
//import { Link, Redirect } from 'react-router-dom';

//import { Container, Row, Col } from 'reactstrap';

//import ServiceListItem from '../../Component/ServiceListItem/ServiceListItem';

import axios from 'axios';
import './ComingSoonPage.style.css';

import { getLanguage } from '../../../Languages';
import { webserviceurl, activelanguage } from '../../../Config';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SubHeader from '../../Component/SubHeader/SubHeader';


class ComingSoonPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            companyId: props.match.params.companyid,
        }
        this.language = getLanguage(activelanguage, 'comingsoonpage');
    }

    componentDidMount=()=>{
        this.waitForBridge();
        this.loadData();
    }

    loadData= () => {
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

    
    render() {
        if (this.state.redirect) {
            /*if (this.state.page == "newspage") {
                return <Redirect to='/news' />;
            }*/
        }

        return (
            <div>
                <SubHeader history={this.props.history} hideSearch={true} title={this.language.title} />
                <div className="main-container coming-soon">
                    <div className="coming-soon-content">
                    {this.language.label}
                    </div>
                </div>
            </div>
        );
    }
}

export default ComingSoonPage;