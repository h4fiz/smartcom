import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import './ServiceCenterDetail.style.css';
import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { numberFormat } from '../../../Global';

class ServiceCenterDetail extends Component {

    constructor(props) {
        super(props);
        this.language = getLanguage(activelanguage, 'servicecenterdetail');
        this.globallang = getLanguage(activelanguage, 'global');

        /*let tmp = JSON.parse(localStorage.getItem('serviceCenterOrder'));
        let total = 0;
        let list = [];
        for(let i=0; i< tmp.length;i++){
            if(tmp[i].qty > 0){
                total += tmp[i].qty * tmp[i].price;
                list.push(tmp[i]);
            }
        }*/

        this.state = {
            page: "",
            redirect: false,
            userserviceid: props.match.params.userserviceid,
            data: {},
        }
        
    }

    componentDidMount=()=>{
        this.waitForBridge();
        this.loadServiceCenter();
    }

    loadServiceCenter = () => {
        axios.post(webserviceurl + '/app_load_servicecenterdetail.php', {
            id: this.state.userserviceid
        },
        {headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) => {
                let result = response.data;
                
                if (result.status === "OK") {

                    let bln = "";
                        
                    switch(result.record.requestbln){
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
                    result.record.monthname = bln;

                    this.setState({ data: result.record });
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

    /*goNext=()=>{
        this.props.history.push('/servicecenterconfirmation/'+this.state.serviceid);
    }*/

    /*getInformation=()=>{
        if(this.state.serviceid === "1"){
            return "Kami melayani jasa kebersihan atau Cleaning Service untuk rumah tinggal, ruko, kantor, dll di seluruh wilayah Jakarta.PT.CLEAN didukung oleh tenaga cleaning service yang terlatih dan berpengalaman dibidang jasa kebersihan atau cleaning service, serta dilengkapi dengan peralatan kebersihan atau cleaning service yang lengkap dan modern. Bahan-bahan pembersih atau cleaning service yang digunakan adalah bahan-bahan yang ramah lingkungan.<br/>Pelayanan : <br/>1.	Kristalisasi marmer<br/>2.	Cleaning Kaca<br/>3.	Shampooing karpet<br/>4.	General cleaning<br/>";
        }else{
            return "solusi pipa mampet Kami adalah penyedia jasa khusus jasa plumbing mampet untuk mengatasi pipa saluran pembuangan air kotor yang mampet atau tersumbat untuk layanan wilayah Jakarta. Melayani tempat tinggal, perkantoran, ruko, mall, pabrik, restoran, tempat sebagainya. <br/>Pelayanan :<br/>•	Pipa Mampet<br/>•	Wastafel Mampet<br/>•	Bak Cucian Piring Mampet (Kitchen Zink)<br/>•	Pelancaran Keran Mampet / Tersumbat<br/>•	Renovasi kamar mandi<br/>•	Saluran Limbah Domestik Mampet (Domestic Waste Line)<br/>•	Instalasi saluran Baru<br/>•	Perbaikan Toilet tersumbat<br/>•	Saluran Kamar Mandi Mampet (Floor Drain)<br/>•	Sedot WC<br/>•	Pelunak saluran air akibat lemak<br/>•	Sistem Penyaringan Air<br/>•	Perbaikan Saluran Selokan<br/>•	Pembersihan saluran pembuangan<br/>•	Talang Hujan Mampet (Gutters)<br/>•	Plumbing Rifair<br/><br/>jasa plumbing mampet siap membantu Anda, tentunya dengan biaya cost yang lebih terjangkau juga waktu pengerjaan yang relatif singkat.";
        }
    }*/

    renderStatus =()=>{
        if(this.state.data.status ===0){
            return (
                <span className="pending">Pending</span>
            )
        }else{
            return (
                <span className="paid">Completed</span>
            )
        }
    }

    render() {
        
        return (
            <div className="main-container">
                <SubHeader history={this.props.history} hideSearch={true} title={this.language.title} />
                <div className="service-center-detail">
                    <table className="service-center-info">
                        <tbody>
                            <tr>
                                <td className="col1">
									{this.language.request}
                                </td>
                                <td className="col2">
                                    {this.state.data.categoryname}
                                </td>
                            </tr>
                            <tr>
                                <td className="col1">
									{this.language.requestdate}
                                </td>
                                <td className="col2">
                                    {this.state.data.id} {this.state.data.monthname} {this.state.data.requestthn}
                                </td>
                            </tr>
							<tr>
                                <td className="col1">
									{this.language.price}
                                </td>
                                <td className="col2">
                                    Rp. {this.state.data.price}
                                </td>
                            </tr>
                            <tr>
                                <td className="col1">
									{this.language.status}
                                </td>
                                <td className="col2">
                                    {this.renderStatus()}
                                </td>
                            </tr>
                            <tr>
                                <td className="col3" colSpan="2">
                                    <div>{this.language.note}</div>
                                    <div className="textarea-note">
                                        {this.state.data.note}
                                    </div>
                                </td>
                            </tr>
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

export default ServiceCenterDetail;