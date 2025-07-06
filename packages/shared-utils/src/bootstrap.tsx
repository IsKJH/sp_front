import React from "react";
import ReactDOM from "react-dom/client";

interface BootstrapOptions {
  elementId?: string;
  initAuth?: boolean;
}

export const bootstrapApp = (
  App: React.ComponentType, 
  options: BootstrapOptions = {}
) => {
  const { elementId = "app", initAuth = true } = options;
  
  const root = ReactDOM.createRoot(document.getElementById(elementId)!);
  
  if (initAuth) {
    // 인증 초기화 로직
    const { useUserStore } = require('./store');
    const store = useUserStore.getState();
    store.initializeAuth();
  }
  
  root.render(<App />);
};