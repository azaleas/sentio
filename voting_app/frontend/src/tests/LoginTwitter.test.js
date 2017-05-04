import React from 'react';
import { shallow } from 'enzyme';

import LoginTwitter from './../containers/LoginTwitter';

describe('LoginTwitter', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<LoginTwitter />);
    });
    
    it('renders without crashing', () => {
        wrapper;
    });
})  
