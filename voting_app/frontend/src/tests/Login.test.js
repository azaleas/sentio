import React from 'react';
import { shallow } from 'enzyme';

import Login from './../containers/Login';

describe('Login', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<Login />);
    });
    
    it('renders without crashing', () => {
        wrapper;
    });
})  
