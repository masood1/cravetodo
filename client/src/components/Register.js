import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Login.css";
import * as Constants from "../common/Constants";

class Create extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: ""
    };
  }
  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  onSubmit = e => {
    e.preventDefault();

    const { username, password } = this.state;

    axios.post(Constants.REGISTER, { username, password }).then(result => {
      this.props.history.push("/login");
    });
  };

  render() {
    const { username, password } = this.state;
    return (
      <div class="container-fluid">
        <div class="row no-gutter">
          <div class="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
          <div class="col-md-8 col-lg-6">
            <div class="login d-flex align-items-center py-5">
              <div class="container">
                <div class="row">
                  <div class="col-md-9 col-lg-8 mx-auto">
                    <h3 class="login-heading mb-4">
                      {" "}
                      Be part of " ToDo For Team "{" "}
                    </h3>

                    <form class="form-signin" onSubmit={this.onSubmit}>
                      <h2 class="form-signin-heading">Register</h2>
                      <label for="inputEmail" class="sr-only">
                        Email address
                      </label>
                      <input
                        type="email"
                        class="form-control"
                        placeholder="Email address"
                        name="username"
                        value={username}
                        onChange={this.onChange}
                        required
                      />
                      <label for="inputPassword" class="sr-only">
                        Password
                      </label>
                      <input
                        type="password"
                        class="form-control"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={this.onChange}
                        required
                      />

                      <button
                        class="btn btn-lg btn-primary btn-block"
                        type="submit"
                      >
                        Register
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Create;
