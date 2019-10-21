import React from "react";
import { CheckBox, Modal } from "../common/components";
import "./ToDoCard.css";
import * as Constants from "../common/Constants";
import { ToDoContext } from "../common/Context";
import "../common/components.css";

class ToDoCard extends React.Component {
  static contextType = ToDoContext;

  constructor(props) {
    super(props);
    this.state = { props, show: false };
    this.todoUpdate = this.todoUpdate.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.removeToDO = this.removeToDO.bind(this);
  }

  todoUpdate(id, checked) {
    console.log("CheckBox clicked : " + id + " Checked : " + checked);
  }

  handleClose() {
    this.setState({ show: false });
  }

  removeToDO() {
    console.log(this.state.todos);
    var authToken = localStorage.getItem("jwtToken");

    // axios.defaults.headers.common['Authorization'] =
    // axios.get('/api/book')
    //   .then(res => {

    fetch(Constants.TODOS + "/" + this.props.todoid, {
      method: "DELETE",
      headers: {
        Authorization: authToken
      }
    })
      .then(res => res.json())
      .then(
        result => {
          if (result["error"]) {
            this.setState({
              error: true,
              message: "Error occured! Check input"
            });
          } else {
            this.setState({ message: "ToDo Create successfully", show: false });

            this.context.fetchToDO();
          }
          console.log(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  render() {
    return (
      <div className="todocard">
        <div style={{ margin: "4%" }}>
          <span className="todo-title">{this.props.name}</span>
          <span
            className="modal-circle-close"
            onClick={() => this.removeToDO()}
          >
            +
          </span>
        </div>
        <div
          style={{ height: "100%" }}
          onClick={() => this.setState({ show: true })}
        >
          <div className="checkboxes">
            {this.props.entries.map(entry => (
              <CheckBox
                name={entry.todo}
                key={entry._id}
                id={entry._id}
                checked={entry.completed}
                handleClick={this.todoUpdate}
              />
            ))}
          </div>
        </div>
        <Modal
          show={this.state.show}
          handleClose={this.handleClose}
          title="Edit To-Do"
        >
          <EditCheckListContainer
            stateData={this.props}
            callback={this.handleClose}
          />
        </Modal>
      </div>
    );
  }
}

class EditCheckListContainer extends React.Component {
  static contextType = ToDoContext;

  constructor(props) {
    super(props);
    this.state = {
      name: "",
      todos: [{ id: 1, todo: "" }],
      counter: 1,
      error: null,
      message: null,
      todoid: null
    };
    this.addNewToDo = this.addNewToDo.bind(this);
    this.addToDo = this.addToDo.bind(this);
    this.removeToDO = this.removeToDO.bind(this);
    this.saveToDO = this.saveToDO.bind(this);
  }

  componentDidMount() {
    var todoEntries = this.props.stateData.entries;
    var counter = this.state.counter;
    for (var i = 0; i < todoEntries.length; i++) {
      todoEntries[i]["id"] = i + 1;
      counter = counter + 1;
    }
    this.setState({
      name: this.props.stateData.name,
      todos: todoEntries,
      counter: counter,
      todoid: this.props.stateData.todoid
    });
  }

  addNewToDo() {
    this.state.todos.push({
      id: this.state.counter,
      todo: "",
      completed: false
    });
    this.state.counter = this.state.counter + 1;
    this.setState({ todos: this.state.todos, counter: this.state.counter });
  }

  addToDo(event, id) {
    var todos = this.state.todos;
    const arrayToObject = todos.map(function(item) {
      return item.id;
    });

    this.state.todos[arrayToObject.indexOf(id)]["todo"] = event.target.value;
    this.setState({ todos: this.state.todos });
  }
  updateCompleted(id) {
    var todos = this.state.todos;
    const arrayToObject = todos.map(function(item) {
      return item.id;
    });
    console.log(id);
    this.state.todos[arrayToObject.indexOf(id)]["completed"] = !this.state
      .todos[arrayToObject.indexOf(id)]["completed"];
    this.setState({ todos: this.state.todos });
  }

  removeToDO(id) {
    var todos = this.state.todos;
    const arrayToObject = todos.map(function(item) {
      return item.id;
    });

    todos.splice(arrayToObject.indexOf(id), 1);
    this.setState({ todos: todos });
  }

  saveToDO() {
    let authToken = localStorage.getItem("jwtToken");
    console.log(this.state.todos);
    fetch(Constants.TODOS + "/" + this.state.todoid + "/entry", {
      method: "PUT",
      body: JSON.stringify(this.state.todos),

      headers: {
        "Content-Type": "application/json",
        Authorization: authToken
      }
    })
      .then(res => res.json())
      .then(
        result => {
          if (result["error"]) {
            this.setState({
              error: true,
              message: "Error occured! Check input"
            });
          } else {
            this.setState({ message: "ToDo Updated successfully" });
            this.context.fetchToDO();
            this.props.callback();
          }
          console.log(result);
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        error => {
          this.setState({
            isLoaded: true,
            error
          });
        }
      );
  }

  render() {
    return (
      <div>
        <div>
          <p>{this.state.name}</p>
        </div>
        <div style={{ marginTop: "4%" }}>
          {this.state.todos.map(entry => (
            <div className="editCheckBox" key={entry.id}>
              <label>
                <input
                  type="checkbox"
                  value={entry.completed}
                  checked={entry.completed}
                  onChange={event => this.updateCompleted(entry.id)}
                />
                <input
                  type="text"
                  className="todo-entry-input"
                  value={entry.todo}
                  onChange={event => this.addToDo(event, entry.id)}
                ></input>
              </label>
              <span
                className="todo-entry-close"
                onClick={() => this.removeToDO(entry.id)}
              >
                X
              </span>
            </div>
          ))}
        </div>
        <div className="todo-submit-div">
          <button
            className="todo-submit-div-button-add"
            onClick={this.addNewToDo}
          >
            + Add To-Do
          </button>
          <button
            className="todo-submit-div-button-save"
            onClick={this.saveToDO}
          >
            Save
          </button>
        </div>
        <div className="todo-submit-message-box">{this.state.message}</div>
      </div>
    );
  }
}
export default ToDoCard;
