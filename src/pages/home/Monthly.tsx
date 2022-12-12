
import React, { useEffect } from 'react';
import { useState } from 'react';

import './Monthly.css'
// import '../../components/canlendar';
import {Calendar, constrainPoint} from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';

import axios from "axios";

import TaskModal from "./TaskModal";


const COLORSLEADING = ['rgb(7,140,190)', 'rgb(255,179,255)', 'rgb(77,77,255)', 'rgb(255,77,106)', 'rgb(255,166,77)', 'rgb(196,255,77)', 'rgb(0,128,153)', 'rgb(0,153,51)', 'rgb(255,230,102)']
const COLORSBELONGING = ['rgb(161,206,230)', 'rgb(165,165,235)', 'rgb(210,181,207)', 'rgb(235,165,176)', 'rgb(230,168,138)', 'rgb(230,204,165)', 'rgb(151,227,136)', 'rgb(138,230,184)']
const COLORCOMPLETED = 'rgb(163,163,163)'

const homeurl = 'https://grouptodos.herokuapp.com/api'

function Monthly(props: any) {

  const email = localStorage.getItem("email");

  const [userID, setUserID] = useState(undefined);
  
  const [individualTaskIDs, setIndividualTaskIDs] = useState([]);
  const [belongingTaskIDs, setBelongingTaskIDs] = useState([]);
  const [leadingTaskIDs, setLeadingTaskIDs] = useState([]);
  const [individualTaskInfo, setIndividualTaskInfo] = useState([]);
  const [belongingTaskInfo, setBelongingTaskInfo] = useState([]);
  const [leadingTaskInfo, setLeadingTaskInfo] = useState([]);

  const [belongingResources, setBelongingResources] = useState<any>([]);
  const [leadingResources, setLeadingResources] = useState<any>([]);
  const [individualEvents, setIndividualEvents] = useState<any>([]);
  const [belongingEvents, setBelongingEvents] = useState<any>([]);
  const [leadingEvents, setLeadingEvents] = useState<any>([]);

  const [belongingGroupNames, setBelongingGroupNames] = useState<any>([]);
  const [leadingGroupNames, setLeadingGroupNames] = useState<any>([]);

  const [belongingGroupIDs, setBelongingGroupIDs] = useState<any>([]);
  const [leadingGroupIDs, setLeadingGroupIDs] = useState<any>([]);

  const [showTask, setShowTask] = useState(false);
  const handleCloseTask = () => setShowTask(false);

  const [clickedTask, setClickedTask] = useState({});

  const [toggledComplete, setToggledComplete] = useState(0);

  useEffect(() => {
    __updateTaskIDs()
  }, [toggledComplete, props.refresh])  // TODO: add dependency?


  useEffect(() => {
    __updateTaskInfo();
  }, [individualTaskIDs, belongingTaskIDs, leadingTaskIDs])  // TODO: add dependency?

  useEffect(()=>{
    
    var calendarEl = document.getElementById('calendar')!;

    // @ts-ignore
    var calendar = new Calendar(calendarEl, {
      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
      plugins: [ interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, resourceTimelinePlugin ],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,listWeek'  // timeGridWeek,timeGridDay,
      },
      initialDate: '2022-12-08',
      // navLinks: true, // can click day/week names to navigate views
      // editable: true,
      // selectable: true,
      dayMaxEvents: true, // allow "more" link when too many events
      resources: [{
        id: "resourceForCompleted",
        eventBorderColor: COLORCOMPLETED
      },
      ...belongingResources, ...leadingResources],
      events: [...individualEvents, ...belongingEvents, ...leadingEvents],
      handleWindowResize: true,
      windowResize: function(arg) {
        calendar.updateSize();
      },

      eventClick: function(info) {
        
        axios({
          method: "get",
          url: `${homeurl}/tasks/${info.event.id}`
        }).then((r) => {
          setClickedTask(r.data.data[0])
          setShowTask(true)
        })
        
      },      
    });

    calendar.render();
    
  }, [individualEvents, belongingEvents, leadingEvents]);


  async function __updateTaskIDs() {
    let newIndividualTaskIDs: any = [];
    let newBelongingTaskIDs: any = [];
    let newLeadingTaskIDs: any = [];

    let newBelongingGroupNames: any = [];
    let newLeadingGroupNames: any = [];

    let newBelongingGroupIDs: any = [];
    let newLeadingGroupIDs: any = [];
    
    var resp;
    try {
        resp = await axios({
            method: "get",
            url: `${homeurl}/users?where={"email":"${email}"}`,
        });
    }
    catch (e: any) {
        // @ts-ignore
    }

    let belongingGroups: any;
    let leadingGroups: any;

    if (resp !== undefined) {
      let data = resp.data.data[0];

      // add individual tasks to the list
      data.individualTasks.forEach((element:any) => {
        newIndividualTaskIDs.push(element);
      });

      // console.log("newIndividualTaskIDs", newIndividualTaskIDs);

      belongingGroups = data.belongingGroups;
      leadingGroups = data.leadingGroups;
      setUserID(data._id)
      // console.log("set userID", data._id);
    }

    var resp1;
    var resp2;
    try {
      if (belongingGroups && belongingGroups.length > 0) {
        resp1 = await axios({
          method: "get",
          url: `${homeurl}/groups?where={"_id": {"$in": ${JSON.stringify(belongingGroups)}}}&select={"name": 1, "groupTasks": 1}`
        });
        if (resp1 !== undefined) { 
          resp1.data.data.forEach((element:any) => {
            newBelongingGroupNames.push(element.name);
            newBelongingGroupIDs.push(element._id);
            newBelongingTaskIDs = newBelongingTaskIDs.concat(element.groupTasks);
          });
        }
      }
      if (leadingGroups && leadingGroups.length > 0) {
        resp2 = await axios({
          method: "get",
          url: `${homeurl}/groups?where={"_id": {"$in": ${JSON.stringify(leadingGroups)}}}&select={"name": 1, "groupTasks": 1}`
        });
        if (resp2 !== undefined) { 
          resp2.data.data.forEach((element:any) => {
            // console.log('element.groupName', element.name)
            newLeadingGroupNames.push(element.name);
            newLeadingGroupIDs.push(element._id);
            newLeadingTaskIDs = newLeadingTaskIDs.concat(element.groupTasks);
            // console.log('leading task num', element.groupTasks.length)
            // console.log('element.groupTasks', element.groupTasks)
            // console.log('leading task num', newLeadingGroupTaskNums)
          });
        }
      }
      
    }
    catch (e: any) {
        // @ts-ignore
    }

    // console.log("newIndividualTaskIDs", newIndividualTaskIDs);
    // console.log("newBelongingTaskIDs", newBelongingTaskIDs);
    // console.log("newLeadingTaskIDs", newLeadingTaskIDs);
    // console.log("newLeadingGroupIDs", newLeadingGroupIDs);

    setIndividualTaskIDs(newIndividualTaskIDs);
    setBelongingTaskIDs(newBelongingTaskIDs);
    setLeadingTaskIDs(newLeadingTaskIDs);

    setBelongingGroupNames(newBelongingGroupNames);
    setLeadingGroupNames(newLeadingGroupNames);

    setBelongingGroupIDs(newBelongingGroupIDs);
    setLeadingGroupIDs(newLeadingGroupIDs);

  }

  async function __updateTaskInfo() {
    let newIndividualTaskInfo: any = [];
    let newBelongingTaskInfo: any = [];
    let newLeadingTaskInfo: any = [];

    // setting to empty list each update, seems not solving the problem
    setIndividualEvents([])
    setBelongingEvents([])
    setLeadingEvents([])

    // console.log("IndividualTaskIDs", individualTaskIDs);
    // console.log("BelongingTaskIDs", belongingTaskIDs);
    // console.log("LeadingTaskIDs", leadingTaskIDs);

    try {
      if (individualTaskIDs.length > 0) {
        const response = await axios({
          method: "get",
          url: `${homeurl}/tasks?where={"_id": {"$in": ${JSON.stringify(individualTaskIDs)}}}&select={"name": 1, "description": 1, "endTime": 1, "completed": 1}`
        });
        newIndividualTaskInfo = newIndividualTaskInfo.concat(response.data.data);
        __updateIndividualEvents(newIndividualTaskInfo);
      }
      if (belongingTaskIDs.length > 0) {
        const response = await axios({
          method: "get",
          url: `${homeurl}/tasks?where={"_id": {"$in": ${JSON.stringify(belongingTaskIDs)}}}&select={"name": 1, "description": 1, "endTime": 1, "completed": 1, "assignedGroup": 1, "assignedUsers": 1}`
        });
        newBelongingTaskInfo = newBelongingTaskInfo.concat(response.data.data);
        __updateBelongingGroupEvents(newBelongingTaskInfo);
      }
      if (leadingTaskIDs.length > 0) {
        const response = await axios({
          method: "get",
          url: `${homeurl}/tasks?where={"_id": {"$in": ${JSON.stringify(leadingTaskIDs)}}}&select={"name": 1, "description": 1, "endTime": 1, "completed": 1, "assignedGroup": 1, "assignedUsers": 1}`
        });
        // console.log('response.data.data', response.data.data)
        newLeadingTaskInfo = newLeadingTaskInfo.concat(response.data.data);
        __updateLeadingGroupEvents(newLeadingTaskInfo);
      }
    }
    catch (e: any) {
        // @ts-ignore
    }

    // console.log("newIndividualTaskInfo", newIndividualTaskInfo);
    // console.log("newBelongingTaskInfo", newBelongingTaskInfo);
    // console.log("newLeadingTaskInfo", newLeadingTaskInfo);

    setIndividualTaskInfo(newIndividualTaskInfo);
    setBelongingTaskInfo(newBelongingTaskInfo);
    setLeadingTaskInfo(newLeadingTaskInfo);

  }

  function __updateIndividualEvents(taskInfo: any) {
    let events: any = [];

    taskInfo.forEach((element:any) => {
      // console.log("element", element.name, element.endTime)
      if (element.completed) {
        events.push({
          id: element._id,
          title: element.name,
          start: element.endTime.slice(0, 10),
          classNames: ['completed'],
        })
      } else {
        events.push({
          id: element._id,
          title: element.name,
          start: element.endTime.slice(0, 10),
          classNames: ['pointer'],
        })
      }
    })

    // console.log("individual events", events);
    setIndividualEvents(events);
  }

  function __updateLeadingGroupEvents(taskInfo: any) {
    let resources: any = [];
    let events: any = [];

    let count = 0;

    // console.log("taskinfo", taskInfo)
    // console.log('leadingGroupNames', leadingGroupNames)

    leadingGroupIDs.forEach((element:any) => {
      resources.push({
        id: element,
        eventColor: COLORSLEADING[(count)]
      })
      count ++;
    });

    ////////////////////// TODO: set completed task style
    taskInfo.forEach((element:any) => {
      if (element.assignedUsers[0] === userID) {
        if (element.completed) {
          events.push({
            id: element._id,
            title: element.name,
            resourceIds: [element.assignedGroup],
            start: element.endTime.slice(0, 10),
            classNames: ['completed', 'pointer'],
          })
        } else {
          events.push({
            id: element._id,
            title: element.name,
            resourceIds: [element.assignedGroup],
            start: element.endTime.slice(0, 10),
            classNames: ['pointer'],
          })
        }
      }
    });

    setLeadingResources(resources)
    setLeadingEvents(events)

  }

  function __updateBelongingGroupEvents(taskInfo: any) {
    let resources: any = [];
    let events: any = [];

    let count = 0;

    belongingGroupIDs.forEach((element:any) => {
      resources.push({
        id: element,
        eventColor: COLORSBELONGING[(count)]
      })
      count ++;
    });

    taskInfo.forEach((element:any) => {
      if (element.assignedUsers[0] === userID) {
        if (element.completed) {
          events.push({
            id: element._id,
            title: element.name,
            resourceIds: [element.assignedGroup],
            start: element.endTime.slice(0, 10),
            classNames: ['completed', 'pointer'],
          })
        } else {
          events.push({
            id: element._id,
            title: element.name,
            resourceIds: [element.assignedGroup],
            start: element.endTime.slice(0, 10),
            classNames: ['pointer'],
          })
        }
      }
    });

    setBelongingResources(resources)
    setBelongingEvents(events)

  }
  
  return (
    <>
      <div id='calendar'></div>
      <TaskModal show={showTask} handleClose={handleCloseTask} data={clickedTask} toggledComplete={toggledComplete} setToggledComplete={setToggledComplete}/>
    </>
  );
};

  export default Monthly;