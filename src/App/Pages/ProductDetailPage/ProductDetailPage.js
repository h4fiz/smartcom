import React, { Component } from 'react';
//import { Link, Redirect } from 'react-router-dom';

//import { Container, Row, Col } from 'reactstrap';

import axios from 'axios';
import './ProductDetailPage.style.css';

import { getLanguage } from '../../../Languages';
import { webserviceurl, activelanguage } from '../../../Config';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import SubHeader from '../../Component/SubHeader/SubHeader';
import PictureGallery from '../../Component/pictureGallery';

class ProductDetailPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            productId: props.match.params.productid,
            productData:{},
            currentTab:0,
        }
        this.language = getLanguage(activelanguage, 'productdetailpage');
        this.waitForBridge();
    }

    componentDidMount=()=>{
        this.loadData();
    }

    loadData= () => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_productdetail.php',
            data: {
                productid: this.state.productId
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
        .then((response) => {
            let result = response.data;
            if (result.status === "OK") {
                /*for (var i = 0; i < result.records.length; i++) {
                    result.records[i].shortdesc = decodeURIComponent(result.records[i].shortdesc);
                }*/

                this.setState({ productData: result.record });
                console.log(result.record);
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

    goToAbout=()=>{
        //ke about
    }

    goToCompany=()=>{
        this.props.history.push('/companyprofile/'+this.state.productData.companyid);
    }

    changeTab=(idx)=>{
        //this.setState({currentTab: idx});
    }

    renderPic=()=>{
        if(this.state.productData.productpic !== undefined && this.state.productData.productpic[0] !== ""){
            return (
                <div className="product-detail-img-container">
                    <img src={this.state.productData.productpic[0]} />
                </div>
            )
        }
    }

    renderAboutUs=()=>{
        if(this.state.productData.about !== '' && this.state.productData.about !== undefined){
            return <span className="aboutus-link" onClick={()=>this.goToAbout()}>{this.language['about']}</span>
        }
    }

    renderInfo=()=>{
        if(this.state.productData.info !== undefined && this.state.productData.info.length>0){
            return (
                <div className="product-detail-info">
                    <table>
                        <tbody>
                            {
                                this.state.productData.info.map((item,i)=>
                                    <tr>
                                        <td className="column-field">
                                            {item.field}
                                        </td>
                                        <td className="column-value">
                                            {item.value}
                                        </td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            )
        }
    }

    renderTabContent=()=>{
        if(this.state.currentTab === 0){
			const imagesrc = this.state.productData.gallery== undefined?[]:this.state.productData.gallery;
            return (			
                <div>
                    {this.renderInfo()}
                    <div className="product-detail-description">
                        <div className="description-label">{this.language['description']}</div>
                        <div dangerouslySetInnerHTML={{ __html: this.state.productData.fulldesc }}></div>
                    </div>
					<br></br>
					<div>
						<PictureGallery 
							images = {imagesrc} theme = ""
						/>
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
                <div className="main-container product-detail">
                    <div className="product-detail-header">
                        
                            {this.renderPic()}
                        
                        <div className="product-detail-name-container">
                            {this.state.productData.name} {/*this.renderAboutUs()*/}
                        </div>
                        <div className="product-detail-company" onClick={()=>this.goToCompany()}>
                            {this.state.productData.companyname}
                        </div>
                        {/*<div className="product-detail-like-container">
                            <table>
                                <tbody>
                                    <tr>
                                        <td>{this.language['like']} 0</td>
                                        <td>{this.language['follower']} 0</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>*/}
                        {/*<div className="product-detail-tab-container">
                            <table>
                                <tbody>
                                    <tr>
                                        <td style={{width:'33%', verticalAlign:'middle'}} className={`${this.state.currentTab === 0 ? 'tab-active': ''}`} onClick={()=>this.changeTab(0)}>
                                            <div className={`product-detail-tab-item `}>
                                                <div className="product-detail-tab-icon">
                                                    <FontAwesomeIcon icon="user-circle" />
                                                </div>
                                                <div className="product-detail-tab-name">
                                                    {this.language['information']}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{width:'33%', verticalAlign:'middle'}} className={`${this.state.currentTab === 1 ? 'tab-active': ''}`} onClick={()=>this.changeTab(1)}>
                                            <div className="product-detail-tab-item">
                                                <div className="product-detail-tab-icon">
                                                    0
                                                </div>
                                                <div className="product-detail-tab-name">
                                                    {this.language['service']}
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{width:'33%', verticalAlign:'middle'}} className={`${this.state.currentTab === 2 ? 'tab-active': ''}`} onClick={()=>this.changeTab(2)}>
                                            <div className="product-detail-tab-item">
                                                <div className="product-detail-tab-icon">
                                                    0
                                                </div>
                                                <div className="product-detail-tab-name">
                                                    {this.language['product']}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>*/}
                    </div>
                    {this.renderTabContent()}
                </div>
            </div>
        );
    }
}

export default ProductDetailPage;