import axios from "axios";
import React, { useEffect, useState } from "react";
import { Notification } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

import "./styles.css";
import "./blog.css";
import baseUrl from "../context/baseUrl";
const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategory] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state
  const storedUserId = localStorage.getItem("userId");
  const latestBlogs = blogs?.slice(0, 5);
  const singleBlogs = blogs?.slice(0, 1);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchSectionVisible, setSearchSectionVisible] = useState(true);
  const [postSectionVisible, setPostSectionVisible] = useState(true);

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const apiUrl = baseUrl + "/admin/api/blog-title?title=" + searchValue;
    axios
      .get(apiUrl)
      .then((response) => {
        console.log("Search result:", response.data.data);
        setSearchResults(response.data.data);
        setPostSectionVisible(false);
        setSearchSectionVisible(true);
      })
      .catch((error) => {
        console.error("Error fetching blog details:", error);
      });
  };

  useEffect(() => {
    const apiUrl = baseUrl + "/admin/api/blog/";
    axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "86400",
          "Access-Control-Expose-Headers":
            "Content-Type, Authorization, Accept",
        },
      })
      .then((response) => {
        setBlogs(response.data.data);
        console.log("DATA:", response.data.data);
        setSearchSectionVisible(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

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

  const truncateText = (text, limit) => {
    const words = text.split(" ");
    const truncated = words?.slice(0, limit).join(" ");
    return truncated + (words?.length > limit ? "..." : "");
  };
  // create a function to convert the date into a human readable format
  const formatDate = (date) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  return (
    <div className="container-fluid mx-auto mt-2 pt-4">
      <div className="col-12 text-center standard_page_content my-8">
        <form
          onSubmit={handleSearchSubmit}
          className="flex items-center justify-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="border px-6 py-2 w-full md:w-[20%] text-md font-medium outline-none rounded-l-xl"
            required
            value={searchValue}
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className=" px-2 text-md py-[10px] rounded-r-xl bg-blue-500 text-white "
          >
            Search
          </button>
        </form>
      </div>
      <section className="blog blog_list blog_header pb-5">
        <div className="container">
          <div className="row ">
            <div className="col-12 text-center standard_page_content">
              <div className="Blog_blog_header_title__u2hU5">
                <h1
                  className="category_title  "
                  style={{
                    color: "#093664",
                    fontSize: "60px",
                    fontWeight: "700",
                    fontFamily: "Source Sans 3",
                  }}
                >
                  Latest News & Helpful Guides
                </h1>
                <p
                  className="Blog_blog_header_sub_title__B40oZ"
                  style={{
                    fontSize: "19.2px",
                    color: "#617B8D",
                    fontFamily: "Source Sans 3",
                  }}
                >
                  Here you'll find all of our latest news and views - including
                  top tips, handy guides, and fun content for our fellow LEGO®
                  lovers!
                </p>
              </div>
            </div>
          </div>

          <div className="category-container  mt-5">
            <div className="my-2  justify-center items-center flex">
              {categories?.map((category, index) => (
                <a
                  href={`/bloglist?catId=${category._id}`}
                  key={category._id}
                  className={`Blog_category_card__i_8G3  text-black `}
                  style={{
                    color: "black",
                    backgroundColor: category?.color,
                    border: `1px solid gray`,
                    fontWeight: 700,
                    fontFamily: "Verdana",
                  }}
                >
                  {category.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {postSectionVisible && (
        <div>
          <section className="blog blog_list pb-5">
            <div className="container sm:container-fluid ">
              <h3
                className="mb-4"
                style={{
                  fontWeight: "bold",
                  color: "#093664",
                  fontSize: "20px",
                }}
              >
                Featured Posts
              </h3>
              <div className="row gap-0">
                {singleBlogs?.map((blog) => (
                  <div className="col-12 col-md-6 col-lg-7">
                    <a
                      href={`/blogdetails?blogId=${blog._id}`}
                      key={blog._id}
                      title="Book Flipping: How to Buy and Resell Books for Profit"
                      className="Blog_new_article_card_link__28EiO"
                    >
                      <div className="Blog_new_article_card__qD7wR h-full mb-5 pr-lg-">
                        <div className="Blog_image_container__9bzik mb-4">
                          <img
                            className="lazy blog-image"
                            src={blog.image}
                            alt="Book Flipping: How to Buy and Resell Books for Profit"
                          />
                        </div>
                        <a
                          className="text-[11px] p rounded-full px-[10px] py-1  font-bold text-sm animate-up border-[1px] border-[grey]"
                          style={{
                            backgroundColor: blog.categoryName.color,
                            color: "black",
                            fontSize: 11
                          }}
                          href={`/bloglist?catId=${blog?.categoryId}`}
                        >
                          {blog.categoryName.name}
                        </a>
                        <h2
                          className="my-3 Blog_new_article_title__CusWh"
                          style={{
                            minHeight: "auto",
                            fontSize: "24px",
                            color: "#093664",
                            fontWeight: "700",
                          }}
                        >
                          {blog.title}
                        </h2>
                        <div
                          className="Blog_new_article_excerpt__iOBYt single_blog_description descriptionContainer"
                          dangerouslySetInnerHTML={{
                            __html: truncateText(blog.description, 30),
                          }}
                          style={{ font: "16px", height: 100 }}
                        />

                        <div className="d-flex items-center mt-auto">
                          <img
                            src="/favicon.png"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50px",
                            }}
                            alt="WeBuyBooks"
                          />
                          <div className="ml-3">
                            <div className="Blog_new_article_profile__xlVqE">
                              Lego2Sell
                            </div>
                            <div className="Blog_new_article_posted__X5fva">
                              {formatDate(blog.created_at)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </a>
                  </div>
                ))}

                {latestBlogs?.length > 0 ? (
                  <div className="col-12 col-md-6 col-lg-5 ">
                    {latestBlogs?.map((blog) => (
                      <div className="row  mb-3 single_latest_blog">
                        <div className="col-4 px-0 ">
                          <div className="h-[135px] w-[100%] overflow-hidden  object-contain latest_blog_image_container">
                            <img
                              className="h-full w-[100%] lazy object-cover  "
                              src={blog.image}
                              alt="Top 5 Air Fryer Cookbooks"
                            />
                          </div>
                        </div>
                        <div className="col-8">
                          <a
                          className="text-[11px] p rounded-full px-[10px] py-1  font-bold text-sm animate-up border-[1px] border-[grey]"
                          style={{
                              backgroundColor: blog.categoryName.color,
                              color: "black",
                              fontSize: 11
                            }}
                            href={`/bloglist?catId=${blog?.categoryId}`}
                          >
                            {blog.categoryName.name}
                          </a>
                          <Link
                            to={`/blogdetails?blogId=${blog._id}`}
                            key={blog._id}
                          >
                            <h2
                              className="my-3 Blog_new_article_title__CusWh "
                              style={{
                                fontSize: "18px",
                                lineHeight: "21.6px",
                                color: "#093664",
                                textDecoration: "none",
                                fontWeight: "700",
                              }}
                            >
                              {blog.title}
                            </h2>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <div class="loader"></div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="blog blog_list pb-5" id="recentPostSection">
            <div className="container sm-container-fluid ">
              <h4
                className="mb-4"
                style={{ fontWeight: "bold", color: "#093664" }}
              >
                Most Recent Posts
              </h4>
              <div className="row justify-start flex-wrap">
                {blogs?.map((blog) => (
                  <div className="blogContainerMain  w-[380px] h-[700px] overflow-hidden mb-10  col-12 col-md-6 col-lg-4 col-xl-4    blogs_card ">
                    <div className=" h-full mb-5    rounded-sm">
                      <Link
                        to={`/blogdetails?blogId=${blog._id}`}
                        key={blog._id}
                        style={{ textDecoration: "none", color: "#093664" }}
                      >
                        <div className=" mb-4">
                          <img
                            className="lazy  h-[349px] w-[100%] object-cover blogs_section_image"
                            src={blog.image}
                            alt="11 Best Comic Books of All Time: Honouring National Comic Book Day"
                          />
                        </div>
                        <a
                          className="text-[11px] p rounded-full px-[10px] py-1  font-bold text-sm animate-up border-[1px] border-[grey]"
                          style={{
                            backgroundColor: blog.categoryName.color,
                            color: "black",
                            fontSize: 11
                          }}
                          href={`/bloglist?catId=${blog?.categoryId}`}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {blog.categoryName.name}
                        </a>
                        <h2
                          className=" my-3 Blog_new_article_title__CusWh  "
                          style={{
                            fontSize: "24px",
                            lineHeight: "28px",
                            fontWeight: "700",
                            height: "56px",
                          }}
                        >
                          {blog.title}
                        </h2>

                        <div
                          className="  overflow-hidden descriptionContainer"
                          dangerouslySetInnerHTML={{
                            __html: truncateText(blog.description, 20),
                          }}
                          style={{
                            height: "100px",
                          }}
                        />

                        <div className="mx-3 d-flex items-center mt-auto">
                          <img
                            src="/favicon.png"
                            style={{
                              width: "50px",
                              height: "50px",
                              borderRadius: "50px",
                            }}
                            alt="WeBuyBooks"
                          />
                          <div className="ml-3">
                            <div className="Blog_new_article_profile__xlVqE">
                              Lego2Sell
                            </div>
                            <div className="Blog_new_article_posted__X5fva">
                              {formatDate(blog.created_at)}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      )}

      {searchSectionVisible && (
        <section className="blog blog_list pb-5" id="searchSection">
          <div className="container">
            <h5
              className="mb-4"
              style={{ fontWeight: "bold", color: "#093664" }}
            >
              Search Results
            </h5>
            <div className="row justify-start">
              {searchResults?.map((result) => (
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="Blog_new_article_card__qD7wR h-full mb-5">
                    <Link to={`/blogdetails/${result._id}`} key={result._id}>
                      <div className="Blog_image_container__9bzik mb-4">
                        <img
                          className="lazy blog-card-"
                          src={result.image}
                          alt="11 Best Comic Books of All Time: Honouring National Comic Book Day"
                        />
                      </div>
                      <a
                        className="Blog_category_card_small__KhtWu"
                        style={{
                          backgroundColor: "#FFE1E1",
                          borderColor: "#FF8585",
                        }}
                        href="/blog/all-things-books/"
                      >
                        All Things Books
                      </a>
                      <h2 className="my-3 Blog_new_article_title__CusWh ">
                        {result.title}
                      </h2>
                      <div
                        className="Blog_new_article_excerpt__iOBYt"
                        dangerouslySetInnerHTML={{
                          __html: truncateText(result.description, 8),
                        }}
                      />

                      <div className="d-flex items-center mt-auto">
                        <img
                          src="/favicon.png"
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50px",
                          }}
                          alt="WeBuyBooks"
                        />
                        <div className="ml-3">
                          <div className="Blog_new_article_profile__xlVqE">
                            Lego2Sell
                          </div>
                          <div className="Blog_new_article_posted__X5fva">
                            {result.created_at}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Blog;
// email.jsx
