---
import type { APIRoute } from 'astro';
import { getAllBlogPosts } from "../../lib/queries";
import { urlFor } from "../../lib/sanityClient";

export const GET: APIRoute = async ({ site }) => {
  const posts = await getAllBlogPosts();
  const siteUrl = site?.origin ?? "https://harryzhao.com";

  const items = await Promise.all(posts.map(async (post) => {
    const postUrl = `${siteUrl}/blog/${post.slug.current}`;
    const pubDate = new Date(post.publishDate).toUTCString();
    const heroUrl = urlFor(post.heroImage).width(1200).url();

    const tagsXml = (post.tags || [])
      .map((tag) => `        <category>${tag}</category>`)
      .join('\n');

    return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      <content:encoded><![CDATA[
        <img src="${heroUrl}" alt="${post.title}" />
        <p>${post.excerpt}</p>
        <p><a href="${postUrl}">Read more...</a></p>
      ]]></content:encoded>
${tagsXml}
    </item>`;
  }));

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:atom="http://www.w3.org/2005/Atom"
>
  <channel>
    <title>Harry Zhao - Blog</title>
    <description>Blog posts by Harry Zhao on physical computing, digital media, and creative technology.</description>
    <link>${siteUrl}/blog</link>
    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>

${items.join('\n')}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
    },
  });
};
