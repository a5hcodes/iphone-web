import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import React, { useRef, useState } from 'react';
import ModelView from './ModelView';
import { yellowImg } from '../utils';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { View } from '@react-three/drei';
import { models, sizes } from '../constants';

const Model = () => {
    const [size, setSize] = useState('small');
    const [model, setModel] = useState({
        title: 'iPhone 15 pro in Natural Titanium',
        color: ['#8f8a81', '#ffe7b9', '#6f6c64'],
        img: yellowImg,
    });

    const cameraControlSmall = useRef();
    const cameraControlLarge = useRef();

    const small = useRef(new THREE.Group());
    const large = useRef(new THREE.Group());

    const [smallRotation, setSmallRotation] = useState(0);
    const [largeRotation, setLargeRotation] = useState(0);

    const headingRef = useRef();

    useGSAP(() => {
        gsap.to(headingRef.current, { y: 0, opacity: 1, duration: 1, ease: 'power3.out' });
    }, []);

    return (
        <section className='common-padding'>
            <div className='screen-max-width'>
                <h1 ref={headingRef} className='section-heading'>
                    Take a closer look.
                </h1>

                <div className='flex flex-col items-center mt-5'>
                    <div className='w-full h-[75vh] md:h-[90vh] overflow-hidden relative'>
                        {/* 3D Model Views */}
                        <ModelView
                            index={1}
                            groupRef={small}
                            controlRef={cameraControlSmall}
                            setRotationState={setSmallRotation}
                            item={model}
                            size={size}
                        />
                        <ModelView
                            index={2}
                            groupRef={large}
                            controlRef={cameraControlLarge}
                            setRotationState={setLargeRotation}
                            item={model}
                            size={size}
                        />

                        {/* Canvas for rendering the 3D stuff */}
                        <Canvas
                            className='w-full h-full'
                            style={{
                                position: 'fixed',
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                pointerEvents: 'none',
                                zIndex: -1,
                            }}
                            eventSource={document.getElementById('root')}
                        >
                            <View.Port />
                        </Canvas>
                    </div>

                    {/* UI Below */}
                    <div className='mx-auto w-full'>
                        <p className='text-sm font-light text-center mb-5'>{model.title}</p>
                        <div className='flex-center'>
                            <ul className='color-container'>
                                {models.map((item, index) => (
                                    <li key={index} className='w-6 h-6 rounded-full mx-2'
                                        style={{ backgroundColor: item.color[0] }}
                                        onClick={() => setModel(item)}
                                    />
                                ))}
                            </ul>
                            <button className='size-btn-container'>
                                {sizes.map(({ label, value }) => (
                                    <span key={label} className='size-btn'
                                        style={{
                                            backgroundColor: size === value ? 'white' : 'transparent',
                                            color: size === value ? 'black' : 'white'
                                        }}
                                        onClick={() => setSize(value)}
                                    >
                                        {label}
                                    </span>
                                ))}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Model;