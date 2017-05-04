import React from 'react';
import { shallow } from 'enzyme';
import CreatePollContainer from './../containers/CreatePollContainer';
import {api} from './../utils/Api';

jest.mock('./../utils/Api');

const data = {
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

describe('CreatePollContainer Component', ()=> {
    let wrapper;
    beforeEach(() => { 
        wrapper = shallow(
                <CreatePollContainer />
        );

        api.createPoll.mockImplementation(() => {
            let response = new Promise((resolve, reject) =>{
                resolve(200);
            });
            return response;
        })
    });
    
    it('renders without crashing', () => {
        wrapper;
    });

    it('increments state property `choiceCounter` by 1 on `addElement`', () =>{
        let addButton = wrapper.find('.ui.button.small.primary').first();
        addButton.simulate('click', {
            preventDefault: () => {},
        });
        expect(
            wrapper.state().choicesCounter
        ).toBe(1);
    });

    it('decrements state property `choiceCounter` by 1 \
        until hits 0 on `deleteElement`', () =>{
        wrapper.setState({choicesCounter: 1});
        let addButton = wrapper.find('.ui.button.small.red').first();
        addButton.simulate('click', {
            preventDefault: () => {},
        });
        expect(
            wrapper.state().choicesCounter
        ).toBe(0);
    });

    it('set state property `cancelCreate` to true on `cancelCreate`', () =>{
        let cancelCreateButton = wrapper.find('.cancelbutton').first();
        cancelCreateButton.simulate('click', {
            preventDefault: () => {},
        });
        expect(
            wrapper.state().cancelCreate
        ).toBe(true);
    });

    it('submits new data to `createPoll` on form submit', () =>{
        wrapper.setState({
            question_text: 'Updated title here',
            choices: [
                {'choice_text': 'habba habba'},
            ],
        });
        let form = wrapper.find('form').first();
        wrapper.instance().validate = jest.fn().mockImplementation(() => {
            let fieldErrors = {
                choices: [false,],
            }
            return fieldErrors;
        });
        form.simulate('submit', {
            preventDefault: () => {},
        });
        return api.createPoll()
            .then((response) =>{
                expect(response).toEqual(200);
                expect(
                    wrapper.state().created
                ).toBe(true);
            });
    })
});