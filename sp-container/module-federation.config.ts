export const mfConfig = {
    name: "sp_container",
    remotes: {
        spNavigationBar: "spNavigationBar@http://localhost:3000/remoteEntry.js",
        spAuth: "spAuth@http://localhost:3001/remoteEntry.js",
        spMainPage: "spMainPage@http://localhost:3002/remoteEntry.js",
    },
    shared: {
        react: {singleton: true, requiredVersion: "^18.2.0"},
        "react-dom": {singleton: true, requiredVersion: "^18.2.0"},
        "react-router-dom": {singleton: true, requiredVersion: "^6.30.0"},
    },
};
