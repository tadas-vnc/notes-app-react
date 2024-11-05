import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import { PlusIcon, TrashIcon } from 'lucide-react';
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import { Container, Row, Col, Button, Card, Form, Modal } from 'react-bootstrap';
import { Sun, Moon } from 'lucide-react';

const App = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(localStorage.getItem("dark-theme") == null ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) : localStorage.getItem("dark-theme") == "true")
  const [notes, setNotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentNote, setCurrentNote] = useState({ id: null, title: '', content: '' });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(()=>{
    localStorage.setItem("dark-theme", isDarkTheme);
    document.body.setAttribute("data-bs-theme", isDarkTheme ? "dark" : "light")
  },[isDarkTheme])

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const handleClose = () => {
    setShowModal(false);
    setCurrentNote({ id: null, title: '', content: '' });
    setIsEditing(false);
  };

  const handleShow = () => setShowModal(true);

  const handleSaveNote = () => {
    if (currentNote.title.trim() === '' || currentNote.content.trim() === '') {
      alert('Please fill in both title and content');
      return;
    }

    if (isEditing) {
      setNotes(notes.map(note => 
        note.id === currentNote.id ? currentNote : note
      ));
    } else {
      setNotes([...notes, { ...currentNote, id: Date.now() }]);
    }
    handleClose();
  };

  const handleEdit = (note) => {
    setCurrentNote(note);
    setIsEditing(true);
    handleShow();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">My Notes</h1>
          <Button 
            variant={isDarkTheme ? 'light' : 'dark'}
            onClick={toggleTheme}
            className="rounded-circle p-2"
            style={{ width: '40px', height: '40px', float:"right" }}
          >
            {isDarkTheme ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </Button>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col className="text-center">
          <Button variant="primary" onClick={() => {
            setIsEditing(false);
            handleShow();
          }}>
            Add New Note
          </Button>
        </Col>
      </Row>

      <Row>
        {notes.length === 0 ? (
          <Col className="text-center">
            <p className="text-muted">No notes available. Click "Add New Note" to create one!</p>
          </Col>
        ) : (
          notes.map(note => (
            <Col key={note.id} xs={12} md={6} lg={4} className="mb-4">
              <Card>
                <Card.Body>
                  <Card.Title>{note.title}</Card.Title>
                  <Card.Text>{note.content}</Card.Text>
                  <div className="d-flex justify-content-end">
                    <Button 
                      variant="outline-primary" 
                      className="me-2"
                      onClick={() => handleEdit(note)}
                    >
                      Edit
                    </Button>
                    <Button 
                      variant="outline-danger"
                      onClick={() => handleDelete(note.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEditing ? 'Edit Note' : 'Add New Note'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter note title"
                value={currentNote.title}
                onChange={(e) => setCurrentNote({...currentNote, title: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter note content"
                value={currentNote.content}
                onChange={(e) => setCurrentNote({...currentNote, content: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveNote}>
            {isEditing ? 'Save Changes' : 'Add Note'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default App;