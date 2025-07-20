import Image from 'next/image';
import type { typeAvatarFrameProps } from '@/type/memberType';

export default function AvatarFrame({
  option,
  currentAvatar,
  selectHandler,
}: typeAvatarFrameProps) {
  const { id, htmlForLabel, imgSrc } = option;
  return (
    <>
      <label
        htmlFor={htmlForLabel}
        className={`rounded-[15px] overflow-hidden cursor-pointer ${
          currentAvatar === id ? 'ring-4 ring-offset-2 ring-yellow-300' : ''
        } 
      ${currentAvatar !== id ? 'opacity-50' : null} hover:opacity-100
      `}
        onClick={() => selectHandler(id)}
      >
        <Image width={120} height={120} alt={htmlForLabel} src={imgSrc} />
      </label>
      <input id={htmlForLabel} name="avatar" type="radio" hidden value={id} />
    </>
  );
}
