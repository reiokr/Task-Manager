/**
 * EasyHTTP Library
 * Library for making HTTP requests
 * @version 3.0.1
 * @author  RK
 * @license MIT
 **/
class EasyHTTP {
  // Make an HTTP GET Request
  async get(url,token) {
    const response = await fetch(url,token);
    const resData = await response.json();
    return resData;
  }
  // Make an HTTP POST Request
  async post(url, data) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(data),
    });
    const resData = await response.json();
    return resData;
  }
  // Make an HTTP PUT Request
  async put(url, data) {
    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(data),
    });
    const resData = await response.json();
    return resData;
  }
  // Make an Patch request
  async patch(url, json) {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(json),
    });
    const resData = await response.json();
    return resData;
  }
  // Make an HTTP DELETE Request
  async delete(url) {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
    });
    const resData = await "Resource Deleted...";
    return resData;
  }
}
