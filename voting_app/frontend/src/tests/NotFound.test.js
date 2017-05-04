import React from 'react';
import { shallow } from 'enzyme';

import NotFound from './../components/NotFound';

describe('NotFound', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<NotFound />);
    });
    
    it('renders without crashing', () => {
        wrapper;
    });
})  
