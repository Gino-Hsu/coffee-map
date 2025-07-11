import type { typeLoginData, typeLoginResponse } from '@/type';

//登入
export const fetchLoginData: ({
  account,
  password,
}: typeLoginData) => Promise<typeLoginResponse<string>> = async ({
  account,
  password,
}) => {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({ account, password }),
  });

  return {
    status: response.status,
    data: await response.json(),
  };
};
