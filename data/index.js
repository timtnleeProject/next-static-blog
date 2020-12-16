// for server side/pre-render task
import fs from "fs";
import path from "path";
import { sortBy } from "utils/data";
import { GROUP } from "../setting";

const postsDirectory = path.join(process.cwd(), "posts");

const { groups, posts } = (function () {
  const groups = (function () {
    const filenames = fs.readdirSync(postsDirectory);
    return filenames.map((dirname) => ({
      display: GROUP[dirname] || "Not defined",
      name: dirname,
      count: 0,
    }));
  })();
  const posts = groups
    .reduce((posts, group, gidx) => {
      const dir = path.join(postsDirectory, group.name);
      const filenames = fs.readdirSync(dir);
      const postFiles = filenames.filter((name) => name.match(/\.md/));
      groups[gidx].count = postFiles.length; // group count
      const postsInGroup = postFiles.map((filename) => {
        const name = filename.replace(/\.md/, "");
        try {
          const metadata = JSON.parse(
            fs.readFileSync(path.join(dir, `${name}.json`), "utf-8"),
          );
          const raw = fs.readFileSync(path.join(dir, filename), "utf-8");

          return {
            name,
            raw,
            group,
            metadata,
            tagMap: metadata.tags.reduce((map, tag) => {
              return {
                ...map,
                [tag]: true,
              };
            }, {}),
          };
        } catch (error) {
          throw new Error(
            `\x1b[41m[Warning] ${name} missing .json metadata file \x1b[0m`,
          );
        }
      });

      return posts.concat(postsInGroup);
    }, [])
    .sort(sortBy((post) => post.metadata.birthtime, true));
  return {
    groups,
    posts,
  };
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
    const count = {};
    posts
      .filter((p) => p.group.name === group.name)
      .forEach((p) => {
        p.metadata.tags.forEach((tag) => {
          tags.add(tag);
          if (!count[tag]) count[tag] = 0;
          count[tag] += 1;
        });
      });
    map[group.name] = Array.from(tags).map((tag) => ({
      name: tag,
      count: count[tag],
    }));
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
