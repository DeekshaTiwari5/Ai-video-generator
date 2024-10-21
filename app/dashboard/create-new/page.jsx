"use client"
import React, { useContext, useEffect, useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle';
import SelectDuration from './_components/SelectDuration';
import { Button } from '@/components/ui/button';
import axios from 'axios';
import CustomLoading from './_components/CustomLoading';
import { v4 as uuidv4 } from 'uuid';
import { VideoDataContext } from '@/app/__context/VideoDataContext';
import { useUser } from '@clerk/nextjs';
import { Users, VideoData } from '@/configs/schema';
import PlayerDialog from '../_components/PlayerDialog';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function CreateNew() {
    const [formData, setFormData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [videoScript, setvideoScript] = useState();
    const [audioFileUrl, setAudioFileUrl] = useState();
    const [captions, setCaptions] = useState();
    const [imageList, setImageList] = useState();
    const [playVideo, setPlayVideo] = useState(true);
    const [videoId, setVideoId] = useState(1);
    

    const { videoData, setVideoData } = useContext(VideoDataContext);
    const { userDetail, setUserDetail } = useContext(VideoDataContext);
    const { user } = useUser;


    const onHandleInputChange = (fieldName,fieldValue) => {
        console.log(fieldName, fieldValue);
        
        setFormData(prev=>({
            ...prev,
            [fieldName]:fieldValue
        }))
    
    }
    const onCreateClickHandler = () => {
        if (userDetail?.credits >= 0) {
            toast("You don't have enough Credits" )
            return;
        }
        GetVideoScript();
        // GenerateAudioFile(scriptData);
        // GenerateAudioCaption();
        // GenerateImage();
    }
    
    //Get Video script
    const GetVideoScript = async () => {
        setLoading(true)
        const prompt='Write a script to generate '+formData.duration+' video on topic :'+formData.topic+' along with AI image prompt in '+formData.imageStyle+' formate for each scene and give me result in JSON formate with image prompt and content Text as field, No Plain text'
        console.log(prompt);
        
        const resp = await axios.post('/api/get-video-script', {
            prompt: prompt
        });
        if (resp.data.result) {
            setVideoData(prev => ({
                ...prev,
                'videoScript': resp.data.result
            }))
            setvideoScript(resp.data.result);
            await GenerateAudioFile(resp.data.result);
        }
        // }).then(resp => {
        //     console.log(resp.data.result);
        //     setvideoScript(resp.data.result);
    
        //     GenerateAudioFile(resp.data.result);
            
        // });
        // setLoading(false);
    }


//Generate audio file and save to firebase storage 
    //Video generator
    const GenerateAudioFile = async (videoScriptData) => {
        setLoading(true);
        let script = '';
        const id = uuidv4();
        videoScriptData.forEach(item => {
            script = script + item.content_text + ' ';
        })
        console.log(script);
        const resp = await axios.post('/api/generate-audio', {
            text: script,
            id: id
        });
         setVideoData((prev) => ({
           ...prev,
          'audioFileUrl': resp.data.result,
         }));
        setAudioFileUrl(resp.data.result);//get file url
        resp.data.result && await GenerateAudioCaption(resp.data.result)
        // }).then(resp => {
        //     console.log(resp.data.result);
        //     setAudioFileUrl(resp.data.result);// Get File URL
        //     // setCaptions(resp?.data?.result);
        //     resp.data.result &&
        //       GenerateAudioCaption(resp.data.result, videoScriptData);
        // });
        console.log(videoScript,captions,audioFileUrl);
        
        setLoading(false);
        
    }
//Used to generate caption from audio file
    //Caption Generator
    const GenerateAudioCaption = async (fileUrl, videoScriptData) => {
      setLoading(true);
       console.log(fileUrl);
       const resp=await axios.post("/api/generate-caption", {
          audioFileUrl: fileUrl,
   })
        setCaptions(resp?.data?.result);
         setVideoData((prev) => ({
           ...prev,
           'captions': resp.data.result,
         }));
        console.log(resp.data.result);
        resp.data.result && GenerateImage(videoScript);
        // .then((resp) => {
        //   console.log(resp.data.result);
        // });
        //   setLoading(false);
    };


// used to generate AI Images
    const GenerateImage = async(videoScriptData) => {
        setLoading(true);
        let images = [];
        // console.log("+++++++",videoScript);
        
        // await videoScriptData.forEach(async(element) => {
        //     await axios.post('/api/generate-image', {
        //         prompt:element?.imagePrompt
        //     }).then(resp => {
        //         console.log(resp.data.result);
        //         images.push(resp.data.result);
        //     })
        // })
        // // console.log(images);
        // console.log(images,videoScript,audioFileUrl,captions);
        for (const element of videoScriptData) {
            try {
                const resp = await axios.post('/api/generate-image', {
                    prompt: element.imagePrompt
                });
                console.log(resp.data.result);
                images.push(resp.data.result);
                
            } catch (e) {
                console.log('Error',e);
                
            }
        }
         setVideoData((prev) => ({
           ...prev,
           'imageList':images,
         }));
        setImageList(images);
        setLoading(false);
    }

    useEffect(() => {
        console.log(videoData);
        if (Object.keys(videoData).length == 4) {
            SaveVideoData(videoData);
        }
    }, [videoData]);

    const SaveVideoData=async(videoData) => {
        setLoading(true);

        const result = await db.insert(VideoData).values({
            script: videoData?.videoScript,
            audioFileUrl: videoData?.audioFileUrl,
            captions: videoData?.captions,
            imageList: videoData?.imageList,
           createdBy:user?.primaryEmailAddress?.emailAddress
        }).returning({ id: VideoData?.id })
       await UpdateUserCredits();
        setVideoId(result[0].id);
        setPlayVideo(true);
        console.log(result);
        setLoading(false);
        
    }
    /**
     * Used to update user Credits
     */
    const UpdateUserCredits = async () => {
        const result = await db.update(Users).set({
            credits: userDetail?.credits - 10
        }).where(eq(Users?.email, user?.primaryEmailAddress?.emailAddress));
        console.log(result);
        setUserDetail(prev => ({
            ...prev,
            'credits':userDetail?.credits-10
        }))
        setVideoData(null);
        
    }
  return (
      <div className='md:px-20'>
          <h2 className='font-bold text-4xl text-primary text-center'>
              Create New
          </h2>

          <div className='mt-10 shadow-md p-10'>
              {/* Select Topic */}
              <SelectTopic onUserSelect={onHandleInputChange} />
              {/* select style */}
               <SelectStyle onUserSelect={onHandleInputChange}/>
              {/* Duration */}
               <SelectDuration onUserSelect={onHandleInputChange}/>
              {/* Create Button */}
              <Button className='mt-10 w-full' onClick={onCreateClickHandler}>Create Short Video</Button>
          </div>
          <CustomLoading loading={loading} />
          <PlayerDialog playVideo={playVideo} videoId={videoId}/>
    </div>
  )
}

export default CreateNew;