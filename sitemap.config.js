module.exports = {
  siteUrl: "https://blog.timtnlee.me",
  generateRobotsTxt: false, // (optional)
  transform: (config, url) => {
    // custom function to ignore the url
    if (/\/404/.test(url)) {
      return null;
    }

    // Use default transformation for all other cases
    return {
      loc: url,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
