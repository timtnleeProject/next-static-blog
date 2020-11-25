import { getPost, getPosts } from "data";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

const renderers = {
  // eslint-disable-next-line react/display-name
  code: ({ language, value }) => {
    return (
      <SyntaxHighlighter style={tomorrow} language={language}>
        {value}
      </SyntaxHighlighter>
    );
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
