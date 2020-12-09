import { getGroups } from "data";

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const groups = getGroups();

export default (req, res) => {
  res.statusCode = 200;
  res.json(groups);
};
