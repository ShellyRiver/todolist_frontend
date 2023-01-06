# CS 409 final project: GroupTODO
People like to use todolist too plan and manage tasks to improve work efficiency. Currently, most todolists in the market are designed for individuals. However, people usually play different roles in various groups, so it would be helpful to have a todolist suitable for group collaboration, in which group leaders can assign tasks to group members, and every user can check both their personal tasks and assigned group tasks in a single web application.

A video demonstration of this web application can be found on [Youtube](https://youtu.be/LsAwws9SEzo).


## How to Run the Code

First install all the dependencies.
```
npm install
```

Add your **own** Firebase user authentication project information as a file ```src/authentication/secret.js```. The content of the file should look like something below:
```
export const firebaseConfig = {
    apiKey: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    authDomain: "project-123.firebaseapp.com",
    projectId: "project-123",
    storageBucket: project-123.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:12345678901234567890"
};
```
Then you can start running the code by running
```
npm start
```
then the project will be hosted on ```localhost:3000/grouptodo```.

