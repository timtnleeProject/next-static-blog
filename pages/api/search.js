import { getPosts } from "data";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const posts = getPosts();

const search = (text, source) => source.toUpperCase().includes(text.toUpperCase());

export default (req, res) => {
  const text = req.query.text;
  res.statusCode = 200;
  const filtered = text
    ? posts.filter((p) => {
        const { title, preview, tags } = p.metadata;
        return (
          search(text, title) ||
          search(text, preview) ||
          tags.some((t) => search(text, t))
        );
      })
    : [];
  res.json(filtered);
};
