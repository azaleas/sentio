import React from 'react';
import { shallow } from 'enzyme';

import Authenticated from './../components/Authenticated';

describe('Authenticated', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<Authenticated />);
    });
    
    it('renders without crashing', () => {
        wrapper;
    });
})  
