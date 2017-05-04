import React from 'react';
import { shallow } from 'enzyme';

import TopBar from './../components/TopBar';
import {api} from './../utils/Api';

jest.mock('./../utils/Api');

describe('TopBar Logged in', () => {

    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<TopBar />);
        api.getUsername.mockImplementation(() => "testuser");
        api.isLoggedIn.mockImplementation(() => true);
    });

    afterEach(() => {
        api.isLoggedIn.mockClear();
        api.getUsername.mockClear();
    });

    it('renders without crashing', () => {
        wrapper;
    });
    
    it('renders `Hello, {username} when logged in`', () => {
        api.isLoggedIn();
        api.getUsername();
        let helloItem = wrapper.find('.hellouser').first();
        expect(
            helloItem.text()
        ).toBe("Hello, testuser");
    });    
});