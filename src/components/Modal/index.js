import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import styles from './styles.module.css' 
import FileForm from '../Form/file'
import FolderForm from '../Form/folder'
/* Cloudinary */
import { CloudinaryContext } from "cloudinary-react";
function Modals() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  return (
    <CloudinaryContext cloudName="dtqzhg98l">
        <>
          <Button className={styles.addFileBtn} onClick={handleShow}>
            + New
          </Button>
    
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>AA DRIVE</Modal.Title>
            </Modal.Header>
          <Modal.Body>
            <FolderForm onHide={handleClose}/>
            <FileForm />
             </Modal.Body>
           
          </Modal>
      </>
      </CloudinaryContext>
      );
}

export default Modals