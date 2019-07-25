import React, { Component } from 'react';
import { getLanguage } from '../../../Languages';

import axios from 'axios';
import './style.css';

import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';

import "../../../../node_modules/video-react/dist/video-react.css";

import { Player } from 'video-react';

class TrafficCamera extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: "",
            redirect: false,
            community: props.match.params.communityid
        }

        this.language = getLanguage(activelanguage, 'trafficcamera');
        
    }

    componentDidMount=()=>{
        this.waitForBridge();
    }

    /*loadtalent = () => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_talent.php',
            data: {
                currentIndex: this.state.talent.currentIndex,
                limit: this.state.limitList,
                companyid: this.state.companyid
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
            .then((response) => {
                let result = response.data;
                if (result.status === "OK") {
                    this.setState({ talent: { list: result.records, currentIndex: this.state.talent.currentIndex } });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }*/


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

    
    render() {
        if (this.state.redirect) {
            /*if (this.state.page == "newspage") {
                return <Redirect to='/news' />;
            }*/
        }

        return (
            <div>
                <SubHeader history={this.props.history} hideSearch={true} title={this.language.title}/>
                <div className="main-container traffic-camera">
                    <div className="camera-container">
                        <div className="camera-header">Bunderan HI</div>
                        <div className="camera-body">
                            <Player
                                playsInline
                                autoPlay
                                src="http://indonesia.lifejuiceco.com/smartcp/video/video20181207_122257.384.mp4"
                                />
                        </div>
                    
                    </div>
                </div>
            </div>
        );
    }
}

export default TrafficCamera;