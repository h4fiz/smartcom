import React, { Component } from 'react';
//import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
//import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import './EntertainmentPage.style.css';

import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';

import ent1 from '../../../images/ent1.png';
import ent2 from '../../../images/ent2.jpg';
import ent3 from '../../../images/ent3.png';
import jgc from '../../../images/Picture1.png';

class EntertainmentPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: "",
            redirect: false,   
        }

        this.trySendMessage = 0;
        this.language = getLanguage(activelanguage, 'entertainmentpage');
                
    }

    componentDidMount=()=>{
        this.waitForBridge();
    }

    openWindow =()=>{
        //window.open('https://www.netflix.com/id-en/', "_blank");
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

    sendMessage=(url)=>{
        this.trySendMessage +=1;
        if (window.postMessage.length !== 1) {
            if(this.trySendMessage < 30){
                setTimeout(function () {
                    this.sendMessage();
                }
                .bind(this), 200);
            }else{
                alert(this.language.errorOnMessage);
                this.trySendMessage = 0;
            }
        }
        else {
            this.trySendMessage = 0;
            let param = '{"code":"openbrowser","url":"'+url+'"}';
            window.postMessage(param, "*");
        }
    }

    createMarkup = (content) => {
        return { __html: content };
    }

    render() {
        if (this.state.redirect) {
            /*if (this.state.page == "newspage") {
                return <Redirect to='/news' />;
            }*/
        }

        return (
            <div>
                {/*<SubHeader history={this.props.history} />*/}
                <div className="main-container park-enterprise">
                    {/* <img src={ent1} alt="altpic" style={{width:'100%'}} onClick={()=>this.sendMessage('https://www.netflix.com/id-en/')}/>
                    <img src={ent2} alt="altpic" style={{width:'100%'}} onClick={()=>this.sendMessage('https://www.ihago.net')}/>
                    <img src={ent3} alt="altpic" style={{width:'100%'}} onClick={()=>this.sendMessage('https://www.joox.com/id/en/')}/> */}
                </div>
            </div>
        );
    }
}

export default EntertainmentPage;