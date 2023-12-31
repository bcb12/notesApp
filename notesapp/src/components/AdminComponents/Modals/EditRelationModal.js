import React, { useEffect, useState } from 'react';
import { Dropdown, Col, Row, Modal, Button, Form } from 'react-bootstrap';
import { AiOutlineSwap } from 'react-icons/ai';

const errorStyle = {
    color: "red",
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    padding: "10px",
    borderRadius: "5px",
    marginBottom: "10px",
};

const CreateRelationModal = ({ show, handleClose, handleRelationUpdate, handleRelationDelete, relation, relations, users }) => {
    const [localUsers, setLocalUsers] = useState(users);
    const [status, setStatus] = useState('pending');
    const [sender_id, setSender_id] = useState('');
    const [receiver_id, setReceiver_id] = useState('');
    const [senderSelected, setSenderSelected] = useState(false);
    const [receiverSelected, setReceiverSelected] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [error, setError] = useState('');

    const handleSenderSelect = (user) => {
        setSender_id({ id: user._id.$oid, username: user.username });
        setSenderSelected(true);
    };

    const handleReceiverSelect = (user) => {
        setReceiver_id({ id: user._id.$oid, username: user.username });
        setReceiverSelected(true);
    };

    useEffect(() => {
        setLocalUsers(users);
    }, [users]);

    useEffect(() => {
        if (relation) {
            setStatus(relation.status);

            const sender = users.find((user) => user._id.$oid === relation.sender_id.$oid);
            const receiver = users.find((user) => user._id.$oid === relation.receiver_id.$oid);

            if (sender && receiver) {
                setSender_id({ id: relation.sender_id.$oid, username: sender.username });
                setReceiver_id({ id: relation.receiver_id.$oid, username: receiver.username });
                setSenderSelected(true);
                setReceiverSelected(true);
            }
        }
    }, [relation, users]);

    const handleSubmit = () => {
        if (
            sender_id.id &&
            receiver_id.id &&
            sender_id.id !== receiver_id.id
        ) {
            handleRelationUpdate(relation, status, sender_id.id, receiver_id.id);
            setStatus('');
            setSender_id({ id: '', username: '' });
            setReceiver_id({ id: '', username: '' });
            handleClose();
        } else {
            setError("Sender and receiver must be different users and can't already have a relation");
        }
    };

    const handleDeleteRelation = () => {
        handleRelationDelete(relation);
        setShowDeleteModal(false);
        handleClose();
    };

    const swapUsers = () => {
        const temp = sender_id;
        setSender_id(receiver_id);
        setReceiver_id(temp);
    };

    return (
        <>
            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Edit friendship</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <div style={errorStyle}>{error}</div>}
                    <Form>
                        <Row>
                            <Col className="d-flex justify-content-center">
                                <div className="d-flex flex-column align-items-center">
                                    <Form.Label>Status</Form.Label>
                                    <Dropdown>
                                        <Dropdown.Toggle variant="secondary" id="dropdown-shared-users">
                                            {status.charAt(0).toUpperCase() + status.slice(1)}
                                        </Dropdown.Toggle>
                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => setStatus('pending')}>Pending</Dropdown.Item>
                                            <Dropdown.Item onClick={() => setStatus('accepted')}>Accepted</Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </Col>
                            <Col className="d-flex justify-content-center">
                                <div className="d-flex flex-column align-items-center">
                                    <Form.Label>Sender</Form.Label>
                                    <Dropdown disabled>
                                        <Dropdown.Toggle variant="secondary" id="dropdown-shared-users" disabled>
                                            {sender_id.username ? sender_id.username : 'Choose sender'}
                                        </Dropdown.Toggle>
                                    </Dropdown>
                                </div>
                            </Col>
                            <Col className="d-flex justify-content-center">
                                <div className="d-flex flex-column align-items-center">
                                    <Form.Label>Receiver</Form.Label>
                                    <Dropdown disabled>
                                        <Dropdown.Toggle variant="secondary" id="dropdown-shared-users" disabled>
                                            {receiver_id.username ? receiver_id.username : 'Choose receiver'}
                                        </Dropdown.Toggle>
                                    </Dropdown>
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col className="d-flex justify-content-center">
                                <div className="position-relative">
                                    <AiOutlineSwap
                                        size="1.5em"
                                        onClick={swapUsers}
                                        className="custom-swap-icon"
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowDeleteModal(true)} style={{ marginRight: 'auto' }} >
                        Delete
                    </Button>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>
                        Create
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to remove this relation?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteRelation()}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default CreateRelationModal;
