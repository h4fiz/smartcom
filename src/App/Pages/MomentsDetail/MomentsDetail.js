import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import './style.css';

//import Picture from '../../Component/pictureGallery';

import MomentListDetail from '../../Component/MomentListDetail/MomentListDetail';

import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';
import PictureGallery from '../../Component/pictureGallery';

class MomentsDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
			momentid: props.match.params.momentid,
            page: "",
            redirect: false,

            moment: {
                list: [],
                currentIndex: 0
            },
            limitList: 10
        }

        this.language = getLanguage(activelanguage, 'moments');
    }

    componentDidMount=()=>{
        this.loadMoment();
        document.addEventListener("message", this.onMessage);
        this.waitForBridge();
    }

    componentWillUnmount=()=>{
        document.removeEventListener("message", this.onMessage);
    }

    loadMoment = () => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_moments_detail.php',
            data: {
                currentIndex: this.state.moment.currentIndex,
                limit: this.state.limitList,
                community: 0,
				momentid: this.state.momentid
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
            .then((response) => {
                let result = response.data;
                if (result.status === "OK") {
                    for (var i = 0; i < result.records.length; i++) {
                        result.records[i].desc = decodeURIComponent(result.records[i].desc);
                    }
                    this.setState({ moment: { list: result.records } });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    onMessage=(data)=>{
        //alert(data.data);
        let messContent = null;
        if(data.data)
            messContent = JSON.parse(data.data);
        
        if(messContent){
            if(messContent.code === 'login'){
                localStorage.setItem('smart-app-id-login', JSON.stringify(messContent.param));
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
	
	reload=()=>{
		this.loadMoment();
	}

    renderList = () => {
        if (this.state.moment.list.length > 0) {
            return (
                <div className="body-section">
                    {this.state.moment.list.map((item, i) =>
                        <div key={i}>
                            <MomentListDetail momentid={this.state.momentid} phoneno={item.phoneno} pic={item.pic} name={item.name} desc={item.desc} gallery={item.gallery} date={item.date} comment={item.comment} count={item.count} username={item.username} reload={this.reload} history={this.props.history}/>
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

export default MomentsDetail;