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
      avatar: enumAvatarImg; // TODO 待完成 prisma api
    }
  | null
  | undefined;

type UserContextType = {
  user: User;
  isGetUserLoading: boolean;
  setUser: Dispatch<SetStateAction<User>>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  isGetUserLoading: false,
  setUser: () => {},
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
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      const userResult = await getUserAction(lang);
      if (userResult.status === 200) {
        setUser(userResult.data.resData);
      }
      setIsGetUserLoading(false);
    };
    getUser();
  }, [lang, pathname]);

  return (
    <UserContext.Provider value={{ user, isGetUserLoading, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
