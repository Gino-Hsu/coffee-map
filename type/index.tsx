type typeResponseDataSuccess<T> = { status: 200; data: T };

type typeResponseDataFailed<T> = { status: number; data: T };

type typeLoginData = {
  account: string;
  password: string;
};

type typeLoginResponse<T> =
  | typeResponseDataSuccess<T>
  | typeResponseDataFailed<T>;

export type { typeLoginData, typeLoginResponse };
