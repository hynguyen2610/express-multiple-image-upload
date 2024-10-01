# File Upload App

This is a simple file upload application built with Node.js and Express. It allows users to upload image files and saves them on the server with a unique timestamped filename.

## Features

- Upload multiple images (up to 10) at once.
- Images are stored in a designated uploads directory.
- Filenames are sanitized and formatted to avoid spaces and special characters.
- Uses Multer for handling file uploads.
- Implements CORS for cross-origin requests.

## Technologies Used

- Node.js
- Express
- Multer
- date-fns
- sanitize-filename
- CORS
