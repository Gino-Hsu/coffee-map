'use server';

import { cookies } from 'next/headers';

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete('coffee_auth_token');
}
