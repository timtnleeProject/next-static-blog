import { getPosts } from "data";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const posts = getPosts();

export default (req, res) => {
  const start = +req.query.start || 0;
  const length = +req.query.length || 10;
  res.statusCode = 200;
  res.json(posts.slice(start, start + length));
};
