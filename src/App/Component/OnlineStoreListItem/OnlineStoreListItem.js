import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';
import './OnlineStoreListItem.style.css';

class OnlineStoreListItem extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            name : props.name, 
            category: props.category,
            shortDesc: props.shortdesc,
            tags: props.tags === undefined ? [] : props.tags,   //array
            pic: props.pic,
			clicks: 0
        };
    }

    componentDidMount=()=>{

    }
	
	IncrementItem = () => {
		this.setState({ clicks: this.state.clicks + 1 });
	}
	
	DecreaseItem = () => {
		this.setState({ clicks: this.state.clicks - 1 });
		if(this.state.clicks <= 0){
			this.setState({ clicks:  0});
		}
	}

    componentWillReceiveProps=(props)=>{
        this.setState({name : props.name, 
            category: props.category,
            shortDesc: props.shortdesc,
            tags: props.tags === undefined ? [] : props.tags,   //array
            pic: props.pic });
    }


    renderCategory=()=>{
        if(this.state.category !== undefined && this.state.category !== ''){
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

    render() {
        return(
            <div className="list-item">
                <div className="relative-container">
                    {/*<div className="imgitem-container">
                        <img src={this.state.pic} alt={'imgpic'}/>
                    </div>*/}
					<div className="onlinestore-list-item">
						<table>
								<tbody>
									<tr>
										<td>
											{this.renderPicture()}
										</td>
										
										<div className="data-container">
											<td>
												<div className="name-container">{this.renderCategory()} {this.state.name}</div>
												<div className="shortdesc-container" dangerouslySetInnerHTML={{__html: this.state.shortDesc}}></div>
												<div className="tags-container">
													{
														this.state.tags.map((tag,i)=>{
															if(tag !== '')
																return <div key={i} className="tag">{tag}</div>
														})
													}
												</div>
											</td>
											<div align="right">
												<td width="50" height="50"><Button color="success" onClick={this.IncrementItem}>+</Button></td>
												<td width="30" height="50">{this.state.clicks}</td>
												<td width="50" height="50"><Button color="success" onClick={this.DecreaseItem}>-</Button></td>
											</div>
										</div>
										
										
								</tr>
                            </tbody>
                        </table>
					</div>
                </div>
            </div>
        )
    }
}

export default OnlineStoreListItem;