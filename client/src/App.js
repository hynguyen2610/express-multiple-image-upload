import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './App.css';

function App() {
    const [name, setName] = useState('');
    const [files, setFiles] = useState([]);

    const onDrop = useCallback((acceptedFiles) => {
        setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        files.forEach((file) => {
            formData.append('images', file);
        });

        fetch(`${process.env.REACT_APP_API_URL}/api/tickets`, {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
            // Reset the form after submission
            setName('');
            setFiles([]);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error uploading ticket.');
        });
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    return (
        <div>
            <h1>Upload Ticket</h1>
            <form id="ticketForm" onSubmit={handleSubmit}>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                /><br/><br/>

                <label>Images:</label>
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
                <aside>
                    <h4>Files</h4>
                    <ul>
                        {files.map((file) => (
                            <li key={file.path}>{file.path} - {file.size} bytes</li>
                        ))}
                    </ul>
                </aside>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default App;
