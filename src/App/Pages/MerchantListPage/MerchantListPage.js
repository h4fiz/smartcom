import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import './MerchantListPage.style.css';

import MerchantListItem from '../../Component/MerchantListItem/MerchantListItem';
import SubHeader from '../../Component/SubHeader/SubHeader';

import { webserviceurl, activelanguage } from '../../../Config';



class MerchantListPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: "",
            redirect: false,

            merchant: {
                list: [],
                currentIndex: 0
            },
            limitList: 10,
            community: props.match.params.communityid,
            category: props.match.params.categoryid
        }

        this.language = getLanguage(activelanguage, 'merchantlist');
    }

    componentDidMount=()=>{
        this.loadMerchant();
        this.waitForBridge();
    }

    loadMerchant = () => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_merchant.php',
            data: {
                currentIndex: this.state.merchant.currentIndex,
                limit: this.state.limitList,
                community: this.state.community,
                category: this.state.category
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
            .then((response) => {
                let result = response.data;
                if (result.status === "OK") {
                    this.setState({ merchant: { list: result.records } });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    goToDetail=(merchant)=>{
        this.props.history.push('/merchantprofile/'+merchant.id);
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
        if (this.state.merchant.list.length > 0) {
            return (
                <div className="body-section">
                    {this.state.merchant.list.map((item, i) =>
                        <div key={i} onClick={()=>this.goToDetail(item)}>
                            <MerchantListItem key={i} name={item.name} shortdesc={item.shortdesc} category={item.category} tags={item.tags} pic={item.merchantpic[0]}  />
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

export default MerchantListPage;