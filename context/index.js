import { createContext, useContext, useState } from "react";

const userContext = createContext({});

export const UserContextProvider = ({ children }) => {
  const [username, setUsername] = useState({ id: "", name: "" });

  return (
    <userContext.Provider value={{ username, setUsername }}>
      {children}
    </userContext.Provider>
  );
};

export const useUserContext = () => useContext(userContext);
