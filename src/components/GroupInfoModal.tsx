import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import React from "react";

export default function GroupInfoModal(props: any) {
    const data = props.data;
    console.log(data);
    if (data.members) {
        console.log(data.members[0])
    }
    return (<>
            <Modal show={props.show} onHide={props.handleCloseGroupInfo}>
        <Modal.Header closeButton>
            <Modal.Title>Group Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Group Name</Form.Label>
                    <ListGroup>
                        <ListGroup.Item>
                            {data.name}
                        </ListGroup.Item>
                    </ListGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Group Description</Form.Label>
                    <ListGroup>
                        <ListGroup.Item>
                            {data.description}
                        </ListGroup.Item>
                    </ListGroup>
                </Form.Group>

                {data.leaders && data.leaders.length > 0 &&
                    <Form.Group className="mb-3">
                        <Form.Label>Group Leader(s)</Form.Label>
                        <ListGroup>
                            {data.leaders.map((leader:any, index:number) => <ListGroup.Item key={index}>{leader}</ListGroup.Item>)}
                        </ListGroup>
                    </Form.Group>
                }

                {data.members && data.members.length > 0 &&
                    <Form.Group className="mb-3">
                        <Form.Label>Group Member(s)</Form.Label>
                        <ListGroup>
                            {data.members.map((member:any, index:number) => <ListGroup.Item key={index}>{member}</ListGroup.Item>)}
                        </ListGroup>
                    </Form.Group>
                }
            </Form>
        </Modal.Body>
    </Modal>
        </>
    )
}