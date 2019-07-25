import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
//import { Container, Row, Col } from 'reactstrap';
import Picture from '../../Component/pictureGallery';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SubHeader from '../../Component/SubHeader/SubHeader';

import './DirectoryDetail.style.css';
import { webserviceurl, activelanguage } from '../../../Config';
import axios from 'axios';

import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";

class DirectoryDetail extends Component {
    constructor(props) {
        super(props);

        this.language = getLanguage(activelanguage, 'directorydetail');
        
        this.state = {
            navigateTo: '',
            directoryid: props.match.params.directoryid,
			directoryname:'',
			directoryaddress:'',
			directoryphone:'',
			directorywebsite:'',
			facebook: '',
			twitter: '',
			instagram: '',
			directorypicture:[],
			latitude: 0,
			longitude: 0,
			markers:[{ lat: 0, lng: 0 }],
        }

        this.waitForBridge();
    }

    waitForBridge() {
        //the react native postMessage has only 1 parameter
        //while the default one has 2, so check the signature
        //of the function

        if (window.postMessage.length !== 1) {
            setTimeout(function () {
                this.waitForBridge();
            }.bind(this), 200);
        }
        else {
            let param = '{"title":"' + this.language.title + '","canGoBack":false, "showCommunityName":true, "hideTopbar":true, "hideFooterMenu":true}';
            window.postMessage(param, "*");
        }
    }
	
	componentDidMount=()=>{
		this.loadDirectory();
	}

    loadDirectory= () => {
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_directorydetail.php',
            data: {
                directoryid: this.state.directoryid,
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
            .then((response) => {
				var tmp = [];
                let result = response.data;
                if (result.status === "OK") {
                    this.setState({ directoryid: result.record[0].info.directoryid });
					this.setState({ directoryname: result.record[0].info.directoryname });
					this.setState({ directoryaddress: result.record[0].info.directoryaddress });
					this.setState({ directorywebsite: result.record[0].info.directorywebsite });
					this.setState({ directoryphone: result.record[0].info.directoryphone });
					this.setState({ facebook: result.record[0].info.facebook });
					this.setState({ twitter: result.record[0].info.twitter });
					this.setState({ instagram: result.record[0].info.instagram });
					this.setState({ directorypicture: result.record[0].info.directorypicture });
					tmp.push(result.record[0].position);
					this.setState({markers: tmp});
					
					this.setState({latitude: result.record[0].position.lat});
					this.setState({longitude: result.record[0].position.lng});
                }
				
				
            })
            .catch(function (error) {
                console.log(error);
            });
    }
	
	openWebsite=()=>{
		window.open("http://"+this.state.directorywebsite, "_blank");
	}
	
	openFacebook=()=>{
		window.open("https://www.facebook.com/"+this.state.facebook);
	}
	
	openTwitter=()=>{
		window.open("https://www.twitter.com/"+this.state.twitter);
	}
	
	openInstagram=()=>{
		window.open("https://www.instagram.com/"+this.state.instagram);
	}

    render() {
        if (this.state.navigateTo != '') {
            return <Redirect to={this.state.navigateTo} />;
        }
		
		const MyMapComponent = withScriptjs(withGoogleMap((props) =>
            <GoogleMap
                defaultZoom={15}
                defaultCenter={{ lat: this.state.latitude, lng: this.state.longitude }}
            >
			{this.state.markers.map((marker, i)=>(
                    <Marker key={i} position={marker}>
					</Marker>
					
                ))}
                
            </GoogleMap>
        ))
		
        return (
            <div>
                <SubHeader history={this.props.history} hideSearch={true} title={this.state.directoryname}/>
                <div className="main-container whitebg">
                        <div className="directory-content" key={this.state.directoryid} >
							<img src={this.state.directorypicture} />
							<div className="directory-text">{this.state.directoryname}</div>
							<div className="directory-social"><img src="https://image.flaticon.com/icons/png/512/9/9903.png"></img> &nbsp; {this.state.directoryaddress}</div>
							<div className="directory-social"><img src="http://www.myiconfinder.com/uploads/iconsets/12918a9f351955eb3242ce0e52198993.png"></img> &nbsp;  {this.state.directoryphone}</div>
							<div className="directory-social" onClick={()=>this.openWebsite()}><img src="http://novacomng.com/css/icons/grey-web.png"></img> &nbsp; {this.state.directorywebsite}</div>
							<div className="directory-social" onClick={()=>this.openFacebook()}><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Facebook_logo_%28square%29.png/600px-Facebook_logo_%28square%29.png"></img> &nbsp; {this.state.facebook}</div>
							<div className="directory-social" onClick={()=>this.openTwitter()}><img src="https://seeklogo.com/images/T/twitter-2012-negative-logo-5C6C1F1521-seeklogo.com.png"></img> &nbsp; @{this.state.twitter}</div>
							<div className="directory-social" onClick={()=>this.openInstagram()}><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSHRmKbZYPuaUUFsx2TrXan4miV8NXQtg3NEwCwr_aYNZLg9cae"></img> &nbsp; @{this.state.instagram}</div>
                        </div>
						<br></br>
						<div className="map-container">
							<MyMapComponent
								isMarkerShown={true}
								googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAdm6TmweM5bzGr1Fry_737Bbcd4T0WxfY"
								loadingElement={<div style={{ height: `100%` }} />}
								containerElement={<div style={{ height: `300px` }} />}
								mapElement={<div style={{ height: `100%` }} />}
							/>
						</div>
                </div>
				
            </div>
        )
    }
}

export default DirectoryDetail;