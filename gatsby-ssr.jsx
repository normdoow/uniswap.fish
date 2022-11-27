const React = require("react");
const ContextProvider = require("./src/context/ContextProvider").default;

exports.wrapRootElement = ({ element }) => {
  return (
    <React.StrictMode>
      <ContextProvider>{element}</ContextProvider>
    </React.StrictMode>
  );
};
