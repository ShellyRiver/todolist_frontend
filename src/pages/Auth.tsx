import { Outlet, Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import Accordion from 'react-bootstrap/Accordion';
import React, { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios'
import {signUp, signIn, signOutUser} from '../authentication/auth'

export default function Auth() {
    const clickSignUp:any = () => {
        signUp();
    }
    const clickSignIn = () => {
        signIn();
    }
    const clickSignOut = () => {
        signOutUser();
    }
    return (
      <>
          <div id="container">
              <input placeholder="name" id="name"/>
              <input type="email" placeholder="email" id="email"/>
              <input type="password" placeholder="password" id="password"/>
              <Button variant="outline-primary" onClick={clickSignUp}>Sign Up</Button>
              <Button variant="outline-primary" onClick={clickSignIn}>Sign In</Button>
              <Button variant="outline-primary" onClick={clickSignOut}>Sign Out</Button>
          </div>
      </>
    );
  };
  


