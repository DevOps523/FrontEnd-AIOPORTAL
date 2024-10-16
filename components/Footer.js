import Link from "next/link";

export default function Footer() {
    return <>
        <div className="footer">
            <div className="container flex flex-sb flex-wrap flex-left">
                <div className="footer_logo" data-aos="fade-right">
                    <h2>AIO PORTAL</h2>
                    <h4>&copy; 2024 ALL Rights Reserved.</h4>
                    {/* <h3>Coded By <span>@vbmcoder</span></h3> */}
                </div>
                <div className="q_links" data-aos="fade-up">
                    <h3>Quick Links</h3>
                    <ul>
                        <li><Link href='/topics/courses'>Courses</Link></li>
                        <li><Link href='/topics/entertainment'>Entertainment</Link></li>
                        <li><Link href='/topics/graphicresources'>Graphic Resources</Link></li>
                        <li><Link href='/topics/software'>Software</Link></li>
                        <li><Link href='/topics/games'>Games</Link></li>
                        <li><Link href='/topics/templates'>Templates</Link></li>
                        <li><Link href='/topics/mobileapps'>Mobile Apps</Link></li>
                    </ul>
                </div>
                <div className="q_links" data-aos="fade-up">
                    <h3>FAQ's</h3>
                    <ul>
                        <li><Link href='/'>Privacy Notice</Link></li>
                        <li><Link href='/'>Cookie Policy</Link></li>
                        <li><Link href='/'>Terms Of Use</Link></li>
                    </ul>
                </div>
                <div className="q_links" data-aos="fade-left">
                    <h3>Social Media</h3>
                    <ul>
                        <li><Link href='/'>Github</Link></li>
                        <li><Link href='/'>Twitter</Link></li>
                        <li><Link href='/'>Instagram</Link></li>
                    </ul>
                </div>
            </div>
        </div>
    </>
}