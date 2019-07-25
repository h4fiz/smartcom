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


class CompanyPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: "",
            redirect: false,

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
                community: 0
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
            let param = '{"title":"' + this.language.company + '","canGoBack":false}';
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

export default CompanyPage;