import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import './pictureGalleryStyle.css';
import PictureSingle from './pictureSingle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Picture extends Component {

    constructor(props) {
        super(props);
        this.state = { images: props.images, theme: props.theme, showcase:false };
    }

	componentWillReceiveProps(props){
		this.setState({images: props.images, theme: props.theme});
	}
	
	/*onClickImage(uri){
		let style = {
            bottom: '125px',
			marginLeft: '-32px',
			backgroundImage: 'url(' + uri + ')',
			marginRight: '16px',
			pointerEvents: 'none',
			position: 'relative',
        };
		return (
            <Col md="4" sm="4" xs="4" className="custom-col" >
                <div style={style}>
                </div>
            </Col>
        );
    }*/
	
    createColumn(uri, i) {
        let style = {
            width: '100%',
            height: '18vw',
            backgroundImage: 'url(' + uri + ')',
            backgroundPosition: 'center',
            backgroundSize: 'cover',
            border: '1px solid #d9d9d9',
        };
        return (
            <Col key={i} md="4" sm="4" xs="4" className="custom-col" >
                <div style={style} onClick={()=>this.showShowcase(uri)}>
                </div>
            </Col>
        );
    }

    showShowcase=(uri)=>{
        this.setState({showcase: true});
    }

    closeShowcase=()=>{
        this.setState({showcase: false});
    }

    renderShowcase=()=>{
        if(this.state.showcase === true){
            return (
                <div className="showcase-container" style={{height:window.document.body.offsetHeight+'px'}} onClick={()=>this.closeShowcase()}>
                    <div className="middle-container" style={{width:'100%'}}>
                        <table style={{width: (window.innerWidth * this.state.images.length) + 'px'}}>
                            <tbody>
                                <tr>
                                    {this.state.images.map((uri, i)=> 
                                        <td key={i} style={{width: window.innerWidth+'px', paddingLeft:'1px', paddingRight:'1px'}}>
                                            <img src={uri} alt={uri} />
                                        </td>
                                    )}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    {/*<div className="close-container">
                        <FontAwesomeIcon icon="times" className="close-icon" onClick={()=>this.closeShowcase()} />
                    </div>*/}
                </div>
            )
        }
    }

    render() {
        if (this.state.images.length == 1) {
            return (
                <div>
                    <div className="picture-container" onClick={()=>this.showShowcase(this.state.images[0])}>
                        <PictureSingle image={this.state.images[0]} theme={this.state.theme !== 'full' ? "single-image" : "single-full-image"} />
                    </div>
                    {this.renderShowcase()}
                </div>

            )
        } else if (this.state.images.length > 1) {
            return (
                <div>
                    <div className="picture-container">
                        <Container>
                            <Row>
                                {this.state.images.map((uri, i) => this.createColumn(uri, i)
                                )}
                            </Row>
                        </Container>
                    </div>
                    {this.renderShowcase()}
                </div>
            )
        } else {
            return ("");
        }

    }
}

export default Picture;