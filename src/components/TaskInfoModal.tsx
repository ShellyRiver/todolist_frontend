import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import {useEffect, useState} from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import {updateUser} from "./updateUser";
const homeurl = 'https://grouptodos.herokuapp.com/api'

export default function TaskInfoModal(props: any) {
    const data = props.data;
    const userName = localStorage.getItem("user") || "";
    const userJSON = JSON.parse(userName);
    const [groupInfo, setGroupInfo] = useState({
        name: undefined
    });

    async function clickOK () {
        /* Delete the task from the unread task */
        try {
            await axios({
                method: "patch",
                url: `${homeurl}/users/${userJSON._id}`,
                data: {
                    'unreadTasks': data._id,
                    'operation': 'remove'
                }
            });
            await updateUser(props.handleReload);
            props.handleClose();
        }
        catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        /* Only run the function is props.show is true */
        if (props.show === true) {
            if (data.assignedGroup) {
                axios({
                    method: "get",
                    url: `${homeurl}/groups/${data.assignedGroup}`
                }).then((r) => {
                    setGroupInfo(r.data.data[0]);
                })
            }
        }
    }, [props.show])

    return (<>{data.name &&
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

                {data.startTime &&
                    <Form.Group className="mb-3">
                        <Form.Label>Task Start Time</Form.Label>
                        <ListGroup>
                            <ListGroup.Item>
                                {data.startTime.slice(0, 10)}
                                {/*{data.endTime}*/}
                            </ListGroup.Item>
                        </ListGroup>
                    </Form.Group>
                }

                <Form.Group className="mb-3">
                    <Form.Label>Task Deadline</Form.Label>
                    <ListGroup>
                        <ListGroup.Item>
                            {data.endTime.slice(0, 10)}
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
            <Button variant="primary" onClick={clickOK}>
                OK
            </Button>
        </Modal.Footer>
    </Modal>}
    </>
    )
}