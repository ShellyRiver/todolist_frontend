import axios from "axios";
const homeurl = 'https://grouptodos.herokuapp.com/api'

export default async function HandleMemberLeaveGroup(groupId: any) {
    const user = localStorage.getItem("user") || "";
    const userJSON = JSON.parse(user);
    try {
        await axios({
            method: 'patch',
            url: `${homeurl}/groups/${groupId}`,
            data: {
                members: userJSON._id,
                operation: 'remove'
            }
        })
    }
    catch (e) {
        console.log(e);
    }
}