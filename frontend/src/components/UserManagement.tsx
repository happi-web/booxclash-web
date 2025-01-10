import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define types for User
interface User {
  _id: string;
  username: string;
  role: string;
  profilePicture?: string;
  grade?: string; // Optional field for grade (only for students)
}

// Define types for New User
interface NewUser {
  username: string;
  password: string;
  role: string;
  grade?: string; // Optional field for grade
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState<NewUser>({
    username: '',
    password: '',
    role: '',
    grade: '' // Initially no grade is set
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming JWT is stored in localStorage
        const response = await axios.get('http://localhost:4000/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Handle the form input for adding new users
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser((prevState) => ({ ...prevState, [name]: value }));
  };

  // Add new user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:4000/users', newUser, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNewUser({ username: '', password: '', role: '', grade: '' }); // Reset form
      // Refetch users to update the list
      const response = await axios.get('http://localhost:4000/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  // Delete a user
  const handleDeleteUser = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:4000/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Refetch users after deletion
      const response = await axios.get('http://localhost:4000/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Management</h2>
      <form onSubmit={handleAddUser}>
        <h3>Add New User</h3>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={newUser.username}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={newUser.password}
          onChange={handleInputChange}
          required
        />
        <select
          name="role"
          value={newUser.role}
          onChange={handleInputChange}
          required
        >
          <option value="">Select Role</option>
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
          <option value="admin">Admin</option>
        </select>
        {newUser.role === 'student' && (
          <div>
            <input
              type="text"
              name="grade"
              placeholder="Enter Grade"
              value={newUser.grade}
              onChange={handleInputChange}
            />
          </div>
        )}
        <button type="submit">Add User</button>
      </form>
      <h3>User List</h3>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Grade</th> {/* Added grade column */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.role}</td>
              <td>{user.role === 'student' ? user.grade || 'No grade' : ''}</td>
              <td>
                <button onClick={() => handleDeleteUser(user._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
