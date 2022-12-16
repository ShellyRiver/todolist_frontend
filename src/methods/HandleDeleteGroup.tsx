import axios from "axios";
const homeurl = 'https://grouptodos.herokuapp.com/api'

export default async function HandleDeleteGroup(groupId: any) {
    try {
        await axios({
            method: 'delete',
            url: `${homeurl}/groups/${groupId}`
        });
    }catch (e) {
        console.log(e);
    }
}