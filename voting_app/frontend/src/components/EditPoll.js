import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types';

class EditPoll extends Component {

    constructor(props) {
        super(props);
        this.state = {
            fieldErrors: {},
            title: "",
            choicesCounter: 0,
            choices: [],
        }
    }

    componentDidMount(){
        this.setState({
            title: this.props.poll.question_text,
        })
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
        console.log(this.props);
        return (
            <div className="ui centered grid">
                <div className="row">
                    <div className="sixteen wide tablet six wide computer column">
                        <div className="ui segment">
                            <div className="ui top attached label green">Edit the Poll</div>
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
                                <hr/>
                                <b>Existing choices</b><br/>
                                <i>Can't be edited</i>
                                <div className="ui list">
                                    {
                                        this.props.poll.choices.map((choice) => {
                                            return(
                                                <div
                                                    className="item"
                                                    key={choice.choice_id}
                                                    >
                                                    {choice.choice_text}
                                                </div>
                                            )
                                        })
                                    }
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
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

EditPoll.propTypes = {
    className: PropTypes.string,
    poll: PropTypes.object,
};

export default EditPoll;
