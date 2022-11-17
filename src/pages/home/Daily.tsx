import ListGroup from 'react-bootstrap/ListGroup';

import React, { useEffect } from 'react';
import { useState } from 'react';

let today: any = Date.now();

function Daily() {

  const [componentList, setComponentList] = useState([]);

  useEffect(() => {
    __updateComponent();
  }, [])  // TODO: add dependency?

  function __updateComponent() {
    let newComponentList: any = [];
    let tasks: any = [
      {name: "CS 409 prototype", description: "This is CS 409 prototype, a homework for CS 409", group: "CS 409 final project"},
      {name: "paper reading", description: "Read the paper: why people often feel sleepy 4 hours before the time going to sleep", group: "Personal tasks"}
    ];

    for (let i in tasks) {
      newComponentList.push(
        <ListGroup.Item className='taskItem' key={'task'+i}>
          <p>{tasks[i].name}</p>
          <p>{tasks[i].group}</p>
          <p>{tasks[i].description}</p>
        </ListGroup.Item>
      );
    }

    setComponentList(newComponentList);
  }

  return (
    <>
      <ListGroup className='taskBox'>
        {componentList}
      </ListGroup>
    </>
  );
};
  
export default Daily;