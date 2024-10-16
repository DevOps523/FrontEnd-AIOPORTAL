import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { a11yDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import Head from "next/head";
import { FaGithub, FaInstagram, FaTwitter } from "react-icons/fa6";
import { SiCoursera } from "react-icons/si";
import { BiSolidMoviePlay } from "react-icons/bi";
import { GrResources } from "react-icons/gr";
import { FaComputer } from "react-icons/fa6";
import { GiGameConsole } from "react-icons/gi";
import { CgTemplate } from "react-icons/cg";
import { FaMobileScreen } from "react-icons/fa6";

export default function blogPage() {

    const router = useRouter();
    const { slug } = router.query;
    const [blog, setBlog] = useState(['']);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        if (slug) { // Check if slug exists
            axios.get(`/api/getblog?slug=${slug}`).then(res => {
                const alldata = res.data;
                setBlog(alldata);
                setLoading(false);
            }).catch(error => {
                console.error("Error fetching blog:", error);
            });
        }
    }, [slug]);

    // function createMarkup(c) {
    //     return { __html: c }
    // }


    const Code = ({ node, inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || '');

        const [copied, setCopied] = useState(false);

        const handleCopy = () => {
            navigator.clipboard.writeText(children);
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 3000); // 3000 milliseconds = 3 seconds
        };

        if (inline) {
            return <code>{children}</code>;
        } else if (match) {
            return (

                <div style={{ position: 'relative' }}>
                    <SyntaxHighlighter
                        style={a11yDark}
                        language={match[1]}
                        PreTag="pre"
                        {...props}
                        codeTagProps={{ style: { padding: '0', borderRadius: '5px', overflowX: 'auto', whiteSpace: 'pre-wrap' } }}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                    <button style={{ position: 'absolute', top: '0', right: '0', zIndex: '1', background: '#3d3d3d', color: '#fff', padding: '10px' }} onClick={handleCopy}>
                        {copied ? 'Copied!' : 'Copy code'}
                    </button>
                </div>
            );
        } else {
            return (
                <code className="md-post-code" {...props}>
                    {children}
                </code>
            );
        }
    };


    return <>
        <Head>
            <title>
                {!blog ? 'Loading...' :
                    blog && blog[0] && blog[0].slug ?
                        blog[0].slug.replace(/-/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
                        : 'Loading...'
                }
            </title>

        </Head>

        <div className="slugpage">
            <div className="container">
                <div className="topslug_titles" data-aos="fade-right">
                    <h1 className="slugtitle">{loading ?<div> loading...</div> : blog && blog[0]?.title}</h1>
                    <h5>By <span>Admin</span>・ Published in <span>{loading ?<div> loading...</div> : blog && blog[0]?.blogcategory}</span> ・   {blog && new Date(blog[0].createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        <span>・ 1 min read</span></h5>
                </div>

                {/* blog data section */}
                <div className="flex flex-sb flex-left pb-5 flex-wrap">
                    <div className="leftblog_data_markdown" data-aos="fade-up">
                        {loading ? <>
                            <div className='wh-100 flex flex-center mt-3'>
                                    <div aria-live="assertive" role="alert" className="loader"></div>
                            </div>
                        </> : <>
                            <div className="w-100 blogcontent" >
                                {/* content */}

                                <ReactMarkdown
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        code: Code,
                                    }}
                                >
                                    {blog[0].description}
                                </ReactMarkdown>
                            </div>

                        </>}
                    </div>
                    <div className="rightslug_data">
                        <div className="slug_profile_info">
                            <div className="slugprofile_sec">
                                <div className="profile_imgbg"></div>
                                <div className="slug_profile_img">
                                    {/* <div className="image_bg_top0"></div>
                                    <div className="image_bg_top1"></div> */}
                                    <img src="/img/coder.png" alt="coder" />
                                </div>
                            </div>
                            <h3>Admin</h3>
                            <h4>Website Developer</h4>
                            <div className="social_talks flex flex-center gap-1 mt-2">
                                <div className="st_icon">
                                    <FaGithub />
                                </div>
                                <div className="st_icon">
                                    <FaTwitter />
                                </div>
                                <div className="st_icon">
                                    <FaInstagram />
                                </div>
                            </div>
                        </div>
                        <div className="topics_sec">
                            <h2>Topics</h2>
                            <div className="topics_list">
                                <Link href='/topics/courses'>
                                    <div className="topics">
                                        <div className="flex flex-center topics_svg">
                                            <SiCoursera />
                                        </div>
                                        <h3>Courses</h3>
                                    </div>
                                </Link>
                                <Link href='/topics/entertainment'>
                                    <div className="topics">
                                        <div className="flex flex-center topics_svg">
                                            <BiSolidMoviePlay />
                                        </div>
                                        <h3>Entertainment</h3>
                                    </div>
                                </Link>
                                <Link href='/topics/graphicresources'>
                                    <div className="topics">
                                        <div className="flex flex-center topics_svg">
                                            <GrResources />
                                        </div>
                                        <h3>Graphic Resources</h3>
                                    </div>
                                </Link>
                                <Link href='/topics/software'>
                                    <div className="topics">
                                        <div className="flex flex-center topics_svg">
                                            <FaComputer />
                                        </div>
                                        <h3>Software</h3>
                                    </div>
                                </Link>
                                <Link href='/topics/games'>
                                    <div className="topics">
                                        <div className="flex flex-center topics_svg">
                                            <GiGameConsole />
                                        </div>
                                        <h3>Games</h3>
                                    </div>
                                </Link>
                                <Link href='/topics/templates'>
                                    <div className="topics">
                                        <div className="flex flex-center topics_svg">
                                            <CgTemplate />
                                        </div>
                                        <h3>Templates</h3>
                                    </div>
                                </Link>
                                <Link href='/topics/mobileapps'>
                                    <div className="topics">
                                        <div className="flex flex-center topics_svg">
                                            <FaMobileScreen />
                                        </div>
                                        <h3>Mobile Apps</h3>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
}





