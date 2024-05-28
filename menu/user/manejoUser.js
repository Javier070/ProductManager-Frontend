document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        fetchUsers(token);
    }
});

let users = []; // Variable global para almacenar todos los usuarios

const fetchUsers = async (token) => {
    try {
        const response = await fetch('http://localhost:8080/user/getAll', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.mensaje);
        }
        
        users = data; // Guardar todos los usuarios en la variable global

        displayUsers(data);
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to load users: ' + error.mensaje);
    }
};

const displayUsers = (users) => {
    const container = document.getElementById('users-container');
    let tableHTML = `<table>
                        <tr>
                            <th>Name</th>
                            <th>Contact Number</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                        </tr>`;
    
    users.forEach(user => {
        const role = user.role === 'admin' ? 'Admin' : 'User';
        const statusChecked = user.status === 'true' ? 'checked' : '';
        tableHTML += `<tr>
                        <td>${user.name}</td>
                        <td>${user.contactNumber}</td>
                        <td>${user.email}</td>
                        <td>${role}</td>
                        <td><label class="switch">
                              <input type="checkbox" ${statusChecked} onchange="toggleUserStatus(${user.id}, this.checked)">
                              <span class="slider round"></span>
                            </label></td>
                      </tr>`;
    });
    
    tableHTML += `</table>`;
    container.innerHTML = tableHTML;
};

const toggleUserStatus = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:8080/user/updateStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id, status: newStatus.toString() })
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.mensaje || 'Error updating user status');
        }

        alert(responseData.mensaje || 'User status updated successfully');
        fetchUsers(token);
    } catch (error) {
        console.error('Error updating user status:', error);
        alert('Failed to update user status: ' + error.message);
    }
};

const searchUsers = () => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm));
    displayUsers(filteredUsers);
};
