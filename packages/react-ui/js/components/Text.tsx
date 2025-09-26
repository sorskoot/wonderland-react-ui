import {Object3D} from '@wonderlandengine/api';
import React, {forwardRef, PropsWithChildren, useContext, useMemo} from 'react';
import type {TextProps, Color} from '../renderer-types.js';
import {parseColor} from '../utils.js';
import {MaterialContext, FlatMaterial} from './component-types.js';
import {resolveStyle, ThemeContext} from '../theme.js';

const tempColor = new Float32Array(4);
/**
 * A 3D text component that renders text in 3D space with customizable styling.
 * Supports color customization and inherits text properties from theme context.
 *
 * @component
 * @example
 * ```tsx
 * <Text
 *   color="#ff0000"
 *   fontSize={24}
 *   fontWeight="bold"
 * >
 *   Hello World
 * </Text>
 * ```
 *
 * @param {TextProps & {color?: Color}} props - The text properties
 * @param {Color} [props.color] - Text color. Falls back to theme color or material color
 * @param {Material} [props.material] - Custom material for the text. If not provided, uses cloned text material from context
 * @param {string} [props.text] - Alternative way to provide text content (children takes precedence)
 * @param {React.ReactNode} props.children - Text content to display (converted to string)
 * @param {React.Ref<Object3D>} ref - Forward ref to access the underlying 3D object
 * @returns {React.ReactElement} A 3D text element
 */

export const Text = forwardRef<
    Object3D,
    PropsWithChildren<
        TextProps & {
            color?: Color;
            variant?: string;
        }
    >
>((props, ref) => {
    const context = useContext(MaterialContext);
    let theme = useContext(ThemeContext);

    // if ('text' in theme) {
    //     //@ts-ignore
    //     theme = {...theme, ...theme.text};
    // }
    let mergedProps = resolveStyle({
        theme,
        props,
        variant: props.variant,
        variants: {},
        states: {},
        specializeKey: 'text',
    });
    // let mergedProps = {
    //     ...theme,
    //     ...(props.variant ? theme.variants?.[props.variant] : {}),
    //     ...props,
    // };

    const mat =
        props.material ??
        theme.textMaterial ??
        useMemo(() => context.textMaterial?.clone(), []);
    if (mat) {
        (mat as unknown as FlatMaterial).setColor(
            parseColor(
                mergedProps.color ??
                    (
                        (mergedProps.material ??
                            context.textMaterial) as unknown as FlatMaterial
                    ).color,
                tempColor
            )
        );
    }
    return React.createElement('text3d', {
        ...mergedProps,
        fontSize: mergedProps.fontSize ?? 32,
        material: mat,
        text: props.children?.toString() ?? props.text,
        ref: ref,
    });
});

Text.displayName = 'Text';
