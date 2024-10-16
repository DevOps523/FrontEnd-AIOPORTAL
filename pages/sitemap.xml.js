import { LRUCache } from "lru-cache";
// //pages/sitemap.xml.js
// const EXTERNAL_DATA_URL = 'http://localhost:3000';

// function generateSiteMap(posts2) {
//     return `<?xml version="1.0" encoding="UTF-8"?>
//    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
//      <!--We manually set the two URLs we know already-->
//     <url>
//      <loc>http://localhost:3000/</loc>
//      <lastmod>2024-02-24T12:12:26.731Z</lastmod>
//      <priority>1.0</priority>
//      <changefreq>yearly</changefreq>
//    </url>
//     <url>
//      <loc>http://localhost:3000/about/</loc>
//      <lastmod>2024-02-24T12:12:26.731Z</lastmod>
//      <priority>0.8</priority>
//      <changefreq>monthly</changefreq>
//    </url>
//     <url>
//      <loc>http://localhost:3000/topics/</loc>
//      <lastmod>2024-02-24T12:12:26.731Z</lastmod>
//      <priority>0.8</priority>
//      <changefreq>monthly</changefreq>
//    </url>
//    ${posts2.map(({ slug, blogcategory, createdAt }) => { // Assuming the field name is 'createdAt' in the second API
//         return `
//      <url>
//          <loc>${`${EXTERNAL_DATA_URL}/blog/${slug}`}</loc>
//          <lastmod>${createdAt}</lastmod>
//          <priority>0.5</priority>
//          <changefreq>weekly</changefreq>
//      </url>
//      <url>
//          <loc>${`${EXTERNAL_DATA_URL}/topics/${blogcategory}`}</loc>
//          <lastmod>${createdAt}</lastmod>
//          <priority>0.5</priority>
//          <changefreq>weekly</changefreq>
//      </url>
//    `;
//     }).join('')}
//    </urlset>
//  `;
// }

// function SiteMap() {
//     // getServerSideProps will do the heavy lifting
// }

// export async function getServerSideProps({ res }) {
//     // We make an API call to gather the URLs for our site
//     const request2 = await fetch(`${EXTERNAL_DATA_URL}/api/getblog`);
//     const posts2 = await request2.json();

//     // We generate the XML sitemap with the posts data
//     const sitemap = generateSiteMap(posts2);

//     res.setHeader('Content-Type', 'text/xml');
//     // we send the XML to the browser
//     res.write(sitemap);
//     res.end();

//     return {
//         props: {},
//     };
// }

// export default SiteMap;

// pages/sitemap.xml.js
const EXTERNAL_DATA_URL = process.env.NEXT_PUBLIC_EXTERNAL_DATA_URL;

/**
 * Generates the XML sitemap.
 * @param {Array} posts2 - Array of blog posts.
 * @returns {string} - XML sitemap as a string.
 */
function generateSiteMap(posts2) {
  // Initialize a Set to store unique categories
  const uniqueCategoriesSet = new Set();
  const uniqueTagsSet = new Set();

  // Iterate over each post to extract unique categories
  posts2.forEach((post) => {
    if (post.blogcategory) {
      if (typeof post.blogcategory === "string") {
        // If blogcategory is a string, normalize and add to the set
        const normalizedCategory = post.blogcategory.trim().toLowerCase();
        uniqueCategoriesSet.add(normalizedCategory);
      } else if (Array.isArray(post.blogcategory)) {
        // If blogcategory is an array, iterate and add each category
        post.blogcategory.forEach((category) => {
          if (typeof category === "string") {
            const normalizedCategory = category.trim().toLowerCase();
            uniqueCategoriesSet.add(normalizedCategory);
          }
        });
      }
      // If blogcategory is neither string nor array, you can handle other types here if needed
    }

    if (post.tags) {
      if (typeof post.tags === "string") {
        const normalizedTag = post.tags.trim().toLowerCase();
        uniqueTagsSet.add(normalizedTag);
      } else if (Array.isArray(post.tags)) {
        post.tags.forEach((tag) => {
          if (typeof tag === "string") {
            const normalizedTag = tag.trim().toLowerCase();
            uniqueTagsSet.add(normalizedTag);
          }
        });
      }
    }
  });

  // Convert the Set back to an Array for further processing
  const uniqueCategories = Array.from(uniqueCategoriesSet);
  const uniqueTags = Array.from(uniqueTagsSet);

  // Generate blog post URLs
  const blogUrls = posts2
    .map(
      ({ slug, createdAt }) => `
        <url>
            <loc>${`${EXTERNAL_DATA_URL}/blog/${encodeURIComponent(
              slug
            )}`}</loc>
            <lastmod>${new Date(createdAt).toISOString()}</lastmod>
            <priority>0.5</priority>
            <changefreq>weekly</changefreq>
        </url>
    `
    )
    .join("");

  // Generate unique category URLs
  const categoryUrls = uniqueCategories
    .map((category) => {
      // Find the latest updated date among posts in this category
      const latestPost = posts2
        .filter((post) => {
          if (typeof post.blogcategory === "string") {
            return post.blogcategory.trim().toLowerCase() === category;
          } else if (Array.isArray(post.blogcategory)) {
            return post.blogcategory.some(
              (cat) =>
                typeof cat === "string" && cat.trim().toLowerCase() === category
            );
          }
          return false;
        })
        .reduce((latest, post) => {
          const postDate = new Date(post.createdAt);
          if (!latest || postDate > new Date(latest.createdAt)) {
            return post;
          }
          return latest;
        }, null);

      const lastmod = latestPost
        ? new Date(latestPost.createdAt).toISOString()
        : new Date().toISOString();

      return `
            <url>
                <loc>${`${EXTERNAL_DATA_URL}/topics/${encodeURIComponent(
                  category.toLowerCase()
                )}`}</loc>
                <lastmod>${lastmod}</lastmod>
                <priority>0.5</priority>
                <changefreq>weekly</changefreq>
            </url>
        `;
    })
    .join("");

  // Generate unique tag URLs
  const tagUrls = uniqueTags
    .map((tag) => {
      // Find the latest updated date among posts with this tag
      const latestPost = posts2
        .filter((post) => {
          if (typeof post.tags === "string") {
            return post.tags.trim().toLowerCase() === tag;
          } else if (Array.isArray(post.tags)) {
            return post.tags.some(
              (t) => typeof t === "string" && t.trim().toLowerCase() === tag
            );
          }
          return false;
        })
        .reduce((latest, post) => {
          const postDate = new Date(post.createdAt);
          if (!latest || postDate > new Date(latest.createdAt)) {
            return post;
          }
          return latest;
        }, null);

      const lastmod = latestPost
        ? new Date(latestPost.createdAt).toISOString()
        : new Date().toISOString();

      return `
            <url>
                <loc>${`${EXTERNAL_DATA_URL}/tag/${encodeURIComponent(
                  tag
                )}`}</loc>
                <lastmod>${lastmod}</lastmod>
                <priority>0.5</priority>
                <changefreq>weekly</changefreq>
            </url>
        `;
    })
    .join("");

  // Define fixed URLs
  const fixedUrls = `
        <url>
            <loc>${EXTERNAL_DATA_URL}/</loc>
            <lastmod>2024-02-24T12:12:26.731Z</lastmod>
            <priority>1.0</priority>
            <changefreq>yearly</changefreq>
        </url>
        <url>
            <loc>${EXTERNAL_DATA_URL}/about/</loc>
            <lastmod>2024-02-24T12:12:26.731Z</lastmod>
            <priority>0.8</priority>
            <changefreq>monthly</changefreq>
        </url>
        <url>
            <loc>${EXTERNAL_DATA_URL}/topics/</loc>
            <lastmod>2024-02-24T12:12:26.731Z</lastmod>
            <priority>0.8</priority>
            <changefreq>monthly</changefreq>
        </url>
    `;

  // Combine all parts into the final sitemap
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <!-- Fixed URLs -->
        ${fixedUrls}
        
        <!-- Blog Post URLs -->
        ${blogUrls}
        
        <!-- Unique Category URLs -->
        ${categoryUrls}

        <!-- Unique Tag URLs -->
        ${tagUrls}
    </urlset>
    `;
}

function SiteMap() {
    // This component remains empty as the sitemap is generated server-side
}

// Initialize the cache outside the handler to persist across requests
const cache = new LRUCache({
    max: 1, // Only cache the sitemap
    ttl: 1000 * 60 * 60, // 1 hour in milliseconds
});

export async function getServerSideProps({ res }) {
    try {
        // Check if sitemap is in cache
        let sitemap = cache.get('sitemap');

        if (!sitemap) {
            // Fetch blog posts from your API
            const request2 = await fetch(`${EXTERNAL_DATA_URL}/api/getblog`);

            if (!request2.ok) {
                throw new Error(`Failed to fetch posts: ${request2.statusText}`);
            }

            const posts2 = await request2.json();

            // Ensure posts2 is an array
            if (!Array.isArray(posts2)) {
                throw new Error('Invalid data format: Expected an array of posts');
            }

            // Generate the XML sitemap with the posts data
            sitemap = generateSiteMap(posts2);

            // Cache the sitemap
            cache.set('sitemap', sitemap);
        }

        // Set the response headers and send the sitemap
        res.setHeader('Content-Type', 'text/xml');
        res.write(sitemap);
        res.end();

        return {
            props: {}, // No props needed as sitemap is sent directly
        };
    } catch (error) {
        console.error('Error generating sitemap:', error);
        res.statusCode = 500;
        res.end('Internal Server Error');

        return {
            props: {},
        };
    }
}

export default SiteMap;

// function SiteMap() {
//   // This component remains empty as the sitemap is generated server-side
// }

// // Initialize the cache outside the handler to persist across requests
// //new features
// const cache = new LRU({
//     max: 1, // Only cache the sitemap
//     maxAge: 1000 * 60 * 60, // 1 hour in milliseconds
// });

// export async function getServerSideProps({ res }) {
//   try {
    
//     // Check if sitemap is in cache
//     let sitemap = cache.get('sitemap');

//     // Fetch blog posts from your API
//     const request2 = await fetch(`${EXTERNAL_DATA_URL}/api/getblog`);

//     if (!request2.ok) {
//       throw new Error(`Failed to fetch posts: ${request2.statusText}`);
//     }

//     const posts2 = await request2.json();

//     // Ensure posts2 is an array
//     if (!Array.isArray(posts2)) {
//       throw new Error("Invalid data format: Expected an array of posts");
//     }

//     // Generate the XML sitemap with the posts data
//     const sitemap = generateSiteMap(posts2);

//     // Set the response headers and send the sitemap
//     res.setHeader("Content-Type", "text/xml");
//     res.write(sitemap);
//     res.end();

//     return {
//       props: {}, // No props needed as sitemap is sent directly
//     };
//   } catch (error) {
//     console.error("Error generating sitemap:", error);
//     res.statusCode = 500;
//     res.end("Internal Server Error");

//     return {
//       props: {},
//     };
//   }
// }


