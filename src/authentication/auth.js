// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut} from "firebase/auth";
import axios from "axios";

// Your web app's Firebase configuration
import {firebaseConfig} from "./secret";
import alert from "bootstrap/js/src/alert";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const homeurl = 'http://localhost:4000/api'


export async function signUp() {
    var name = document.getElementById('name');
    var email = document.getElementById('email');
    var password = document.getElementById('password');
    if (name.value === "") {
        return {
            status: "error",
            message: "User name cannot be empty!"
        }
    }
    else {
        try {
            await createUserWithEmailAndPassword(auth, email.value, password.value);
        }
        catch (e) {
            return {
                status: "error",
                message: e.message
            }
        }
        try {
            const response = await axios({
                method: "post",
                url: `${homeurl}/users`,
                data: {
                    'name': name.value,
                    'email': email.value
                }
            });
            return {
                status: "success",
                message: null
            };
        }
        catch (e) {
            return {
                status: "error",
                message: e.message
            }
        }
    }
}

export async function signIn() {
    var email = document.getElementById('email');
    var password = document.getElementById('password');
    var r;
    try {
        r = await signInWithEmailAndPassword(auth, email.value, password.value);
        // console.log("Logged In Successfully!");
        // console.log(r.user.email);
        // return {
        //     status: "success",
        //     message: r.user.email
        // }
    }
    catch (e) {
        // console.log(e.message);
        // console.log(e.code);
        return {
            status: "error",
            message: e.message
        }
    }
    try {
        const user = await axios({
            method: "get",
            url: `${homeurl}/users?where={"email":"${email.value}"}`,
        });
        // console.log(user.data.data[0]);
        return {
            status: "success",
            message: r.user.email,
            info: user.data.data[0]
        }
    }
    catch (e) {
        return {
            status: "error",
            message: e.message
        }
    }
}

export async function signOutUser() {
    try {
        await signOut(auth);
        // console.log("Logged Out Successfully!");
        return true;
    }
    catch (e) {
        // console.log(e.message);
        return false;
    }
}