import axios from "axios";
import React, {useState} from "react";
import home from "../pages/Home";

const homeurl = 'https://grouptodos.herokuapp.com/api'

export default async function HandleLeaderLeaveGroup(groupId: any, groupInfo: any) {
    const user = localStorage.getItem("user") || "";
    const userJSON = JSON.parse(user);

    /* Only one leader in the group, the whole group will be deleted */
    if (groupInfo.leaders.length === 1) {
        console.log("Only one leader, delete the whole group!");
        try {
            await axios({
                method: 'delete',
                url: `${homeurl}/groups/${groupId}`
            });
        }catch (e) {
            console.log(e);
        }
    }
    else {
        console.log("More than one leader, delete the leader only!");
        try {
            await axios({
                method: 'patch',
                url: `${homeurl}/groups/${groupId}`,
                data: {
                    leaders: userJSON._id,
                    operation: 'remove'
                }
            })
        } catch (e) {
            console.log(e);
        }
    }
}