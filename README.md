## React Chat App

### [Demo](https://real-time-chat-cc29e.web.app)

**Test accounts:**

 * Email:
   * test1.test@test.com
   * test2.test@test.com
 * Password:
   * test1test1234
   * test2test1234

**🚨If you open 2 browsers to check realtime chat, please use incognito mode: "Press Ctrl + Shift + n" to avoid override your current authentication.<br>(This project uses firebase authentication)**

Demo: https://real-time-chat-cc29e.web.app

<hr>

## About this app:
 
Real time chat app allows user to communicate with other users and check realtime status of other users in the same chat room. Built with React, React-redux, Typescript, and CSS.
Use Node.js for the backend, and socket.io for handling real time user status and text messaging. 


### Project Screen Shot(s)

<div>
<img width="450" alt="Screen Shot 2022-09-10 at 4 41 29 PM" src="https://user-images.githubusercontent.com/55787141/189505402-8c1424a5-b2bf-4894-8b36-afe903ac8e84.png">

<br>

<img width="450" alt="Screen Shot 2022-09-10 at 4 42 17 PM" src="https://user-images.githubusercontent.com/55787141/189505409-1b19bce8-908c-439d-aa27-08f07b5639ef.png">

<br>

<img width="450" alt="Screen Shot 2022-09-10 at 4 42 53 PM" src="https://user-images.githubusercontent.com/55787141/189505413-5f3c9a7c-9670-41a3-ba69-3ba10e4b4ff6.png">
</div>


## Installation and Setup Instructions

Firebase setup:
Please visit firebase console and create a project to get firebaseConfig. In your project setting, grab firebaseConfig and create .env file in fontend folder.
In your .env file you can copy and past the following, then set firebaseConfig for each REACT_APP_{firebaseConfig name}.

REACT_APP_API_KEY= <br>
REACT_APP_AUTH_DOMAIN= <br>
REACT_APP_DATABASE_URL= <br>
REACT_APP_PROJECT_ID= <br>
REACT_APP_STORAGE_BUCKET= <br>
REACT_APP_MESSAGING_SENDER_ID= <br>
REACT_APP_APP_ID= <br>
REACT_APP_MEASUREMENT_ID= <br>
REACT_APP_SERVER_ENDPOINT=http://localhost:5001  <br>

Clone down this repository. You will need `node` and `npm` installed globally on your machine.  

Installation:

`npm run setup`  

To Run Test Suite:  

`cd frontend` 

`npm run test`  

To Start Server:

-- frontend --  <br>
`cd frontend` 

`npm run start`

-- server -- <br>
`cd ..` 

`cd server` 

`npm run start`

To Visit App: 

`localhost:3000/` 

## Hosted by
  Frontend: Firebase Hosting <br>
  Backend: Heroku

## Check actual application?

Please visit the link below.

https://real-time-chat-cc29e.web.app

The application is hosted by firebase hosintg for frontend and heroku for backend(socket.io won't work on firebase hosting).

