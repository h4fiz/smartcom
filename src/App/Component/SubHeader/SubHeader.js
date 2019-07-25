import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import './SubHeader.style.css';
import { getLanguage } from '../../../Languages';
import { webserviceurl, activelanguage } from '../../../Config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SubHeader extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hideSearch: props.hideSearch === undefined ? false : props.hideSearch,
            title: props.title === undefined ? '' : props.title,
            showAddButton: props.showAddButton === undefined ? false : props.showAddButton
        };

        this.language = getLanguage(activelanguage, 'subheader');

        this.backButtonRef = null;
    }

    componentDidMount=()=>{

    }

    componentWillReceiveProps=(props)=>{
        this.setState({hideSearch: props.hideSearch === undefined ? false : props.hideSearch, 
            title: props.title ===undefined ? '' : props.title,
            showAddButton: props.showAddButton ===undefined ? '' : props.showAddButton,
        });
    }

    goBack=()=>{
        if(this.props.goBack !== undefined){
            this.props.goBack();
        }else
            this.props.history.goBack();
    }
	
	onSearch=(query)=>{
        if(this.props.onSearch !== undefined){
            this.props.onSearch(query);
        }
    }

    add=()=>{
        if(this.props.add !== undefined){
            this.props.add();
        }
    }

    renderSearch=()=>{
        if(!this.state.hideSearch){
            return (
                <div className="search-container">
                    <input type="text" placeholder={this.language.search} onChange={(event) => this.onSearch(event.target.value)}/>
                    <FontAwesomeIcon icon="search" className="magnify" />
                </div>
            )
        }else{
            return (
                <div className="title-container">
                    {this.state.title}
                </div>
            )
        }
    }

    renderAddButton=()=>{
        if(this.state.showAddButton){
            return (
                <FontAwesomeIcon icon="plus" />
            )
        }
    }

    renderRightContainer=()=>{
        if(this.state.hideSearch){
            return (
                <div className="right-container" style={{width: this.backButtonRef === null ? '47px' : this.backButtonRef.clientWidth+'px' }} onClick={()=>this.add()}>
                    {this.renderAddButton()}
                </div>
            )
        }
    }

    render() {
        return(
            <div className="sub-header">
                <div ref={ref => this.backButtonRef=ref} className="back-container" onClick={()=>this.goBack()}><FontAwesomeIcon icon="chevron-left" /> {this.language.back}</div>
                {this.renderSearch()}
                {this.renderRightContainer()}
            </div>
        )
    }
}

export default SubHeader;