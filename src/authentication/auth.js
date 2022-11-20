// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged} from "firebase/auth";
import axios from "axios";

// Your web app's Firebase configuration
import {firebaseConfig} from "./secret";
import alert from "bootstrap/js/src/alert";

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
    if (name.value === "") {
        alert("User name cannot be empty!");
        return false;
    }
    else {
        createUserWithEmailAndPassword(auth, email.value, password.value).then(r => {
            axios({
                method: "post",
                url: `${homeurl}/users`,
                data: {
                    'name': name.value,
                    'email': email.value
                }
            }).then((response) => {
                console.log(response);
                alert("Signed Up Successfully!");
                return true;
            }).catch((error) => {
                alert(error.message);
                return false;
            });
        }).catch(e => {
            alert(e.message);
            return false;
        })
    }
}

export async function signIn() {
    var email = document.getElementById('email');
    var password = document.getElementById('password');
    try {
        const r = await signInWithEmailAndPassword(auth, email.value, password.value);
        console.log("Logged In Successfully!");
        console.log(r.user.email);
        return r.user.email;
    }
    catch (e) {
        console.log(e.message);
        return null;
    }
    // signInWithEmailAndPassword(auth, email.value, password.value).then(r => {
    //     console.log("Logged In Successfully!");
    //     console.log(r.user.email);
    //     return true;
    // }).catch(e => {
    //     console.log(e.message);
    //     return false;
    // })
}

export async function signOutUser() {
    try {
        await signOut(auth);
        console.log("Logged Out Successfully!");
        return true;
    }
    catch (e) {
        console.log(e.message);
        return false;
    }
    // signOut(auth).then(() => {
    //     alert("Logged Out Successfully!");
    // }).catch((error) => {
    //     alert(error.message)
    // });
}