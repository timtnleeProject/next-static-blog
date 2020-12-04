// for server side/pre-render task
import fs from "fs";
import path from "path";
import { group as groupSetting } from "../setting";

const postsDirectory = path.join(process.cwd(), "posts");

const groups = (function () {
  const filenames = fs.readdirSync(postsDirectory);
  return filenames.map((dirname) => ({
    name: groupSetting[dirname] || "Not defined",
    dirname,
  }));
})();

const posts = (function () {
  return groups.reduce((posts, group) => {
    const dir = path.join(postsDirectory, group.dirname);
    const filenames = fs.readdirSync(dir);
    const postsInGroup = filenames
      .filter((name) => name.match(/\.md/))
      .map((filename) => {
        const name = filename.replace(/\.md/, "");
        try {
          const metadata = fs.readFileSync(path.join(dir, `${name}.json`), "utf-8");
          const stat = fs.statSync(path.join(dir, filename));
          const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
          return {
            name,
            stat: {
              mtime: stat.mtime.toJSON(),
            },
            raw,
            group,
            metadata: JSON.parse(metadata),
          };
        } catch (error) {
          throw new Error(
            `\x1b[41m[Warning] ${name} missing .json metadata file \x1b[0m`,
          );
        }
      })
      .sort((a, b) =>
        b.stat.mtime > a.stat.mtime ? 1 : b.stat.mtime === a.stat.mtime ? 0 : -1,
      );
    return posts.concat(postsInGroup);
  }, []);
})();

export const getPosts = () => posts;

export const getPost = (name) => posts.find((p) => p.name === name);
