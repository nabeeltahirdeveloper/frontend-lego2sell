import axios from "axios"
import React, { useEffect, useState } from "react"
import AdminOffer from "../componet/AdminOffer"
import { useNavigate } from "react-router-dom"
import CryptoJS from 'crypto-js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import baseUrl from "../context/baseUrl";

const UserComments = () => {
    const currentUrl = 'http://localhost:5100';
    const [comments, setComments] = useState([]);
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true) // Track loading state
    const storedUserId = localStorage.getItem("userId")
  
          
        useEffect(() => {
                const apiUrl = baseUrl+'/admin/service/api/comment';
                axios.get(apiUrl)
                .then(response => {
                setComments(response.data.data);
                console.log('DATA:',response.data.data);
                })
                .catch(error => {
                console.error('Error fetching data:', error);
                });
        }, []);


        const handleDelete = async (id) => {
            try {
              const apiUrl = baseUrl+`/admin/service/api/comment/${id}`;
              const response = await axios.delete(apiUrl);
              console.log('Blog deleted successfully:', response.data);
              // Refresh the blog list after deleting a blog
              const updatedBlogs = await axios.get(currentUrl+'/admin/service/api/comment');
              alert("Comment Deleted Successfully");
              setComments(updatedBlogs.data.data);
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
     <h3>Comments</h3>
      <div className="container mx-auto mt-8">
      <table className="min-w-full border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Blog Id</th>
            <th className="py-2 px-4 border-b">User </th>
            <th className="py-2 px-4 border-b">Comment</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody className="text-center">
            {comments.map(comment => (
            <tr key={comment._id} className="border-b">
              <td className="py-2 px-4 centered">{comment.blogId}</td>
              <td className="py-2 px-4">{comment.name}</td>
              <td className="py-2 px-4">{comment.comment}</td>
             <td className="py-2 px-4">
                <button
                onClick={() => handleDelete(comment._id)}
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

export default UserComments
