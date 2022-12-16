import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import {useEffect, useState} from "react";
import axios from "axios";
import './UserInfoModal.css';
const homeurl = 'https://grouptodos.herokuapp.com/api'


export default function UserInfoModal(props: any) {
    const [userInfo, setUserInfo] = useState({
        name: undefined,
        description: undefined,
        email: undefined,
        image: undefined
    });

    useEffect(() => {
        /* Only run the function is props.show is true */
        if (props.show === true) {
            axios({
                method: "get",
                url: `${homeurl}/users/${props.id}`
            }).then((r) => {
                setUserInfo(r.data.data[0]);
            })
        }
    }, [props.show])

    return (<>
    <Modal show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>User Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <div className='info-container-modal'>
                    <div className="image-container-modal">
                        {userInfo.image &&
                            <img src={`data:image/jpeg;base64,${userInfo.image}`} />
                        }
                    </div>
                    <div className='name-container-modal'>
                        <Form.Group className="mb-3">
                            {/*<Form.Label>User Name</Form.Label>*/}
                            <ListGroup>
                                <ListGroup.Item className='name-item-modal'>
                                    Name: {userInfo.name}
                                </ListGroup.Item>
                            </ListGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            {/*<Form.Label>User Email</Form.Label>*/}
                            <ListGroup>
                                <ListGroup.Item>
                                    Email: {userInfo.email}
                                </ListGroup.Item>
                            </ListGroup>
                        </Form.Group>
                    </div>
                </div>

                {userInfo.description && <Form.Group className="mb-3">
                    <Form.Label>Personal Description</Form.Label>
                    <ListGroup>
                        <ListGroup.Item>
                            {userInfo.description}
                        </ListGroup.Item>
                    </ListGroup>
                </Form.Group>}
            </Form>
        </Modal.Body>
    </Modal>
        </>
    )
}