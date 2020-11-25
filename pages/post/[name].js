import { getPost, getPosts } from "data";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

const renderers = {
  code: ({ language, value }) => {
    return <SyntaxHighlighter style={dark} language={language} children={value} />;
  },
};

export default function Post(props) {
  const { post } = props;

  return <ReactMarkdown renderers={renderers}>{post.raw}</ReactMarkdown>;
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
