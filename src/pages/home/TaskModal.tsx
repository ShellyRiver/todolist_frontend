import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import React, {useEffect, useState} from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";

const homeurl = 'https://grouptodos.herokuapp.com/api'

export default function TaskInfoModal(props: any) {
    const data = props.data;
    const [groupInfo, setGroupInfo] = useState({
        name: undefined,
    });

    async function clickComplete () {
        /* set completed to true */
        try {
            if (data.completed) {
                await axios({
                    method: "put",
                    url: `${homeurl}/tasks/${data._id}`,
                    data: {
                        'completed': false,
                    }
                });
            } else {
                await axios({
                    method: "put",
                    url: `${homeurl}/tasks/${data._id}`,
                    data: {
                        'completed': true,
                    }
                });
            }
            props.handleClose()
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        /* Only run the function is props.show is true */
        if (data.assignedGroup) {
            if (props.show === true) {
                axios({
                    method: "get",
                    url: `${homeurl}/groups/${data.assignedGroup}`
                }).then((r) => {
                    setGroupInfo(r.data.data[0]);
                })
            }
        }
    }, [props.show])

    return (<>{
    <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Task Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Task Name</Form.Label>
                    <ListGroup>
                        <ListGroup.Item>
                            {data.name}
                        </ListGroup.Item>
                    </ListGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Task Description</Form.Label>
                    <ListGroup>
                        <ListGroup.Item>
                            {data.description}
                        </ListGroup.Item>
                    </ListGroup>
                </Form.Group>

                {data.endTime &&
                    <Form.Group className="mb-3">
                        <Form.Label>Task Deadline</Form.Label>
                        <ListGroup>
                            <ListGroup.Item>
                                {data.endTime.slice(0, 10)}
                                {/*{data.endTime}*/}
                            </ListGroup.Item>
                        </ListGroup>
                    </Form.Group>
                }

                <Form.Group className="mb-3">
                    <Form.Label>Task Status</Form.Label>
                    <ListGroup>
                        <ListGroup.Item>
                            {data.completed ? "Completed" : "Not completed"}
                            {/*{data.endTime}*/}
                        </ListGroup.Item>
                    </ListGroup>
                </Form.Group>

                {groupInfo.name &&
                    <Form.Group className="mb-3">
                        <Form.Label>Task Group</Form.Label>
                        <ListGroup>
                            <ListGroup.Item>
                                {groupInfo.name}
                            </ListGroup.Item>
                        </ListGroup>
                    </Form.Group>
                }
            </Form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={clickComplete}>
                {data.completed ? "Not Completed" : "Completed"}
            </Button>
            <Button variant="secondary" onClick={props.handleClose}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>}
    </>
    )
}