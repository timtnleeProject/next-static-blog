import { useEffect } from "react";
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

  useEffect(() => {
    const { group, name, metadata } = post;
    const url = `https://${window.location.host}/post/${group.name}/${name}`;
    const identifier = metadata.title;
    const script = document.createElement("SCRIPT");
    script.setAttribute("id", "disqus-script");
    script.innerHTML = `/**
    *  RECOMMENDED CONFIGURATION VARIABLES: EDIT AND UNCOMMENT THE SECTION BELOW TO INSERT DYNAMIC VALUES FROM YOUR PLATFORM OR CMS.
    *  LEARN WHY DEFINING THESE VARIABLES IS IMPORTANT: https://disqus.com/admin/universalcode/#configuration-variables    */
    var disqus_config = function () {
    this.page.url = "${url}";  // Replace PAGE_URL with your page's canonical URL variable
    this.page.identifier = "${identifier}"; // Replace PAGE_IDENTIFIER with your page's unique identifier variable
    };
    (function() { // DON'T EDIT BELOW THIS LINE
    var d = document, s = d.createElement('script');
    s.src = 'https://blog-gjsysjy5bw.disqus.com/embed.js';
    s.setAttribute('data-timestamp', +new Date());
    (d.head || d.body).appendChild(s);
    })();`;
    document.body.appendChild(script);
    return () => {
      document.body.querySelector("#disqus-script").remove();
    };
  }, [post]);

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
      <div id="disqus_thread"></div>
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
