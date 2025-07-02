import React from "react";

import "./index.css";

const App = () => (
    <nav className="flex w-full px-48 py-4 justify-between items-center bg-white border-b border-gray-300">
        <div className="text-xl font-bold text-gray-800">로고</div>
        <div className="flex space-x-8">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">메뉴1</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">메뉴2</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">메뉴3</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">메뉴4</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">메뉴5</a>
        </div>
    </nav>
);


export default App