import axios from "axios";
const homeurl = 'http://localhost:4000/api'

export async function updateUser() {
    const userString = localStorage.getItem("user");
    const userJSON = JSON.parse(userString || "");
    try {
        const user = await axios({
            method: "get",
            url: `${homeurl}/users/${userJSON._id}`,
        });
        localStorage.setItem('user', JSON.stringify(user.data.data[0]));
    }
    catch (e) {
        console.log(e);
    }
}