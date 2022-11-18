// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from "firebase/auth";
import axios from "axios";

// Your web app's Firebase configuration
import {firebaseConfig} from "./secret";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const homeurl = 'http://localhost:4000/api'

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(`User State Change: ${user}`)
    } else {
        console.log(`log out`)
    }
});

export function signUp() {
    var name = document.getElementById('name');
    var email = document.getElementById('email');
    var password = document.getElementById('password');
    createUserWithEmailAndPassword(auth, email.value, password.value)
        .then(r => {
        axios({
            method: "post",
            url: `${homeurl}/users`,
            data: {
                'name': name.value,
                'email': email.value
            }
        })
            .then((response) => {
                console.log(response);
                alert("Signed Up Successfully!")
            })
            .catch((error)=>console.log(error));
    })
        .catch(e => alert(e.message))
}

export function signIn() {
    var email = document.getElementById('email');
    var password = document.getElementById('password');
    signInWithEmailAndPassword(auth, email.value, password.value).then(r => {
        alert("Logged In Successfully!");
        console.log(r.user.email);
    }).catch(e => alert(e.message))
}

export function signOutUser() {
    signOut(auth).then(() => {
        alert("Logged In Successfully!");
    }).catch((error) => {
        alert(error.message)
    });
}