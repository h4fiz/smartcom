import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { Carousel,CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption } from 'reactstrap';

import { webserviceurl, activelanguage } from '../../../Config';
import { getLanguage } from '../../../Languages';
import './MarketplacePage.style.css';

import banner1 from '../../../images/banner1.jpeg';
import banner2 from '../../../images/banner2.jpeg';
import banner3 from '../../../images/banner3.jpeg';

import adv1 from '../../../images/adv1.jpeg';
import adv2 from '../../../images/adv2.jpeg';
import adv3 from '../../../images/adv3.jpeg';

import axios from 'axios';

import gourment from '../../../images/marketplace/plate.png';
import supermarket from '../../../images/marketplace/stale.png';
import fresh from '../../../images/marketplace/food.png';
import distribution from '../../../images/marketplace/box.png';
import maintenance from '../../../images/marketplace/tools.png';
import moving from '../../../images/marketplace/truck.png';
import drycleaning from '../../../images/marketplace/shirt.png';
import housekeeping from '../../../images/marketplace/maid.png';
import massage from '../../../images/marketplace/feet.png';
import more from '../../../images/marketplace/more.png';

import samplemap from '../../../images/sample-maps.png';

import { InfoWindow } from "react-google-maps";

import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"

let icons = [];
const items = [
    {
        src: adv1,
        altText: 'Slide 1',
        caption: 'Slide 1'
    },
    {
        src: adv2,
        altText: 'Slide 2',
        caption: 'Slide 2'
    },
    {
        src: adv3,
        altText: 'Slide 3',
        caption: 'Slide 3'
    }
];

class MarketplacePage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: "",
            redirect: false,
            community: 0,
            activeIndex:0,
            markers:[{ lat: -6.1779101, lng: 106.9516151 }],
			isOpen: false,
			title: '',
			address: '',
			description: '',
			startdate: '',
			enddate: '',
			starttime: '',
			endtime: '',
			picture: [],
			icons: []
        }

        //---check community that send from app
        let search = props.location.search.replace("?", "");
        let params = search.split("&");
        for (let i = 0; i < params.length; i++) {
            let param = params[i].split("=");
            if (param[0].toLowerCase() === "page") {
                this.state.page = param[1];
                this.state.redirect = true;
                break;
            } else if (param[0].toLowerCase() === "community") {
                this.state.community = param[1];
            }
        }
        //--------------------------------------
    
        this.language = getLanguage(activelanguage, 'marketplace');
		
		
        /* if (activelanguage == "chn") {
            icons = [
                { image: gourment, label: "美食", link: "/merchantlist/"+this.state.community+"/0" },
                { image: supermarket, label: "超市", link: "/comingsoon" },
                { image: fresh, label: "生鲜", link: "/comingsoon" },
                { image: distribution, label: "配送", link: "/comingsoon" },
                { image: maintenance, label: "维修", link: "/comingsoon/"+this.state.community },
                { image: moving, label: "搬家", link: "/comingsoon" },
                { image: drycleaning, label: "干洗", link: "/comingsoon" },
                { image: housekeeping, label: "家政", link: "/comingsoon" },
                { image: massage, label: "按摩", link: "/comingsoon" },
                { image: more, label: "更多", link: "/comingsoon" },
            ]
        } else {
            icons = [
                { image: gourment, label: "Gourment", link: "/merchantlist/"+this.state.community+"/0" },
                { image: supermarket, label: "Market", link: "/comingsoon" },
                { image: fresh, label: "Fresh", link: "/comingsoon" },
                { image: distribution, label: "Distribution", link: "/comingsoon" },
                { image: maintenance, label: "Maintenance", link: "/comingsoon/"+this.state.community },
                { image: moving, label: "Moving", link: "/comingsoon" },
                { image: drycleaning, label: "Laundry", link: "/comingsoon" },
                { image: housekeeping, label: "Housekeeping", link: "/comingsoon" },
                { image: massage, label: "Massages", link: "/comingsoon" },
                { image: more, label: "More", link: "/comingsoon" },
            ]
        } */

        /*setTimeout(
            function() {
                this.waitForBridge();
            }
            .bind(this)
        , 500);*/
    }
	
	handleToggleOpen = () => {
        this.setState({
            isOpen: true
        });
    }

    handleToggleClose = () => {
        this.setState({
            isOpen: false
        });
    }
	
	loadMerchantCategory = () => {
		axios.post(webserviceurl + '/app_load_merchantcategory.php', {
			
		},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
                console.log(response.data);
				var tmp = [];
				
				for(var i = 0; i < response.data.records.length; i++){	
					var pic = [];
					var a = {};
					
					a.image = response.data.records[i].icon;
                    a.label = response.data.records[i].name;
                    if(response.data.records[i].isonlinestore === 0)
                        a.link = "/merchantlist/"+this.state.community+"/"+response.data.records[i].merchantcategoryid;
                    else 
                        a.link = "/onlinestore/"+this.state.community+"";

					tmp.push(a);
				}
				
				this.setState({icons: tmp});
				console.log(this.state.icons);
				
            })
            .catch((error) =>{
                console.log(error);
				alert(error);
            });
	}

    componentDidMount=()=>{
        this.waitForBridge();
		this.loadMerchantCategory();
		axios.post(webserviceurl + '/app_load_marketplace.php', {
			
		}, 
		
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
                //console.log(response.data);
				var tmp = [];
				
				for(var i = 0; i < response.data.records.length; i++){	
					var pic = [];
					if(response.data.records[i].info.picture !== ""){
						pic.push(response.data.records[i].info.picture);
					}
				
					tmp.push(response.data.records[i].position);
					this.setState({title: response.data.records[i].info.title});
					this.setState({description: response.data.records[i].info.description});
					this.setState({address: response.data.records[i].info.address});
					this.setState({startdate: response.data.records[i].info.startdate});
					this.setState({enddate: response.data.records[i].info.enddate});
					this.setState({starttime: response.data.records[i].info.starttime});
					this.setState({endtime: response.data.records[i].info.endtime});
					this.setState({picture : pic});
				}
				
				this.setState({markers: tmp});
				
            })
            .catch((error) =>{
                console.log(error);
				alert(error);
            });
    }

    componentWillReceiveProps=(props)=>{
		
    }

    changePage = (idx) => {
        if (idx === 1)
            this.props.history.push('/company');
        else if (idx === 2)
            this.props.history.push('/product/0');
        else if (idx === 3)
            this.props.history.push('/service/0');
        else if (idx === 4)
            this.props.history.push('/project/0');
        else if (idx === 5)
            this.props.history.push('/talent/0');
        else if (idx === 6)
            this.props.history.push('/investment/0');
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
            let param = '{"title":"' + this.language.title + '","canGoBack":false, "showCommunityName":true, "hideTopbar":false, "hideFooterMenu":false}';
            window.postMessage(param, "*");
        }
    }

    next=()=>{
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
    }

    previous=()=>{
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });
    }

    goToIndex(newIndex) {
        if (this.animating) return;
        this.setState({ activeIndex: newIndex });
    }

    onMapClick=(event)=>{
        console.log(event);
        this.setState({markers: [{ lat: event.latLng.lat(), lng: event.latLng.lng() }] });
    }

    render() {
        if (this.state.redirect) {
            /*if (this.state.page == "newspage") {
                return <Redirect to='/news' />;
            }else if(this.state.page == "myprofile"){
                return <Redirect to='/myprofile' />;
            }*/
        }

        const MyMapComponent = withScriptjs(withGoogleMap((props) =>
            <GoogleMap
                defaultZoom={15}
                defaultCenter={{ lat: -6.1779101, lng: 106.9516151 }}
            >
                {this.state.markers.map((marker, i)=>(
                    <Marker key={i} position={marker} onClick={() => this.handleToggleOpen()}>
					{this.state.isOpen &&
					<InfoWindow onCloseClick={() => this.handleToggleClose()}>
                        <span>
							<tr>	
								Title: {this.state.title}
							</tr>
							<tr>
								<td colSpan="2">&nbsp;</td>
							</tr>
							<tr>	
								Description: {this.state.description}
							</tr>
							<tr>
								<td colSpan="2">&nbsp;</td>
							</tr>
							<tr>	
								Address: {this.state.address}
							</tr>
							<tr>
								<td colSpan="2">&nbsp;</td>
							</tr>
							<tr>	
								Start Date: {this.state.startdate}
							</tr>
							<tr>
								<td colSpan="2">&nbsp;</td>
							</tr>
							<tr>	
								End Date: {this.state.enddate}
							</tr>
							<tr>
								<td colSpan="2">&nbsp;</td>
							</tr>
							<tr>	
								Start Time: {this.state.starttime}
							</tr>
							<tr>
								<td colSpan="2">&nbsp;</td>
							</tr>
							<tr>	
								End Time: {this.state.endtime}
							</tr>
							<tr>
								<td colSpan="2">&nbsp;</td>
							</tr>
							<tr>	
								<img src={this.state.picture} />
							</tr>
						</span>
                    </InfoWindow>
					}
					</Marker>
					
                ))}
                
            </GoogleMap>
        ))

        const slides = items.map((item) => {
            return (
              <CarouselItem
                onExiting={this.onExiting}
                onExited={this.onExited}
                key={item.src}
              >
                <img src={item.src} alt={item.altText} className="marketplace-banner" />
                <CarouselCaption captionText={item.caption} captionHeader={item.caption} />
              </CarouselItem>
            );
        });

        return (
            <div className="main-container">
                <div className="marketplace-header" >
                    <Carousel
                        activeIndex={this.state.activeIndex}
                        next={this.next}
                        previous={this.previous}
                    >
                        <CarouselIndicators items={items} activeIndex={this.state.activeIndex} onClickHandler={this.goToIndex} />
                        {slides}
                        <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                        <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                    </Carousel>
                </div>
                <div className="icons">
                    <Container fluid={true}>
                        <Row>
                            {icons.map((icon, i) => <Col key={icon.label} md="3" sm="3" xs="3" className="icon">
                                <Link to={icon.link}><div className="link-label"><img src={icon.image} /><br />{icon.label}</div></Link>
                            </Col>)}
                        </Row>
                    </Container>
                    <div className="marketplace-icons-container">
                            {this.state.icons.map((icon, i) => 
                                <div key={i} className="icon-column">
                                    <Link to={icon.link}><div className="link-label"><img src={icon.image} /><br />{icon.label}</div></Link>
                                </div>
                            )}
                    </div>
                </div>
                <div className="map-container hidden">
                    {/*<img src={samplemap} alt={'mapalt'} />*/}
                    <MyMapComponent
                        isMarkerShown={true}
                        googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAdm6TmweM5bzGr1Fry_737Bbcd4T0WxfY"
                        loadingElement={<div style={{ height: `100%` }} />}
                        containerElement={<div style={{ height: `240px` }} />}
                        mapElement={<div style={{ height: `100%` }} />}
                    />
                </div>
                <div className="adv-container">
                    <Carousel
                        activeIndex={this.state.activeIndex}
                        next={this.next}
                        previous={this.previous}
                    >
                        <CarouselIndicators items={items} activeIndex={this.state.activeIndex} onClickHandler={this.goToIndex} />
                        {slides}
                        <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                        <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                    </Carousel>
                </div>
                <div className="adv-container">
                    <div className="adv">
                        <img src={banner1} alt={'adv'} />
                    </div>
                    <div className="adv">
                        <img src={banner2} alt={'adv'} />
                    </div>
                    <div className="adv">
                        <img src={banner3} alt={'adv'} />
                    </div>
                </div>
                {/*<div className="big-icons">
                    <Container>
                        <Row>
                            <Col md="6" sm="6" xs="6" className="big-image-col">
                                <div className="big-image-container" onClick={() => this.changePage(1)}>
                                    <img src={require('../../../images/pic_产业资本加速@2x.png')} />
                                    <div className="big-image-label">
                                        找企业
                                    </div>
                                </div>
                            </Col>
                            <Col md="6" sm="6" xs="6" className="big-image-col">
                                <div className="big-image-container" onClick={() => this.changePage(2)}>
                                    <img src={require('../../../images/pic_产业链协同创新@2x.png')} />
                                    <div className="big-image-label">
                                        找产品
                                    </div>
                                </div>
                            </Col>
                            <Col md="6" sm="6" xs="6" className="big-image-col">
                                <div className="big-image-container" onClick={() => this.changePage(3)}>
                                    <img src={require('../../../images/pic_企业数据@2x.png')} />
                                    <div className="big-image-label">
                                        找方案
                                    </div>
                                </div>
                            </Col>
                            <Col md="6" sm="6" xs="6" className="big-image-col">
                                <div className="big-image-container" onClick={() => this.changePage(4)}>
                                    <img src={require('../../../images/pic_共享智能展厅@2x.png')} />
                                    <div className="big-image-label">
                                        找项目
                                    </div>
                                </div>
                            </Col>
                            <Col md="6" sm="6" xs="6" className="big-image-col">
                                <div className="big-image-container" onClick={() => this.changePage(5)}>
                                    <img src={require('../../../images/pic_共享高端智力@2x.png')} />
                                    <div className="big-image-label">
                                        找人才
                                    </div>
                                </div>
                            </Col>
                            <Col md="6" sm="6" xs="6" className="big-image-col">
                                <div className="big-image-container" onClick={() => this.changePage(6)}>
                                    <img src={require('../../../images/pic_园区企业分析@2x.png')} />
                                    <div className="big-image-label">
                                        找投资
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>*/}
            </div>
        );
    }
}

export default MarketplacePage;