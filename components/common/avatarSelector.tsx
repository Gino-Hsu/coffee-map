'use client';
import { useState } from 'react';
import { enumAvatarImg } from '@/type/memberType';
import type { typeFormDataRef } from '@/type/memberType';
import AvatarFrame from './avatarFrame';

const avatarOptions: {
  id: enumAvatarImg;
  htmlForLabel: string;
  imgSrc: string;
}[] = [
  {
    id: enumAvatarImg.bear,
    htmlForLabel: 'avatarBear',
    imgSrc: '/avatar/bear.png',
  },
  {
    id: enumAvatarImg.cat,
    htmlForLabel: 'avatarCat',
    imgSrc: '/avatar/cat.png',
  },
  {
    id: enumAvatarImg.dog,
    htmlForLabel: 'cat',
    imgSrc: '/avatar/dog.png',
  },
  {
    id: enumAvatarImg.rabbit,
    htmlForLabel: 'avatarRabbit',
    imgSrc: '/avatar/rabbit.png',
  },
];

export default function AvatarSelector({
  formData,
}: {
  formData: typeFormDataRef;
}) {
  const [selectedAvatar, setSelectedAvatar] = useState<enumAvatarImg>(
    enumAvatarImg.bear
  );
  const handleAvatarSelect = (id: enumAvatarImg) => {
    setSelectedAvatar(id);
    formData.avatar = id;
  };

  return (
    <div className="flex gap-x-4">
      {avatarOptions.map(option => {
        return (
          <AvatarFrame
            key={option.id}
            option={option}
            currentAvatar={selectedAvatar}
            selectHandler={handleAvatarSelect}
          />
        );
      })}
    </div>
  );
}
