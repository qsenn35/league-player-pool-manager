import React, { useState, createContext } from "react";

// Create Context Object
const localUser = localStorage.user;
const initialState = localUser ? JSON.parse(localStorage.user) : null;
export const UserContext = createContext(initialState);

// Create a provider for components to consume and subscribe to changes
export const UserContextProvider = props => {
  const [user, setUser] = useState(initialState);
  
  // update localStorage and setUser
  const _setUser = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  }

  return (
    <UserContext.Provider value={[user, _setUser]}>
      {props.children}
    </UserContext.Provider>
  );
};