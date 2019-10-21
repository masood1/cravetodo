import React from "react";
import logo from "./logo.svg";
import "./App.css";
import axios from "axios";
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
    axios.defaults.headers.common["Authorization"] = localStorage.getItem(
      "jwtToken"
    );
    axios
      .get(Constants.TODOS)
      .then(res => {
        console.log("Response : ", res);
        if (res.status == 403) {
          this.props.history.push("/login");
        } else {
          this.setState({
            todos: res.data.todos
          });
          console.log(this.state.todos);
        }
      })
      .catch(error => {
        console.log("Error from backend : ", error);
        // if (error.response.status === 403) {
        this.props.history.push("/login");
        // }
      });
  }
  logout = () => {
    localStorage.removeItem("jwtToken");
    window.location.reload();
  };

  render() {
    return (
      <div className="App">
        <div class="panel panel-default">
          <div class="panel-heading">
            <h3 class="panel-title">
              <header className="App-header">
                <p> Crave Team To-Do List</p>
              </header>
            </h3>
            {localStorage.getItem("jwtToken") && (
              <button class="btn btn-primary" onClick={this.logout}>
                Logout
              </button>
            )}
          </div>
        </div>

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
