import React, { useCallback, useEffect, useRef, useState } from "react";
import classnames from "classnames";
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
import PageMetadata from "components/PageMetadata";
import { DISQUS, SITE } from "setting";
import LinkPreview from "components/LinkPreview";
import Image from "components/Image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCaretUp,
  faExclamationCircle,
  faLink,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { faElementor } from "@fortawesome/free-brands-svg-icons";
import Tree from "components/Tree";
import App from "components/App";
import Card from "components/Card";

const renderers = {
  heading: function Heading(el) {
    const { level, node, children } = el;
    const slug = node?.data?.id;
    if (level === 2 || level === 3) {
      return React.createElement(`h${level}`, { id: slug }, [
        React.createElement(
          "a",
          {
            href: `#${slug}`,
            "aria-hidden": true,
            tabIndex: -1,
            key: "link",
          },
          React.createElement(FontAwesomeIcon, {
            icon: faLink,
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

  // tree
  const ref = useRef(); // article
  const [tree, setTree] = useState([]);
  const [mbTreeToggle, setMbTreeToggle] = useState(false);
  const toggle = useCallback(() => {
    setMbTreeToggle((t) => !t);
  }, []);
  useEffect(() => {
    const t = [];
    const headers = ref.current.querySelectorAll("h2,h3");
    Array.from(headers).forEach((el) => {
      if (el.tagName === "H2") {
        t.push({
          id: el.id,
          name: el.innerText,
          href: `#${el.id}`,
          items: [],
        });
      } else {
        t[t.length - 1]?.items.push({
          id: el.id,
          name: el.innerText,
          href: `#${el.id}`,
        });
      }
    });
    const id = "article-title";
    const h1 = ref.current.querySelector("h1");
    h1.setAttribute("id", id);
    setTree([
      {
        id: h1.id,
        name: h1.innerText,
        href: `#${id}`,
        items: t,
      },
    ]);
  }, []);

  return (
    <Page.Content innerRef={ref}>
      <PageMetadata
        title={metadata.title}
        description={metadata.preview}
        image={metadata.image}
      />
      <BreadCrumb />
      <article className={styles.article}>
        <Metadata post={post} />
        <ReactMarkdown
          linkTarget="_blank"
          renderers={renderers}
          plugins={[gfm, breaks, slug]}
        >
          {post.raw}
        </ReactMarkdown>
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
      </article>
      {tree?.[0]?.items?.length >= 2 && (
        <App.Body className={styles.mockBody}>
          <App.Content className={styles.mockContent}></App.Content>
          <App.Aside>
            {mbTreeToggle && <div className={styles.mbLayer} onClick={toggle}></div>}
            <Card className={classnames(styles.menu, mbTreeToggle && styles.mbTreeShow)}>
              <div className={styles.iconRight}>
                <FontAwesomeIcon
                  icon={faTimes}
                  className={styles.closeIcon}
                  onClick={toggle}
                />
              </div>
              <Tree tree={tree} />
            </Card>
            <button className={styles.indicator} onClick={toggle}>
              <FontAwesomeIcon
                icon={mbTreeToggle ? faCaretUp : faElementor}
                className={styles.menuIcon}
              />
              目錄
            </button>
          </App.Aside>
        </App.Body>
      )}
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
