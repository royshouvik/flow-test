// @moduledoc
//
// This is the base API client, it acts as a container for Authentication,
// Login, user settings, base endpoints, etc.
// It is meant to be easy to mock.

import axios from "axios";
import btoa from "btoa";

const logRequests = typeof DEV !== "undefined" && DEV;
const requestColor = "CornflowerBlue";
const responseColor = "Crimson";
const API_URL = "https://dev.hihenry.com/api";

export default class ApiClient {
  static createToken(username, password) {
    return "Basic " + btoa(username + ":" + password);
  }

  constructor(authToken, errorHandler = console.error.bind(console)) {
    this.authToken = authToken;
    this.errorHandler = errorHandler;
  }

  encodeQueryParameters(parameters) {
    if (parameters) {
      return (
        "?" +
        Object.keys(parameters)
          .map(
            key =>
              `${encodeURIComponent(key)}=${encodeURIComponent(
                parameters[key]
              )}`
          )
          .join("&")
      );
    }
    return "";
  }

  requestJWT() {
    const method = "GET";
    const path = "/v2/token";
    const headers = {
      Authorization: this.authToken
    };
    if (logRequests) {
      console.groupCollapsed(`%c${method} ${path}`, `color: ${requestColor}`);
      console.log("method:", method);
      console.log("path:", API_URL + path);
      console.log("headers:", headers);
      console.groupEnd();
    }
    return new Promise((resolve, reject) =>
      axios(API_URL + path, {
        method,
        headers,
        mode: "cors"
      }).then(response => {
        if (logRequests) {
          console.groupCollapsed(
            `%c${method} ${path}`,
            `color: ${responseColor}`
          );
          console.groupEnd();
        }
        if (response.status === 401) {
          reject(new Error("Invalid email or password"));
        }
        const token = response.data;

        if (token) {
          this.authToken = "Bearer " + token;
          resolve(this.authToken);
        } else {
          reject(new Error("The server did not send a"));
        }
      })
    );
  }

  fetch(method, path, body, userHeaders = {}) {
    const headers = Object.assign(
      {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: this.authToken
      },
      userHeaders
    );
    if (logRequests) {
      console.groupCollapsed(`%c${method} ${path}`, `color: ${requestColor}`);
      console.log("method:", method);
      console.log("path:", API_URL + path);
      console.log("headers:", headers);
      if (body) {
        console.log("body:", body);
      }
      console.groupEnd();
    }
    return new Promise((resolve, reject) =>
      axios(API_URL + path, {
        method,
        headers,
        data: body
      })
        .then(response => {
          if (logRequests) {
            console.groupCollapsed(
              `%c${method} ${path}`,
              `color: ${responseColor}`
            );
            console.groupEnd();
          }
          if (response.status === 401) {
            window.location.pathname = "/logout";
            resolve({
              status: "error",
              message: "Insufficient access rights",
              code: response.status
            });
          } else if (response.status === 403) {
            resolve({
              status: "error",
              message: "Insufficient access rights",
              code: response.status
            });
          } else if (response.status >= 400 && response.status < 500) {
            resolve({
              status: "error",
              message: "Client error: Try refreshing the browser",
              code: response.status
            });
          } else if (response.status >= 500) {
            resolve({
              status: "error",
              message:
                "Server error: try refreshing the browser, or try again later.",
              code: response.status
            });
          } else {
            resolve({
              status: "ok",
              data: response.data
            });
          }
        })
        .catch(error => {
          const result = {
            status: "error",
            message: "An error occured talking to the server.",
            cause: error
          };
          this.errorHandler(result);
          resolve(result);
        })
    );
  }
}
