import React from 'react';
import { shallow } from 'enzyme';
import App from './../containers/App';
import {api} from './../utils/Api';

jest.mock('./../utils/Api');

describe('App', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<App />);
    });

    afterEach(() => {
        api.isLoggedIn.mockClear();
        api.handleTwitterLogin.mockClear();
    });
    
    it('renders without crashing', () => {
        wrapper;
    });

    it('should have the `div` with class ".app-wrapper"', () => {
        expect(
            wrapper.find(".app-wrapper").exists()
        ).toBe(true);
    });

    it('should have a `TopBar` element', () => {
        expect(
            wrapper.find('TopBar').exists()
        ).toBe(true);
    });

    it('should have a `SideBar` element', () => {
        expect(
            wrapper.find('Sidebar').exists()
        ).toBe(true);
    });

    describe('Sidebar', () => {
        let sidebar;
        beforeEach(() => {
            sidebar = wrapper.find('Sidebar').first();
            api.isLoggedIn.mockImplementation(() => true);
            wrapper.setState({visible: true});
            api.isLoggedIn();
            wrapper.update();
        });

        it('should change state property `visible` to false \
            if `hideMenu` is called', () => {
            wrapper.instance().hideMenu();
            expect(
                wrapper.state().visible
            ).toEqual(false);
        });

        it('should change state property `visible` to false \
            if `hideMenuSegment` is called', () => {
            wrapper.instance().hideMenuSegment();
            expect(
                wrapper.state().visible
            ).toEqual(false);
        });
    });

    describe('Login', () => {
        beforeEach(() => {
            api.handleTwitterLogin.mockImplementation(() => {
                let response = new Promise((resolve, reject) =>{
                    resolve('success');
                });
                return response;
            });
            wrapper.setState({fetchingToken: true});
            wrapper.update();
        });
        it('should login when `twitterLoginStart` is triggered', () => {
            wrapper.instance().twitterLoginStart();
            return api.handleTwitterLogin()
                .then((response) =>{
                    expect(response).toEqual('success');
                    expect(
                        wrapper.state().fetchingToken
                    ).toEqual(false);
                });
        })
    });
})  
