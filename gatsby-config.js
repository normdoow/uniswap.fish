module.exports = {
  plugins: [
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
