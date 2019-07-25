import React, { Component } from 'react';
import { Button, Container, Row, Col,  Label, Input } from 'reactstrap';
import './MomentListItem.style.css';
import PictureGallery from '../../Component/pictureGallery';
import LazyLoad from 'react-lazy-load';
import ImageLoader from '../../Component/ImageLoader';

class MomentListItem extends Component {

    constructor(props) {
        super(props);
        this.state = { 
			id: props.id,
            name : props.name, 
            desc: props.desc,
            pic: props.pic,
            date: props.date,
			gallery: props.gallery,
			count: props.count,
			comment: props.comment,
			username: props.username,
			label: "Comments"
        };
    }
	
	doCheckCount=(count, label)=>{
		if (this.state.count == 1){
			this.setState({label: "Comment"});
		}
		return this.state.label;
    }
	
	goToDetail=(moment)=>{
        this.props.history.push('/momentsdetail/'+moment.id);
    }

	addComment=(moment)=>{
		this.props.history.push('/momentsdetail/'+moment.id);
    }
	
    componentDidMount=()=>{
		this.doCheckCount();
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
					<LazyLoad>
						<img src={this.state.pic} alt={'imgpic'}/>
					</LazyLoad>
                </div>
            )
        }else{
            return (
                <div className="imgitem-container2">
                    <ImageLoader src={require('../../../images/default.png')} alt={'imgpic'} className="imgdefault"/>
                </div>
            )
        }
    }

    renderShowMore=()=>{
        //if(this.state.comment.length > 2){
            return (
                <div align="right" className="showmore" onClick={()=>this.goToDetail(this.state)}>Show more... &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
            )
        //}
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
						<div align="right" className="addcomment-container">{/*this.state.count*/} {/*this.state.label*/}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;	<Button color="primary" onClick={() => this.addComment(this.state)}>Add Comment</Button></div>
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

export default MomentListItem;