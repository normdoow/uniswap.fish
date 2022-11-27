module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-plausible`,
      options: {
        domain: `uniswap.fish`,
      },
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
