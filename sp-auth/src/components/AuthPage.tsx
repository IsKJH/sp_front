import React from "react";
import SocialLoginButton from "./SocialLoginButton";

const AuthPage = () => {
    return (
        <div className="flex h-screen w-full justify-center items-center bg-gray-100">
            <div className="flex w-[500px] h-[500px] justify-center items-center bg-white rounded-lg shadow-xl">
                <div className="flex flex-col text-center gap-8">
                    <div className="text-3xl font-extrabold">우리 프로젝트 명 뭐라뭐라</div>
                    <div>고객님 환영합니다! 기다리고 있었습니다.</div>
                    <div className="flex items-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="px-4 text-gray-500 text-sm">간편 로그인</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>
                    <div className="space-y-3">
                        <SocialLoginButton provider="kakao"/>
                        <SocialLoginButton provider="google"/>
                        <SocialLoginButton provider="naver"/>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AuthPage;