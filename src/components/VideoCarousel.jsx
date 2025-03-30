import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { hightlightsSlides } from '../constants';
import { pauseImg, playImg, replayImg } from '../utils';

const VideoCarousel = () => {
    const videoRef = useRef([]);
    const videoSpanRef = useRef([]);
    const videoDivRef = useRef([]);

    const [video, setVideo] = useState({
        isEnd: false,
        startPlay: false,
        videoId: 0,
        isLastVideo: false,
        isPlaying: false
    });

    const { isEnd, isLastVideo, startPlay, videoId, isPlaying } = video;

    useGSAP(() => {
        gsap.to('#video', {
            scrollTrigger: {
                trigger: '#video',
                toggleActions: 'play none none none'
            },
            onComplete: () => {
                setVideo((prev) => ({ ...prev, startPlay: true, isPlaying: true }));
            }
        });
    }, []);

    useEffect(() => {
        if (startPlay && videoRef.current[videoId]) {
            videoRef.current[videoId].play();
        }
    }, [startPlay, videoId]);

    useEffect(() => {
        let currentProgress = 0;
        let span = videoSpanRef.current;
        
        if (span[videoId]) {
            let anim = gsap.to(videoSpanRef.current[videoId], {
                onUpdate: () => {
                    const progress = Math.ceil(anim.progress() * 100);
                    if (progress !== currentProgress) {
                        currentProgress = progress;
                        gsap.to(videoDivRef.current[videoId], {
                            width: window.innerWidth < 760 ? '10vw' : window.innerWidth < 1200 ? '10vw' : '5vw'
                        });

                        gsap.to(videoSpanRef.current[videoId], {
                            width: `${currentProgress}%`,
                            backgroundColor: 'white'
                        });
                    }
                },
                onComplete: () => {
                    if (isPlaying) {
                        gsap.to(videoDivRef.current[videoId], { width: '12px' });
                        gsap.to(span[videoId], { backgroundColor: '#afafaf' });
                    }
                    setVideo((prev) => ({ ...prev, isEnd: true }));
                }
            });

            if (videoId > 0) {
                anim.restart();
            }
            const animUpdate = () => {
                anim.progress(videoRef.current[videoId].currentTime / hightlightsSlides[videoId].videoDuration);
            };
            if (isPlaying) {
                gsap.ticker.add(animUpdate);
            } else {
                gsap.ticker.remove(animUpdate);
            }
        }
    }, [videoId, startPlay, isPlaying]);

    const handleProcess = (type) => {
        switch (type) {
            case 'video-end':
                setVideo((prevVideo) => ({ ...prevVideo, isEnd: true, videoId: videoId + 1 }));
                break;
            case 'video-last':
                setVideo((prev) => ({ ...prev, isLastVideo: true }));
                break;
            case 'video-reset':
                setVideo({ isEnd: false, startPlay: false, videoId: 0, isLastVideo: false, isPlaying: false });
                break;
            case 'play':
                setVideo((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
                break;
            default:
                return;
        }
    };

    return (
        <>
            <div className='flex items-center'>
                {hightlightsSlides.map((list, i) => (
                    <div key={list.id} id='slider' className='sm:pr-20 pr-10'>
                        <div className='video-carousel_container'>
                            <div className='w-full h-full flex-center rounded-3xl overflow-hidden bg-black'>
                                <video
                                    id='video'
                                    className='w-full h-full object-cover'
                                    autoPlay
                                    muted
                                    ref={(el) => (videoRef.current[i] = el)}
                                    onPlay={() => setVideo((prevVideo) => ({ ...prevVideo, isPlaying: true }))}
                                    onEnded={() => handleProcess('video-end')}
                                >
                                    <source src={list.video} type='video/mp4' />
                                </video>
                            </div>
                            <div className='absolute top-12 left-[-0.5%] z-10'>
                                {list.textLists.map((text) => (
                                    <p key={text} className='text-white md:text-2xl text-xl font-medium'>{text}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className='relative flex-center mt-10'>
                <div className='flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full'>
                    {hightlightsSlides.map((_, i) => (
                        <span
                            key={i}
                            ref={(el) => (videoDivRef.current[i] = el)}
                            className='mx-2 w-3 h-3 bg-gray-200 rounded-full relative cursor-pointer'
                        >
                            <span ref={(el) => (videoSpanRef.current[i] = el)} className='absolute h-full w-full rounded-full' />
                        </span>
                    ))}
                </div>
                <button className='control-btn' onClick={() => handleProcess(isLastVideo ? 'video-reset' : 'play')}>
                    <img src={isLastVideo ? replayImg : isPlaying ? pauseImg : playImg} alt={isLastVideo ? 'Replay' : isPlaying ? 'Pause' : 'Play'} />
                </button>
            </div>
        </>
    );
};

export default VideoCarousel;