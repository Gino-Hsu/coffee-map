'use client';
import { enumAvatarImg } from '@/type/memberType';
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
  handleChange,
  selectedAvatar,
}: {
  handleChange: (id: enumAvatarImg) => void;
  selectedAvatar: enumAvatarImg;
}) {
  return (
    <div className="flex gap-x-4">
      {avatarOptions.map(option => {
        return (
          <AvatarFrame
            key={option.id}
            option={option}
            currentAvatar={selectedAvatar}
            selectHandler={handleChange}
          />
        );
      })}
    </div>
  );
}
