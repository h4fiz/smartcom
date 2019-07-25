import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import './pictureSingleStyle.css';

class PictureSingle extends Component {

    constructor(props) {
        super(props);
        this.state = { image: props.image, theme: props.theme };
    }


    render() {

        return (
            <img src={this.state.image} className={this.state.theme} />
        )

    }
}

export default PictureSingle;