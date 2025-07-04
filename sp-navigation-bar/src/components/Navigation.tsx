import React, {useState} from "react";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoImage from "../assets/github_logo.png";
import {motion, AnimatePresence} from "framer-motion";
import "../index.css";
import LoginIcon from '@mui/icons-material/Login';
import {useNavigate} from "react-router-dom";

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const navigate = useNavigate();
    let menus = ["메뉴1", "메뉴2", "메뉴3", "메뉴4", "메뉴5"];

    return (
        <div className="relative">
            <nav
                className="flex w-full h-16 px-12 lg:px-36 py-4 justify-between items-center border-b border-gray-300">
                <img src={LogoImage} alt="Logo" className="h-auto w-9 cursor-pointer" onClick={() => navigate("/")}/>
                <div className="hidden lg:flex space-x-8 items-center">
                    {menus.map((menu, index) => (
                        <a key={index} href="#"
                           className="text-gray-600 hover:text-blue-600 transition-colors">{menu}</a>
                    ))}
                    <div
                        className="relative cursor-pointer"
                        onMouseEnter={() => setShowTooltip(true)}
                        onMouseLeave={() => setShowTooltip(false)}
                        onClick={() => navigate("/login")}
                    >
                        <LoginIcon className="hover:text-blue-600 transition-colors"/>
                        <AnimatePresence>
                            {showTooltip && (
                                <motion.div
                                    initial={{opacity: 0, y: -10}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -10}}
                                    transition={{duration: 0.2}}
                                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg whitespace-nowrap"
                                >
                                    로그인
                                    <div
                                        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-800"></div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
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