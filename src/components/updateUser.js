import axios from "axios";
const homeurl = 'https://grouptodos.herokuapp.com/api'

export async function updateUser(reloadCallback) {
    const userString = localStorage.getItem("user");
    const userJSON = JSON.parse(userString || "");
    try {
        const user = await axios({
            method: "get",
            url: `${homeurl}/users/${userJSON._id}`,
        });
        localStorage.setItem('user', JSON.stringify(user.data.data[0]));
        // console.log(JSON.stringify(user.data.data[0]));
        // console.log(localStorage.getItem('user'));
        reloadCallback();
    }
    catch (e) {
        console.log(e);
    }
}