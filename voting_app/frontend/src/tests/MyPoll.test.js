import React from 'react';
import { shallow } from 'enzyme';
import MyPollContainer from './../containers/MyPollContainer';
import MyPoll from './../components/MyPoll';
import EditPoll from './../components/EditPoll';
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

const dataVoteUpdated = {
    "question_text": "Docker vs Vagrant?",
    "id": 1,
    "choices": [
        {
            "choice_id": 15,
            "choice_text": "Vagrant",
            "vote": 1
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

const dataUpdate = {
    "question_text": "New title",
    "choices": [
        {
            "choice_id": 18,
            "choice_text": "New choice",
            "vote": 0
        },
    ]
} 

const dataVoted = {
    "question": data.id,
    "choice": data.choices[0].choice_id,
}

describe('MyPollContainer', () => {
    let wrapper;
    let path = {
        params: {
            questionId: data.id,
        }
    }

    beforeEach(() => {
        wrapper = shallow(<MyPollContainer match={path}/>);
        api.fetchSinglePoll.mockImplementation(() => {
            let response = new Promise((resolve, reject) =>{
                resolve(data);
            });
            return response;
        });
        api.postVote.mockImplementation(() => {
            data.choices[0].vote = 1;
            let response = new Promise((resolve, reject) =>{
                resolve(dataVoted);
            });
            return response;
        });
        api.deletePoll.mockImplementation(() => {
            let response = new Promise((resolve, reject) =>{
                resolve(204);
            });
            return response;
        });
        api.pollUpdate.mockImplementation(() => {
            data.question_text = dataUpdate.question_text;
            data.choices = [...data.choices, dataUpdate.choices[0]];
            let response = {
                status: 200,
                poll: data
            };
            let responsePromise = new Promise((resolve, reject) =>{
                resolve(response);
            });
            return responsePromise;
        });
    });

    afterEach(() => {
        api.fetchSinglePoll.mockClear();
        api.postVote.mockClear();
        api.deletePoll.mockClear();
        api.pollUpdate.mockClear();
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

    it('should have `MyPoll` element \
         while state properties `isError` is false, \
            `fetched` is true and `editPoll` is false', () => {
        wrapper.setState({
            isError: false,
            fetched: true,
            editPoll: false,
        });
        expect(
            wrapper.find(MyPoll).exists()
        ).toBe(true);   
    });

    it('should have `EditPoll` element \
         while state properties `isError` is false, \
            `fetched` is true and `editPoll` is true', () => {
        wrapper.setState({
            isError: false,
            fetched: true,
            editPoll: true,
        });
        expect(
            wrapper.find(EditPoll).exists()
        ).toBe(true);   
    });

    it('should receive poll data from server and set state property `poll`', () => {
        wrapper.instance().getPoll();
        return api.fetchSinglePoll(data.id)
            .then((poll) =>{
                expect(poll).toEqual(data);
                expect(
                    wrapper.state().poll
                ).toEqual(data);
            });
    });

    it('should receive poll data from server and set state property `totalVotes`', () => {
        
        wrapper.instance().getPoll();
        return api.fetchSinglePoll(data.id)
            .then((poll) =>{
                    let totalVotes = 0;
                    poll.choices.forEach((el) => {
                        totalVotes+=el.vote;
                    });
                    
                    expect(
                        wrapper.state().totalVotes
                    ).toEqual(totalVotes);
                })
    });

    it('should update state property `totalVotes` on vote', () => {
        let totalVotes = wrapper.state().totalVotes;
        wrapper.setState({
            poll: data,
        })
        wrapper.instance().onVote();
        expect(
            wrapper.state().totalVotes
        ).toEqual(totalVotes+1);
    });

    it('should receive udpated data after vote', () => {
        wrapper.setState({
            poll: data,
        })
        wrapper.instance().onVote();
        return api.postVote(data.id, data.choices[0].choice_id)
            .then((poll) =>{
                    expect(
                        poll
                    ).toEqual(dataVoted);

                    return api.fetchSinglePoll(data.id)
                        .then((poll) =>{
                                wrapper.setState({
                                    poll: data,
                                });
                                expect(
                                    wrapper.state().poll.choices[0].vote
                                ).toEqual(dataVoteUpdated.choices[0].vote);
                            })
                })
    });

    it('should set state property `onEdit` to true when `onEdit` method is fired', () =>{
        wrapper.instance().onEdit();
        expect(
            wrapper.state().editPoll
        ).toBe(true);
    });


    it('should set state property `onEdit` to false when `editFinish` method is fired', () =>{
        wrapper.setState({editPoll: true});
        wrapper.instance().editFinish();
        expect(
            wrapper.state().editPoll
        ).toBe(false);
    });

    it('should set state property `pollDeleted` to true\
        when `onDelete` is fired', () =>{
            wrapper.instance().onDelete();
            return api.deletePoll(data.id)
                .then((response) =>{
                        expect(
                            wrapper.state().pollDeleted
                        ).toEqual(true);
                });
    });

    it('should set return updated data after `onPollUpdate` is fired', () =>{
        wrapper.instance().onPollUpdate();
        return api.pollUpdate(data.id, dataUpdate.question_text, dataUpdate.choices)
            .then((response) =>{
                expect(
                    wrapper.state().pollUpdated
                ).toBe(true);
                expect(
                    wrapper.state().poll
                ).toBe(data);
            });
    });

    describe('MyPoll Component', ()=> {
        let poll;
        beforeEach(() => { 
            wrapper.setState({
                poll: data,
            });           
            wrapper.update();
            poll = shallow(
                    <MyPoll 
                        poll={data}
                        totalVotes={wrapper.state().totalVotes}
                        onVoteSelectChange={wrapper.instance().onVoteSelectChange}
                        onVote={wrapper.instance().onVote}
                        voted={wrapper.state().voted}
                        onEdit={wrapper.instance().onEdit}
                        onDelete={wrapper.instance().onDelete}
                          />
            );
        });
        
        it('renders without crashing', () => {
            poll;
        });

        it('should have `select` element with with id `choiceSelect`', () =>{
            expect(
                poll.find("#choiceSelect").exists()
            ).toBe(true); 
        });

        it('should have `Doughnut` element', () =>{
            expect(
                poll.find("Doughnut").exists()
            ).toBe(true); 
        });

        it('should have `a` element with with `totalVotes` as value', () =>{
            expect(
                poll.find('a.label').text()
            ).toEqual(String(wrapper.state().totalVotes)); 
        });

        it('should update totalVotes on `onVote`', () => {
            wrapper.instance().onVote();
            poll.setProps({totalVotes: wrapper.state().totalVotes});
            // console.log(poll.instance().props);
            expect(
                poll.find('a.label').text()
            ).toEqual(String(wrapper.state().totalVotes)); 
        });

        it('should show `You already voted.` text on `voted` props udpate', () => {
            poll.setProps({'voted': true});
            expect(
                poll.find('.error.message').exists()
            ).toBe(true);
            expect(
                poll.find('.error.message').text()
            ).toBe('You already voted.');
        })
    });

    describe('EditPoll Component', ()=> {
        let editpoll;
        beforeEach(() => { 
            wrapper.setState({
                poll: data,
            });           
            wrapper.update();
            editpoll = shallow(
                    <EditPoll 
                        poll={data}
                        onPollUpdate={wrapper.instance().onPollUpdate}
                        pollUpdated={wrapper.state().pollUpdated}
                        goBack={wrapper.instance().editFinish}
                          />
            );
        });
        
        it('renders without crashing', () => {
            editpoll;
        });

        it('increments state property `choiceCounter` by 1 on `addElement`', () =>{
            let addButton = editpoll.find('.ui.button.small.primary').first();
            addButton.simulate('click', {
                preventDefault: () => {},
            });
            expect(
                editpoll.state().choicesCounter
            ).toBe(1);
        });

        it('decrements state property `choiceCounter` by 1 \
            until hits 0 on `deleteElement`', () =>{
            editpoll.setState({choicesCounter: 1});
            let addButton = editpoll.find('.ui.button.small.red').first();
            addButton.simulate('click', {
                preventDefault: () => {},
            });
            expect(
                editpoll.state().choicesCounter
            ).toBe(0);
        });

        it('clears state properties `choiceCounter` and `choices` on `goBack`', () =>{
            editpoll.setState({
                choicesCounter: 1,
                choices: [
                    {'choice_text': 'habba habba'},
                ],
            });
            let goBackButton = editpoll.find('.goback').first();
            goBackButton.simulate('click', {
                preventDefault: () => {},
            });
            expect(
                editpoll.state().choicesCounter
            ).toBe(0);
            expect(
                editpoll.state().choices.length
            ).toBe(0);
        });

        it('submits new data to `onPollUpdate` on form submit', () =>{
            editpoll.setState({
                choicesCounter: 1,
                question_text: 'Updated title here',
                choices: [
                    {'choice_text': 'habba habba'},
                ],
            });
            let form = editpoll.find('form').first();
            editpoll.instance().validate = jest.fn().mockImplementation(() => {
                let fieldErrors = {
                    choices: [false,],
                }
                return fieldErrors;
            });
            form.simulate('submit', {
                preventDefault: () => {},
            });
            expect(
                editpoll.state().choicesCounter
            ).toBe(0);
            expect(
                editpoll.state().choices.length
            ).toBe(0);
        })
    });
})  
