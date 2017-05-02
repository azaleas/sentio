import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';
import Redirect from 'react-router-dom/Redirect';

import {api} from './../utils/Api';

class CreatePollContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fieldErrors: {},
            title: "",
            choicesCounter: 0,
            choices: [],
            cancelCreate: false,
            notEnoughChoices: false,
            submitting: false,
            created: false,
        }
    }

    onTitleChange = (event) => {
        this.setState({
            title: event.target.value  
        })
    }

    onChoiceChange = (event) => {
        let elementName = event.target.name;
        let choices = this.state.choices || [];
        let elementId = elementName.replace('choice', '') - 1;
        choices[elementId] = event.target.value;
        this.setState({
            choices,
        });
    }

    addElement = (event) => {
        event.preventDefault();    
        this.setState({
            choicesCounter: this.state.choicesCounter + 1,
        });
    }
    
    deleteElement = (event) => {
        event.preventDefault(); 
        if(this.state.choicesCounter > 0){
            this.setState({
                choicesCounter: this.state.choicesCounter - 1,
            });
            let choicesCounter = this.state.choicesCounter;
            let choices = this.state.choices;
            if(typeof choices !== 'undefined'){
                choices = [...choices.slice(0, choicesCounter-1)];
                this.setState({
                    choices,
                });
            }
        }
    }

    formSubmit = (event) =>{
        event.preventDefault();

        const fieldErrors = this.validate(this.state.choices, this.state.title);

        this.setState({
            fieldErrors,
        });

        if(Object.keys(fieldErrors).length > 1) return;

        let choiceErrors = fieldErrors.choices.filter((el, index) => {
            if(el) return el;
        });

        if(choiceErrors.length) return;

        if(this.state.choices.length > 0){
            this.setState({
                notEnoughChoices: false,
                submitting: true,
            })
            api.createPoll(this.state.title, this.state.choices)
                .then((response) => {
                    if(response === 200){
                        this.setState({
                            created: true,
                        })
                    }
                })
        }
        else{
            this.setState({
                notEnoughChoices: true,
            });
            return;
        }

    }

    cancelCreate = (event) =>{
        event.preventDefault();
        this.setState({
            cancelCreate: true,
        })
    }

    validate = (choices, title) => {
        const errors = {};
        if(!title || typeof(title) === "undefined"){
            errors.title = true;
        }
        let choiceErrors = [];
        for(let ref in this.refs){
            if(ref.indexOf("choice") !== -1){
                let choiceInput = ReactDOM.findDOMNode(this.refs[ref]).value;
                if(choiceInput === ""){
                    choiceErrors.push(true);
                }
                else{
                    choiceErrors.push(false);
                }
            }
        }
        errors.choices = choiceErrors;
        return errors;
    }

    renderChoices(){
        let choices = [];
        for (let indexNumber = 1; indexNumber <= this.state.choicesCounter; indexNumber++){
            choices.push(
                <div 
                    key={"choice" + indexNumber}
                    className={"field " + 
                    ((typeof this.state.fieldErrors.choices !== "undefined" && 
                        this.state.fieldErrors.choices[indexNumber-1]) ? "error" : "")}>
                    <input 
                        name={"choice" + indexNumber}
                        type="text"
                        ref={"choice" + indexNumber}
                        placeholder="Choice..."
                        value={(this.state.choices.length > 0) ? this.state.choices[indexNumber-1] : ""}
                        onChange={this.onChoiceChange}
                        />
                </div>
            )
        }
        return choices;
    }

    render() {
        return (
            (this.state.cancelCreate || this.state.created)
            ?(
                <Redirect to="/mypolls"/>
            )
            :(
                <div className="ui centered grid">
                    <div className="row">
                        <div className="sixteen wide tablet six wide computer column">
                            <div className="ui segment">
                                <div className="ui top attached label green">Create New Poll</div>
                                <form 
                                    onSubmit={this.formSubmit}
                                    className="ui form">
                                    <div className={"field " + 
                                        (this.state.fieldErrors.title ? "error" : "")}>
                                        <input 
                                            type="text"
                                            name="question"
                                            onChange={this.onTitleChange}
                                            value={this.state.title}
                                            placeholder="Poll title"/>
                                    </div>
                                    {this.renderChoices()}
                                    <div className="two ui buttons">
                                        <button 
                                            onClick={this.addElement}
                                            className="ui button small primary">
                                            Add Choice
                                        </button>
                                        <button 
                                            onClick={this.deleteElement}
                                            className="ui button small red">
                                            Delete Choice
                                        </button>
                                    </div>
                                    <hr/>
                                    <input 
                                        type="submit" 
                                        className="ui button small" 
                                        value="Submit"/>
                                    <button 
                                        onClick={this.cancelCreate}
                                        className="ui button small">
                                        Cancel
                                    </button>
                                </form>
                                {
                                    this.state.notEnoughChoices
                                    ? (
                                    <div className="ui icon error message mini">
                                        <i className="warning circle icon"></i>
                                            <div className="content">
                                                <div className="header">
                                                    Add at least one choice.
                                                </div>
                                            </div>
                                    </div>
                                    )
                                    :(<p></p>)
                                }
                                {
                                    this.state.submitting
                                    ? (
                                    <div className="ui icon success message mini">
                                        <i className="warning circle icon"></i>
                                            <div className="content">
                                                <div className="header">
                                                    Creating new poll...
                                                </div>
                                            </div>
                                    </div>
                                    )
                                    :(<p></p>)
                                }
                            </div>
                        </div>
                    </div>
                </div>
            )
        );
    }
}

CreatePollContainer.propTypes = {
    className: PropTypes.string,
};

export default CreatePollContainer;
