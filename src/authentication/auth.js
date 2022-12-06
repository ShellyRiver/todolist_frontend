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

export function changeToRegister() {
    const signUpTab = document.getElementById('login-tab-tab-register');
    signUpTab.click();
}

export async function signUp() {
    var name = document.getElementById('name-sign-up');
    var email = document.getElementById('email-sign-up');
    var password = document.getElementById('password-sign-up');
    var repeatPassword = document.getElementById('repeat-password-sign-up');
    if (name.value === "") {
        return {
            status: "error",
            message: "User name cannot be empty!"
        }
    }
    else if (password.value !== repeatPassword.value) {
        return {
            status: "error",
            message: "Password do not match!"
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
            document.getElementById('name-sign-up').value = "";
            document.getElementById('email-sign-up').value = "";
            document.getElementById('password-sign-up').value = "";
            document.getElementById('repeat-password-sign-up').value = "";
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
    var email = document.getElementById('email-sign-in');
    var password = document.getElementById('password-sign-in');
    var r;
    try {
        r = await signInWithEmailAndPassword(auth, email.value, password.value);
    }
    catch (e) {
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
        return true;
    }
    catch (e) {
        return false;
    }
}