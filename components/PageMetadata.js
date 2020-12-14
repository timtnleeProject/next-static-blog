import React, { memo } from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { SITE } from "setting";
function PageMetadata({ title, image, description, home = false }) {
  const fullTitle = home ? title : `${title} - ${SITE.title}`;
  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
    </Head>
  );
}

PageMetadata.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string,
};
export default memo(PageMetadata);
