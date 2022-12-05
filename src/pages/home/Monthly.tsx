import ListGroup from 'react-bootstrap/ListGroup';

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
import adaptivePlugin from '@fullcalendar/adaptive';

import axios from "axios";


const COLORSLEADING = ['rgb(7,140,190)', 'rgb(255,179,255)', 'rgb(77,77,255)', 'rgb(255,77,106)', 'rgb(255,166,77)', 'rgb(196,255,77)', 'rgb(0,128,153)', 'rgb(0,153,51)', 'rgb(255,230,102)']
const COLORSBELONGING = ['rgb(161,206,230)', 'rgb(165,165,235)', 'rgb(210,181,207)', 'rgb(235,165,176)', 'rgb(230,168,138)', 'rgb(230,204,165)', 'rgb(151,227,136)', 'rgb(138,230,184)']
const COLORCOMPLETED = 'rgb(163,163,163)'

let taskIdsUpdated = 0;
let taskInfoUpdated = 0;

// date list: should change based today's date and week
// represent by date difference
// should be updated everyday
                // Sun Mon Tue Wed Thu Fri Sat
let dates: any = [[-19,-18,-17,-16,-15,-14,-13],
                  [-12,-11,-10, -9, -8, -7, -6],
                  [ -5, -4, -3, -2, -1,  0,  1],
                  [  2,  3,  4,  5,  6,  7,  8],
                  [  9, 10, 11, 12, 13, 14, 15]];
// display tasks for the month of "today"
let today: any = Date.now();

const homeurl = 'http://localhost:4000/api'

function Monthly() {
  let belongingGroupNames = [];
  let leadingGroupNames = [];

  const email = localStorage.getItem("email");
  
  const [componentList, setComponentList] = useState([]);

  const [individualTaskIDs, setIndividualTaskIDs] = useState([]);
  const [belongingTaskIDs, setBelongingTaskIDs] = useState([]);
  const [leadingTaskIDs, setLeadingTaskIDs] = useState([]);
  const [individualTaskInfo, setIndividualTaskInfo] = useState([]);
  const [belongingTaskInfo, setBelongingTaskInfo] = useState([]);
  const [leadingTaskInfo, setLeadingTaskInfo] = useState([]);

  const [calendarResources, setCalendarResources] = useState<any>([]);
  const [calendarEvents, setCalendarEvents] = useState<any>([]);


  useEffect(() => {
    __updateTaskIDs();
    console.log("useeffect-update task ids")
    // __updateTaskInfo();
  }, [])  // TODO: add dependency?


  useEffect(() => {
    __updateTaskInfo();
  }, [individualTaskIDs, belongingTaskIDs, leadingTaskIDs])  // TODO: add dependency?

  useEffect(()=>{
    
    console.log("resources, events", calendarResources, calendarEvents)

    var calendarEl = document.getElementById('calendar')!;

    // @ts-ignore
    var calendar = new Calendar(calendarEl, {
      schedulerLicenseKey: 'CC-Attribution-NonCommercial-NoDerivatives',
      plugins: [ interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin, resourceTimelinePlugin ],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'resourceTimelineDay, dayGridMonth,listWeek'  // timeGridWeek,timeGridDay,
      },
      initialDate: '2022-12-08',
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      dayMaxEvents: true, // allow "more" link when too many events
      resources: calendarResources,
      events: calendarEvents
      // resources: [
      //   {
      //     id: 'completed',
      //     eventColor: COLORCOMPLETED
      //   },
      //   {
      //     id: 'a',
      //     title: 'Room A',
      //     eventColor: 'rgb(255,0,0)'
      //   },
      //   {
      //     id: 'b',
      //     title: 'Room B'
      //   }
      // ],
      // events: [
      //   {
      //     id: 't1',
      //     title: 'All Day Event',
      //     resourceIds: ['a'],
      //     start: '2022-12-07',
      //   },
      //   {
      //     title: 'Long Event',
      //     start: '2022-12-08',
      //     end: '2022-12-08'
      //   },
      //   {
      //     title: 'Repeating Event',
      //     start: '2022-12-08T16:00:00'
      //   },
      //   {
      //     title: 'Repeating Event',
      //     start: '2022-12-08T16:00:00'
      //   },
      //   {
      //     title: 'Conference',
      //     start: '2022-12-08',
      //     end: '2022-12-08'
      //   },
      //   {
      //     title: 'Meeting',
      //     start: '2022-12-08T10:30:00',
      //     end: '2022-12-08T12:30:00'
      //   },
      //   {
      //     title: 'Lunch',
      //     resourceIds: ['a'],
      //     start: '2022-12-08T12:00:00'
      //   },
      //   {
      //     title: 'Meeting',
      //     start: '2022-12-08T14:30:00'
      //   },
      //   {
      //     title: 'Happy Hour',
      //     start: '2022-12-08T17:30:00'
      //   },
      //   {
      //     title: 'Dinner',
      //     start: '2022-12-08T20:00:00'
      //   },
      //   {
      //     title: 'Birthday Party',
      //     start: '2022-12-08T07:00:00'
      //   },
        
      // ]
    });

    // __updateTaskIDs();
    
    // __updateEvents(calendar);

    calendar.render();
    
    
  }, [calendarEvents]);

  useEffect(() => {
    __updateComponent();
  }, [])  // TODO: add dependency?

  // useEffect(() => {
  //   __updateTaskIDs();
  //   __updateTaskInfo();
  //   __updateEvents();
  // }, [])  // TODO: add dependency?

  async function __updateTaskIDs() {
    let newIndividualTaskIDs: any = [];
    let newBelongingTaskIDs: any = [];
    let newLeadingTaskIDs: any = [];
    
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
    }

    // console.log("log Groups", belongingGroups, leadingGroups)

    // // add belonging and leading group task ids
    // if (belongingGroups && belongingGroups.length > 0) {
    //   axios({
    //     method: "get",
    //     url: `${homeurl}/groups?where={"_id": {"$in": ${JSON.stringify(belongingGroups)}}}&select={"name": 1, "groupTasks": 1, "_id": 0}`
    //   }).then((r) => {
    //     // console.log("log res", r.data.data)
    //     r.data.data.forEach((element:any) => {
    //       belongingGroupNames.push(element.groupName);
    //       newBelongingTaskIDs.push(element.groupTasks);
    //     });
    //   })
    // }

    var resp1;
    var resp2;
    try {
      resp1 = await axios({
        method: "get",
        url: `${homeurl}/groups?where={"_id": {"$in": ${JSON.stringify(belongingGroups)}}}&select={"name": 1, "groupTasks": 1, "_id": 0}`
      });
      resp2 = await axios({
        method: "get",
        url: `${homeurl}/groups?where={"_id": {"$in": ${JSON.stringify(leadingGroups)}}}&select={"name": 1, "groupTasks": 1, "_id": 0}`
      });
    }
    catch (e: any) {
        // @ts-ignore
    }

    if (resp1 !== undefined) { 
      resp1.data.data.forEach((element:any) => {
        belongingGroupNames.push(element.groupName);
        newBelongingTaskIDs.push(element.groupTasks);
      });
    }
    if (resp2 !== undefined) { 
      resp2.data.data.forEach((element:any) => {
        leadingGroupNames.push(element.groupName);
        newLeadingTaskIDs.push(element.groupTasks);
      });
    }

    // if (leadingGroups && leadingGroups.length > 0) {
    //   axios({
    //     method: "get",
    //     url: `${homeurl}/groups?where={"_id": {"$in": ${JSON.stringify(leadingGroups)}}}&select={"name": 1, "groupTasks": 1, "_id": 0}`
    //   }).then((r) => {
    //     // console.log("log res", r.data.data)
    //     r.data.data.forEach((element:any) => {
    //       leadingGroupNames.push(element.groupName);
    //       newLeadingTaskIDs.push(element.groupTasks);
    //     });
    //   })
    // }

    // console.log("newIndividualTaskIDs", newIndividualTaskIDs);
    // console.log("newBelongingTaskIDs", newBelongingTaskIDs);
    // console.log("newLeadingTaskIDs", newLeadingTaskIDs);

    setIndividualTaskIDs(newIndividualTaskIDs);
    setBelongingTaskIDs(newBelongingTaskIDs);
    setLeadingTaskIDs(newLeadingTaskIDs);

    taskIdsUpdated ++;
  }

  async function __updateTaskInfo() {
    console.log("call __updateTaskInfo")
    let newIndividualTaskInfo: any = [];
    let newBelongingTaskInfo: any = [];
    let newLeadingTaskInfo: any = [];

    // console.log("IndividualTaskIDs", individualTaskIDs);
    // console.log("BelongingTaskIDs", belongingTaskIDs);
    // console.log("LeadingTaskIDs", leadingTaskIDs);

    // if (individualTaskIDs && individualTaskIDs.length > 0) {
    //   axios({
    //     method: "get",
    //     url: `${homeurl}/tasks?where={"_id": {"$in": ${JSON.stringify(individualTaskIDs)}}}&select={"name": 1, "description": 1, "endTime": 1, "completed": 1, "_id": 0}`
    //   }).then((r) => {
    //     console.log("individual log res", r.data.data)
    //     newIndividualTaskInfo = newIndividualTaskInfo.concat(r.data.data);
    //     console.log("aaaaaaaaanewIndividualTaskInfo", newIndividualTaskInfo);
    //   })
    // }
    // if (belongingTaskIDs && belongingTaskIDs.length > 0) {
    //   belongingTaskIDs.forEach((group) => {
    //     axios({
    //       method: "get",
    //       url: `${homeurl}/tasks?where={"_id": {"$in": ${JSON.stringify(group)}}}&select={"name": 1, "description": 1, "endTime": 1, "completed": 1, "_id": 0}`
    //     }).then((r) => {
    //       console.log("belonging log res", r.data.data)
    //       newBelongingTaskInfo.push(r.data.data);
    //     })
    //   });
    // }
    // console.log("??????????????LeadingTaskIDs", leadingTaskIDs);
    // console.log("??????????????LeadingTaskIDs", leadingTaskIDs.length);
    // if (leadingTaskIDs && leadingTaskIDs.length > 0) {
    //   leadingTaskIDs.forEach((group) => {
    //     console.log("leading group", group)
    //     axios({
    //       method: "get",
    //       url: `${homeurl}/tasks?where={"_id": {"$in": ${JSON.stringify(group)}}}&select={"name": 1, "description": 1, "endTime": 1, "completed": 1, "_id": 0}`
    //     }).then((r) => {
    //       console.log("leading log res", r.data.data)
    //       newLeadingTaskInfo.push(r.data.data);
    //     })
    //   });
    // }
  
    // var resp1;
    // var resp2: any = [];
    // var resp3: any = [];
    try {
      if (individualTaskIDs.length > 0) {
        const response = await axios({
          method: "get",
          url: `${homeurl}/tasks?where={"_id": {"$in": ${JSON.stringify(individualTaskIDs)}}}&select={"name": 1, "description": 1, "endTime": 1, "completed": 1, "_id": 0}`
        });
        newIndividualTaskInfo = newIndividualTaskInfo.concat(response.data.data);
        __updateIndividualEvents(newIndividualTaskInfo);
      }
      belongingTaskIDs.forEach(async (group:any) => {
        if (group.length > 0) {
          const response = await axios({
            method: "get",
            url: `${homeurl}/tasks?where={"_id": {"$in": ${JSON.stringify(group)}}}&select={"name": 1, "description": 1, "endTime": 1, "completed": 1, "_id": 0}`
          })
          newBelongingTaskInfo.push(response.data.data);
          __updateGroupEvents(response.data.data, COLORSBELONGING, belongingGroupCount);
        }
        
      })
      leadingTaskIDs.forEach(async (group:any) => {
        // console.log("leading group", group)
        if (group.length > 0) {
          const response = await axios({
            method: "get",
            url: `${homeurl}/tasks?where={"_id": {"$in": ${JSON.stringify(group)}}}&select={"name": 1, "description": 1, "endTime": 1, "completed": 1, "_id": 0}`
          })
          newLeadingTaskInfo.push(response.data.data);
          __updateGroupEvents(response.data.data, COLORSLEADING, leadingGroupCount);
        }
      })
    }
    catch (e: any) {
        // @ts-ignore
    }


    // if (resp1 !== undefined) { 
    //   // console.log("individual log res", resp1.data.data)
    //   newIndividualTaskInfo = newIndividualTaskInfo.concat(resp1.data.data);
    // }
    // if (resp2 && resp2.length > 0) { 
    //   resp2.forEach((element:any) => {
    //     console.log("belonging log res", element.data.data)
    //     newBelongingTaskInfo.push(element.data.data);
    //   });
    // }
    // if (resp3 && resp3.length > 0) { 
    //   resp3.forEach((element:any) => {
    //     console.log("leading log res", element.data.data)
    //     newLeadingTaskInfo.push(element.data.data);
    //   });
    // }


    // console.log("newIndividualTaskInfo", newIndividualTaskInfo);
    // console.log("newBelongingTaskInfo", newBelongingTaskInfo);
    // console.log("newLeadingTaskInfo", newLeadingTaskInfo);

    setIndividualTaskInfo(newIndividualTaskInfo);
    setBelongingTaskInfo(newBelongingTaskInfo);
    setLeadingTaskInfo(newLeadingTaskInfo);

    taskInfoUpdated ++;
  }

  function __updateIndividualEvents(taskInfo: any) {
    let events: any = [];

    taskInfo.forEach((element:any) => {
      // console.log("element", element.name, element.endTime)
      events.push({
        title: element.name,
        start: element.endTime.slice(0, 10)
      })
    })

    console.log("events", events);
    setCalendarEvents([...calendarEvents, ...events]);
  }

  let belongingGroupCount = 0;
  let leadingGroupCount = 0;

  function __updateGroupEvents(taskInfo: any, colors: any, count: number) {
    let resources: any = [];
    let events: any = [];

    // console.log("taskinfo", taskInfo.length)
    // console.log([count.toString()])

    resources.push({
      id: (count).toString(),
      title: (count).toString(),
      eventColor: colors[(count)]
    })
    
    taskInfo.forEach((element:any) => {
      console.log("taskinfo element", element)
      events.push({
        id: element.name,
        title: element.name,
        resourceIds: [count.toString()],
        start: element.endTime.slice(0, 10),
      })
      
    });
    count ++;
    setCalendarResources([...calendarResources, ...resources])
    setCalendarEvents([...calendarEvents, ...events]);
  }
  

  // update all date boxes
  function __updateComponent() {
    let newComponentList: any = [];
    for (let i in dates) {
      let listGroupRowComponent: any = [];
      for (let j in dates[i]) {
        listGroupRowComponent.push(
          <div key={j} className='dateBox'>
            {DateBox(dates[i][j])}
          </div>
        );
      }
      newComponentList.push(
        <ListGroup horizontal className='listGroupRow' key={dates[i]}>
          {listGroupRowComponent}
        </ListGroup>
      );
    }

    setComponentList(newComponentList);
  }
  
  return (
    <>
      <ListGroup horizontal className='weekTitles'>
        <ListGroup.Item className='weekTitlesBox'>Sun</ListGroup.Item>
        <ListGroup.Item className='weekTitlesBox'>Mon</ListGroup.Item>
        <ListGroup.Item className='weekTitlesBox'>Tue</ListGroup.Item>
        <ListGroup.Item className='weekTitlesBox'>Wed</ListGroup.Item>
        <ListGroup.Item className='weekTitlesBox'>Thu</ListGroup.Item>
        <ListGroup.Item className='weekTitlesBox'>Fri</ListGroup.Item>
        <ListGroup.Item className='weekTitlesBox'>Sat</ListGroup.Item>
      </ListGroup>
      <ListGroup className='listGroupCol'>
        {componentList}
      </ListGroup>
      <div id='calendar'></div>
    </>
  );
};

// date box that displays tasks of that day
function DateBox(difference: number) {
  // TODO: get target day's date based on difference in days
  // return: a date, can be used to obtain target day's tasks
  function __getDate(difference: number) {
    let date: number = today;
    return date;
  }
  
  let targetDate = __getDate(difference);
  // TODO: obtain a list of task names based on target date
  let taskNames: string[] = ["CS 409 prototype", "Paper Reading"];

  let taskComponent: any = [];

  for (let i in taskNames) {
    let taskName: string = taskNames[i];
    taskComponent.push(
      <p key={taskName+i}>{taskName}</p>  // TODO: display complete, toggle complete
    );
  }

  return (
    <ListGroup.Item>
      {/* <p>{today}</p>   // TODO: display today's date  */}
      {taskComponent}
    </ListGroup.Item>
  );
}



// TODO: update the date list dates based on today's date and week
function updateDateList() {
  
}
  

  export default Monthly;