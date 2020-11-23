import { getPost, getPosts } from "data";
import ReactMarkdown from "react-markdown";

export default function Post(props) {
  const { post } = props;

  return <ReactMarkdown>{post.raw}</ReactMarkdown>;
}

export async function getStaticProps(context) {
  return {
    props: {
      post: getPost(context.params.name),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: getPosts().map(({ name }) => ({ params: { name } })),
    fallback: false, // See the "fallback" section below
  };
}
