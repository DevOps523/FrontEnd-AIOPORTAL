// import { useEffect, useState } from "react";
// import Link from "next/link";
// import axios from "axios";
// import { useRouter } from "next/router";


// // function for markdown first image fetch
// function extractFirstImageUrl(markdownContent) {
//     // Check if markdownContent is provided and non-empty
//     if (!markdownContent || typeof markdownContent !== 'string') {
//         return null;
//     }

//     // Regular expression to match the first image URL in markdown format ![alt text](imageURL)
//     const regex = /!\[.*?\]\((.*?)\)/;
//     const match = markdownContent.match(regex);
//     return match ? match[1] : null;
// }

// export default function CategoryPage() {

//     const [loading, setLoading] = useState(true);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [perPage] = useState(4);
//     const [blog, setBlog] = useState([]);
//     const router = useRouter();
//     const { category } = router.query;

//     useEffect(() => {
//         // Function to fetch blog data
//         const fetchBlogData = async () => {
//             try {
//                 const res = await axios.get(`/api/getblog?blogcategory=${category}`);
//                 const alldata = res.data;
//                 setBlog(alldata);
//                 setLoading(false); // Set loading state to false after data is fetched
//             } catch (error) {
//                 console.error('Error fetching blog data:', error);
//                 setLoading(false); // Set loading state to false even if there's an error
//             }
//         };

//         // Fetch blog data only if category exists
//         if (category) {
//             fetchBlogData();
//         } else {
//             router.push('/404');
//         }
//     }, [category]);

//     // filter published blogs
//     const publishedblogs = blog.filter(ab => ab.status === 'publish');


//     // Function to handle page change
//     const paginate = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

//     const indexOfLastProduct = currentPage * perPage;
//     const indexOfFirstProduct = indexOfLastProduct - perPage;
//     const currentProducts = blog.slice(indexOfFirstProduct, indexOfLastProduct);

//     const alldata = blog.length; // Total number of products

//     const pageNumbers = [];

//     for (let i = 1; i <= Math.ceil(alldata / perPage); i++) {
//         pageNumbers.push(i);
//     }


//     return (
//         <div className="blogpage">
//             <div className="category_slug">
//                 <div className="container">
//                     <div className="category_title">
//                         <div className="flex gap-1" data-aos="fade-right">
//                             <h1>{loading ? <div>Loading...</div> : publishedblogs ? publishedblogs && publishedblogs[0]?.blogcategory : publishedblogs && publishedblogs.blogcategory}</h1>
//                             <span>{loading ? <div>0</div> : publishedblogs.filter(blog => blog.blogcategory).length}</span>
//                         </div>
//                         <p data-aos="fade-left"></p>
//                     </div>
//                     <div className="category_blogs mt-3">
//                         {loading ? <><div className="wh-100 flex flex-center mt-2 pb-5">
//                             <div aria-live="assertive" role="alert" class="loader"></div></div></> : <>
//                             {publishedblogs.map((item) => {
//                                 // in the markdown content first image show here
//                                 const firstImageUrl = extractFirstImageUrl(item.description);
//                                 return <div className="cate_blog" key={item._id} data-aos="fade-up">
//                                     <Link href={`/blog/${item.slug}`}><img src={firstImageUrl || "/img/noimage.jpg"} alt="blog" /></Link>
//                                     <div className="bloginfo mt-2">
//                                         <Link href={`/tag/${item.tags[0]}`}><div className="blogtag">{item.tags[0]}</div></Link>
//                                         <Link href={`/blog/${item.slug}`}><h3>{item.title}</h3></Link>
//                                         {/* <p>Markdown is a lightweight markup language with plain-text-formatting syntax. Its design allows it to…</p> */}
//                                         <div className="blogauthor flex gap-1">
//                                             <div className="blogaimg">
//                                                 <img src="/img/coder.png" alt="author" />
//                                             </div>
//                                             <div className="flex flex-col flex-left gap-05">
//                                                 <h4>Admin</h4>
//                                                 <span>{new Date(item.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             })}
//                         </>
//                         }

//                     </div>
//                     <div className='blogpagination'>
//                         <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
//                         {pageNumbers.slice(Math.max(currentPage - 3, 0), Math.min(currentPage + 2, pageNumbers.length)).map(number => (
//                             <button
//                                 key={number}
//                                 onClick={() => paginate(number)}
//                                 className={`${currentPage === number ? 'active' : ''}`}
//                             >
//                                 {number}
//                             </button>
//                         ))}
//                         <button onClick={() => paginate(currentPage + 1)} disabled={currentProducts.length < perPage}>Next</button>
//                     </div>
//                 </div>
//             </div>
//         </div >

//     );
// }

import Link from "next/link";
import { mongooseConnect } from "@/lib/mongoose"; // Adjust this path based on your project structure
import { Blog } from "@/models/Blog"; // Adjust this path based on your project structure
import { useState } from "react";

// Function to extract the first image URL from markdown content
function extractFirstImageUrl(markdownContent) {
    if (!markdownContent || typeof markdownContent !== 'string') {
        return null;
    }
    const regex = /!\[.*?\]\((.*?)\)/;
    const match = markdownContent.match(regex);
    return match ? match[1] : null;
}

export default function CategoryPage({ blogs, category, totalPages }) {
    const [currentPage, setCurrentPage] = useState(1);
    const perPage = 3; // Number of blogs per page

    // Function to handle page change
    const paginate = (pageNumber) => {
        // Ensure the page number is within valid range
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    // Calculate indices for pagination
    const indexOfLastBlog = currentPage * perPage;
    const indexOfFirstBlog = indexOfLastBlog - perPage;
    const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);

    // Generate page numbers with a window around the current page
    const pageNumbers = [];
    const maxPageButtons = 5; // Maximum number of pagination buttons to display
    let startPage = Math.max(currentPage - 2, 1);
    let endPage = Math.min(startPage + maxPageButtons - 1, totalPages);

    if (endPage - startPage < maxPageButtons - 1) {
        startPage = Math.max(endPage - maxPageButtons + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="blogpage">
            <div className="category_slug">
                <div className="container">
                    <div className="category_title">
                        <div className="flex gap-1" data-aos="fade-right">
                            <h1>{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
                            <span>{blogs.length}</span>
                        </div>
                        <p data-aos="fade-left"></p>
                    </div>
                    <div className="category_blogs mt-3">
                        {currentBlogs.length > 0 ? currentBlogs.map((item) => {
                            const firstImageUrl = extractFirstImageUrl(item.description);
                            return (
                                <div className="cate_blog" key={item._id} data-aos="fade-up">
                                    <Link href={`/blog/${item.slug}`}>
                                        <img src={firstImageUrl || "/img/noimage.jpg"} alt="blog" />
                                    </Link>
                                    <div className="bloginfo mt-2">
                                        {item.tags && item.tags.length > 0 && (
                                            <Link href={`/tags/${item.tags[0].toLowerCase()}`}>
                                                <div className="blogtag">{item.tags[0]}</div>
                                            </Link>
                                        )}
                                        <Link href={`/blog/${item.slug}`}>
                                            <h3>{item.title}</h3>
                                        </Link>
                                        <div className="blogauthor flex gap-1">
                                            <div className="blogaimg">
                                                <img src="/img/coder.png" alt="author" />
                                            </div>
                                            <div className="flex flex-col flex-left gap-05">
                                                <h4>Admin</h4>
                                                <span>
                                                    {new Date(item.createdAt).toLocaleDateString('en-US', {
                                                        month: 'long',
                                                        day: 'numeric',
                                                        year: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div>No posts found for this category.</div>
                        )}
                    </div>
                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className='blogpagination'>
                            <button
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="pagination-button"
                            >
                                Previous
                            </button>
                            {pageNumbers.map(number => (
                                <button
                                    key={number}
                                    onClick={() => paginate(number)}
                                    className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                                >
                                    {number}
                                </button>
                            ))}
                            <button
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="pagination-button"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export async function getStaticPaths() {
    await mongooseConnect();

    // Fetch all unique categories from the database
    const categories = await Blog.distinct('blogcategory');

    // Normalize categories to lowercase to ensure consistent routing
    const normalizedCategories = categories.map(cat => cat.toLowerCase());

    // Generate paths for each category
    const paths = normalizedCategories.map(cat => ({
        params: { category: cat },
    }));

    return {
        paths,
        fallback: 'blocking', // Allows new categories to be generated on-demand
    };
}

export async function getStaticProps({ params }) {
    const { category } = params;
    await mongooseConnect();

    // Fetch blogs that match the category (case-insensitive) and are published
    const blogs = await Blog.find({
        blogcategory: { $in: [new RegExp(`^${category}$`, 'i')] },
        status: 'publish'
    }).sort({ createdAt: -1 });

    if (!blogs || blogs.length === 0) {
        return { notFound: true }; // Trigger a 404 page if no blogs are found
    }

    const perPage = 3; // Consistent perPage value
    const totalPages = Math.ceil(blogs.length / perPage);

    return {
        props: {
            blogs: JSON.parse(JSON.stringify(blogs)), // Serialize data for Next.js
            category,
            totalPages,
        },
        revalidate: 3600, // Revalidate the page every hour to fetch new data
    };
}
