import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
import { Button, Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import './style.css';
import LazyLoad from 'react-lazy-load';
import ImageLoader from '../../Component/ImageLoader';
import PictureUploader from '../../Component/PictureUploader/PictureUploader';
//import Picture from '../../Component/pictureGallery';

import MomentListItem from '../../Component/MomentListItem/MomentListItem';

import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';
import PictureGallery from '../../Component/pictureGallery';

class Moments extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: "",
            redirect: false,
			start: 0,
			counter: 0,
			filter: '',
			loadMomentFinished: false,
            moment: {
                list: [],
                currentIndex: 0
            },
			momentid: 0,
			phoneno: '',
			name: '',
			profilepic: [],
			desc: '',
			gallery: [],
			communityid: 1
        }

        this.language = getLanguage(activelanguage, 'moments');
        this.listel = null;
        
    }

    componentDidMount=()=>{
        this.loadMoment();
		this.loadUser();
        document.addEventListener("message", this.onMessage);
        this.waitForBridge();
        this.listel = document.getElementById('list-moment');
        this.listel.addEventListener('scroll', (e)=>{
            this.scrollCheck();
        });
    }

    componentWillUnmount=()=>{
        document.removeEventListener("message", this.onMessage);
        this.listel.removeEventListener('scroll', (e)=>{
            this.scrollCheck();
        });
    }
	
	onUploadGallery = (result) => {
        this.setState({ gallery: result });
    }

    scrollCheck = ()=>{
        if(this.listel.scrollTop + this.listel.clientHeight >= this.listel.scrollHeight){
            if(this.state.loadMomentFinished == false){
				this.loadMoment(this.state.start);
			}
        }
    }


    loadMoment = (start) => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_moments.php',
            data: {
                currentIndex: this.state.moment.currentIndex,
                community: 0,
				start: this.state.start,
				filter: this.state.filter
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
            .then((response) => {
                let result = response.data;
				let limitafterload = this.state.start + 10;
                if (result.status === "OK") {
					if(result.records.length == 0){
						this.setState({loadMomentFinished: true});
					}
					
					let tmp = this.state.moment.list;
					
					for(var i=0; i<result.records.length;i++){
						tmp.push(result.records[i]);
					}
					
                    for (var i = 0; i < result.records.length; i++) {
                        result.records[i].desc = decodeURIComponent(result.records[i].desc);
                    }
					
                    this.setState({ moment: { list: tmp } });
					this.setState({ start: limitafterload});
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
	
	loadUser=()=>{
        
		if(localStorage.getItem('smart-app-id-login') != undefined && localStorage.getItem('smart-app-id-login') != 'undefined'){
			var com = localStorage.getItem('smart-app-id-login');
			var login = JSON.parse(com);
        
            this.state.phoneno = login.phonenumber;
            this.state.name = login.name;
            this.state.profilepic = login.profilepic
			//this.setState({phoneno : login.phonenumber===undefined?"":login.phonenumber, name : login.name===undefined?"":login.name, profilepic : login.profilepic===undefined?"":login.profilepic});
		}
	}
	
	addMoment=()=>{
		const {desc} = this.state;
		const {gallery} = this.state;
		
		if(desc == null || desc == '' || gallery == [] || gallery == null){
			alert('Please fill the input!');
			return false;
		}
			
		else{
			this.onSubmit();
		}
    }
	
	onSubmit = () => {
		axios({
            method: 'post',
            url: webserviceurl + '/app_insert_moment.php',
			data: {
				momentid: this.state.momentid,
				phoneno: this.state.phoneno,
                desc: this.state.desc,
				communityid: this.state.communityid,
				gallery: this.state.gallery
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
            .then( (response) =>{
				alert('Moment added');
				this.setState({desc: ''});
				this.setState({gallery: []});
				this.loadMoment();
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
    }
	
	getLocation=()=>{
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(this.showPosition);
		  } else { 
			console.log('Geolocation is not supported by this browser');
		  }
	}
	
	showPosition=(position)=>{
		console.log(position.coords.latitude);
		console.log(position.coords.longitude);
	}
	
	onSearch=(query)=>{
		axios({
            method: 'post',
            url: webserviceurl + '/app_load_moments.php',
            data: {
                currentIndex: this.state.moment.currentIndex,
                community: 0,
				start: 0,
				filter: query
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
            .then((response) =>{
                let result = response.data;
				let limitafterload = 10;
				
                if (result.status === "OK") {
					if(result.records.length == 0){
						this.setState({loadMomentFinished: true});
					}
					
					let tmp = result.records;
					
					for (var i = 0; i < result.records.length; i++) {
                        result.records[i].desc = decodeURIComponent(result.records[i].desc);
                    }
						
					this.setState({ moment: { list: tmp } });
					this.setState({ filter : query});
					this.setState({ counter: limitafterload});
                }
				
            })
            .catch((error) =>{
                console.log(error);
				alert(error);
            });
	}

	goToDetail=(moment)=>{
        //this.props.history.push('/momentprofile/'+moment.id);
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
                this.loadUser();
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
            let param = '{"title":"' + this.language.moments + '","canGoBack":false}';
            window.postMessage(param, "*");
        }
    }

    createMarkup = (content) => {
        return { __html: content };
    }

    renderList = () => {
        if (this.state.moment.list.length > 0) {
            return (
                <div className="body-section">
                    {this.state.moment.list.map((item, i) =>
                        <div key={i} onClick={()=>this.goToDetail(item)}>
                            <MomentListItem id={item.id} pic={item.pic} name={item.name} desc={item.desc} gallery={item.gallery} date={item.date} comment={item.comment} count={item.count} username={item.username} history={this.props.history}/>
                        </div>
                    )}
                </div>
            )

        } else {
            return (
                <div className="no-data-available">No Data</div>
            )
        }
    }
	
	renderPicture=()=>{
        if(this.state.profilepic !== ''){
            return (
                <div className="imgitem-container2">
					<LazyLoad>
						<img src={this.state.profilepic} alt={'imgpic'}/>
					</LazyLoad>
                </div>
            )
        }else{
            return (
                <div className="imgitem-container2">
                    <ImageLoader src={require('../../../images/default.png')} alt={'imgpic'} className="imgdefault"/>
                </div>
            )
        }
    }
	
	renderAdd=()=>{
		return (
			<div className="body-section">
				<div className="list-item" >
                <div className="relative-container">
                    {this.renderPicture()}
                    <div className="data-container2">
                        <div className="name-container moments-name">{this.state.name}</div>
						<div className="field-container">
                            <div className="field-label">{this.language.description}</div>
                            <div className="field-value">
                                <textarea rows="5" placeholder={this.language.placeholder} value={this.state.desc} onChange={(event)=>this.setState({desc: event.target.value})}>
                                    
                                </textarea>
                            </div>
                        </div>
						
						<div className="field-container">
                            <div className="field-label">{this.language.upload}</div>
                            <div className="field-value">
                                <PictureUploader onUpload={this.onUploadGallery} picList = {this.state.gallery} picLimit={9}></PictureUploader>
                            </div>
                        </div>
						<br></br>
						<div align="right" className="addcomment-container">{/*this.state.count*/} {/*this.state.label*/}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	<Button color="success" onClick={() => this.addMoment(this.state)}>Add Moment</Button></div>
                    </div>
                </div>
            </div>
			</div>
		)
	}

    render() {
		if (this.state.redirect) {
            /*if (this.state.page == "newspage") {
                return <Redirect to='/news' />;
            }*/
        }
		
        return (
            <div> 
                <SubHeader history={this.props.history} onSearch={this.onSearch}/>
                <div className="main-container park-enterprise" id="list-moment">
					{this.renderAdd()}
                    {this.renderList()}
                </div>
            </div>
        );
    }
}

export default Moments;