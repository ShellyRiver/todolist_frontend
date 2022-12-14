import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import {updateUser} from "./updateUser";

export default function ConfirmationModal(props: any) {
    async function clickConfirm() {
        await props.handleConfirm();
        if (props.setReload) {
            await updateUser(props.setReload);
        }
        props.handleClose();
    }
    return (
        <>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{props.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label>{props.body}</Form.Label>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={clickConfirm}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}