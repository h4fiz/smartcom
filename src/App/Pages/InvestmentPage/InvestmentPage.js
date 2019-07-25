import React, { Component } from 'react';
//import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
//import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import './InvestmentPage.style.css';

//import Picture from '../Component/pictureGallery';
import InvestmentListItem from '../../Component/InvestmentListItem/InvestmentListItem';

import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';

class InvestmentPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: "",
            redirect: false,
            companyid:props.match.params.companyid,

            investment: {
                list: [],
                currentIndex: 0
            },
            limitList: 10
        }

        this.language = getLanguage(activelanguage, 'investmentpage');
        this.loadinvestment();
        this.waitForBridge();
    }

    loadinvestment = () => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_investment.php',
            data: {
                currentIndex: this.state.investment.currentIndex,
                limit: this.state.limitList,
                companyid: this.state.companyid
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
            .then((response) => {
                let result = response.data;
                if (result.status === "OK") {
                    /*for (var i = 0; i < result.records.length; i++) {
                        result.records[i].shortdesc = decodeURIComponent(result.records[i].shortdesc);
                    }*/

                    this.setState({ investment: { list: result.records } });
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

    goToDetail=(investment)=>{
        this.props.history.push('/investmentdetail/'+investment.id);
    }

    renderList = () => {
        if (this.state.investment.list.length > 0) {
            return (
                <div className="body-section">
                    {this.state.investment.list.map((item, i) =>
                        <div key={i} onClick={()=>this.goToDetail(item)}>
                            <InvestmentListItem key={i} name={item.name} shortdesc={item.shortdesc} category={item.category} tags={item.tags} pic={item.investmentpic[0]}  />
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

export default InvestmentPage;