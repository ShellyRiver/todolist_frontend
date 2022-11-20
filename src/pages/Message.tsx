import React, { useEffect, useState } from 'react';

import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

let messages = ["message1", "message2", "message3"];

function Message() {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  const [componentList, setComponentList] = useState([]);

  useEffect(() => {
    __updateComponent();
  }, [])  // TODO: add dependency?

  const [messageIdx, setMessageIdx] = useState(0);

  function __updateComponent() {
    let newComponentList: any = [];
    for (let i = 0; i < messages.length; i ++) {
      newComponentList.push(
        <div key={i}>
          <ListGroup.Item action onClick={() => {
            setMessageIdx(i);
            setShow(true);
          }}>
            {messages[i]}
          </ListGroup.Item>
        </div>
      );
    }
    setComponentList(newComponentList);
  }

  return (
    <>
      <h1>Incoming Messages</h1>
      <ListGroup>
        {componentList}
      </ListGroup>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {messages[messageIdx]}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Decline
          </Button>
          <Button variant="primary">
            Accept
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
  
export default Message;