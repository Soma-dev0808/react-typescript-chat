import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import dotenv from "dotenv";
dotenv.config();

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

firebase.initializeApp(config);

const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };

// interfaces for the data in firestore
interface UserInfoType {
  email: string;
  name: string;
}

interface RoomInfoType {
  date_created: firebase.firestore.Timestamp;
  roomName: string;
  users: UserInfoType[];
}

interface MessaageType {
  user: string;
  text: string;
  timeStamp?: firebase.firestore.Timestamp | string;
}

interface FireBaseErrorType {
  code: string;
  message: string;
  name: "FirebaseError";
  stack?: string;
}

export type { UserInfoType, RoomInfoType, MessaageType, FireBaseErrorType };
