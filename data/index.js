// for server side/pre-render task
import fs from "fs";
import path from "path";

const postsDirectory = path.join(process.cwd(), "posts");

const posts = (function () {
  const filenames = fs.readdirSync(postsDirectory);
  return filenames
    .filter((name) => name.match(/\.md/))
    .map((filename) => {
      const name = filename.replace(/\.md/, "");
      try {
        const metadata = fs.readFileSync(
          path.join(postsDirectory, `${name}.json`),
          "utf-8",
        );
        const stat = fs.statSync(path.join(postsDirectory, filename));
        const raw = fs.readFileSync(path.join(postsDirectory, filename), "utf-8");
        return {
          name,
          stat: {
            mtime: stat.mtime.toJSON(),
          },
          raw,
          metadata: JSON.parse(metadata),
        };
      } catch (error) {
        throw new Error(`\x1b[41m[Warning] ${name} missing .json metadata file \x1b[0m`);
      }
    });
})();

export const getPosts = () => posts;

export const getPost = (name) => posts.find((p) => p.name === name);
