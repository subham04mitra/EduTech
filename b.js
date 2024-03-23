const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const { Readable } = require('stream');

// Define a Mongoose schema for PDF files
const pdfSchema = new mongoose.Schema({
    name: String,
    data: Buffer
});

// Create a Mongoose model for PDF files
const Pdf = mongoose.model('Pdf', pdfSchema);

// Connect to MongoDB
mongoose.connect('mongodb+srv://technoidkolkata:technoid123@cluster0.iivynkd.mongodb.net/pdf_files', { useNewUrlParser: true, useUnifiedTopology: true });

// Create an Express app
const app = express();

// Route to fetch and display the PDF file
app.get('/pdf/:id', async (req, res) => {
    try {
        // Fetch the PDF file from MongoDB
        const pdf = await Pdf.findById(req.params.id);

        // Check if the PDF file exists
        if (!pdf) {
            return res.status(404).send('PDF file not found');
        }

        // Create a readable stream from the PDF data
        const pdfStream = new Readable();
        pdfStream.push(pdf.data);
        pdfStream.push(null);

        // Set response headers for PDF content
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${pdf.name}"`);

        // Pipe the PDF stream to the response
        pdfStream.pipe(res);
    } catch (error) {
        console.error('Error fetching PDF file:', error);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
