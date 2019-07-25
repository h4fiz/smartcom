import React, { Component } from 'react';
import { Container, Row, Col } from 'reactstrap';
import './DirectoryListItem.style.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { getLanguage } from '../../../Languages';
import { activelanguage } from '../../../Config';

class DirectoryListItem extends Component {

    constructor(props) {
        super(props);
        let monthName = '';

        this.globallang = getLanguage(activelanguage, 'global');
        this.language = getLanguage(activelanguage, 'directorycenterlist');

        this.state = { 
            directoryname : props.directoryname, 
            directorycategoryname: props.directorycategoryname,
            directoryaddress: props.directoryaddress,
            directoryphone: props.directoryphone,
            directorywebsite: props.directorywebsite,
            directorypicture: props.directorypicture
        };
    }

    componentDidMount=()=>{
		
    }

    componentWillReceiveProps=(props)=>{
        this.setState({
			directoryname : props.directoryname, 
            directorycategoryname: props.directorycategoryname,
            directoryaddress: props.directoryaddress,
            directoryphone: props.directoryphone,
            directorywebsite: props.directorywebsite,
            directorypicture: props.directorypicture
			});
    }

    render() {
        return(
            <div >
                <div className="relative-container">
                    <div className="directory-list-item">
                        <table>
                            <tbody>
                                <tr>
                                    <td style={{width:'90px', height:'100px', position:'relative'}}>
										<div className="image-container">
											<img src={this.state.directorypicture}/>
										</div>
                                    </td>
                                    <td>
                                        <div className="name-container">{this.state.directoryname}</div>
                                        <div className="address-container">{this.state.directoryaddress}</div>
                                        <div className="phone-container">{this.state.directoryphone}</div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}

export default DirectoryListItem;