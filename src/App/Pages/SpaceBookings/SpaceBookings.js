import React, { Component } from 'react';
import { getLanguage } from '../../../Languages';
import axios from 'axios';
import './SpaceBookings.style.css';
import { Container, Row, Col } from 'reactstrap';
import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import 'react-confirm-alert/src/react-confirm-alert.css';

import more from '../../../images/marketplace/more.png';

class SpaceBookings extends Component {

    constructor(props) {
        super(props);

        this.language = getLanguage(activelanguage, 'spacebookings');
        this.globallang = getLanguage(activelanguage, 'global');

        let curr = localStorage.getItem('bookingfrom');
        if(curr === null || curr === undefined || curr === '') curr = 0;

        this.state = {
			currentTab: parseInt(curr), 
            page: "",
            redirect: false,
            rooms:[],
            roomcategories:[],
            currentRoomCategory: 0,
			roomstart: 0,
			loadRoomFinished: false,
			activities:[],
			activitycategories:[],
            currentActivityCategory: 0,
			activitystart: 0,
			loadActivityFinished: false
        }
		
		this.listel = null;
    }

    componentDidMount=()=>{
        this.waitForBridge();
        this.loadRoomCategory();
        this.loadActivityCategory();

        let curr = localStorage.getItem('bookingfrom');
        if(curr === null || curr === undefined || curr === '') curr = 0;
        this.setState({currentTab: parseInt(curr)});
		
		this.listel = document.getElementById('list-booking');
        this.listel.addEventListener('scroll', (e)=>{
            this.scrollRoomCheck();
			this.scrollActivityCheck();
        });
    }
	
	componentWillUnmount=()=>{
        this.listel.removeEventListener('scroll', (e)=>{
            this.scrollRoomCheck();
			this.scrollActivityCheck();
        });
    }
	
	scrollRoomCheck = ()=>{
        if(this.listel.scrollTop + this.listel.clientHeight >= this.listel.scrollHeight){
			if(this.state.loadRoomFinished == false){
				this.loadRoomReservationByCategory(this.state.currentRoomCategory, this.state.roomstart);
			}
        }
    }
	
	scrollActivityCheck = ()=>{
        if(this.listel.scrollTop + this.listel.clientHeight >= this.listel.scrollHeight){
			if(this.state.loadActivityFinished == false){
				this.loadRoomReservationByCategory(this.state.currentActivityCategory, this.state.activitystart);
			}
        }
    }

    loadRoom=(id)=>{
        this.setState({currentRoomCategory: id});
        this.loadRoomReservationByCategory(id, 0);
		this.setState({ roomstart: 0});
		this.setState({ rooms: []});
    }
	
	loadActivity=(id)=>{
        this.setState({currentActivityCategory: id});
        this.loadActivityReservationByCategory(id, 0);
		this.setState({ activitystart: 0});
		this.setState({ activities: []});
    }

    loadRoomCategory = (id) => {
        axios.get(webserviceurl + '/app_load_roomcategory.php')
            .then((response) => {
                let result = response.data;
                if (result.status === "OK") {
                    this.loadRoomReservationByCategory(this.state.currentRoomCategory, 0);
                    this.setState({ roomcategories: result.records});
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
	
	loadActivityCategory = (id) => {
        axios.get(webserviceurl + '/app_load_activitycategory.php')
            .then((response) => {
                let result = response.data;
                if (result.status === "OK") {
                    this.loadActivityReservationByCategory(this.state.currentActivityCategory, 0);
                    this.setState({ activitycategories: result.records});
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    loadRoomReservationByCategory = (id, roomstart) => {
        axios.get(webserviceurl + '/app_load_roomreservation.php?id='+id + '&roomstart=' +roomstart)
            .then((response) => {
                let result = response.data;
				let limitafterload = this.state.roomstart + 10;
                if (result.status === "OK") {
					if(result.records.length == 0){
						this.setState({loadRoomFinished: true});
					}
					
					let tmp = this.state.rooms;
					for(var i=0; i<result.records.length;i++){
						tmp.push(result.records[i]);
					}
					
                    this.setState({ rooms: tmp});
					this.setState({ roomstart: limitafterload});	
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
	
	loadActivityReservationByCategory = (id, activitystart) => {
        axios.get(webserviceurl + '/app_load_activityreservation.php?id='+id + '&activitystart=' +activitystart)
            .then((response) => {
                let result = response.data;
				let limitafterload = this.state.activity + 10;
                if (result.status === "OK") {  
					if(result.records.length == 0){
						this.setState({loadActivityFinished: true});
					}
					
                    let tmp = this.state.activities;
					for(var i=0; i<result.records.length;i++){
						tmp.push(result.records[i]);
					}
					
                    this.setState({ activities: tmp});
					this.setState({ activitystart: limitafterload});
                }
            })
            .catch((error) => {
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

    goBack=()=>{
        this.props.history.goBack();
    }

    goToRoomDetail=(room)=>{
        this.props.history.push('/roomreservationdetail/'+room.roomreservationid);
    }
    goToActivityDetail=(activity)=>{
        this.props.history.push('/activityreservationdetail/'+activity.activityreservationid);
    }

    add=()=>{
		if(this.state.currentTab == 0){
            localStorage.setItem('bookingfrom', '0');
            this.props.history.push('/roomcategoryselect')
            
		}
		else{
            localStorage.setItem('bookingfrom', '1');
            this.props.history.push('/activitycategoryselect')
            
		}
    }
	
	currentActiveTab(idx) {
        if (idx === this.state.currentTab)
            return "tab-item active-tab";
        else
            return "tab-item";
    }

    changeTab(idx) {
        this.setState({ currentTab: idx, currentIndex: 0 });
        if(idx == 0){
            this.renderRoomReservation();
        }
        else{
            this.renderActivityReservation();
        }
    }

    renderDot = (item)=>{
        if(item.status === 0){
            return(
                <span className="pending"><FontAwesomeIcon icon="circle" /></span>
            )
        }
		else if(item.status === 1){
            return(
                <span className="paid"><FontAwesomeIcon icon="circle" /></span>
            )
        }
		else if(item.status === 2){
            return(
                <span className="cancelled"><FontAwesomeIcon icon="circle" /></span>
            )
        }
    }

    renderStatus = (item)=>{
        if(item.status === 0){
            return(
                <span className="pending">{this.language.pending}</span>
            )
        }
		else if (item.status === 1){
            return(
                <span className="completed">{this.language.completed}</span>
            )
        }
		else if (item.status === 2){
            return(
                <span className="cancelled">{this.language.cancelled}</span>
            )
        }
    }

    renderRoomReservationBody = () => {
        if(this.state.rooms.length>0){
            return (
                <div className="body-section rooms-scroll-view">
                    <table>
                        <tbody>
                            {this.state.rooms.map((item, i) =>
                                <tr key={i} className="room-list" onClick={()=>this.goToRoomDetail(item)}>
                                    <td className="room-list-col-dot">
                                        {this.renderDot(item)}
                                    </td>
                                    <td className="rooms-list-col1">
                                        <div className="room-name">{item.roomname}</div>
										<div className="room-checkin">In: {item.checkin}</div>
										<div className="room-checkout">Out: {item.checkout}</div>
                                        {/*<div className="room-desc">Rp. {item.price}</div>*/}
                                    </td>
                                    <td className="rooms-list-col-qty">
                                        <div className="room-status-label">Status</div>
                                        <div className="room-status-value">
                                            {this.renderStatus(item)}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )
        }
		else{
            return(
                <div className="body-section rooms-scroll-view" >
                    <div className="no-data">
                        {this.globallang.nodata}
                    </div>        
                </div>
            )
        }
    }
	
	renderActivityReservationBody = () => {
        if(this.state.activities.length>0){
            return (
                <div className="body-section activities-scroll-view">
                    <table>
                        <tbody>
                            {this.state.activities.map((item, i) =>
                                <tr key={i} className="activity-list" onClick={()=>this.goToActivityDetail(item)}>
                                    <td className="activity-list-col-dot">
                                        {this.renderDot(item)}
                                    </td>
                                    <td className="activities-list-col1">
                                        <div className="activity-name">{item.name}</div>
										<div className="activity-checkin">Check In: {item.checkin}</div>
										<div className="activity-checkout">Check Out: {item.checkout}</div>
                                        <div className="activity-desc">Rp. {item.price}</div>
                                    </td>
                                    <td className="activities-list-col-qty">
                                        <div className="activity-status-label">Status</div>
                                        <div className="activity-status-value">
                                            {this.renderStatus(item)}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )
        }
		else{
            return(
                <div className="body-section rooms-scroll-view">
                    <div className="no-data">
                        {this.globallang.nodata}
                    </div>        
                </div>
            )
        }
    }

    renderRoomCategory = (category)=>{
        if(category.roomcategoryid === this.state.currentRoomCategory){
            return (<div className="room-link-label room-link-active" onClick={() => this.loadRoom(category.roomcategoryid)}><img src={category.icon} /><br />{category.roomcategoryname} </div>)
        }
		else{
            return (<div className="room-link-label" onClick={() => this.loadRoom(category.roomcategoryid)}><img src={category.icon} /><br />{category.roomcategoryname} </div>)
        }
    }
	
	renderActivityCategory = (category)=>{
        if(category.activitycategoryid === this.state.currentActivityCategory){
            return (<div className="activity-link-label activity-link-active" onClick={() => this.loadActivity(category.activitycategoryid)}><img src={category.icon} /><br />{category.activitycategoryname} </div>)
        }
		else{
            return (<div className="activity-link-label" onClick={() => this.loadActivity(category.activitycategoryid)}><img src={category.icon} /><br />{category.activitycategoryname} </div>)
        }
    }
	
	renderRoomReservation=()=>{
		const all = {
				roomcategoryid : 0,
				roomcategoryname: this.globallang.all,
				icon: more
			}
			
			return (
				<div>
					<div className="room-icons">
						<div className="room-icons-container">
							<table className="table-icon">
								<tbody>
									<tr>
										<td>
											<div className="room-icon-column">
												{this.renderRoomCategory(all)}
											</div>
										</td>
									{this.state.roomcategories.map((category, i) => 
										<td>
											<div key={i} className="room-icon-column">
												{this.renderRoomCategory(category)}
											</div>
										</td>
									)}
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					{this.renderRoomReservationBody()}
				</div>
			);
	}
	
	renderActivityReservation=()=>{
		const all = {
				activitycategoryid : 0,
				activitycategoryname: this.globallang.all,
				icon: more
			}
			
			return (
				<div>
					<div className="activity-icons">
						<div className="activity-icons-container">
							<table className="table-icon">
								<tbody>
									<tr>
										<td>
											<div className="activity-icon-column">
												{this.renderActivityCategory(all)}
											</div>
										</td>
									{this.state.activitycategories.map((category, i) => 
										<td>
											<div key={i} className="activity-icon-column">
												{this.renderActivityCategory(category)}
											</div>
										</td>
									)}
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					{this.renderActivityReservationBody()}
				</div>
			);
	}
	
	renderWhat=()=>{
		if(this.state.currentTab == 0){
			return(
				<div>
					{this.renderRoomReservation()}
				</div>
			);
		}
		
		else{
			return(
				<div>
					{this.renderActivityReservation()}
				</div>
			);
		}
	}

    render() {
        return (
            <div>
                <SubHeader history={this.props.history} hideSearch={true} title={this.state.currentTab == 0 ? this.language.roombooking : this.language.activitybooking} showAddButton={true} add={this.add}/>
                <div className="main-container" id="list-booking">              
                    <div className="tab-section">
                        <Container>
                            <Row>                  
                                <Col md="6" sm="6" xs="6" className={this.currentActiveTab(0)} onClick={() => this.changeTab(0)}>
                                    Room
                                </Col>
                                <Col md="6" sm="6" xs="6" className={this.currentActiveTab(1)} onClick={() => this.changeTab(1)}>
                                    Activity
                                </Col>
                            </Row>
                        </Container>
                    </div>
					{this.renderWhat()}
                </div>
            </div>
        );
    }
}

export default SpaceBookings;