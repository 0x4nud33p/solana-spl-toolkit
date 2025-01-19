"use client"

import React, { createContext, ReactNode, useState, useContext } from "react";

interface UrlContextType {
  url: string;
  setUrl: (newUrl: string) => void;
  videoId : string;
  setVideoId : (videoid : string) => void;
}

const UrlContext = createContext<UrlContextType | undefined>(undefined);

interface UrlProviderProps {
  children: ReactNode;
}

const UrlProvider: React.FC<UrlProviderProps> = ({ children }) => {
  const [url, setUrl] = useState<string>("");
  const [videoId, setVideoId] = useState<string>("");

  return (
    <UrlContext.Provider value={{ url, setUrl, videoId, setVideoId }}>
      {children}
    </UrlContext.Provider>
  );
};

const useUrlContext = (): UrlContextType => {
  const context = useContext(UrlContext);
  if (!context) {
    throw new Error("useUrlContext must be used within a UrlProvider");
  }
  return context;
};

export { UrlContext, UrlProvider, useUrlContext };
