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

    async function changeTask() {
        // @ts-ignore
        var taskName = (document.getElementById("new-task-name-calendar") ? document.getElementById("new-task-name-calendar").value : "");
        // @ts-ignore
        var taskDescription = (document.getElementById("new-task-description-calendar") ? document.getElementById("new-task-description-calendar").value : "");
        // @ts-ignore
        var taskDeadline = (document.getElementById("new-task-endtime-calendar") ? document.getElementById("new-task-endtime-calendar").value : "");
        // @ts-ignore
        var taskStatus = (document.getElementById("new-task-status-calendar") ? document.getElementById("new-task-status-calendar").value : "");
        taskStatus = taskStatus === "complete" ? true : false;
        var requestBody = {
            'name': taskName,
            'description': taskDescription,
            'endTime': taskDeadline,
            'completed': taskStatus
        };
        try {
            await axios({
                method: "put",
                url: `${homeurl}/tasks/${data._id}`,
                data: requestBody
            });
            props.setToggledComplete(!props.toggledComplete);
            props.handleClose()
        }
        catch (e) {
            console.log(e);
            props.handleClose()
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
                    <Form.Control
                        placeholder="Task Name"
                        autoFocus
                        defaultValue= {data.name || ""}
                        id = "new-task-name-calendar"
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Task Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Task Description"
                        defaultValue={data.description || ""}
                        id = "new-task-description-calendar"
                    />
                </Form.Group>

                {data.endTime &&
                    <Form.Group className="mb-3">
                        <Form.Label>Task Deadline</Form.Label>
                        <Form.Control type="date" id='new-task-endtime-calendar' defaultValue={data.endTime.slice(0, 10) || ""}/>
                    </Form.Group>
                }

                <Form.Group className="mb-3">
                    <Form.Label>Task Status</Form.Label>
                            {/*{data.completed ? "Completed" : "Not completed"}*/}
                            {/*{data.endTime}*/}
                            <Form.Select aria-label="Default select example" id="new-task-status-calendar" defaultValue={data.completed ? "complete" : "incomplete"}>
                                <option key={"complete"} value={"complete"}>Complete</option>
                                <option key={"incomplete"} value={"incomplete"}>Incomplete</option>
                            </Form.Select>
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
            <Button variant="primary" onClick={changeTask}>
                {/*{data.completed ? "Not Completed" : "Completed"}*/}
                Save Changes
            </Button>
            <Button variant="secondary" onClick={props.handleClose}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>}
    </>
    )
}