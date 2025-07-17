'use client';

import { getUserAction } from '@/app/actions/user/getUser';
import {
  createContext,
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
} from 'react';

export type User =
  | {
      id: string;
      name: string;
      email: string;
      role: string;
      favoriteList: string[];
    }
  | null
  | undefined;

type UserContextType = {
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
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

  useEffect(() => {
    const getUser = async () => {
      const userResult = await getUserAction(lang);
      if (userResult.status === 200) {
        setUser(userResult.data.resData);
      }
    };
    getUser();
  }, [lang]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
