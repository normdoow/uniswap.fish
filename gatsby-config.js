module.exports = {
  plugins: [
    "gatsby-plugin-fontawesome-css",
    {
      resolve: `gatsby-plugin-plausible`,
      options: {
        domain: `uniswap.fish`,
      },
    },
    {
      resolve: `gatsby-plugin-styled-components`,
    },
    {
      resolve: `gatsby-plugin-global-styles`,
      options: {
        pathToConfigModule: `src/GlobalStyle`,
        props: {
          theme: `src/theme`,
        },
      },
    },
  ],
};
