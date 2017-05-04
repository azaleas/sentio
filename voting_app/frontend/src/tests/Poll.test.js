import React from 'react';
import { shallow } from 'enzyme';
import PollContainer from './../containers/PollContainer';
import Poll from './../components/Poll';
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

const dataUpdated = {
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

const dataVoted = {
    "question": data.id,
    "choice": data.choices[0].choice_id,
}

describe('PollContainer', () => {
    let wrapper;
    let path = {
        params: {
            questionId: data.id,
        }
    }

    beforeEach(() => {
        wrapper = shallow(<PollContainer match={path}/>);
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
    });

    afterEach(() => {
        api.fetchSinglePoll.mockClear();
        api.postVote.mockClear();
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

    it('should have `Poll` element \
         while state properties `isError` is false and `fetched` is true', () => {
        wrapper.setState({
            isError: false,
            fetched: true,
        });
        expect(
            wrapper.find('Poll').exists()
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
                                ).toEqual(dataUpdated.choices[0].vote);
                            })
                })
    });

    describe('Poll Component', ()=> {
        let poll;
        beforeEach(() => { 
            wrapper.setState({
                poll: data,
            });           
            wrapper.update();
            poll = shallow(
                    <Poll 
                        poll={data}
                        totalVotes={wrapper.state().totalVotes}
                        onVoteSelectChange={wrapper.instance().onVoteSelectChange}
                        onVote={wrapper.instance().onVote}
                        voted={wrapper.state().voted}
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
})  
