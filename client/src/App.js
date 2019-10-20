import React from "react";
import logo from "./logo.svg";
import "./App.css";
import ToDoCard from "./todocard/ToDoCard";
import AddToDo from "./todocard/AddToDo";
import * as Constants from "./common/Constants";
import { ToDoContext } from "./common/Context";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      todos: []
    };
    this.fetchToDO = this.fetchToDO.bind(this);
  }

  componentDidMount() {
    this.fetchToDO();
  }

  fetchToDO() {
    fetch(Constants.TODOS)
      .then(res => json())
      .then(
        result => {
          this.setState({
            todos: result.todos
          });
          console.log(this.state.todos);
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
      <div className="App">
        <header className="App-header">
          <p>To-Do</p>
        </header>
        <body className="App-body">
          <ToDoContext.Provider
            value={{
              state: this.state,
              fetchToDO: () => {
                this.fetchToDO();
              }
            }}
          >
            {this.state.todos.map(todo => (
              <ToDoCard
                name={todo.name}
                entries={todo.entries}
                todoid={todo._id}
                key={todo._id}
              />
            ))}
            <AddToDo />
          </ToDoContext.Provider>
        </body>
      </div>
    );
  }
}

export default App;
