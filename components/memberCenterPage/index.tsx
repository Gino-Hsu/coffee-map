'use client';
// import { useState } from 'react';
import UpdateInfo from './updateInfo';

export default function MemberCenterPage() {
  // const [memberCenterSubMenu, setMemberCenterSubMenu] = useState(1);
  return (
    <>
      <div className="flex gap-x-4 p-2">
        <div className="flex flex-col min-h-screen p-2 border-r-2 mr-2">
          <p className="text-xl font-bold pb-4 text-[#5a3d1b]">更新會員資料</p>
          {/* <p className="text-xl font-bold pb-4 text-[#5a3d1b]">更新密碼</p> */}
        </div>
        <div>
          <UpdateInfo />
        </div>
      </div>
    </>
  );
}
