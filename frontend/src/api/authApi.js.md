Understand the code
1. fetch() sends a request to your Express backend.
2. method: "POST" tells the backend that we're submitting login details.
3. JSON.stringify() converts our JavaScript object into JSON.
4. If the server returns an error, we throw an error to display it on the login page.
5. If login succeeds, we return the response containing the token and user details.