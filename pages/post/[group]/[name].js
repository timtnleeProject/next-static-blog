import React, { useEffect, useRef } from "react";
import { getPost, getPosts } from "data";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { Metadata } from "components/Post";
import { DiscussionEmbed } from "disqus-react";
import styles from "styles/Post.module.scss";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import Page from "components/Page";
import { BreadCrumb } from "components/BreadCrumb";
import gfm from "remark-gfm";
import breaks from "remark-breaks";
import slug from "remark-slug";
import { ToTop } from "components/ToTop";
import PageMetadata from "components/PageMetadata";
import { DISQUS, SITE } from "setting";
import LinkPreview from "components/LinkPreview";
import Image from "components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faThumbtack } from "@fortawesome/free-solid-svg-icons";

const renderers = {
  heading: function Heading(el) {
    const { level, node, children } = el;
    const slug = node?.data?.id;
    if (level === 2 || level === 3) {
      return React.createElement(`h${level}`, { id: slug }, [
        React.createElement(
          "a",
          { href: `#${slug}`, ariaHidden: true, tabIndex: -1 },
          React.createElement(FontAwesomeIcon, {
            icon: faThumbtack,
            className: level === 2 ? "g-color-emphasis" : "g-color-main",
          }),
        ),
        ...React.Children.toArray(children),
      ]);
    }
    return React.createElement(`h${level}`, {}, React.Children.toArray(children));
  },
  code: function Code({ language, value }) {
    return (
      <SyntaxHighlighter style={tomorrow} language={language}>
        {value}
      </SyntaxHighlighter>
    );
  },
  link: function Link(el) {
    const { href, node, children, target } = el;
    return href === node.children[0]?.value ? (
      <LinkPreview href={href} target={target} />
    ) : (
      <a target={target} href={href} className={styles.link}>
        {children}
      </a>
    );
  },
  image: function PostImage({ src, alt }) {
    return <Image src={src} alt={alt} />;
  },
};

export default function Post(props) {
  const { post } = props;

  const { group, name, metadata } = post;
  const url = `https://${DISQUS.host}/post/${group.name}/${name}`;
  const identifier = `${group}/${name}`;
  const title = metadata.title;
  const language = "en";

  const ref = useRef();
  useEffect(() => {
    const tree = [];
    const headers = ref.current.querySelectorAll("h2,h3");
    Array.from(headers).forEach((el) => {
      console.log(el);
    });
  }, []);

  return (
    <Page.Content>
      <PageMetadata
        title={metadata.title}
        description={metadata.preview}
        image={metadata.image}
      />
      <BreadCrumb />
      <Metadata post={post} />
      <article ref={ref} className={styles.article}>
        <ReactMarkdown
          linkTarget="_blank"
          renderers={renderers}
          plugins={[gfm, breaks, slug]}
        >
          {post.raw}
        </ReactMarkdown>
      </article>
      <div className={styles.declare}>
        <div>
          <FontAwesomeIcon icon={faExclamationCircle} />
          此文章出自<b>{SITE.title}</b>，請勿抄襲，轉載請註明出處。
        </div>
      </div>
      <DiscussionEmbed
        shortname={DISQUS.shortname}
        config={{
          url,
          identifier,
          title,
          language,
        }}
      ></DiscussionEmbed>
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
