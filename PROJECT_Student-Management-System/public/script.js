let token = null;
let currentlyEditingId = null;
let isEditMode = false;

// DOM Elements
const authSection = document.getElementById('auth-section');
const appSection = document.getElementById('app-section');
const studentTableBody = document.getElementById('studentTableBody');
const addStudentBtn = document.getElementById('addStudentBtn');

// Initialize
document.getElementById('loginBtn').addEventListener('click', login);
document.getElementById('registerBtn').addEventListener('click', register);
addStudentBtn.addEventListener('click', handleStudentSubmit);

// Unified handler for both add and update
function handleStudentSubmit() {
    if (isEditMode) {
        updateStudent();
    } else {
        addStudent();
    }
}

async function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (response.ok) {
            token = data.token;
            authSection.style.display = 'none';
            appSection.style.display = 'block';
            loadStudents();
        } else {
            alert('Login failed: ' + (data.message || 'Invalid credentials'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Login failed');
    }
}

async function register() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            alert('Admin registered successfully! Please login.');
        } else {
            const error = await response.text();
            alert('Registration failed: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Registration failed');
    }
}

async function addStudent() {
    const student = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        grade: document.getElementById('grade').value,
        address: document.getElementById('address').value,
        contactNumber: document.getElementById('contact').value
    };

    try {
        const response = await fetch('http://localhost:3000/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(student)
        });

        if (response.ok) {
            alert('Student added successfully!');
            clearForm();
            loadStudents();
        } else {
            const error = await response.text();
            alert('Error adding student: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add student');
    }
}

async function editStudent(id) {
    currentlyEditingId = id;
    isEditMode = true;
    
    try {
        const response = await fetch(`http://localhost:3000/api/students/${id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const student = await response.json();

        document.getElementById('name').value = student.name;
        document.getElementById('age').value = student.age;
        document.getElementById('grade').value = student.grade;
        document.getElementById('address').value = student.address || '';
        document.getElementById('contact').value = student.contactNumber || '';
        
        addStudentBtn.textContent = 'Update Student';
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load student details');
    }
}

async function updateStudent() {
    const student = {
        name: document.getElementById('name').value,
        age: document.getElementById('age').value,
        grade: document.getElementById('grade').value,
        address: document.getElementById('address').value,
        contactNumber: document.getElementById('contact').value
    };

    try {
        const response = await fetch(`http://localhost:3000/api/students/${currentlyEditingId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(student)
        });

        if (response.ok) {
            alert('Student updated successfully!');
            clearForm();
            loadStudents();
            exitEditMode();
        } else {
            const error = await response.text();
            alert('Error updating student: ' + error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to update student');
    }
}

function exitEditMode() {
    isEditMode = false;
    currentlyEditingId = null;
    addStudentBtn.textContent = 'Add Student';
}

async function deleteStudent(id) {
    if (confirm('Are you sure you want to delete this student?')) {
        try {
            const response = await fetch(`http://localhost:3000/api/students/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                alert('Student deleted successfully!');
                loadStudents();
            } else {
                const error = await response.text();
                alert('Error deleting student: ' + error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to delete student');
        }
    }
}

async function loadStudents() {
    try {
        const response = await fetch('http://localhost:3000/api/students', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const students = await response.json();
        renderStudents(students);
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to load students');
    }
}

function renderStudents(students) {
    studentTableBody.innerHTML = '';
    
    students.forEach(student => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.grade}</td>
            <td>${student.address || '-'}</td>
            <td>${student.contactNumber || '-'}</td>
            <td>
                <button class="action-btn edit-btn" onclick="editStudent('${student._id}')">Edit</button>
                <button class="action-btn delete-btn" onclick="deleteStudent('${student._id}')">Delete</button>
            </td>
        `;
        
        studentTableBody.appendChild(row);
    });
}

function clearForm() {
    document.getElementById('name').value = '';
    document.getElementById('age').value = '';
    document.getElementById('grade').value = '';
    document.getElementById('address').value = '';
    document.getElementById('contact').value = '';
}

// Make functions available globally
window.editStudent = editStudent;
window.deleteStudent = deleteStudent;