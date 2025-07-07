import React, {useEffect} from "react";
import KakaoIcon from "../assets/kakao_logo.png";
import GoogleIcon from "../assets/google_logo.png";
import NaverIcon from "../assets/naver_logo.png";
import env from "../env.ts";
import {useNavigate} from "react-router-dom";
import {apiClient, useUserStore} from 'shared-utils';


type Provider = "kakao" | "google" | "naver";

interface SocialLoginButtonProps {
    provider: Provider;
}

interface ProviderConfig {
    src: string;
    label: string;
    bgColor: string;
    textColor: string;
    border: string;
}

const providerConfig: Record<Provider, ProviderConfig> = {
    kakao: {
        src: KakaoIcon,
        label: "카카오 로그인",
        bgColor: "bg-yellow-300 hover:bg-yellow-400 active:bg-yellow-500",
        textColor: "text-black",
        border: "border border-yellow-400",
    },
    google: {
        src: GoogleIcon,
        label: "Google 로그인",
        bgColor: "bg-white hover:bg-gray-50 active:bg-gray-100",
        textColor: "text-gray-900",
        border: "border border-gray-300",
    },
    naver: {
        src: NaverIcon,
        label: "네이버 로그인",
        bgColor: "bg-green-500 hover:bg-green-600 active:bg-green-700",
        textColor: "text-white",
        border: "border border-green-600",
    }
};


const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({provider}) => {
    const {src, label, bgColor, textColor, border} = providerConfig[provider];
    const navigate = useNavigate();
    const {setToken, setUserData} = useUserStore();
    const getAuthUrl = (provider: Provider): string | undefined => {
        switch (provider) {
            case "kakao":
                return env.api.KAKAO_AUTH_URL;
            case "google":
                return env.api.GOOGLE_AUTH_URL;
            case "naver":
                return env.api.NAVER_AUTH_URL;
        }
    };

    const handleLogin = () => {
        const authUrl = getAuthUrl(provider);
        const popup = window.open(authUrl, "_blank", "width=500,height=600");
        if (!popup) {
            alert("팝업이 차단되었습니다. 허용 후 다시 시도하세요.");
            return;
        }
        const allowedOrigins = env.origins[provider];
        const receiveMessage = async (event: MessageEvent) => { // async 추가
            if (!allowedOrigins.some(origin => event.origin.startsWith(origin))) {
                console.warn("허용되지 않은 origin:", event.origin);
                return;
            }

            const {accessToken} = event.data;
            if (!accessToken) return;

            localStorage.setItem("userToken", accessToken);
            setToken(accessToken);

            // 사용자 데이터 가져오기
            try {
                const userData = await fetchUserData();
                console.log('Fetched userData:', userData);
                setUserData(userData);
                console.log('setUserData called with:', userData);
                alert(`환영합니다. ${userData.name}님!`);
            } catch (error) {
                console.error('사용자 정보 가져오기 실패:', error);
            }

            window.dispatchEvent(new Event("user-token-changed"));
            window.removeEventListener("message", receiveMessage);

            try {
                popup.close();
            } catch {
            }

            setTimeout(() => navigate("/"), 100);
        };

        window.addEventListener("message", receiveMessage);
    }

    const fetchUserData = async () => {
        const userData = await apiClient.get('/api/user/profile');
        return userData;
    };

    return (
        <button
            type="button"
            onClick={handleLogin}
            className={`
                flex items-center justify-center w-full rounded-lg font-medium
                transition-all duration-200 transform h-10 gap-3
                ${bgColor} ${textColor} ${border}
                shadow-sm hover:shadow-md hover:scale-[1.02]
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                cursor-pointer
               
            `.trim()}
            aria-label={`${label} 버튼`}
        >
            <img
                src={src}
                alt=""
                className="h-5 w-5 object-contain"
                aria-hidden="true"
            />
            <span>{label}</span>
        </button>
    );
};

export default SocialLoginButton;