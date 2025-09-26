import {Object3D, Texture} from '@wonderlandengine/api';
import React, {forwardRef, useContext, useMemo, useState} from 'react';
import {MaterialContext, FlatMaterial} from './component-types.js';
import {PanelProps} from './Panel.js';
import {
    resolveStyle,
    stripLayoutProps,
    Theme,
    ThemeContext,
    ThemeProvider,
} from '../theme.js';

/**
 * A 9-slice panel component that renders a textured panel with customizable borders.
 * Uses 9-slice scaling technique to maintain border proportions while scaling the content area.
 *
 * @component
 * @example
 * ```tsx
 * <Panel9Slice
 *   texture={myTexture}
 *   borderSize={10}
 *   borderTextureSize={0.3}
 * >
 *   <Content />
 * </Panel9Slice>
 * ```
 *
 * @param {PanelProps & {texture?: Texture | null; borderSize?: number; borderTextureSize?: number}} props - The component props
 * @param {Texture | null} [props.texture] - Optional texture to apply to the panel. If provided, will override the default material texture
 * @param {number} [props.borderSize] - The size of the border in world units
 * @param {number} [props.borderTextureSize] - The size of the border in the texture, between 0.0 - 1.0 (default is 0.5, meaning half the texture size)
 * @param {Material | null} [props.material] - Optional custom material. If not provided, uses the cloned panel material from context
 * @param {React.ReactNode} props.children - Child elements to render inside the panel
 * @param {React.Ref<Object3D>} ref - Forward ref to access the underlying Object3D
 * @returns {React.ReactElement} A 9-slice panel element with the specified texture and border configuration
 */

export const Panel9Slice = forwardRef<
    Object3D,
    React.PropsWithChildren<
        PanelProps & {
            variant?: 'default' | string;
            texture?: Texture | null;

            /**
             * how thick the visible border is in the mesh's geometry (same units as width/height). It moves the inner quad inwards by this amount on each side.
             */
            borderSize?: number;

            /**
             * The normalized size (0..1) of the border area in texture (UV) space.
             * It controls which part of the texture is sampled for the border vs the center.
             *
             * For example, if the texture is 256x256 and the border is 32 pixels wide, this should be set to 32/256 = 0.125.
             */
            borderTextureSize?: number;
        }
    >
>((props, ref) => {
    const context = useContext(MaterialContext);
    let theme = useContext(ThemeContext);

    // let specializedTheme = !!theme.panel9Slice;
    let mergedProps = resolveStyle({
        theme,
        props,
        variant: props.variant,
        variants: {},
        states: {},
        specializeKey: 'panel9Slice',
    });

    // let mergedProps = {
    //     ...theme,
    //     ...(props.variant ? theme.variants?.[props.variant] : {}),
    //     ...props,
    // };

    // if ('panel9Slice' in theme) {
    //     theme = {...theme, ...theme.panel9Slice};
    //     if (props.variant && props.variant in theme.variant) {
    //         theme = {...theme, ...theme.variant[props.variant]};
    //     }
    //     specializedTheme = true;
    // }

    //     // borderSize: props.borderSize ?? theme.panel9Slice?.borderSize ?? 10,
    //     // borderTextureSize:
    //     //     props.borderTextureSize ?? theme.panel9Slice?.borderTextureSize ?? 0.33,
    // };
    // props.borderSize = props.borderSize ?? theme.panel9Slice?.borderSize ?? 10;
    // props.borderTextureSize =
    //     props.borderTextureSize ?? theme.panel9Slice?.borderTextureSize ?? 0.33;

    const mat = useMemo(() => context.panelMaterialTextured?.clone(), []);
    if (mat && (mergedProps.texture || (theme && 'texture' in theme && theme.texture)))
        (mat as unknown as FlatMaterial).flatTexture = mergedProps.texture ?? theme.texture;

    return React.createElement(
        'nineSlice',
        {
            ...mergedProps,
            material: mergedProps.material ?? mat,
            ref: ref,
        },

        props.children
    );
});

Panel9Slice.displayName = 'Panel9Slice';
