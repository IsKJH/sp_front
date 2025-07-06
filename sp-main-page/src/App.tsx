import React, { useEffect } from "react";
import { apiClient, useUserStore } from 'shared-utils';

import "./index.css";

const fetchUserData = async () => {
    const userData = await apiClient.get('/api/user/profile');
    return userData;
};

const App = () => {
    const { setUserData, userData, isLoggedIn, token, initializeAuth } = useUserStore();

    useEffect(() => {
        // 인증 초기화 (이미 bootstrap에서 처리되지만 명시적으로)
        initializeAuth();
    }, []);

    useEffect(() => {
        // 토큰이 있을 때만 사용자 정보 가져오기
        if (token && !userData) {
            const loadData = async () => {
                try {
                    const userData = await fetchUserData();
                    console.log(userData);
                    setUserData(userData);
                } catch (error) {
                    console.error('API 호출 실패:', error);
                }
            };
            loadData();
        }
    }, [token, userData]);

    return (
        <div className="mt-10 text-3xl mx-auto max-w-6xl">
            <div>Name: sp-main-page</div>
            <div>Framework: react-18</div>
            <div className="mt-4">
                <div>로그인 상태: {isLoggedIn ? '✅ 로그인됨' : '❌ 로그아웃됨'}</div>
                <div>토큰: {token ? '✅ 있음' : '❌ 없음'}</div>
                <div>사용자 정보: {userData?.name || userData?.email || '없음'}</div>
                {userData && (
                    <div className="mt-2 text-sm">
                        <pre>{JSON.stringify(userData, null, 2)}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
