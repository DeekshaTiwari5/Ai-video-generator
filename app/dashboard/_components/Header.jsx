import { UserDetailContext } from '@/app/__context/UserDetailsContext';
import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image'
import React, { useContext } from 'react'

function Header() {
  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  return (
    <div className="p-3 px-5 flex items-center justify-between shadow-md">
      <div className="flex gap-3 items-center">
        <Image src={"./logo.svg"} width={30} height={30} />
        <h2 className="font-bold text-xl">Snapify</h2>
      </div>
      <div className='flex gap-3 items-center'>
        <Button>Dashboard</Button>
        <div className='flex gap-10 items-center'>
          <Image src={'/dollar.png'}width={20} height={20}/>
          <h2>{ userDetail?.credits}</h2>
        </div>
        <UserButton/>
      </div>
    </div>
  );
}

export default Header