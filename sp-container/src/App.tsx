import React, {lazy, Suspense} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./index.css";

const SpNavigationBar = lazy(() => import("spNavigationBar/App"));
const SpAuth = lazy(() => import("spAuth/App"));

const App = () => {
    return (
        <BrowserRouter>
            <div className="w-full">
                <Suspense fallback={<div>Loading Navigation Bar...</div>}>
                    <SpNavigationBar/>
                    <div className="flex h-auto mx-auto justify-center items-center">
                    <Routes>
                            <Route path="/" element={<div>Home Page</div>}/>
                            <Route path="/login" element={<SpAuth/>}/>
                        </Routes>
                    </div>

                </Suspense>
            </div>
        </BrowserRouter>
    );
}

export default App;