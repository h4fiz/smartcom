import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
//import { Container, Row, Col } from 'reactstrap';
import Picture from '../../Component/pictureGallery';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SubHeader from '../../Component/SubHeader/SubHeader';

import './NewsDetailStyle.css';
import { webserviceurl, activelanguage } from '../../../Config';
import axios from 'axios';

class NewsDetail extends Component {
    constructor(props) {
        super(props);

        this.language = getLanguage(activelanguage, 'newsdetail');

        this.idnews = props.match.params.idnews;
        
        this.state = {
            navigateTo: '',
            news: [{
                id:0,
                title:'',
                fulldesc:'',
                newspic:[],
                time:''
            }]
        }
        this.loadNews(this.idnews);

        this.waitForBridge();
    }

    waitForBridge() {
        //the react native postMessage has only 1 parameter
        //while the default one has 2, so check the signature
        //of the function

        if (window.postMessage.length !== 1) {
            setTimeout(function () {
                this.waitForBridge();
            }.bind(this), 200);
        }
        else {
            let param = '{"title":"' + this.language.title + '","canGoBack":false, "showCommunityName":true, "hideTopbar":true, "hideFooterMenu":true}';
            window.postMessage(param, "*");
        }
    }

    loadNews= (id) => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_newsdetail.php',
            data: {
                id: id,
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
            .then((response) => {
                let result = response.data;
                if (result.status === "OK") {
                    //result.record[0].description = decodeURIComponent(result.record[0].description);
                    if(result.record.length === 0){
                        this.setState({navigateTo: '/news'})
                    }else
                    this.setState({ news: result.record });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    /*_back() {
        this.setState({ navigateTo: '/news' });
    }*/

    render() {
        if (this.state.navigateTo != '') {
            return <Redirect to={this.state.navigateTo} />;
        }
        return (
            <div>
                <SubHeader history={this.props.history} />
                <div className="main-container whitebg">
                    {/*<div className="top-navigation">
                        <div className="back-button" onClick={() => this._back()}><FontAwesomeIcon icon="chevron-left" /> {this.language.back}</div>
                    </div>*/}
                    {this.state.news.map((news, i) =>
                        <div className="news-content" key={news.id} >
                            <div className="news-title">{news.title}</div>
                            <Picture images={news.newspic} theme={"full"} />
                            <div className="news-datetime">{news.time}</div>
                            <div className="news-description" dangerouslySetInnerHTML={{__html: news.fulldesc}}></div>
                        </div>
                    )}
                </div>
            </div>
        )
    }
}

export default NewsDetail;