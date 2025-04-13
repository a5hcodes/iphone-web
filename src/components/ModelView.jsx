import { PerspectiveCamera, View, Html } from '@react-three/drei';
import React, { Suspense } from 'react';
import Lights from './Lights';
import IPhone from './IPhone';

const ModelView = ({ index, groupRef, gsapType, controlRef, setRotationState, size, item }) => {
    return (
        <View
            index={index}
            id={gsapType}
            className={`border-2 border-red-500 w-full h-full ${index === 2 ? 'right-[-100%]' : ''}`}>

            {/* Ambient light */}
            <ambientLight intensity={0.3} />
            <PerspectiveCamera makeDefault position={[0, 0, 4]} />
            <Lights />

            {/* Fixed: Html wrapper for fallback */}
            <Suspense fallback={
                <Html>
                    <div style={{ color: 'white' }}>Loading...</div>
                </Html>
            }>
                <IPhone item={item} size={size} />
            </Suspense>

        </View>
    );
};

export default ModelView;
