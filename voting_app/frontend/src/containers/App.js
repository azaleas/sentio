import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Route from 'react-router-dom/Route';
import Switch from 'react-router-dom/Switch';
import Link from 'react-router-dom/Link';
import Redirect from 'react-router-dom/Redirect';

import { Sidebar, Icon, Menu, Segment } from 'semantic-ui-react';

import {api} from './../utils/Api';
import VARIABLES from './../env/variables';

import Authenticated from './../components/Authenticated';


import TopBar from './../components/TopBar';
import PollsContainer from './../containers/PollsContainer';
import PollContainer from './../containers/PollContainer';
import MyPollsContainer from './../containers/MyPollsContainer';
import MyPollContainer from './../containers/MyPollContainer';
import CreatePollContainer from './../containers/CreatePollContainer';

import LoginTwitter from './../containers/LoginTwitter';
import Logout from './../containers/Logout';

import NotFound from './../components/NotFound';

import './../styles/App.css';

class App extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            fetchingToken: false,
        }
    }

    toggleVisibility = () => this.setState({ visible: !this.state.visible })

    hideMenu = (event) =>{
        if (this.state.visible && api.isLoggedIn()){
            this.setState({
                visible: !this.state.visible
            });
        }
    }
    hideMenuSegment = (event) =>{
        if (this.state.visible){
            this.setState({
                visible: !this.state.visible
            });
        }
    }

    twitterLoginStart = (event) => {

        localStorage.removeItem('oath_token');
        localStorage.removeItem('oauth_secret');
        localStorage.removeItem('user');
            
        // http://stackoverflow.com/questions/4068373/center-a-popup-window-on-screen
        let dualScreenLeft = window.screenLeft !== undefined ? window.screenLeft : screen.left;
        let dualScreenTop = window.screenTop !== undefined ? window.screenTop : screen.top;

        let width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
        let height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

        let left = ((width / 2) - (570 / 2)) + dualScreenLeft;
        let top = ((height / 2) - (520 / 2)) + dualScreenTop;
        window.open(
            VARIABLES.TWITTER_LOGIN_URL, 
            '_blank', 
            'location=yes,height=400,width=400,scrollbars=yes,status=yes,top=' + top + ',left=' + left + ''
        );
        this.twitterLogin();
    }

    twitterLogin(){
        /*Remove login text while loggging in is in process*/
        let user = localStorage.getItem('user');
        if(user !== '' && typeof user !== 'undefined' && user !== null){
            this.setState({
                fetchingToken: true,
            });
        }
        api.handleTwitterLogin()
            .then((response) =>{
                if(response === 'error'){
                    setTimeout(() => {
                        this.twitterLogin();
                    }, 50);
                }
                else if(response === 'success'){
                    this.setState({
                        fetchingToken: false,
                    });
                }
            })
    }

    render(){
        const visible = this.state.visible
        return(
            <div className="ui container raised segment">
                <TopBar 
                    toggleVisibility={this.toggleVisibility}
                    fetchingToken={this.state.fetchingToken}
                    twitterLoginStart={this.twitterLoginStart} />
                <Sidebar.Pushable
                    onClick={this.hideMenu} 
                    as={Segment}>
                    {
                        api.isLoggedIn()
                        ?(
                            <Sidebar
                                as={Menu}
                                animation='scale down'
                                width='thin'
                                direction='right'
                                visible={visible}
                                icon='labeled'
                                vertical>
                                <Menu.Item name='home'>
                                    <div>
                                        <Icon name='home' />
                                        <div>Hello, {api.getUsername()}</div>
                                    </div>
                                </Menu.Item>
                                <Menu.Item name='archive'>
                                    <Link 
                                        to="/">
                                        <Icon name='archive' />
                                        <div>Polls</div>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item name='book'>
                                    <Link 
                                        to="/mypolls">
                                        <Icon name='book' />
                                        <div>My Polls</div>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item name='edit'>
                                    <Link 
                                        to="/create">
                                        <Icon name='edit' />
                                        <div>New Poll</div>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item name='sign out'>
                                    <Link 
                                        to="/logout">
                                        <Icon name='sign out' />
                                        <div>Logout</div>
                                    </Link>
                                </Menu.Item>
                            </Sidebar>
                        )
                        :(
                            <Sidebar
                                as={Menu}
                                animation='scale down'
                                width='thin'
                                direction='right'
                                visible={visible}
                                icon='labeled'
                                vertical>
                                <Menu.Item name='archive'>
                                     <Link 
                                        to="/">
                                        <Icon name='archive' />
                                        <div>Polls</div>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item name='sign in'>
                                    <a 
                                        onClick={this.twitterLoginStart}
                                        >
                                        <Icon name='sign in' />
                                        <div>Log in</div>
                                    </a>
                                </Menu.Item>
                                <div className="item">
                                    {
                                    this.state.fetchingToken
                                        ?(
                                            <div className="item user--loading">
                                                <div className="ui active inverted dimmer">
                                                    <div className="ui loader"></div>
                                                </div>
                                                <Redirect push to="/" />
                                            </div>
                                        )
                                        :(
                                            <p></p>
                                        )
                                    }
                                </div>
                            </Sidebar>
                        )
                    }
                    <Sidebar.Pusher>
                        <Segment 
                            onClick={this.hideMenuSegment} 
                            basic>
                            <div className="spacer row app-wrapper">
                                <Switch>
                                    <Route exact path="/polls" component={PollsContainer} />
                                    <Route exact path="/polls/:questionId" component={PollContainer} />
                                    <Route exact path="/" render={() => (
                                            <Redirect
                                                to="/polls"
                                            />
                                        )} 
                                    />
                                    <Authenticated exact path="/mypolls" component={MyPollsContainer} />
                                    <Authenticated exact path="/mypolls/:questionId" component={MyPollContainer} />
                                    <Authenticated exact path="/create" component={CreatePollContainer} />
                                    <Route path="/twitter_logged_in/" component={LoginTwitter} />
                                    <Route path="/logout" component={Logout} />
                                    <Route path="*" component={NotFound} />
                                </Switch>
                            </div>
                        </Segment>
                    </Sidebar.Pusher>
                </Sidebar.Pushable>
            </div>
        )
    }    
};

App.propTypes = {
    className: PropTypes.string,
};

export default App;
