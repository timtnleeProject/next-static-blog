import React, { useEffect, useRef, useMemo } from "react";
import { getPost, getPosts, getRecommandedPosts } from "data";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import PostComponent, { Metadata } from "components/Post";
import { DiscussionEmbed } from "disqus-react";
import styles from "styles/Post.module.scss";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
import Page from "components/Page";
import { bread, BreadCrumb } from "components/BreadCrumb";
import gfm from "remark-gfm";
import breaks from "remark-breaks";
import slug from "remark-slug";
import PageMetadata from "components/PageMetadata";
import { DISQUS, SITE } from "setting";
import LinkPreview from "components/LinkPreview";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle, faLink } from "@fortawesome/free-solid-svg-icons";
import AdsFrame from "components/AdsFrame";
import Image from "components/Image";
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
    const multiLine = /[\n\r]/.test(value);
    return (
      <SyntaxHighlighter style={tomorrow} language={language} showLineNumbers={multiLine}>
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
    return <Image className={styles.image} src={src} alt={alt} />;
  },
};

function Post(props) {
  const { post, recommanded, app } = props;
  const { group, name, metadata } = post;
  const url = `https://${DISQUS.host}/post/${group.name}/${name}`;
  const identifier = `${group.name}/${name}`;
  const title = metadata.title;
  const language = "en";

  // tree
  const ref = useRef(); // article
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
    const tree = [
      {
        id: h1.id,
        name: h1.innerText,
        href: `#${id}`,
        items: t,
      },
    ];
    if (tree?.[0]?.items?.length >= 2) {
      app.createTree(tree);
      return () => {
        app.clearTree(null);
      };
    }
  }, [app]);

  const breadcrumbs = useMemo(
    () => [
      bread.home,
      bread.post,
      {
        frag: group.name,
        name: group.display,
      },
      {
        frag: name,
        name: metadata.title,
      },
    ],
    [group, name, metadata],
  );
  return (
    <Page.Content>
      <PageMetadata
        title={metadata.title}
        description={metadata.preview}
        image={metadata.image}
      />
      <Page.CenterSection as="article" innerRef={ref} className={styles.article}>
        <BreadCrumb links={breadcrumbs} />
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
        <AdsFrame src="/ads/inpost.html" />
        <DiscussionEmbed
          shortname={DISQUS.shortname}
          config={{
            url,
            identifier,
            title,
            language,
          }}
        ></DiscussionEmbed>
      </Page.CenterSection>
      <h2 className="g-text-center">看看其他文章</h2>
      <PostComponent.VerticalList>
        {recommanded.map((recommand) => (
          <PostComponent.VerticalItem key={recommand.name} post={recommand} simple />
        ))}
      </PostComponent.VerticalList>
    </Page.Content>
  );
}

export default Post;

export async function getStaticProps(context) {
  const post = getPost(context.params.group, context.params.name);
  const recommanded = getRecommandedPosts(post);
  return {
    props: {
      post,
      recommanded,
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
