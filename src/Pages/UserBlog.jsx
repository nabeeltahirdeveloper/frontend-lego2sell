import axios from "axios";
import React, { useEffect, useState } from "react";
import AdminOffer from "../componet/AdminOffer";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import baseUrl from "../context/baseUrl";

const UserBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategory] = useState([]);
  const [apiResponse, setResponse] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false); // Track loading state
  const storedUserId = localStorage.getItem("userId");
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const [formData, setFormData] = useState({
    userId: storedUserId,
    userName: "test",
    categoryId: "",
    categoryName: {
      name: "",
      color: "",
    },
    title: "",
    image: "",
    description: "",
  });

  console.log("set form data", formData);
  const handleChange = (e) => {
    if (e.target.type === "file") {
      // Handle file input
      const selectedImage = e.target.files[0];
      setImage1(selectedImage);
      const fileNameWithoutPath = selectedImage ? selectedImage.name : "";
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
    console.log("set form data", formData);
  };

  const handleChangeCategory = (event) => {
    const selectedCategoryId = event.target.value;
    const selectedCategory = categories.find(
      (category) => category._id === selectedCategoryId
    );

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

    console.log("set image", formData);
    try {
      const formData1 = new FormData();
      formData1.append("image", image1);
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios
        .post(baseUrl + "/upload", formData1, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log("Image uploaded successfully:", response.data.imageUrl);
          formData.image = response.data.imageUrl;
          const apiUrl = baseUrl + "/admin/api/blog";
          const response1 = axios.post(apiUrl, formData, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setResponse("Data submitted successfully");
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          setLoading(false);
          alert("Error uploading image");
        });

      const updatedBlogs = await axios.get(baseUrl + "/admin/api/blog");
      setBlogs(updatedBlogs.data.data);
      setLoading(false);
      alert("Data submitted successfully");
    } catch (error) {
      setResponse("Error submitting data");
      console.error("Error submitting data:", error);
      setLoading(false);
      alert("Error submitting data");
    }
  };

  useEffect(() => {
    const apiUrl = baseUrl + "/admin/api/blog";
    axios
      .get(apiUrl)
      .then((response) => {
        setBlogs(response.data.data);
        console.log("DATA:", response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleDelete = async (blogId) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = baseUrl + "/admin/api/blog/" + blogId;
      const response = await axios.delete(apiUrl,{
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Blog deleted successfully:", response.data);
      alert("Blog deleted successfully");
      // Refresh the blog list after deleting a blog
      const updatedBlogs = await axios.get(baseUrl + "/admin/api/blog");
      setBlogs(updatedBlogs.data.data);
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  useEffect(() => {
    const apiUrl = baseUrl + "/admin/service/api/category";
    axios
      .get(apiUrl)
      .then((response) => {
        setCategory(response.data.data);
        console.log("DATA:", response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <>
      <div className="mt-3 mx-auto w-full justify-center items-center ">
        <div className="flex lg:flex-row flex-col items-center">
          <div className="flex flex-col justify-start gap-5 ml-4 h-full bg-slate-50 lg:border-[8px] border-[0px] px-4 py-24 border-blue-500 rounded-[30px]">
            <a
              className="Blog_category_card_small__KhtWu Blog_category_card_1 py-4 text-black md:m-0 mx-auto w-[350px] "
              href="/usermanagement"
            >
              User Management
            </a>
            <a
              className="Blog_category_card_small__KhtWu Blog_category_card_2 py-4 text-black md:m-0 mx-auto w-[350px]"
              href="/usercategory"
            >
              Categories
            </a>
            <a
              className="Blog_category_card_small__KhtWu Blog_category_card_3 py-4 text-black md:m-0 mx-auto w-[350px]"
              href="/usercomments"
            >
              Comments
            </a>
            <a
              className="Blog_category_card_small__KhtWu Blog_category_card_1 py-4 text-black md:m-0 mx-auto w-[350px]"
              href="/userblogs"
            >
              Blogs
            </a>
          </div>
          <div className="container mx-auto mt-8">
            <h3>{apiResponse}</h3>
            <form className="mx-auto p-6 bg-white rounded shadow">
              <div className="mb-4">
                <label
                  htmlFor="Category"
                  className="block text-gray-600 font-semibold"
                >
                  Category
                </label>
                <select
                  id="categoryName"
                  name="categoryName"
                  value={formData.categoryId}
                  onChange={handleChangeCategory}
                  className="w-full p-2 border border-gray-300 rounded mt-1"
                  data-color={formData.categoryName.color}
                >
                  <option value="">Choose Category</option>
                  {categories?.map((category) => (
                    <option
                      key={category._id}
                      value={category._id}
                      color={category.color}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  htmlFor="title"
                  className="block text-gray-600 font-semibold"
                >
                  Heading
                </label>
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
                <label
                  htmlFor="image"
                  className="block text-gray-600 font-semibold"
                >
                  Image
                </label>
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
                    modules={{
                      toolbar: {
                        container: [
                          [{ header: [1, 2, false] }],
                          [
                            "bold",
                            "italic",
                            "underline",
                            "strike",
                            "blockquote",
                          ],
                          [{ list: "ordered" }, { list: "bullet" }],
                          ["link", "image"], // Add 'image' to include the image button
                          ["clean"],
                        ],
                      },
                    }}
                    style={{ width: "100%", height: "250px" }}
                  />
                </div>
              </div>
              <button
                style={{ marginTop: "50px" }}
                type="submit"
                onClick={handleSubmit}
                className="w-full bg-blue-500 text-white font-semibold p-2 rounded"
                disabled={loading} // Disable the button while loading
              >
                {loading ? "Loading..." : "Submit"}
              </button>
            </form>
          </div>
        </div>

        <div className="container mx-auto my-12">
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="">
                <th className="py-4 text-center font-bold px-4 border-b">ID</th>
                <th className="py-4 text-center font-bold px-4 border-b">
                  Category Id
                </th>
                <th className="py-4 text-center font-bold px-4 border-b">
                  Category
                </th>
                <th className="py-4 text-center font-bold px-4 border-b">
                  Title
                </th>
                <th className="py-4 text-center font-bold px-4 border-b">
                  Image
                </th>
                <th className="py-4 text-center font-bold px-4 border-b">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {blogs?.map((blog) => (
                <tr key={blog._id} className="">
                  <td className="py-2 px-4 centered border-b ">{blog._id}</td>
                  <td className="py-2 px-4 border-b">{blog.categoryId}</td>
                  <td className="py-2 px-4 border-b">
                    {blog.categoryName.name}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {blog.title.slice(0, 20)}...
                  </td>
                  <td className="py-2 px-4 border-b">
                    <img
                      src={blog.image}
                      alt="Blog"
                      className="w-[200px] object-cover h-[100px]"
                    />
                  </td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="w-full bg-red-500 text-white font-semibold p-2 rounded"
                    >
                      Delete
                    </button>
                    <div style={{ marginTop: "20px" }}>
                      <a
                        href={`/blogedit?blogId=${blog._id}`}
                        key={blog._id}
                        className="w-full bg-blue-500 text-white font-semibold p-3 rounded"
                      >
                        Edit
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserBlog;
