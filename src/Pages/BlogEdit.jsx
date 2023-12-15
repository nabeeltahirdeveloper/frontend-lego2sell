import axios from "axios"
import React, { useEffect, useState } from "react"
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import AdminOffer from "../componet/AdminOffer"
import { useNavigate } from "react-router-dom"
import CryptoJS from 'crypto-js';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const UserBlog = () => {
    const currentUrl = 'http://localhost:5100';
    const [blogs, setBlogs] = useState([]);
    const location = useLocation();
    const [categories, setCategory] = useState([]);
    const [apiResponse, setResponse] = useState([]);
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true) // Track loading state
    const storedUserId = localStorage.getItem("userId")
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);



    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const idFromUrl = searchParams.get('blogId');
      
        if (idFromUrl) {
          const apiUrl = currentUrl+'/admin/api/blog/'+idFromUrl;
          axios.get(apiUrl)
            .then(response => {
              setBlogs((prevBlog) => response.data.data || prevBlog);
              setFormData({
                ...formData,
                description: response.data.data.description,
                categoryId: response.data.data.categoryId,
                title: response.data.data.title,
                });
            })
            .catch(error => {
              console.error('Error fetching blog details:', error);
            });
        }
    
      }, [location.search]);


      const [formData, setFormData] = useState({
        userId: storedUserId,
        userName: 'test',
        categoryId: '',
        categoryName: {
          name:'',
          color:'',
        },
        title: '',
        image: '',
        description: '',
      });

       


      const handleChange = (e) => {
        if (e.target.type === 'file') {
          // Handle file input
          const selectedImage = e.target.files[0];
          setImage1(selectedImage);
          const fileNameWithoutPath = selectedImage ? selectedImage.name : '';
          setFormData({
            ...formData,
            image: fileNameWithoutPath,
          });
          } else {
          // Handle regular input
          setFormData({
          ...formData,
          [e.target.name]: e.target.value,
          });
          }

      };

    
     

      const handleChangeCategory = (event) => {
        const selectedCategoryId = event.target.value;
        const selectedCategory = categories.find((category) => category._id === selectedCategoryId);
      
        if (selectedCategory) {
          // Update the formData with the selected category information
          setFormData({
            ...formData,
            categoryId: selectedCategoryId,
            categoryName: {
              name: selectedCategory.name,
              color: selectedCategory.color,
            },
          });
        }
      };


        const handleEditorChange = (content) => {
          setFormData({ ...formData, description: content });
        };

      
        const handleSubmit = async (e) => {
            e.preventDefault();
        
            try {
              const formData1 = new FormData();
              formData1.append('image', image1);
              const formData2 = new FormData();
              const response = await axios.post(currentUrl+'/upload', formData1)
              .then(response => {
                console.log('Image uploaded successfully:', response.data.imageUrl);
                setImageUrl(response.data.imageUrl);
                formData.image = response.data.imageUrl;
                
              })
              .catch(error => {
                console.error('Error uploading image:', error);
              });

              const apiUrl = currentUrl+'/admin/api/blog';
              const response1 = axios.put(apiUrl, formData);
              setResponse('Data Updated successfully');

              const updatedBlogs = await axios.get(currentUrl+'/admin/api/blog');
              setBlogs(updatedBlogs.data.data);
            } catch (error) {
              setResponse('Error submitting data');
              console.error('Error submitting data:', error);
            }
          };

          
    


          useEffect(() => {
          const apiUrl = currentUrl+'/admin/service/api/category';
          axios.get(apiUrl)
          .then(response => {
          setCategory(response.data.data);
          console.log('DATA:',response.data.data);
          })
          .catch(error => {
          console.error('Error fetching data:', error);
          });
          }, []);

  return (
    <div className="">
        <a className="Blog_category_card_small__KhtWu Blog_category_card_1"
        href="/usermanagement">User Management</a>
        <a className="Blog_category_card_small__KhtWu Blog_category_card_2"
        href="/usercategory">Categories</a>
        <a className="Blog_category_card_small__KhtWu Blog_category_card_3"
        href="/usercomments">Comments</a>


     <div className="container mx-auto mt-8">
         <h3>{apiResponse}</h3>
        <form className="mx-auto p-6 bg-white rounded shadow">
            
        
        <div className="mb-4">
          <label htmlFor="Category" className="block text-gray-600 font-semibold">Category</label>
        <select
        id="categoryName"
        name="categoryName"
        value={formData.categoryId}
        onChange={handleChangeCategory}
        className="w-full p-2 border border-gray-300 rounded mt-1"
        >
        <option value="">Choose Category</option>
        {categories.map(category => (
        <option
        key={category._id}
        value={category._id}
        selected={blogs.categoryId === category._id}
        >
        {category.name}
        </option>
        ))}
        </select>
        </div>


        <div className="mb-4">
          <label htmlFor="title" className="block text-gray-600 font-semibold">Heading</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            
          />
        </div>
            <div className="mb-4">
            <label htmlFor="image" className="block text-gray-600 font-semibold">Image</label>
            <input
            type="file"
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-1"
            required
            />
            </div>
        <div className="mb-6">

        <div>
        <ReactQuill
        theme="snow"
        name="description"
        value={formData.description}
        onChange={handleEditorChange}
        style={{ width: '100%', height: '250px' }}
        />
        </div>
  
        </div>
        <button
        style={{ marginTop: '50px'}}
          type="submit"
          onClick={handleSubmit}
          className="w-full bg-blue-500 text-white font-semibold p-2 rounded"
        >
          Submit
        </button>
      </form>
      </div>

    </div>
  )
}

export default UserBlog
