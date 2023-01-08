import {useEffect} from 'react';
import {useState} from 'react';
import './Monthly.css'
import {Calendar} from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import resourceTimelinePlugin from '@fullcalendar/resource-timeline';
import axios from "axios";
import TaskModal from "./TaskModal";
const COLORSLEADING = ['rgb(255,77,106)', 'rgb(7,160,195)', 'rgb(220,120,220)', 'rgb(107,100,190)', 'rgb(255,166,77)', 'rgb(100,100,100)', 'rgb(0,128,153)', 'rgb(0,153,51)', 'rgb(20,10,92)', 'rgb(51,0,153)', 'rgb(0,102,100)', 'rgb(100,32,102)', 'rgb(85,128,0)', 'rgb(128,85,0)', 'rgb(70,0,1)', 'rgb(93,138,168)']
const COLORSBELONGING = ['rgb(161,206,230)', 'rgb(165,165,235)', 'rgb(200,201,50)', 'rgb(220,165,176)', 'rgb(20,88,20)', 'rgb(90,150,150)', 'rgb(151,227,136)', 'rgb(138,230,184)', 'rgb(13,201,235)', 'rgb(255,238,153)', 'rgb(235,187,153)', 'rgb(255,199,221)', 'rgb(188,196,191)']
const INDIVIDUAL = 'rgba(77,136,255,0.8)'
const WHITE = 'rgb(255,255,255)'
const homeurl = 'https://grouptodos.herokuapp.com/api'

function Monthly(props: any) {
  const email = localStorage.getItem("email");
  const [userID, setUserID] = useState(undefined);
  const [individualTaskIDs, setIndividualTaskIDs] = useState([]);
  const [belongingTaskIDs, setBelongingTaskIDs] = useState([]);
  const [leadingTaskIDs, setLeadingTaskIDs] = useState([]);
  const [belongingResources, setBelongingResources] = useState<any>([]);
  const [leadingResources, setLeadingResources] = useState<any>([]);
  const [individualEvents, setIndividualEvents] = useState<any>([]);
  const [belongingEvents, setBelongingEvents] = useState<any>([]);
  const [leadingEvents, setLeadingEvents] = useState<any>([]);
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
        id: "resourceIndividual",
        eventColor: INDIVIDUAL
      }, ...belongingResources, ...leadingResources],
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
      belongingGroups = data.belongingGroups;
      leadingGroups = data.leadingGroups;
      setUserID(data._id)
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
            newLeadingGroupNames.push(element.name);
            newLeadingGroupIDs.push(element._id);
            newLeadingTaskIDs = newLeadingTaskIDs.concat(element.groupTasks);
          });
        }
      }
      
    }
    catch (e: any) {
        // @ts-ignore
    }
    setIndividualTaskIDs(newIndividualTaskIDs);
    setBelongingTaskIDs(newBelongingTaskIDs);
    setLeadingTaskIDs(newLeadingTaskIDs);
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
        newLeadingTaskInfo = newLeadingTaskInfo.concat(response.data.data);
        __updateLeadingGroupEvents(newLeadingTaskInfo);
      }
    }
    catch (e: any) {
        // @ts-ignore
    }
  }

  function __updateIndividualEvents(taskInfo: any) {
    let events: any = [];

    taskInfo.forEach((element:any) => {
      if (element.completed) {
        events.push({
          id: element._id,
          title: element.name,
          start: element.endTime.slice(0, 10),
          resourceIds: ["resourceIndividual"],
          classNames: ['completed'],
        })
      } else {
        events.push({
          id: element._id,
          title: element.name,
          start: element.endTime.slice(0, 10),
          resourceIds: ["resourceIndividual"],
          classNames: ['pointer'],
        })
      }
    })
    setIndividualEvents(events);
  }

  function __updateLeadingGroupEvents(taskInfo: any) {
    let resources: any = [];
    let events: any = [];
    let count = 0;
    leadingGroupIDs.forEach((element:any) => {
      resources.push({
        id: element,
        eventBorderColor: COLORSLEADING[(count) % COLORSLEADING.length],
        eventBackgroundColor: WHITE,
        eventTextColor: COLORSLEADING[(count) % COLORSLEADING.length],
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
        eventBorderColor: COLORSBELONGING[(count) % COLORSBELONGING.length],
        eventBackgroundColor: WHITE,
        eventTextColor: COLORSBELONGING[(count) % COLORSBELONGING.length],
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