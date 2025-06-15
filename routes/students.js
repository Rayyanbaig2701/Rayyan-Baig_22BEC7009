const express = require('express');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const router = express.Router();

// Middleware to verify token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('No token provided');
    
    jwt.verify(token.split(' ')[1], 'your_secret_key', (err, decoded) => {
        if (err) return res.status(500).send('Failed to authenticate token');
        req.userId = decoded.userId;
        next();
    });
};

// Create Student (Single)
router.post('/', verifyToken, async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).send(student);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Create Multiple Students (Bulk Insert)
router.post('/bulk', verifyToken, async (req, res) => {
    try {
        const students = req.body; // Expecting an array of student objects
        const insertedStudents = await Student.insertMany(students);
        res.status(201).send(insertedStudents);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Get All Students
router.get('/', verifyToken, async (req, res) => {
    try {
        const students = await Student.find();
        res.send(students);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Get Single Student
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).send('Student not found');
        res.send(student);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

// Update Student
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) return res.status(404).send('Student not found');
        res.send(student);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

// Delete Student
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).send('Student not found');
        res.send('Student deleted successfully');
    } catch (error) {
        res.status(500).send(error.message);
    }
});

module.exports = router;