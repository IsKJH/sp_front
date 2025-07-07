import React, {useEffect, useState} from "react";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LogoImage from "../assets/github_logo.png";
import {motion, AnimatePresence} from "framer-motion";
import "../index.css";
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircleOutlined';
import {useNavigate} from "react-router-dom";
import {useUserStore} from 'shared-utils';

const Navigation = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const navigate = useNavigate();
    const {userData, isLoggedIn, logout, token, initializeAuth} = useUserStore();
    let menus = ["메뉴1", "메뉴2", "메뉴3", "메뉴4", "메뉴5"];

    useEffect(() => {
        initializeAuth();
    }, []);

    console.log('로그인 상태:', {
        isLoggedIn,
        token: !!token,
        userData
    });

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
                        onClick={() => isLoggedIn ? logout() : navigate("/login")}
                    >
                        {isLoggedIn ? <LogoutIcon/> : <LoginIcon/>}
                        <AnimatePresence>
                            {showTooltip && !isLoggedIn && (
                                <motion.div
                                    key="login-tooltip"
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
                            {showTooltip && isLoggedIn && (
                                <motion.div
                                    key="logout-tooltip"
                                    initial={{opacity: 0, y: -10}}
                                    animate={{opacity: 1, y: 0}}
                                    exit={{opacity: 0, y: -10}}
                                    transition={{duration: 0.2}}
                                    className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg whitespace-nowrap"
                                >
                                    로그아웃
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
                            className="w-full bg-white shadow-lg"
                            initial={{opacity: 0, y: -20, height: 0}}
                            animate={{opacity: 1, y: 0, height: "auto"}}
                            exit={{opacity: 0, y: -20, height: 0}}
                            transition={{duration: 0.3}}
                        >
                            <div className="flex flex-col">
                                {/* User Profile Section */}
                                <div className="px-6 py-5 border-b border-gray-100">
                                    {userData ? (
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <AccountCircleIcon className="text-blue-600" fontSize="large"/>
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-gray-900">{userData.name}</div>
                                                <div className="text-sm text-gray-500">{userData.email}</div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setIsMenuOpen(false);
                                                }}
                                                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                            >
                                                로그아웃
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center space-x-4">
                                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                                <AccountCircleIcon className="text-gray-400" fontSize="large"/>
                                            </div>
                                            <div className="flex-1">
                                                <div className="text-gray-600">로그인이 필요합니다</div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    navigate("/login");
                                                    setIsMenuOpen(false);
                                                }}
                                                className="px-3 py-1 text-sm text-blue-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                            >
                                                로그인
                                            </button>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Menu Items */}
                                <div className="py-2">
                                    {menus.map((menu, index) => (
                                        <div 
                                            key={index} 
                                            className="px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 cursor-pointer transition-colors border-l-4 border-transparent hover:border-blue-600"
                                        >
                                            {menu}
                                        </div>
                                    ))}
                                </div>
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