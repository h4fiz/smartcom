import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import './style.css';
import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


class ServiceCenterConfirmation extends Component {

    constructor(props) {
        super(props);
        this.language = getLanguage(activelanguage, 'servicecenterconfirmation');
        this.state = {
            page: "",
            redirect: false,
            serviceid: props.match.params.serviceid,
            title: this.language.title,
            when:'',
            contact:'',
            number:'',
            remark:''
        }
    }

    componentDidMount=()=>{
        this.waitForBridge();
    }

    /*loadServiceCenter = () => {
        axios.get(webserviceurl + '/app_load_servicecenter.php')
            .then((response) => {
                let result = response.data;
                if (result.status === "OK") {
                    result.record.description = decodeURIComponent(result.record.description);
                    this.setState({ introduction: result.record });
                }
            })
            .catch((error) => {
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

    createMarkup = (content) => {
        return { __html: content };
    }

    goNext=()=>{
        if(this.state.when === ''){
            alert('Please input when you need the service');
            return false;
        }
        if(this.state.contact === ''){
            alert('Please input your contact person');
            return false;
        }
        if(this.state.number === ''){
            alert('Please input contact person number');
            return false;
        }
        alert('Thank you. Your confirmation has been saved.');
        
        this.props.history.go(-2);
    }

    render() {
        if (this.state.redirect) {
            /*if (this.state.page == "newspage") {
                return <Redirect to='/news' />;
            }*/
        }

        return (
            <div>
                <SubHeader history={this.props.history} hideSearch={true} title={this.state.title} />
                <div className="main-container service-center-confirmation">
                    <div className="sc-form-label">When?</div>
                    <div className="sc-form-input">
                        <input type="text" placeholder="input the date and time" value={this.state.when} onChange={(event)=>this.setState({when: event.target.value})}/>
                    </div>
                    <div className="sc-form-label">Contact Person</div>
                    <div className="sc-form-input">
                        <input type="text" placeholder="input your contact person" value={this.state.contact} onChange={(event)=>this.setState({contact: event.target.value})}/>
                    </div>
                    <div className="sc-form-label">Contact Number</div>
                    <div className="sc-form-input">
                        <input type="text" placeholder="input contact person number" value={this.state.number} onChange={(event)=>this.setState({number: event.target.value})}/>
                    </div>
                    <div className="sc-form-label">Remark</div>
                    <div className="sc-form-input">
                        <textarea placeholder="input remark here" rows="4" value={this.state.remark} onChange={(event)=>this.setState({remark: event.target.value})}></textarea>
                    </div>
                    
                </div>
                <div className="next-button" onClick={()=>this.goNext()}>
                    Submit
                </div>
            </div>
        );
    }
}

export default ServiceCenterConfirmation;