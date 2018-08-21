const colors = require("../../src/styles/colors");

module.exports = {
  siteTitle: "Benjamin Piouffle - @Betree's Blog", // <title>
  shortSiteTitle: "@Betree's Blog", // <title> ending for posts and pages
  siteDescription: "Benjamin Piouffle - @Betree's Blog",
  siteUrl: "https://blog.benjamin.piouffle.com",
  pathPrefix: "",
  siteImage: "preview.jpg",
  siteLanguage: "en",
  // author
  authorName: "Benjamin Piouffle",
  authorTwitterAccount: "betree83",
  // info
  infoTitle: "Benjamin Piouffle",
  infoTitleNote: "Personal Blog",
  // manifest.json
  manifestName: "Benjamin Piouffle - @Betree's Blog",
  manifestShortName: "PersonalBlog", // max 12 characters
  manifestStartUrl: "/",
  manifestBackgroundColor: colors.background,
  manifestThemeColor: colors.background,
  manifestDisplay: "standalone",
  // contact
  contactEmail: "benjamin.piouffle@protonmail.ch",
  // social
  authorSocialLinks: [
    { name: "github", url: "https://github.com/Betree" },
    { name: "twitter", url: "https://twitter.com/Betree83" }
  ]
};
