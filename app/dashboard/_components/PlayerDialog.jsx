import React, { useEffect, useState } from 'react'
import { Player } from "@remotion/player";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RemotionVideo from './RemotionVideo';
import { useRouter } from 'next/navigation';

function PlayerDialog({ playVideo, videoId }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [videoData, setVideoData] = useState();
  const [durationInFrame, setDurationInFrame] = useState(100);
  const router = useRouter();
  
    useEffect(() => {
      setOpenDialog(!openDialog)
      videoId && GetVideoData();
    }, [playVideo])
  
  const GetVideoData = async() => {
    const result = await db.select().from(videoData)
      .where(eq(VideoData.id, videoId));
    console.log(result);
    
  }
  return (
    <Dialog open={openDialog}>
      <DialogContent className="bg-white flex flex-col items-center">
        <DialogHeader>
          <DialogTitle
            className="text-3xl font-bold
          my-5"
          >
            Your video is ready
          </DialogTitle>
          <DialogDescription>
            <Player
              component={RemotionVideo}
              durationInFrames={Number(durationInFrame.toFixed(0))}
              compositionWidth={300}
              compositionHeight={480}
              fps={30}
              controls={true}
              inputProps={{
                ...videoData,
                setDurationInFrame:(frameValue)=>setDurationInFrame(frameValue)
              }}
            />
            <div className='flex gap-10 mt-10'>
              <Button variant='ghost'onClick={()=>{router.replace('/dashboard');setOpenDialog(false)}}>Cancel</Button>
              <Button>Export</Button>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default PlayerDialog