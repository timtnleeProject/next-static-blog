import { getPost, getPosts } from "data";
import Head from "next/head";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Metadata } from "components/Post";
import styles from "styles/Post.module.scss";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import Page from "components/Page";

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

  return (
    <Page.Content>
      <Head>
        <title>{post.metadata?.title}</title>
      </Head>
      <Metadata metadata={post.metadata} />
      <article className={styles.article}>
        <ReactMarkdown linkTarget="_blank" renderers={renderers}>
          {post.raw}
        </ReactMarkdown>
      </article>
    </Page.Content>
  );
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
