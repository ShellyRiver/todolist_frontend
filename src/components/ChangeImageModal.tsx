import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import axios from "axios";
import React, {useState} from "react";
import Button from 'react-bootstrap/Button';
import './ChangeImageModal.css';
import {updateUser} from "./updateUser";


const homeurl = 'https://grouptodos.herokuapp.com/api'

export default function ChangeImageModal(props: any) {
    const data = props.data;
    const [showPreview, setShowPreview] = useState(false);
    function changePreview() {
        // @ts-ignore
        const newImage = document.getElementById("new-profile-image").files[0];
        const windowURL = window.URL || window.webkitURL;
        const img = document.getElementById('preview');　　
        if(newImage) {　　
            const dataURl = windowURL.createObjectURL(newImage);
            // @ts-ignore
            img.setAttribute('src',dataURl);
            setShowPreview(true);
        }
    }

    async function changeImage() {
        // @ts-ignore
        const newImage = document.getElementById("new-profile-image").files;
        console.log(newImage);
        const requestBody = new FormData();
        requestBody.append('image', newImage[0]);
        console.log(requestBody);
        /* Update the profile to the backend database */
        try {
            await axios({
                method: "put",
                url: `${homeurl}/users/upload/${props.data._id}`,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: requestBody
            });
        }
        catch (e) {
            // console.log(e);
            props.handleClose();
        }
        updateUser(props.setReload);
        setShowPreview(false);
        props.handleClose();
    }
    // @ts-ignore
    return (
        <>
            <Modal show={props.show} onHide={()=>{setShowPreview(false); props.handleClose()}}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Profile Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Profile Image</Form.Label>
                            <Form.Control
                                type="file"
                                id = "new-profile-image"
                                accept="image/*"
                                name="image"
                                onChange={changePreview}
                            />
                        </Form.Group>
                        {showPreview &&
                            <Form.Group className="mb-3">
                                <Form.Label>Image Preview</Form.Label>
                            </Form.Group>
                        }
                    </Form>
                    <div className="image-container"><img id='preview' src="" hidden={!showPreview}/></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={()=>{setShowPreview(false); props.handleClose()}}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={changeImage}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}