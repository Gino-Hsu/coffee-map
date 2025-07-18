'use client';
import { useState } from 'react';
import Image from 'next/image';
import { enumAvatarImg } from '@/type/memberType';
export default function AvatarSelector() {
  const [selectedAvatar, setSelectedAvatar] = useState<enumAvatarImg>(
    enumAvatarImg.bear
  );
  console.log(
    'selectedAvatar === enumAvatarImg.bear: ',
    selectedAvatar === enumAvatarImg.bear
  );

  const handleAvatarSelect = (id: enumAvatarImg) => {
    console.log('handleAvatarSelect clicked, incoming id: ', id);
    setSelectedAvatar(id);
  };

  return (
    <div className="flex gap-x-4">
      <label
        htmlFor="avatarBear"
        className={`rounded-[15px] overflow-hidden cursor-pointer ${
          selectedAvatar === enumAvatarImg.bear
            ? 'outline-4 outline ring-yellow-600'
            : ''
        }`}
        onClick={() => handleAvatarSelect(enumAvatarImg.bear)}
      >
        <Image width={120} height={120} alt="bear" src="/avatar/bear.png" />
      </label>
      <label
        htmlFor="avatarCat"
        className={`rounded-[15px] overflow-hidden cursor-pointer ${
          selectedAvatar === enumAvatarImg.cat
            ? 'outline-4 outline ring-yellow-600'
            : ''
        }`}
        onClick={() => handleAvatarSelect(enumAvatarImg.cat)}
      >
        <Image width={120} height={120} alt="cat" src="/avatar/cat.png" />
      </label>
      <label
        htmlFor="avatarDog"
        className={`rounded-[15px] overflow-hidden cursor-pointer ${
          selectedAvatar === enumAvatarImg.dog
            ? 'outline-4 outline ring-yellow-600'
            : ''
        }`}
        onClick={() => handleAvatarSelect(enumAvatarImg.dog)}
      >
        <Image width={120} height={120} alt="dog" src="/avatar/dog.png" />
      </label>
      <label
        htmlFor="avatarRabbit"
        className={`rounded-[15px] overflow-hidden cursor-pointer ${
          selectedAvatar === enumAvatarImg.rabbit
            ? 'outline-4 outline ring-yellow-600'
            : ''
        }`}
        onClick={() => handleAvatarSelect(enumAvatarImg.rabbit)}
      >
        <Image width={120} height={120} alt="rabbit" src="/avatar/rabbit.png" />
      </label>
      <input id="avatarBear" name="avatar" type="radio" hidden />
      <input id="avatarCat" name="avatar" type="radio" hidden />
      <input id="avatarDog" name="avatar" type="radio" hidden />
      <input id="avatarRabbit" name="avatar" type="radio" hidden />
    </div>
  );
}
