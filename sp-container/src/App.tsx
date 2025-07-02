import React, {lazy, Suspense} from "react";

import "./index.css";

const SpNavigationBar = lazy(() => import("spNavigationBar/App"));

const App = () => {
    return (
        <div className="w-full">
            <Suspense fallback={<div>Loading Navigation Bar...</div>}>
                <SpNavigationBar/>
            </Suspense>
        </div>
    );
}

export default App;