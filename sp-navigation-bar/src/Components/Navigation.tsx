import React, {useState} from "react";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoImage from "../assets/github_logo.png";
import {motion, AnimatePresence} from "framer-motion";
import "../index.css";

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    let menus = ["메뉴1", "메뉴2", "메뉴3", "메뉴4", "메뉴5"];

    return (
        <div className="relative">
            <nav
                className="flex w-full h-16 px-12 lg:px-36 py-4 justify-between items-center border-b border-gray-300">
                <img src={LogoImage} alt="Logo" className="h-auto w-9 cursor-pointer"/>
                <div className="hidden lg:flex space-x-8 items-center">
                    {menus.map((menu, index) => (
                        <a key={index} href="#"
                           className="text-gray-600 hover:text-blue-600 transition-colors">{menu}</a>
                    ))}
                </div>
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="lg:hidden cursor-pointer"
                    aria-label="메뉴 토글"
                >
                    {isMenuOpen ? <CloseIcon fontSize="large"/> : <MenuIcon fontSize="large"/>}
                </button>
            </nav>
            <AnimatePresence>
                {isMenuOpen && (
                    <div className="lg:hidden">
                        <motion.div
                            className="w-full bg-gray-50"
                            initial={{opacity: 0, y: -20, height: 0}}
                            animate={{opacity: 1, y: 0, height: "auto"}}
                            exit={{opacity: 0, y: -20, height: 0}}
                            transition={{duration: 0.3}}
                        >
                            <div className="flex flex-col">
                                {menus.map((menu, index) => (
                                    <div key={index} className="py-3 px-5 content-center">{menu}</div>
                                ))}
                            </div>
                        </motion.div>
                        <div onClick={() => setIsMenuOpen(false)} className="h-screen w-full" role="button"
                             tabIndex={0}></div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Navigation;