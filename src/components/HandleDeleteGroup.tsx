import axios from "axios";
import React, {useState} from "react";

const homeurl = 'http://localhost:4000/api'

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