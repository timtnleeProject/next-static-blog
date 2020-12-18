// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getLinkPreview } from "link-preview-js";

export default (req, res) => {
  const { link } = req.query;
  if (!link) {
    res.status(400).json({ message: "missing query: link" });
    return;
  }

  getLinkPreview(link).then((data) => {
    res.statusCode = 200;
    res.json(data);
  });
};
