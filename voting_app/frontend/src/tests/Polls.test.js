import React from 'react';
import { shallow } from 'enzyme';
import PollsContainer from './../containers/PollsContainer';
import Polls from './../components/Polls';
import {api} from './../utils/Api';

jest.mock('./../utils/Api');

const data = [
    {
        "question_text": "Docker vs Vagrant?",
        "id": 1,
        "choices": [
            {
                "choice_id": 15,
                "choice_text": "Vagrant",
                "vote": 0
            },
            {
                "choice_id": 16,
                "choice_text": "Docker",
                "vote": 0
            },
            {
                "choice_id": 17,
                "choice_text": "Other",
                "vote": 0
            },
        ]
    } 
]

describe('PollsContainer', () => {
    let wrapper;

    let pathname = {
        pathname: '/polls',
    }

    beforeEach(() => {
        wrapper = shallow(<PollsContainer location={pathname} />);
        api.fetchAllPolls.mockImplementation(() => {
            let response = new Promise((resolve, reject) =>{
                resolve(data);
            });
            return response;
        });
    });

    afterEach(() => {
        api.fetchAllPolls.mockClear();
    });
    
    it('renders without crashing', () => {
        wrapper;
    });

    it('should have `div` element with "loader" class \
         while state property `fetched` is false', () => {
        wrapper.setState({fetched: false});
        expect(
            wrapper.find('.loader').exists()
        ).toBe(true);   
    });

    it('should have `NotFound` element \
         while state properties `isError` and `fetched` are true', () => {
        wrapper.setState({
            isError: true,
            fetched: true,
        });
        expect(
            wrapper.find('NotFound').exists()
        ).toBe(true);   
    });

    it('should have `Polls` element \
         while state properties `isError` is false and `fetched` is true', () => {
        wrapper.setState({
            isError: false,
            fetched: true,
        });
        expect(
            wrapper.find('Polls').exists()
        ).toBe(true);   
    });

    it('should receive polls data from server and set state property `polls`', () => {
        wrapper.instance().getPolls();
        return api.fetchAllPolls()
            .then((response) =>{
                expect(response).toEqual(data);
                expect(
                    wrapper.state().polls
                ).toEqual(data);
            });
    });

    describe('Polls Component', ()=> {
        let polls;
        beforeEach(() => {
            polls = shallow(
                    <Polls polls={data}
                           path={pathname.pathname} />
            );
        });
        
        it('renders without crashing', () => {
            polls;
        });

        it('should have `div` element with with className `poll-single`', () =>{
            expect(
                polls.find(".poll-single").exists()
            ).toBe(true); 
        });

        it('should have `div` element with with `question_text` as value', () =>{
            const question_texts = polls.find('.poll-single').map(node=>node.text());
            expect(
                question_texts
            ).toEqual([data[0]['question_text']]); 
        });

        it('should have `Link` element with path to a single poll', () =>{
            let link = polls.find('Link').first();
            expect(
                link.props().to
            ).toEqual(`${pathname.pathname}/${data[0]['id']}`)
        })
    });
})  
