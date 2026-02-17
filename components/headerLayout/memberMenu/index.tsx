'use client';
import { useContext } from 'react';
import Image from 'next/image';
import { UserContext } from '@/lib/context/userContext';
import PersonIcon from '@mui/icons-material/Person';
import { enumAvatarImg } from '@/type/memberType';

const imageSrcList: Record<enumAvatarImg, string> = {
  [enumAvatarImg.bear]: '/avatar/bear.png',
  [enumAvatarImg.cat]: '/avatar/cat.png',
  [enumAvatarImg.dog]: '/avatar/dog.png',
  [enumAvatarImg.rabbit]: '/avatar/rabbit.png',
};

export default function MemberMenu() {
  const { user } = useContext(UserContext);

  return (
    <div className="member-menu">
      {!!user &&
        (user.avatar ? (
          <Image
            className="rounded-md cursor-pointer shadow-sm opacity-75 hover:opacity-100"
            src={imageSrcList[user.avatar]}
            width={35}
            height={35}
            alt="avatar"
          />
        ) : (
          <PersonIcon className="text-2xl text-[#5a3d1b] cursor-pointer" />
        ))}
    </div>
  );
}
