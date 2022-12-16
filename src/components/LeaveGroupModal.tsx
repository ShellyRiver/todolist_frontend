import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function LeaveGroupModal(props: any) {
    return (
        <>
            <Modal show={props.show} onHide={props.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Leave Group</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {props.body}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={props.handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={props.handleConfirm}>
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}