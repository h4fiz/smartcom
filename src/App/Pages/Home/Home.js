import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
//import test from '../images/me_pic_head-bg@2x.png';
import { Container, Row, Col } from 'reactstrap';
import { webserviceurl, activelanguage } from '../../../Config';
import axios from 'axios';
import { Carousel,CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption, Modal, ModalHeader, ModalBody, ModalFooter, Button  } from 'reactstrap';
import './Home.css';

import banner1 from '../../../images/banner1.jpeg';
import banner2 from '../../../images/banner2.jpeg';
import banner3 from '../../../images/banner3.jpeg';

//import adv1 from '../../../images/adv1.jpeg';
//import adv2 from '../../../images/adv2.jpeg';
//import adv3 from '../../../images/adv3.jpeg';

import gc1 from '../../../images/gc1.jpg';
import gc2 from '../../../images/gc2.jpg';
import gc3 from '../../../images/gc3.jpg';
import gc4 from '../../../images/gc4.jpg';

import modern1 from '../../../images/modern1.jpeg';
import modern2 from '../../../images/modern2.jpeg';
import modern3 from '../../../images/modern3.jpeg';
import modern4 from '../../../images/modern4.jpeg';
import modern5 from '../../../images/modern5.jpeg';
import modern6 from '../../../images/modern6.jpeg';

let icons = [];
const items = [
    {
        src: modern1,
        altText: 'Slide 1',
        caption: 'Slide 1'
    },
    {
        src: modern2,
        altText: 'Slide 2',
        caption: 'Slide 2'
    },
    {
        src: modern3,
        altText: 'Slide 3',
        caption: 'Slide 3'
    }
];

const items2 = [
    {
        src: modern4,
        altText: 'Slide 1',
        caption: 'Slide 1'
    },
    {
        src: modern5,
        altText: 'Slide 2',
        caption: 'Slide 2'
    },
    {
        src: modern6,
        altText: 'Slide 3',
        caption: 'Slide 3'
    }
];

const items3 = [
    {
        src: gc3,
        altText: 'Slide 3',
        caption: 'Slide 3'
    },
    {
        src: gc1,
        altText: 'Slide 1',
        caption: 'Slide 1'
    },
    {
        src: gc2,
        altText: 'Slide 2',
        caption: 'Slide 2'
    },
    
    {
        src: gc4,
        altText: 'Slide 3',
        caption: 'Slide 3'
    }
];

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: "",
            redirect: false,
            community: 'dynamax',
            activeIndex:0,
            activeIndex2:0,
            activeIndex3:0,
            modal: false,
			count: 0
        }
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
        

        this.language = getLanguage(activelanguage, 'home');

        
        icons = [
            { image: require("../../../images/events.png"), label: this.language.news, link: "/news" },
            { image: require("../../../images/moments.png"), label: this.language.moments, link: "/moments" },
            { image: require("../../../images/traffic-camera.png"), label: this.language.trafficcamera, link: "/trafficcamera" },
            { image: require("../../../images/visitor-access.png"), label: this.language.visitoraccess, link: "/visitoraccess" },
            { image: require("../../../images/smart-parking.png"), label: this.language.smartparking, link: "/comingsoon" },
            { image: require("../../../images/call-center.png"), label: this.language.callcenter, link: "/coorporatecontact/"+ this.state.community },
            { image: require("../../../images/payment-center.png"), label: this.language.mybills, link: "/paymentcenter" },
            { image: require("../../../images/office-space-blue.png"), label: this.language.room, link: "/spacebookings" },
            { image: require("../../../images/more.png"), label: "Directory", link: "/directorycategoryselect" }
			
            /*{ image: require("../../../images/entertainment.png"), label: "Entertainment", link: "/entertainment" },
			{ image: require("../../../images/service-center.png"), label: this.language.servicecenter, link: "/servicecenter" },
            { image: require("../../../images/online-store.png"), label: "Online Store", link: "/onlinestore" },
            { image: require("../../../images/more.png"), label: "More", link: "/comingsoon" },
			{ image: require("../../../images/entertainment.png"), label: this.language.inbox, link: "/comingsoon" },
			{ image: require("../../../images/emergency.png"), label: this.language.emergency, link: "", onclick: "emergency" },*/
        ]
		
		
		if(localStorage.getItem('smart-app-id-login') != undefined && localStorage.getItem('smart-app-id-login') != 'undefined'){
			var com = window.localStorage.getItem('smart-app-id-login');
			var login = JSON.parse(com);
		}
		
        //this.waitForBridge();
    }

    componentDidMount=()=>{
        this.waitForBridge();
        document.addEventListener("message", this.onMessage);
		this.loadMomentCount();
    }

    componentWillUnmount=()=>{
        document.removeEventListener("message", this.onMessage);
    }

    loadMomentCount = () => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_momentscount.php',
            data: {
				filter: ''
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
            .then((response) => {
                let result = response.data;
                if (result.status === "OK") {
					this.setState({ count: result.records});
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    toggle=()=> {
        this.setState({
          modal: !this.state.modal
        });
    }

    callEmergency=()=>{
        this.toggle();
        window.location="tel:0123";
    }

    onMessage=(data)=>{
        //alert(data.data);
        let messContent = null;
        if(data.data)
            messContent = JSON.parse(data.data);
        
        if(messContent){
            if(messContent.code === 'login'){
                localStorage.setItem('smart-app-id-login', JSON.stringify(messContent.param));
                //alert(JSON.stringify(messContent.param));
                window.postMessage('{"code":"receivelogin"}', "*");
            }else if(messContent.code === 'logout'){
                localStorage.removeItem('smart-app-id-login');
            }
        }
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
            let param = '{"title":"","canGoBack":false, "showCommunityName":true, "hideTopbar":false, "hideFooterMenu":false}';
            window.postMessage(param, "*");
        }
    }

    onClickHandler = (idx)=>{
        if(idx === "emergency"){
            this.toggle();
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

    goToIndex=(newIndex)=> {
        if (this.animating) return;
        this.setState({ activeIndex: newIndex });
    }

    next2=()=>{
        if (this.animating) return;
        const nextIndex = this.state.activeIndex2 === items2.length - 1 ? 0 : this.state.activeIndex2 + 1;
        this.setState({ activeIndex2: nextIndex });
    }

    previous2=()=>{
        if (this.animating) return;
        const nextIndex = this.state.activeIndex2 === 0 ? items2.length - 1 : this.state.activeIndex2 - 1;
        this.setState({ activeIndex2: nextIndex });
    }

    goToIndex2=(newIndex)=> {
        if (this.animating) return;
        this.setState({ activeIndex2: newIndex });
    }

    //------TOP BANNER-----
    next3=()=>{
        if (this.animating) return;
        const nextIndex = this.state.activeIndex3 === items3.length - 1 ? 0 : this.state.activeIndex3 + 1;
        this.setState({ activeIndex3: nextIndex });
    }

    previous3=()=>{
        if (this.animating) return;
        const nextIndex = this.state.activeIndex3 === 0 ? items3.length - 1 : this.state.activeIndex3 - 1;
        this.setState({ activeIndex3: nextIndex });
    }

    goToIndex3=(newIndex)=> {
        if (this.animating) return;
        this.setState({ activeIndex3: newIndex });
    }
    //---------------------

    renderIcon = (icon)=>{
        if(icon.link !== ""){
			if(icon.label == "Moments"){
				return(
					<Link to={icon.link}><div className="link-label" ><div className="moment-icon"><img src={icon.image} /><br />{icon.label}<div className="fa-moment"><span class="num">{this.state.count}</span></div></div></div></Link>
				)
			}
			else{
				return (
					<Link to={icon.link}><div className="link-label"><img src={icon.image} /><br />{icon.label}</div></Link>
				)
			}
        }
		else{
            return (
                <div className="link-label" onClick={()=>this.onClickHandler(icon.onclick)}><img src={icon.image} /><br />{icon.label}</div>
            )
        }

    }

    render() {
        if (this.state.redirect) {
            if (this.state.page == "newspage") {
                return <Redirect to='/news' />;
            }else if(this.state.page == "mypage"){
                return <Redirect to='/mypage' />;
            }else if(this.state.page == "marketplace"){
                return <Redirect to='/marketplace' />;
            }else if(this.state.page == "entertainment"){
                return <Redirect to='/entertainment' />;
            }

        }

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

        const slides2 = items2.map((item) => {
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

        const slides3 = items3.map((item) => {
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
                <div className="header">
                    <Carousel
                            activeIndex={this.state.activeIndex3}
                            next={this.next3}
                            previous={this.previous3}
                        >
                        <CarouselIndicators items={items3} activeIndex={this.state.activeIndex3} onClickHandler={this.goToIndex3} />
                        {slides3}
                        <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous3} />
                        <CarouselControl direction="next" directionText="Next" onClickHandler={this.next3} />
                    </Carousel>
                </div>
                <div className="icons">
                    <Container>
                        <Row>
                            {icons.map((icon, i) => <Col key={icon.label} md="3" sm="3" xs="3" className="icon">
                                {this.renderIcon(icon)}
                            </Col>)}
                        </Row>
                    </Container>
                </div>
                <div className="big-icons">
                    <div className="adv-content">
                        <Carousel
                            activeIndex={this.state.activeIndex2}
                            next={this.next2}
                            previous={this.previous2}
                        >
                            <CarouselIndicators items={items2} activeIndex={this.state.activeIndex2} onClickHandler={this.goToIndex2} />
                            {slides2}
                            <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous2} />
                            <CarouselControl direction="next" directionText="Next" onClickHandler={this.next2} />
                        </Carousel>
                    </div>
                </div>
                <div className="big-icons">
                    {/*<div className="adv-title">
                        Promotion
                    </div>*/}
                    <div className="adv-content">
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
                </div>
                
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                <ModalHeader toggle={this.toggle}>Emergency</ModalHeader>
                <ModalBody>
                    Calling Emergency?
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={this.callEmergency}>Yes</Button>{' '}
                    <Button color="secondary" onClick={this.toggle}>No</Button>
                </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default Home;