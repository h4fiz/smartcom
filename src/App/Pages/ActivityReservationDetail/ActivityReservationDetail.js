import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import './ActivityReservationDetail.style.css';
import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { numberFormat } from '../../../Global';

class ActivityReservationDetail extends Component {

    constructor(props) {
        super(props);
        this.language = getLanguage(activelanguage, 'activityreservationdetail');
        this.globallang = getLanguage(activelanguage, 'global');

        this.state = {
            page: "",
            redirect: false,
            activityreservationid: props.match.params.activityreservationid,
            title: this.language.title,
            data: {},
			detail: []
        }
        
    }

    componentDidMount=()=>{
        this.waitForBridge();
        this.loadActivityReservation();
    }

    loadActivityReservation = () => {
        axios.post(webserviceurl + '/app_load_activityreservationdetail.php', {
            activityreservationid: this.state.activityreservationid
        },
        {headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) => {
                let result = response.data;
                
                if (result.status === "OK") {
                    this.setState({ data: result.record });
					this.setState({ detail: result.record.info });
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

    renderStatus =()=>{
        if(this.state.data.status === 0){
            return (
                <span className="pending">Pending</span>
            )
        }
		else if (this.state.data.status === 1){
            return (
                <span className="paid">Paid</span>
            )
        }
		else if (this.state.data.status === 2){
            return (
                <span className="cancelled">Cancelled</span>
            )
        }
    }

    render() {
        return (
            <div className="main-container">
                <SubHeader history={this.props.history} hideSearch={true} title={this.state.title} />
                <div className="activity-reservation-detail">
                    <table className="activity-reservation-info">
                        <tbody>
                            <tr>
                                <td className="col1">
                                    Name
                                </td>
                                <td className="col2">
                                    {this.state.data.name}
                                </td>
                            </tr>
                            <tr>
                                <td className="col1">
                                    Date Check In
                                </td>
                                <td className="col2">
                                    {this.state.data.checkin}
                                </td>
                            </tr>
							<tr>
                                <td className="col1">
                                    Date Check Out
                                </td>
                                <td className="col2">
                                    {this.state.data.checkout}
                                </td>
                            </tr>
                            <tr>
                                <td className="col1">
                                    Activity Name
                                </td>
                                <td className="col2">
                                    {this.state.data.activityname}
                                </td>
                            </tr>
							<tr>
                                <td className="col1">
                                    Price
                                </td>
                                <td className="col2">
                                    Rp. {this.state.data.price}
                                </td>
                            </tr>
                            <tr>
                                <td className="col1">
                                    Status
                                </td>
                                <td className="col2">
                                    {this.renderStatus()}
                                </td>
                            </tr>
							{this.state.detail.map((item, i)=>
								<tr>
									<td className="col1">
										{this.state.detail[i].activityaddonname}
									</td>
									<td className="col2">
										{this.state.detail[i].qty}
									</td>
								</tr>
							)}
                        </tbody>
                    </table>
                    
                </div>
                {/*<div className="next-button" onClick={()=>this.goNext()}>
                    {this.globallang.next}
                </div>*/}
            </div>
        );
    }
}

export default ActivityReservationDetail;