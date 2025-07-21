enum enumAvatarImg {
  'bear' = 1,
  'cat',
  'dog',
  'rabbit',
}

interface typeAvatarOptions {
  id: enumAvatarImg;
  htmlForLabel: string;
  imgSrc: string;
}
interface typeAvatarFrameProps {
  option: typeAvatarOptions;
  currentAvatar: enumAvatarImg;
  selectHandler: (id: enumAvatarImg) => void;
}

interface typeFormDataRef {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  avatar: number;
}

export { enumAvatarImg };
export type { typeAvatarOptions, typeAvatarFrameProps, typeFormDataRef };
