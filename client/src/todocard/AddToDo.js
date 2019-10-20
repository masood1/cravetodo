import React,{useContext} from 'react';
import './ToDoCard.css';
import { Modal } from '../common/components'
import * as Constants from '../common/Constants'
import {ToDoContext} from '../common/Context'

class AddToDo extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            show: false,
        };
        this.handleClose = this.handleClose.bind(this);
    }
    
    handleClose() {
        this.setState({ show: false })
    }

    

    render() {
        return (
            <div className="todocard-add">
                <span className="todoadd-span" onClick={() => { this.setState({ show: true }) }}>+</span>

                <Modal show={this.state.show} handleClose={this.handleClose} title="Add To Do">
                    <CheckListContainer />
                </Modal>
            </div>
        );
    }
}

export class CheckListContainer extends React.Component {
    static contextType = ToDoContext;

    constructor(props) {
        super(props);
        this.state = { name: "", todos: [{ id: 1, todo: "" }], counter: 2, error: null, message: null,todoid:null};
        this.addNewToDo = this.addNewToDo.bind(this);
        this.addToDo = this.addToDo.bind(this);
        this.removeToDO = this.removeToDO.bind(this);
        this.saveToDO = this.saveToDO.bind(this);
    }

    addNewToDo() {
        this.state.todos.push({ id: this.state.counter, todo: "" })
        this.state.counter = this.state.counter + 1;
        this.setState({ todos: this.state.todos, counter: this.state.counter })
    }

    addToDo(event, id) {
        var todos = this.state.todos;
        const arrayToObject = todos.map(function (item) {
            return item.id;
        });

        this.state.todos[arrayToObject.indexOf(id)]["todo"] = event.target.value;
        this.setState({ todos: this.state.todos })
    }

    removeToDO(id) {
        var todos = this.state.todos;
        const arrayToObject = todos.map(function (item) {
            return item.id;
        });

        todos.splice(arrayToObject.indexOf(id), 1);
        this.setState({ todos: todos })
    }

    saveToDO() {
        fetch(Constants.TODOS,{
            method: 'POST',
            body: JSON.stringify(this.state),
            headers:{"Content-Type":"application/json"}
         }).then(res => res.json())
            .then(
                (result) => {
                    if(result["error"]){
                        this.setState({error:true,message:"Error occured! Check input"})
                    }
                    else{
                        this.setState({message:"ToDo Create successfully",error:false})
                        this.context.fetchToDO();
                    }
                    console.log(result);
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    render() {
        return (
            <div>
                <div>
                    <input type="text" className="todo-title-input" placeholder="Title" onChange={(event) => { this.setState({ name: event.target.value }) }}></input>
                </div>
                <div style={{marginTop:"4%"}}>
                    {this.state.todos.map(entry => (
                        <div className="editCheckBox" key={entry.id}>
                            <label><input type="checkbox" disabled={true} />
                                <input type="text" className="todo-entry-input" value={entry.todo} onChange={(event) => this.addToDo(event, entry.id)}></input>
                            </label>
                            <span className="todo-entry-close" onClick={() => this.removeToDO(entry.id)}>X</span>
                        </div>
                    ))}

                </div>
                <div className="todo-submit-div">
                    <button className="todo-submit-div-button-add" onClick={this.addNewToDo}>+ Add To-Do</button>
                    <button className="todo-submit-div-button-save" onClick={this.saveToDO}>Save</button>
                </div>
                <div className="todo-submit-message-box">
                    {this.state.message}
                </div>
            </div>
        );
    }
}

export default AddToDo;
