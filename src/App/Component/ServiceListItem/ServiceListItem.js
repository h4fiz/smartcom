import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import './ServiceListItem.style.css';

class ServiceListItem extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            name : props.name, 
            category: props.category,
            shortDesc: props.shortdesc,
            tags: props.tags === undefined ? [] : props.tags,   //array
            pic: props.pic 
        };
    }

    componentDidMount=()=>{

    }

    componentWillReceiveProps=(props)=>{
        this.setState({
            name : props.name, 
            category: props.category,
            shortDesc: props.shortdesc,
            tags: props.tags === undefined ? [] : props.tags,   //array
            pic: props.pic });
    }

    renderCategory=()=>{
        if(this.state.category != ''){
            return (
                <div className="category">{this.state.category}</div>
            )
        }
    }
    renderPicture=()=>{
        if(this.state.pic !== ''){
            return (
                <div className="imgitem-container">
                    <img src={this.state.pic} alt={'imgpic'}/>
                </div>
            )
        }else{
            return (
                <div className="imgitem-container">
                    <img src={require('../../../images/default.png')} alt={'imgpic'} className="imgdefault"/>
                </div>
            )
        }
    }

    renderTag = (tag, i)=>{
        if(tag !== '')
        return (
            <div key={i} className="tag">{tag}</div>
        )
    }

    render() {
        return(
            <div className="list-item">
                <div className="relative-container">
                    {/*<div className="imgitem-container">
                        <img src={this.state.pic} alt={'imgpic'}/>
                    </div>*/}
                    {this.renderPicture()}
                    <div className="data-container">
                        <div className="name-container">{this.renderCategory()} {this.state.name}</div>
                        <div className="shortdesc-container" dangerouslySetInnerHTML={{__html: this.state.shortDesc}}></div>
                        <div className="tags-container">
                            {
                                this.state.tags.map((tag,i)=>{
                                    this.renderTag(tag, i);    
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ServiceListItem;