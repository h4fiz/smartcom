import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { Container, Row, Col } from 'reactstrap';
import { Carousel,CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption } from 'reactstrap';
import { webserviceurl, activelanguage } from '../../../Config';
import { getLanguage } from '../../../Languages';
import './RoomCategorySelect.style.css';
import axios from 'axios';
import SubHeader from '../../Component/SubHeader/SubHeader';

class RoomCategorySelect extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: "",
            redirect: false,
            community: 0,
			title: '',
			roomcategoryid: 0,
			icons: []
        }
    
        this.language = getLanguage(activelanguage, 'roomcategoryselect');
    }
	
	loadRoomCategory = () => {
		axios.post(webserviceurl + '/app_load_roomcategory.php', {
			
		},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
                console.log(response.data);
				var tmp = [];
				
				for(var i = 0; i < response.data.records.length; i++){	
					var pic = [];
					var a = {};
					
					a.image = response.data.records[i].icon;
                    a.label = response.data.records[i].roomcategoryname;
					a.roomcategoryid = response.data.records[i].roomcategoryid;
                    a.link = "/roomreservationform/"+a.roomcategoryid+"";

					tmp.push(a);
				}
				
				this.setState({icons: tmp});
				
            })
            .catch((error) =>{
                console.log(error);
				alert(error);
            });
	}

    componentDidMount=()=>{
		this.loadRoomCategory();
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

    render() {
        if (this.state.redirect) {
            /*if (this.state.page == "newspage") {
                return <Redirect to='/news' />;
            }else if(this.state.page == "myprofile"){
                return <Redirect to='/myprofile' />;
            }*/
        }

        return (
            <div className="main-container room-category-page">
				<SubHeader history={this.props.history} hideSearch={true} title={this.language.title} goBack={this.goBack}/>
                <div className="icons">
                    <div className="roomcategory-icons-container">
                            {this.state.icons.map((icon, i) => 
                                <div key={i} className={`roomcategory-icon-column ${i%2===0 ? 'category-left-column': 'category-right-column' }`}>
                                    <div className="room-category-content" >
                                        <Link to={icon.link}><div className="roomcategory-link-label"><img className="image-250" style={{height: ((window.innerWidth/2) - 60) + 'px' }} src={icon.image} /><div className="room-category-label-name">{icon.label}</div></div></Link>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
                
            </div>
        );
    }
}

export default RoomCategorySelect;