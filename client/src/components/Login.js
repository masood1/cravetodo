import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Login.css";
import * as Constants from "../common/Constants";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      message: ""
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

    axios
      .post(Constants.LOGIN, { username, password })
      .then(result => {
        localStorage.setItem("jwtToken", result.data.token);
        this.setState({ message: "" });
        this.props.history.push("/");
      })
      .catch(error => {
        if (error.response.status === 401) {
          this.setState({
            message: "Login failed. Username or password not match"
          });
        }
      });
  };

  render() {
    const { username, password, message } = this.state;
    return (
      <div class="container-fluid">
        <div class="row no-gutter">
          <div class="d-none d-md-flex col-md-4 col-lg-6 bg-image"></div>
          <div class="col-md-8 col-lg-6">
            <div class="login d-flex align-items-center py-5">
              <div class="container">
                <div class="row">
                  <div class="col-md-9 col-lg-8 mx-auto">
                    <h3 class="login-heading mb-4">Welcome back!</h3>

                    <form class="form-signin" onSubmit={this.onSubmit}>
                      {message !== "" && (
                        <div
                          class="alert alert-warning alert-dismissible"
                          role="alert"
                        >
                          {message}
                        </div>
                      )}

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
                        Login
                      </button>
                      <p>
                        Not a member?{" "}
                        <Link to="/register">
                          <span
                            class="glyphicon glyphicon-plus-sign"
                            aria-hidden="true"
                          ></span>{" "}
                          Register here
                        </Link>
                      </p>
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

export default Login;
