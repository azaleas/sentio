import React from 'react';
import { shallow } from 'enzyme';

import TopBar from './../components/TopBar';
import {api} from './../utils/Api';

jest.mock('./../utils/Api');

describe("TopBar Not Logged in", () =>{
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<TopBar />);
    });

    it('renders `Login` when not logged in', () => {
        let loginLink = wrapper.find('#desktop-menu a').first();
        expect(
            loginLink.text()
        ).toBe("Login");
    });
});  

