import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import './VisitorAccessPage.style.css';
import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import VisitorAccessListItem from '../../Component/VisitorAccessListItem/VisitorAccessListItem';


class VisitorAccessPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: "",
            redirect: false,
			list: []
        }

        this.language = getLanguage(activelanguage, 'visitoraccess');
    }

	loadVisit = () =>{
		axios.post(webserviceurl + '/app_load_uservisit.php', {
		},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) => {
                let result = response.data;
                
                if (result.status === "ok") {

					this.setState({ list: result.records });
				}
				
            })
            .catch((error) => {
                console.log(error);
            });
	}

	componentDidMount = () => {
        this.waitForBridge();
		this.loadVisit();
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

    goToDetail=(item)=>{
        this.props.history.push('/visitoraccessdetail/'+item.uservisitid);
    }

    renderTab = () => {
        return (
                <div className="body-section payment-scroll-view">
                    {this.state.list.map((item, i) =>
                        <div key={i} onClick={()=>this.goToDetail(item)}>
                            <VisitorAccessListItem key={i} visitorpic={item.visitorpic} visitorname={item.visitorname} pic={item.pic} visit={item.visit} leave={item.leave} address={item.address} onClick={()=>this.goToDetail(item)}/>
                        </div>
                    )}
                </div>
            )
    }

    render() {
        if (this.state.redirect) {
            /*if (this.state.page == "newspage") {
                return <Redirect to='/news' />;
            }*/
        }

        return (
            <div>
                <SubHeader history={this.props.history} hideSearch={true} title={this.language.title}/>
                {this.renderTab()}
            </div>
        );
    }
}

export default VisitorAccessPage;