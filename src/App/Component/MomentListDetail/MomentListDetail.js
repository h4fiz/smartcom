import React, { Component } from 'react';
import { Button, Container, Row, Col,  Label, Input } from 'reactstrap';
import './MomentListDetail.style.css';
import PictureGallery from '../../Component/pictureGallery';
import axios from 'axios';
import { webserviceurl, activelanguage } from '../../../Config';

class MomentListDetail extends Component {

    constructor(props) {
        super(props);
        this.state = { 
			id: props.momentid,
            name : props.name, 
            desc: props.desc,
            pic: props.pic,
            date: props.date,
			gallery: props.gallery,
			count: props.count,
			comment: props.comment,
			username: props.username,
			phoneno: '',
			label: "Comments",
			commentid: 0,
			commentbox: ''
        };
		//console.log(props);
    }
	
	doCheckCount=(count, label)=>{
		if (this.state.count == 1){
			this.setState({label: "Comment"});
		}
		return this.state.label;
    }

	addComment=()=>{
		const {commentbox} = this.state;
		
		if(commentbox == null || commentbox == ''){
			alert('Please fill the input!');
			return false;
		}
			
		else{
			this.onSubmit();
		}
    }
	
	loadUser=()=>{
		if(localStorage.getItem('smart-app-id-login') != undefined && localStorage.getItem('smart-app-id-login') != 'undefined'){
			var com = window.localStorage.getItem('smart-app-id-login');
			var login = JSON.parse(com);
			
			this.setState({phoneno : login.phonenumber===undefined?"":login.phonenumber});
		}
	}
	
	onSubmit = () => {
		alert(this.state.phoneno);
		axios({
            method: 'post',
            url: webserviceurl + '/app_insert_comment.php',
			data: {
				commentid: this.state.commentid,
                momentid: this.state.id,
				comment: this.state.commentbox,
				commentphoneno: this.state.phoneno
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }
        })
            .then( (response) =>{
				alert('Comment saved');
				this.setState({commentbox: ''});
				this.props.reload();
				//window.location.reload();
            })
            .catch( (error) =>{
                console.log(error);
				alert(error);
            });
    }
	
    componentDidMount=()=>{
		this.doCheckCount();
		this.loadUser();
    }

    componentWillReceiveProps=(props)=>{
        this.setState({
			id: props.id,
			name : props.name, 
            desc: props.desc,
            pic: props.pic,
            date: props.date,
			gallery: props.gallery,
			count: props.count,
			comment: props.comment
			});
    }

    renderPicture=()=>{
        if(this.state.pic !== ''){
            return (
                <div className="imgitem-container2">
                    <img src={this.state.pic} alt={'imgpic'}/>
                </div>
            )
        }else{
            return (
                <div className="imgitem-container2">
                    <img src={require('../../../images/default.png')} alt={'imgpic'} className="imgdefault"/>
                </div>
            )
        }
    }

    render() {
		
        const imagesrc = this.state.gallery== undefined?[]:this.state.gallery;
        return(
            <div className="list-item" >
                <div className="relative-container">
                    {/*<div className="imgitem-container">
                        <img src={this.state.pic} alt={'imgpic'}/>
                    </div>*/}
                    {this.renderPicture()}
                    <div className="data-container2">
                        <div className="name-container moments-name">{this.state.name}</div>
                        <div className="desc-container moments-desc" dangerouslySetInnerHTML={{__html: this.state.desc}}></div>
						<div>
							<PictureGallery 
								images = {imagesrc} theme = ""
							/>
						</div>
						<div className="date-container moments-date">{this.state.date}</div>
						<hr></hr>
						<div className="texbox-container moments-texbox"><Input type="textarea" name="commentbox" id="commentbox" placeholder="Write a comment.." value={this.state.commentbox} onChange = {(event) => this.setState({ commentbox : event.target.value }) }/></div>
						<Button color="primary" className="btn-addcomment" onClick={() => this.addComment()}>Add Comment</Button>
						
						{/*<div align="right">{this.state.count} {this.state.label}  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	</div>*/}
						<div className="moments-comment">
                            <div className="comment-container">
                            {this.state.comment.map((item, i) =>
                                <div key={i} className="thecomment">
                                    <span className="commenter">{item.username}</span>: {item.comment}
									{/*<Label for="commenter" className="commenter-label">{item.username} on {item.insert} said:</Label>
									<Input type="textarea" className="commenter-value" name="comment" id="comment" disabled = "disabled " value={item.comment} />*/}
								</div>
                            )}
                            </div>
							{/*this.renderShowMore()*/}
						</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default MomentListDetail;