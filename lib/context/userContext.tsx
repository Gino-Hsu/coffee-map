'use client';

import { usePathname } from 'next/navigation';
import { getUserAction } from '@/app/actions/user/getUser';
import {
  createContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';
import { enumAvatarImg } from '@/type/memberType';

export type User =
  | {
      id: string;
      name: string;
      email: string;
      role: string;
      favoriteList: string[];
      avatar: enumAvatarImg;
    }
  | null
  | undefined;

type UserContextType = {
  user: User;
  isGetUserLoading: boolean;
  setUser: Dispatch<SetStateAction<User>>;
  setIsLoginSession: ((value: boolean) => void) | null;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  isGetUserLoading: false,
  setUser: () => {},
  setIsLoginSession: null,
});

export const UserProvider = ({
  children,
  lang = 'zh',
}: {
  children: React.ReactNode;
  lang: string;
}) => {
  const [user, setUser] = useState<User>(null); // 初始值為 null
  const [isGetUserLoading, setIsGetUserLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const pathname = usePathname();

  // 🧠 包一層來同步 sessionStorage 狀態
  const setIsLoginSession = (value: boolean) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('isLogin', value ? '1' : '0');
    }
    setIsLogin(value);
  };

  // ✅ 初始化時讀取 sessionStorage 判斷是否登入
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('isLogin');
      if (stored === '1') {
        setIsLogin(true);
      }
    }
  }, []);

  useEffect(() => {
    const getUser = async (isLogin: boolean) => {
      setIsGetUserLoading(false);
      if (!isLogin) {
        return;
      }
      const userResult = await getUserAction(lang);
      if (userResult.status === 200) {
        setUser(userResult.data.resData);
      } else {
        setUser(null);
        setIsLogin(false);
      }
    };
    getUser(isLogin);
  }, [lang, pathname, isLogin]);

  return (
    <UserContext.Provider
      value={{ user, isGetUserLoading, setUser, setIsLoginSession }}
    >
      {children}
    </UserContext.Provider>
  );
};
