## React Chat App

#### About this app:
 
Real time chat app allows user to communicate with other users and check realtime status of other users in the same chat room, built with React, React-redux, JavaScript, and CSS.
Used Node.js for the backend, and socket.io for handling real time user status and text messaging. 


### Project Screen Shot(s)

<div>
 <img src="https://user-images.githubusercontent.com/55787141/152980902-0dab9c71-030b-4619-b766-43a78b279e8f.png" width="450">

 <img src="https://user-images.githubusercontent.com/55787141/152981084-35b66b8e-8431-4c43-b320-4be48b8d44d2.png" width="450">

 <img src="https://user-images.githubusercontent.com/55787141/152981225-d8d79254-97b3-4e5a-b747-59e925a1c739.png" width="450">
</div>

## Installation and Setup Instructions

Firebase setup:
Please visit firebase console and create a project to get firebaseConfig. In your project setting, grab firebaseConfig and create .env file in fontend folder.
In your .env file you can copy and past the following, then set firebaseConfig for each REACT_APP_{firebaseConfig name}.

REACT_APP_API_KEY=
REACT_APP_AUTH_DOMAIN=
REACT_APP_DATABASE_URL=
REACT_APP_PROJECT_ID=
REACT_APP_STORAGE_BUCKET=
REACT_APP_MESSAGING_SENDER_ID=
REACT_APP_APP_ID=
REACT_APP_MEASUREMENT_ID=
REACT_APP_SERVER_ENDPOINT=http://localhost:5000 

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
