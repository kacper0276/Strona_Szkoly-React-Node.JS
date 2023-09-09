import React from "react";

const LoginContext = React.createContext({
  state: [],
  dispatch: () => {},
});

export default LoginContext;
