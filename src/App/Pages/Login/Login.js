import React, { Component } from 'react';
//import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import { Button } from 'reactstrap';
import { webserviceurl } from '../../../Config.js';

import './Login.style.css';
import { activelanguage } from '../../../Config';
import { getLanguage } from '../../../Languages';

class Login extends Component {
    constructor(props) {
        super(props);

        this.globallang = getLanguage(activelanguage, 'global');
        this.language = getLanguage(activelanguage, 'Login');

		this.state = {
			userPhone:'',
            userPassword:'',
            errorMessage: ''
        };

        //reset browser history
        //this.props.history.index=0;
        //this.props.history.length=1;
	}
	
    doLogin = () => {
        //this.props.history.replace({pathname:'/panel/dashboard', state:{loginInfo: { name: 'rusman', profilepic:""}}});
        if(this.state.userPhone === ''){
            alert(this.language.alertphoneno);
            return false;
        }
        if(this.state.userPassword === ''){
            alert(this.language.alertpassword);
            return false;
        }

        let param = {
            phonenumber: this.state.userPhone,
			password: this.state.userPassword
        }

		axios.post(webserviceurl + '/app_login.php', param,
		{headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' }})
            .then( (response) => {
                let data = response.data;
				console.log(data);
                if(data.status === "OK"){
					
                    localStorage.setItem('smart-app-id-login', JSON.stringify(data.records));
                    this.props.history.replace({pathname:'/', state:{loginInfo: data.records}});
					
                }else{
					alert('Invalid username or password');
                    this.setState({errorMessage: data.message, userPassword: ''});
                }
				
            })
            .catch( (error) => {
                console.log(error);
				//alert(error);
            });
    }

    renderError=()=>{
        if(this.state.errorMessage !== ""){
            return this.state.errorMessage;
        }
    }

    render() {
        return (
            <div className="login-container">
                <div className="login-box-container">
                    <div className="logo">

                    </div>
                    <div className="login-title">Login</div>
                    <div className="login-input">
                        <input type="text" placeholder="Phone Number" value={this.state.userPhone} onChange = {(event) => this.setState({ userPhone : event.target.value }) }/>
                    </div>
                    <div className="login-input">
                        <input type="password" placeholder="Password" value={this.state.userPassword} onChange = {(event) => this.setState({ userPassword : event.target.value }) }/>
                    </div>
                    <div className="login-error">
                        {this.renderError()}
                    </div>
                    <div className="button-container">
                        <Button color="success" onClick={() => this.doLogin()} block>Login</Button>
                    </div>
                </div>
            </div>
        );
    }
}
export default Login;