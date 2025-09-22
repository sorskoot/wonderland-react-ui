import {Material, Object3D, Texture} from '@wonderlandengine/api';
import React, {createContext} from 'react';

import type {YogaNodeProps, Color} from '../renderer-types.js';

export interface FlatMaterial {
    flatTexture: Texture;
    setColor(c: Float32Array): void;
    color: Color;
}

export const MaterialContext = createContext(
    {} as {
        panelMaterial?: Material | null;
        panelMaterialTextured?: Material | null;
        textMaterial?: Material | null;
    }
);

declare global {
    namespace JSX {
        interface IntrinsicElements {
            container: React.PropsWithChildren<YogaNodeProps> &
                React.RefAttributes<Object3D>;
        }
    }
}
