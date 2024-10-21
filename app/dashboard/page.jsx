"use client"
import { Button } from '@/components/ui/button'
import React, { useState } from 'react';
import EmptyState from './_components/EmptyState';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { VideoData } from '@/configs/schema';
import VideoList from './_components/VideoList';

function Dashboard() {
  const [videoList, setVideoList] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    user && GetVideoList();
  }, [user])
  
  /**
   * Used to Get Users Video
   */
  const GetVideoList = async () => {
    const result = await db.select().from(VideoData)
      .where(eq(VideoData?.createdBy, user?.primaryEmailAddress?.emailAddress))
    
    console.log(result);
    setVideoList(result);
    
  }
  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl text-primary">Dashboard</h2>
        {/* <Button>+ Create New</Button> */}
        <Link href={"/dashboard/create-new"}>
          <Button>+ Create New</Button>
        </Link>
      </div>

      {/* Empty State */}
      {videoList?.length == 0 && (
        <div>
          <EmptyState />
        </div>
      )}

      {/* //List of Videos */}
      <VideoList videoList={videoList } />

    </div>
  );
}

export default Dashboard