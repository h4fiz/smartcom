import React, { Component } from 'react';
//import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
//import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import './ServiceCenterPage.style.css';
import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

//import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';

//import { numberFormat } from '../../../Global';
import more from '../../../images/marketplace/more.png';

class ServiceCenterPage extends Component {

    constructor(props) {
        super(props);
        let tmp = JSON.parse(localStorage.getItem('serviceCenterOrder'));

        this.state = {
            page: "",
            redirect: false,
            services:[],
            categories:[],
            currentCategory: 0,
			phoneno: '',
			start: 0,
			loadFinished: false
        }

        this.language = getLanguage(activelanguage, 'servicecenter');
        this.globallang = getLanguage(activelanguage, 'global');

        this.listel = null;
    }

    componentDidMount=()=>{
        this.waitForBridge();
		this.loadUser();
        this.loadServiceCategory(0);
		
		this.listel = document.getElementById('list-service');
        this.listel.addEventListener('scroll', (e)=>{
            this.scrollCheck();
        });
    }
	
	componentWillUnmount=()=>{
        this.listel.removeEventListener('scroll', (e)=>{
            this.scrollCheck();
        });
    }
	
	loadUser=()=>{
		if(localStorage.getItem('smart-app-id-login') != undefined && localStorage.getItem('smart-app-id-login') != 'undefined'){
			var com = window.localStorage.getItem('smart-app-id-login');
			var login = JSON.parse(com);
			
			this.setState({phoneno : login[0].phonenumber===undefined?"":login[0].phonenumber});
		}
	}
	
	scrollRoomCheck = ()=>{
        if(this.listel.scrollTop + this.listel.clientHeight >= this.listel.scrollHeight){
			if(this.state.loadRoomFinished == false){
				this.loadServiceByCategory(this.state.currentCategory, this.state.start);
			}
        }
    }

    loadServices=(id)=>{
        this.setState({currentCategory: id});
        this.loadServiceByCategory(id, 0, this.state.phoneno);
		this.setState({ start: 0});
		this.setState({ services: []});
    }

    loadServiceCategory = (id) => {
        axios.get(webserviceurl + '/app_load_servicecentercategory.php')
            .then((response) => {
                let result = response.data;
                if (result.status === "OK") {
                    this.loadServiceByCategory(this.state.currentCategory, 0, this.state.phoneno);
                    this.setState({ categories: result.records});
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    loadServiceByCategory = (id, start,phoneno) => {
        axios.get(webserviceurl + '/app_load_servicecenter.php?id='+id + '&start=' +start+ '&phoneno=' +phoneno)
            .then((response) => {
                let result = response.data;
				let limitafterload = this.state.start + 10;
                if (result.status === "OK") {
					if(result.records.length == 0){
						this.setState({loadFinished: true});
					}
					
					let tmp = this.state.services;

                    for(let i=0; i< result.records.length;i++){
                        let bln = "";
                        
                        switch(result.records[i].requestbln){
                            case 1: bln = this.globallang.january; break;
                            case 2: bln = this.globallang.february; break;
                            case 3: bln = this.globallang.march; break; 
                            case 4: bln = this.globallang.april; break;
                            case 5: bln = this.globallang.may; break;
                            case 6: bln = this.globallang.june; break;
                            case 7: bln = this.globallang.july; break;
                            case 8: bln = this.globallang.august; break;
                            case 9: bln = this.globallang.september; break;
                            case 10: bln = this.globallang.october; break;
                            case 11: bln = this.globallang.november; break;
                            case 12: bln = this.globallang.december; break;
                        }
                        result.records[i].monthname = bln;
						
						tmp.push(result.records[i]);
                    }
					
                    this.setState({ services: tmp});
					this.setState({ start: limitafterload});
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
        /*let exists = false;
        for(let i=0;i<this.state.services.length;i++){
            if(this.state.services[i].qty > 0){
                exists = true;
                break;
            }
        }
        if(!exists){
            this.props.history.goBack();
        }else{
            confirmAlert({
                message: this.language.areyousure,
                buttons: [
                  {
                    label: this.globallang.yes,
                    onClick: () => {
                        localStorage.removeItem('serviceCenterOrder');
                        localStorage.removeItem('serviceCenterCurrent');
                        this.props.history.goBack();
                    }
                  },
                  {
                    label: this.globallang.no,
                  }
                ]
            });
        }*/
        this.props.history.goBack();
    }

    /*
       type 
        1 : plus
        -1 : minus
    */
    updateQty=(type, idx)=>{
        let services = this.state.services;
        if(type === 1){
            services[idx].qty += type;
        }else{
            if(services[idx].qty > 0){
                services[idx].qty += type;
            }
        }
        this.setState({services: services});
    }

    /*doNext=()=>{
        let exists = false;
        for(let i=0;i<this.state.services.length;i++){
            if(this.state.services[i].qty > 0){
                exists = true;
                break;
            }
        }
        if(!exists){
            alert(this.language.pleaseaddqty);
            return false;
        }else{
            localStorage.setItem('serviceCenterOrder', JSON.stringify(this.state.services));
            localStorage.setItem('serviceCenterCurrent', this.state.currentCategory);
            this.props.history.push('/servicecenterdetail/0');
        }
    }*/
	
    goToDetail=(userservice)=>{
        this.props.history.push('/servicecenterdetail/'+userservice.userserviceid);
    }

    add=()=>{
        this.props.history.push('/servicecentercategoryselect')
    }

    renderDot = (item)=>{
        if(item.status ===0){
            return(
                <span className="pending"><FontAwesomeIcon icon="circle" /></span>
            )
        }else{
            return(
                <span className="paid"><FontAwesomeIcon icon="circle" /></span>
            )
        }
    }

    renderStatus = (item)=>{
        if(item.status ===0){
            return(
                <span className="pending">{this.language.pending}</span>
            )
        }else{
            return(
                <span className="paid">{this.language.completed}</span>
            )
        }
    }

    renderBody = () => {
        if(this.state.services.length>0){
            return (
                <div className="body-section services-scroll-view">
                    <table>
                        <tbody>
                            {this.state.services.map((item, i) =>
                                <tr key={i} className="service-list" onClick={()=>this.goToDetail(item)}>
                                    <td className="services-list-col-dot">
                                        {this.renderDot(item)}
                                    </td>
                                    <td className="services-list-col1">
                                        <div className="services-name">{item.requesttgl} {item.monthname} {item.requestthn}</div>
                                        <div className="services-desc">{item.categoryname}</div>
										<div className="services-desc">Rp. {item.price}</div>
                                    </td>
                                    <td className="services-list-col-qty">
                                        <div className="service-status-label">Status</div>
                                        <div className="service-status-value">
                                            {this.renderStatus(item)}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )
        }else{
            return(
                <div className="body-section services-scroll-view">
                    <div className="no-data">
                        {this.globallang.nodata}
                    </div>        
                </div>
            )
            
        }
        
    }

    renderCategory = (category)=>{
        
        if(category.id === this.state.currentCategory){
            return (<div className="service-link-label service-link-active" onClick={() => this.loadServices(category.servicecentercategoryid)}><img src={category.icon} /><br />{category.servicecentercategoryname} </div>)
        }else{
            return (<div className="service-link-label" onClick={() => this.loadServices(category.servicecentercategoryid)}><img src={category.icon} /><br />{category.servicecentercategoryname} </div>)
        }
    }

    render() {
        const all = {
            servicecentercategoryid : 0,
            servicecentercategoryname: this.globallang.all,
            icon: more
        }

        return (
            <div className="main-container">
                <SubHeader history={this.props.history} hideSearch={true} title={this.language.title} goBack={this.goBack} showAddButton={true} add={this.add}/>
                <div className="service-icons" id="list-service">
                    <div className="service-icons-container">
                        <table className="table-icon">
                            <tbody>
                                <tr>
                                    <td>
                                        <div className="service-icon-column">
                                            {this.renderCategory(all)}
                                        </div>
                                    </td>
                                {this.state.categories.map((category, i) => 
                                    <td>
                                        <div key={i} className="service-icon-column">
                                            {this.renderCategory(category)}
                                        </div>
                                    </td>
                                )}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                {this.renderBody()}
                {/*<div className="services-footer" onClick={()=>this.doNext()}>
                    {this.globallang.next}
                </div>*/}
            </div>
        );
    }
}

export default ServiceCenterPage;