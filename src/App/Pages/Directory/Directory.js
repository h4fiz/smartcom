import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
import { Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import './Directory.style.css';
import { webserviceurl, activelanguage } from '../../../Config';
import SubHeader from '../../Component/SubHeader/SubHeader';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import more from '../../../images/marketplace/more.png';

import DirectoryListItem from '../../Component/DirectoryListItem/DirectoryListItem';


class Directory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: "",
            redirect: false,
			directorycategoryid: props.match.params.directorycategoryid,
			directorycategoryname: props.match.params.directorycategoryname,
			list: [],
			start: 0,	
			loadDirectoryFinished: false
        }

        this.language = getLanguage(activelanguage, 'directory');
		this.listel = null;
    }
	
	loadDirectoryCategory = () => {
		axios.post(webserviceurl + '/app_load_directorycategoryselected.php', {
			directorycategoryid: this.state.directorycategoryid
		},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) =>{
				this.setState({directorycategoryname: response.data.records[0].directorycategoryname});
				
            })
            .catch((error) =>{
                console.log(error);
				alert(error);
            });
	}

	loadDirectory = () =>{
		axios.post(webserviceurl + '/app_load_directory.php', {
			start: this.state.start,
			directorycategoryid: this.state.directorycategoryid
		},
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then((response) => {
                let result = response.data;
                let limitafterload = this.state.start + 10;
                if (result.status === "ok") {
					if(result.records.length == 0){
						this.setState({loadDirectoryFinished: true});
					}
					
					let tmp = this.state.list;
					
					for(var i=0; i<result.records.length;i++){
						tmp.push(result.records[i]);
					}
					
					this.setState({ list: tmp });
					this.setState({ start: limitafterload});
				}
				
            })
            .catch((error) => {
                console.log(error);
            });
	}

	componentDidMount = () => {
        this.waitForBridge();
		this.loadDirectoryCategory();
		this.loadDirectory();
		this.listel = document.getElementById('list-directory');
        this.listel.addEventListener('scroll', (e)=>{
            this.scrollCheck();
        });
	}
	
	componentWillUnmount=()=>{
        this.listel.removeEventListener('scroll', (e)=>{
            this.scrollCheck();
        });
    }
	
	scrollCheck = ()=>{	
        if(this.listel.scrollTop + this.listel.clientHeight >= this.listel.scrollHeight){
            if(this.state.loadDirectoryFinished == false){
				this.loadDirectory();
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
            let param = '{"title":"' + this.language.title + '","canGoBack":true, "showCommunityName":true, "hideTopbar":true, "hideFooterMenu":true}';
            window.postMessage(param, "*");
        }
    }

    createMarkup = (content) => {
        return { __html: content };
    }

    goToDetail=(item)=>{
        this.props.history.push('/directorydetail/'+item.directoryid);
    }

    renderTab = () => {
        return (
                <div className="body-section directory-scroll-view">
                    {this.state.list.map((item, i) =>
                        <div key={i} onClick={()=>this.goToDetail(item)}>
                            <DirectoryListItem key={i} category={item.directorycategoryname} directoryname={item.directoryname} directoryaddress={item.directoryaddress} directoryphone={item.directoryphone} directorywebsite={item.directorywebsite}  directorypicture={item.directorypicture} onClick={()=>this.goToDetail(item)}/>
                        </div>
                    )}
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
            <div className="main-container" >
                <SubHeader history={this.props.history} hideSearch={true} title={this.state.directorycategoryname}/>
                <div id="list-directory">
					{this.renderTab()}
                </div>
            </div>
        );
    }
}

export default Directory;