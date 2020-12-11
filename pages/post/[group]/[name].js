import { getPost, getPosts } from "data";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Metadata } from "components/Post";
import styles from "styles/Post.module.scss";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import Page from "components/Page";
import { BreadCrumb } from "components/BreadCrumb";
import breaks from "remark-breaks";
import { ToTop } from "components/ToTop";
import PageMetadata from "components/PageMetadata";

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
      <PageMetadata title={post.metadata.title} description={post.metadata.preview} />
      <BreadCrumb />
      <Metadata post={post} />
      <article className={styles.article}>
        <ReactMarkdown linkTarget="_blank" renderers={renderers} plugins={[breaks]}>
          {post.raw}
        </ReactMarkdown>
      </article>
      <ToTop />
    </Page.Content>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      post: getPost(context.params.group, context.params.name),
    },
  };
}

export async function getStaticPaths() {
  return {
    paths: getPosts().map(({ name, group }) => {
      return { params: { name, group: group.name } };
    }),
    fallback: false, // See the "fallback" section below
  };
}
