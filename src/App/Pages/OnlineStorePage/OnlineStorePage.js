import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import './OnlineStorePage.style.css';
import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';
import CommodityListItem from '../../Component/CommodityListItem/CommodityListItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import OnlineStoreListItem from '../../Component/OnlineStoreListItem/OnlineStoreListItem';
import banner from '../../../images/onlinestore.jpg';


class OnlineStorePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: "",
            redirect: false,
            list: [],
            category: [],
            currentTab: 0,
            currentCategory: 0,
        }
        this.language = getLanguage(activelanguage, 'onlinestore');
    }

    loadCommodityCategory=()=>{
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_commoditycategory.php',
            data: {
                
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
        .then((response) => {
            let result = response.data;
            if (result.status === "OK") {
                let current = 0;
                if(result.records.length>0){
                    this.loadCommodity(result.records[0].commoditycategoryid);
                    current = result.records[0].commoditycategoryid;
                }
                this.setState({ category: result.records, currentCategory: current });
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }

    loadCommodity=(id)=>{
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_commodity.php',
            data: {
                category: id,
                onlinestore: 1
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
        .then((response) => {
            let result = response.data;
            if (result.status === "OK") {
                this.setState({ list: result.records });
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    }    
	
	/*loadOnlineStore = () =>{
		axios.get(webserviceurl + '/app_load_commodity.php')
            .then((response) => {
                let result = response.data;
                
                if (result.status === "OK") {

					this.setState({ list: result.records });
				}
				
            })
            .catch((error) => {
                console.log(error);
            });
	}*/
	
	componentDidMount = () => {
        this.waitForBridge();
        this.loadCommodityCategory();
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

    goToMerchantProfile=(item)=>{
        this.props.history.push('/merchantprofile/'+item.merchant);
    }

    /*renderTab = () => {
        if (this.state.currentTab === 0) {
            return (
                <div className="body-section">
                    {this.state.list.map((item, i) =>
                        <div key={i} onClick={()=>this.goToDetail(item)}>
                            <OnlineStoreListItem key={i} category={item.category} name={item.name} shortdesc={item.shortdesc} tags={item.tags}  pic={item.pic}  onClick={()=>this.goToDetail(item)}/>
                        </div>
                    )}
                </div>
            )
        } else if (this.state.currentTab === 1) {
            return (
                <div className="body-section">
                    <div className="no-data">No Data Available</div>
                </div>
            )
        }
    }*/

    changeCategory=(id)=>{
        this.setState({currentCategory: id});
        this.loadCommodity(id);
    }

    renderCategoryList=()=>{
        if(this.state.category !== undefined){
            return (
                <div>
                {this.state.category.map((category, i)=>
                    <div  key={i} onClick={()=>this.changeCategory(category.commoditycategoryid)} className={`category-item online-category ${category.commoditycategoryid === this.state.currentCategory ? 'active': ''}`}>
                        {category.commoditycategoryname}
                    </div>
                )}
                </div>
            )
        }
    }

    renderCommodity=()=>{
        if(this.state.list !== undefined && this.state.list.length>0){
            return (
                <div className="commodity-list-container online-commodity" >
                    {this.state.list.map((item, i)=>
                        <div onClick={()=>this.goToMerchantProfile(item)} key={i}>
                            <CommodityListItem  id={item.commodityid} name={item.commodityname} shortdesc={item.shortdesc} category={item.commoditycategoryname} tags={item.tags} pic={item.commoditypic[0]} price={item.price} qty={item.qty} updateQty={this.updateQty} sold={0} hidePlusMinus={true}  />
                        </div>
                    )}
                </div>
            )
        }else{
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
                <SubHeader history={this.props.history} hideSearch={true} title={this.language.title}/>
                <div className="main-container merchant-profile">
                    {/*<div className="tab-section">
                        <Container>
                            <Row>
                                <Col md="6" sm="6" xs="6" className={this.currentActiveTab(0)} onClick={() => this.changeTab(0)}>
                                    New
                                </Col>
                                <Col md="6" sm="6" xs="6" className={this.currentActiveTab(1)} onClick={() => this.changeTab(1)}>
                                    History
                                </Col>
                            </Row>
                        </Container>
                    </div>
                    {this.renderTab()}*/}
                    
                    <div className="menu-banner-container">
                        <img src={banner} alt="banner"/>
                    </div>
                    <div className="menu-section-container" >
                        <table style={{minHeight: window.innerHeight - ( 150) + 'px', maxWidth: window.innerWidth+'px', tableLayout:'fixed' }}>
                            <tbody>
                                <tr>
                                    <td className="category-column online-column">
                                        {this.renderCategoryList()}
                                    </td>
                                    <td className="menu-column">
                                        {this.renderCommodity()}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                </div>
            </div>
        );
    }
}

export default OnlineStorePage;