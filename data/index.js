// for server side/pre-render task
import fs from "fs";
import path from "path";
import { GROUP } from "../setting";

const postsDirectory = path.join(process.cwd(), "posts");

const groups = (function () {
  const filenames = fs.readdirSync(postsDirectory);
  return filenames.map((dirname) => ({
    display: GROUP[dirname] || "Not defined",
    name: dirname,
  }));
})();

const posts = (function () {
  return groups.reduce((posts, group) => {
    const dir = path.join(postsDirectory, group.name);
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

const groupsPostsMap = (function () {
  return groups.reduce((map, group) => {
    const postsInGroup = posts.filter((p) => p.group.name === group.name);
    map[group.name] = postsInGroup;
    return map;
  }, {});
})();

const groupTagsMap = (function () {
  return groups.reduce((map, group) => {
    const tags = new Set();
    posts
      .filter((p) => p.group.name === group.name)
      .forEach((p) => {
        p.metadata.tags.forEach((tag) => {
          tags.add(tag);
        });
      });
    map[group.name] = Array.from(tags);
    return map;
  }, {});
})();

const limitPost = (posts) =>
  posts.map((p) => {
    const { raw, ...rest } = p;
    return {
      ...rest,
    };
  });

export const getPosts = () => limitPost(posts);

export const getPostsByGroup = (groupName) => limitPost(groupsPostsMap[groupName]);

export const getPost = (groupName, name) =>
  groupsPostsMap[groupName]?.find((p) => p.name === name);

export const getGroups = () => groups;

export const getTagsByGroup = (groupName) => groupTagsMap[groupName];
