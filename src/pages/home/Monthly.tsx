import ListGroup from 'react-bootstrap/ListGroup';

import React, { useEffect } from 'react';
import { useState } from 'react';

import './Monthly.css'
// import '../../components/canlendar';
import {Calendar} from "@fullcalendar/core";
import interactionPlugin from "@fullcalendar/interaction";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";


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

function Monthly() {
  
  const [componentList, setComponentList] = useState([]);

  useEffect(()=>{
    var calendarEl = document.getElementById('calendar');

    // @ts-ignore
    var calendar = new Calendar(calendarEl, {
      plugins: [ interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin ],
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      initialDate: '2018-01-12',
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      dayMaxEvents: true, // allow "more" link when too many events
      events: [
        {
          title: 'All Day Event',
          start: '2018-01-01',
        },
        {
          title: 'Long Event',
          start: '2018-01-07',
          end: '2018-01-10'
        },
        {
          groupId: 999,
          title: 'Repeating Event',
          start: '2018-01-09T16:00:00'
        },
        {
          groupId: 999,
          title: 'Repeating Event',
          start: '2018-01-16T16:00:00'
        },
        {
          title: 'Conference',
          start: '2018-01-11',
          end: '2018-01-13'
        },
        {
          title: 'Meeting',
          start: '2018-01-12T10:30:00',
          end: '2018-01-12T12:30:00'
        },
        {
          title: 'Lunch',
          start: '2018-01-12T12:00:00'
        },
        {
          title: 'Meeting',
          start: '2018-01-12T14:30:00'
        },
        {
          title: 'Happy Hour',
          start: '2018-01-12T17:30:00'
        },
        {
          title: 'Dinner',
          start: '2018-01-12T20:00:00'
        },
        {
          title: 'Birthday Party',
          start: '2018-01-13T07:00:00'
        },
        {
          title: 'Click for Google',
          url: 'http://google.com/',
          start: '2018-01-28'
        }
      ]
    });
    calendar.render();
  }, []);

  useEffect(() => {
    __updateComponent();
  }, [])  // TODO: add dependency?

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