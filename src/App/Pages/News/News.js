import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { getLanguage } from '../../../Languages';
import { Container, Row, Col } from 'reactstrap';
import Picture from '../../Component/pictureGallery';
import NewsListItem from '../../Component/NewsListItem/NewsListItem';
import './News.css';
import { webserviceurl, activelanguage, limitList } from '../../../Config';
import axios from 'axios';
import SubHeader from '../../Component/SubHeader/SubHeader';

class News extends Component {
    constructor(props) {
        super(props);
        this.language = getLanguage(activelanguage, 'news');
        this.globalLang = getLanguage(activelanguage, 'global');

        this.state = { 
            currentTab: 0, 
            navigateTo: '', 
            news:[], 
            announcement:[], 
            event:[], 
            redirect:false, 
            community:'',
            category:[],
            currentIndex: 0,
            limitList: limitList,
            onload:false,
            showLoadMore:true,
			start: 0,
			loadFinished: false,
			filter: '',
			counter: 0
        };
        /*setTimeout(
            function () {
                this.waitForBridge();
            }.bind(this)
            , 500);*/
			
		this.listel = null;

        let search = props.location.search.replace("?", "");
        let params = search.split("&");
        for (let i = 0; i < params.length; i++) {
            let param = params[i].split("=");
            if (param[0].toLowerCase() === "page") {
                this.state.navigateTo = param[1];
                this.state.redirect = true;
                break;
            } else if (param[0].toLowerCase() === "community") {
                this.state.community = param[1];
            }
        }
    }

    componentDidMount=()=>{
        this.loadNews(this.state.currentTab, this.state.currentIndex, 0)
        this.waitForBridge();
		
    }

    componentDidUpdate=()=>{
        if(this.listel == null){
            this.listel = document.getElementById('list-news');
            if(this.listel != null){
                /*this.listel.removeEventListener('scroll', (e)=>{
                    this.scrollCheck();
                });*/

                this.listel.addEventListener('scroll', (e)=>{
                    this.scrollCheck();
                });
            }
        }
        
        //console.log(document.getElementById('testing'));
    }
	
	componentWillUnmount=()=>{
        this.listel.removeEventListener('scroll', (e)=>{
            this.scrollCheck();
        });
    }
	
	scrollCheck = ()=>{
        if(this.listel.scrollTop + this.listel.clientHeight >= this.listel.scrollHeight){
			if(this.state.loadFinished == false){
				this.loadNews(this.state.currentTab, this.state.currentIndex, 0);
			}
        }
    }
	
	/* loadNews=(id)=>{
        this.loadNews(id, 0, 0);
		this.setState({ start: 0});
		this.setState({ news: []});
    } */

    /**
     * 0:announcement
     * 1:event
     * 2:news
     */
    loadNews = (type,currentIndex, start) => {
        this.setState({onload:true});
        axios({
            method: 'post',
            url: webserviceurl + '/app_load_news.php',
            data: {
                type: type,
                currentIndex: currentIndex,
                limit: this.state.limitList,
				start: this.state.start,
				filter: this.state.filter
                //community: this.state.community
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
        .then((response) => {
            this.setState({onload:false});
            let result = response.data;
			let limitafterload = this.state.start + 10;
            if (result.status === "OK") {
				if(result.records.length == 0){
					this.setState({loadFinished: true});
				}
				
                let list = this.state.news;

                for (var i = 0; i < result.records.length; i++) {
                    //result.records[i].shortdesc = decodeURIComponent(result.records[i].shortdesc);
                    list.push(result.records[i]);
                }

                let next = this.state.currentIndex;
                if(result.records.length > 0)
                    next += 1;

                let show = true;
                if(result.records.length < limitList)
                    show = false;

                this.setState({ news: list, currentIndex: next, showLoadMore: show});
            }
        })
        .catch((error) =>{
            this.setState({onload:false});
            console.log(error);
        });
    }
	
	onSearch=(query)=>{
		console.log(query);
		axios({
            method: 'post',
            url: webserviceurl + '/app_load_news.php',
            data: {
				type: this.state.currentTab,
                currentIndex: 0,
                limit: this.state.limitList,
                //community: 0,
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
						this.setState({loadFinished: true});
					}
					
					let list = result.records;
					
					/* for (var i = 0; i < result.records.length; i++) {
                        result.records[i].desc = decodeURIComponent(result.records[i].desc);
                    } */
					
					let next = 0;
					if(result.records.length > 0)
						next += 1;

					let show = true;
					if(result.records.length < limitList)
						show = false;
						
					this.setState({ news: list, currentIndex: next, showLoadMore: show});
					this.setState({ filter : query});
					this.setState({ counter: limitafterload});
                }
				
            })
            .catch((error) =>{
                console.log(error);
				alert(error);
            });
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
            let param = '{"title":"'+this.language.title+'","canGoBack":true, "showCommunityName":true, "hideTopbar":true, "hideFooterMenu":true}';
            window.postMessage(param, "*");
        }
    }

    currentActiveTab(idx) {
        if (idx === this.state.currentTab)
            return "tab-item active-tab";
        else
            return "tab-item";
    }

    changeTab(idx) {
        this.setState({ currentTab: idx, news:[], currentIndex: 0 });
        if(idx !== 2)
            this.loadNews(idx, 0);
        else{
            this.setState({news:[]});
        }
    }

    goToDetail(news) {
        //this.setState({ navigateTo: '/newsdetail/' + news.id });
        this.props.history.push('/newsdetail/'+news.id);
    }

    renderList=()=>{
        
        if(this.state.news.length>0){
            return (
                <div className="news-list-section" id="list-news">
                    {this.state.news.map((item, i) =>
                        <div key={i} onClick={()=>this.goToDetail(item)}>
                            <NewsListItem key={i} title={item.title} shortdesc={item.shortdesc} category={item.category} tags={[]} pic={item.newspic[0]}  />
                        </div>
                    )}
                </div>
            )
        }else{
            return(
                <div className="news-list-section" id="list-news">
                    <div className="no-data">{this.language.nodata}</div>
                </div>
            )
        }
    
        
    }

    render() {
        if (this.state.navigateTo != '') {
            return <Redirect to={this.state.navigateTo} />
        }
        return (
            <div>
                <SubHeader history={this.props.history} hideSearch={false} title={this.language.title} onSearch={this.onSearch}/>
                <div className="main-container" >
                    
                    <div className="tab-section">
                        <Container>
                            <Row>
                                {/*this.state.category.map((category,i)=>
                                    <Col md="4" sm="4" xs="4" className={this.currentActiveTab(i)} onClick={() => this.changeTab(i, category.id)}>
                                        {category.name}
                                    </Col>
                                )*/}
                                
                                <Col md="4" sm="4" xs="4" className={this.currentActiveTab(0)} onClick={() => this.changeTab(0)}>
                                    {this.language.community}
                                </Col>
                                <Col md="4" sm="4" xs="4" className={this.currentActiveTab(1)} onClick={() => this.changeTab(1)}>
                                    {this.language.dynamax}
                                </Col>
                                <Col md="4" sm="4" xs="4" className={this.currentActiveTab(2)} onClick={() => this.changeTab(2)}>
                                    {this.language.newsfeed}
                                </Col>
                            </Row>
                        </Container>
                    </div>
                    {this.renderList()}
                </div>
            </div>
        );
    }
}

export default News;