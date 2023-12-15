import axios from "axios"
import React, { useEffect, useState } from "react"
import AdminOffer from "../componet/AdminOffer"
import { useNavigate } from "react-router-dom"
import CryptoJS from 'crypto-js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import baseUrl from "../context/baseUrl";


const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true) // Track loading state
    const storedUserId = localStorage.getItem("userId")
   
        useEffect(() => {
             const apiUrl = baseUrl + '/GetUsers';
                axios.get(apiUrl)
                .then(response => {
                setUsers(response.data.data);
                console.log('DATA:',response.data.data);
                })
                .catch(error => {
                console.error('Error fetching data:', error);
                });
        }, []);


        const handleDelete = async (userId) => {
            try {
              const apiUrl = baseUrl + '/GetUsers/'+userId;
              const response = await axios.delete(apiUrl);
              console.log('Blog deleted successfully:', response.data);
        
              // Refresh the blog list after deleting a blog
              const updatedUsers = await axios.get('http://localhost:5100/GetUsers');
              setUsers(updatedUsers.data.data);

              
            } catch (error) {
              console.error('Error deleting blog:', error);
            }
          };

  return (
    <div className="">
        <div >

<a className="Blog_category_card_small__KhtWu Blog_category_card_1 py-4 text-black "
href="/usermanagement">User Management</a>
<a className="Blog_category_card_small__KhtWu Blog_category_card_2 py-4 text-black"
href="/usercategory">Categories</a>
<a className="Blog_category_card_small__KhtWu Blog_category_card_3 py-4 text-black"
href="/usercomments">Comments</a>
<a className="Blog_category_card_small__KhtWu Blog_category_card_1 py-4 text-black "
href="/userblogs">Blogs</a>
</div>



     <div className="container mx-auto mt-8">
     <h3>User Management</h3>
      <div className="container mx-auto mt-8">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
            {users.map(user => (
            <tr key={user._id} className="border-b">
              <td className="py-2 px-4 centered">{user._id}</td>
              <td className="py-2 px-4">{user.Mydetails[0].firstName} {user.Mydetails[0].lastName}</td>
              <td className="py-2 px-4 centered">{user.email}</td>
              <td className="py-2 px-4">{user.Mydetails[0].Telephone}</td>
             <td className="py-2 px-4">
                <button
                onClick={() => handleDelete(user._id)}
                className="w-full bg-red-500 text-white font-semibold p-2 rounded"
                >
                Delete
                </button>
                </td>

            </tr>
          ))}
        </tbody>
      </table>
       </div>

      </div>
    </div>
  )
}

export default UserManagement