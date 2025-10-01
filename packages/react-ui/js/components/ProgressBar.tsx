import {Object3D, Material, Texture} from '@wonderlandengine/api';
import React, {forwardRef, useContext} from 'react';
import {FlexDirection, Align, PositionType, Justify} from '../renderer.js';
import type {YogaNodeProps, Color, NineSliceProps} from '../renderer-types.js';
import {Container} from './Container.js';
import {Panel} from './Panel.js';
import {resolveStyle, ThemeContext} from '../theme.js';
import {Panel9Slice} from './Panel9Slice.js';

type ProgressBarBaseProps = YogaNodeProps & {
    nineSlice?: boolean;
    variant?: string;
    /* Number between 0-1 */
    value: number;
    rounding?: number;

    fgMaterial?: Material;
    bgMaterial?: Material;

    fgColor?: Color;
    bgColor?: Color;

    barLeftMargin?: number;
};
type ProgressBarPropsNormal = {
    nineSlice?: false;
};
type ProgressBarProps9Slice = NineSliceProps & {
    nineSlice?: true;
    fgTexture?: Texture;
    bgTexture?: Texture;
};
export type ProgressBarProps = ProgressBarBaseProps &
    (ProgressBarPropsNormal | ProgressBarProps9Slice);

/**
 * A progress bar component that displays a value between 0 and 1 as a filled bar.
 * Supports customizable foreground and background styling.
 *
 * @component
 * @example
 * ```tsx
 * <ProgressBar
 *   value={0.75}
 *   bgColor="#e0e0e0"
 *   fgColor="#4caf50"
 *   height={20}
 *   width={200}
 * >
 *   <Text>75%</Text>
 * </ProgressBar>
 * ```
 *
 * @param {ProgressBarProps} props - The progress bar properties
 * @param {number} props.value - Progress value between 0 and 1 (will be clamped if outside range)
 * @param {number} [props.rounding=30] - Corner rounding radius for the progress bar
 * @param {Material} [props.fgMaterial] - Material for the foreground (filled) bar
 * @param {Material} [props.bgMaterial] - Material for the background bar
 * @param {Color} [props.fgColor] - Color for the foreground (filled) bar
 * @param {Color} [props.bgColor] - Color for the background bar
 * @param {number} [props.barLeftMargin=12] - Left margin for the content overlay
 * @param {React.ReactNode} props.children - Content to display over the progress bar (e.g., percentage text)
 * @param {React.Ref<Object3D>} ref - Forward ref to access the underlying 3D object
 * @returns {React.ReactElement} A progress bar element
 */
export const ProgressBar = forwardRef<Object3D, React.PropsWithChildren<ProgressBarProps>>(
    (props, ref) => {
        const value = Math.max(Math.min(1, props.value), 0); // clamp between 0 and 1

        const theme = useContext(ThemeContext);

        const propsMerged = resolveStyle({
            theme,
            variant: props.variant,
            props,
            specializeKey: 'ProgressBar',
        });

        const rounding = propsMerged.rounding ?? 30;
        if (!propsMerged.nineSlice) {
            return (
                <Panel
                    material={propsMerged.bgMaterial}
                    backgroundColor={propsMerged.bgColor}
                    {...propsMerged}
                    flexDirection={FlexDirection.Row}
                    padding={propsMerged.padding ?? 6}
                    paddingLeft={propsMerged.paddingLeft ?? 8}
                    paddingRight={propsMerged.paddingRight ?? 8}
                    resolution={6}
                    rounding={rounding * 1.5}
                    ref={ref}
                >
                    <Container
                        alignItems={Align.FlexStart}
                        position={PositionType.Absolute}
                        width="100%"
                        height="100%"
                        left={propsMerged.barLeftMargin ?? 12}
                    >
                        {props.children}
                    </Container>

                    <Panel
                        width={`${100 * value}%`}
                        minWidth={rounding * 2}
                        height="100%"
                        material={propsMerged.fgMaterial}
                        backgroundColor={propsMerged.fgColor}
                        alignItems={Align.Center}
                        rounding={rounding}
                    ></Panel>
                </Panel>
            );
        } else {
            return (
                <Panel9Slice
                    texture={propsMerged.bgTexture}
                    {...propsMerged}
                    flexDirection={FlexDirection.Row}
                    padding={propsMerged.padding ?? 8}
                    paddingLeft={propsMerged.paddingLeft ?? 6}
                    paddingRight={propsMerged.paddingRight ?? 6}
                >
                    <Container
                        marginTop={8}
                        alignItems={Align.Center}
                        position={PositionType.Absolute}
                        width={`${100 * value}%`}
                        height="100%"
                        left={propsMerged.barLeftMargin ?? 12}
                    >
                        {props.children}
                    </Container>
                    <Panel9Slice
                        borderSize={propsMerged.fgBorderSize || propsMerged.borderSize || 0}
                        borderTextureSize={
                            propsMerged.fgBorderTextureSize || propsMerged.borderTextureSize
                        }
                        texture={propsMerged.fgTexture}
                        width={`${100 * value}%`}
                        minWidth={rounding * 2}
                        top={-1}
                        height="100%"
                        material={propsMerged.fgMaterial}
                        backgroundColor={propsMerged.fgColor}
                        alignItems={Align.Center}
                        rounding={rounding}
                    ></Panel9Slice>
                </Panel9Slice>
            );
        }
    }
);
ProgressBar.displayName = 'ProgressBar';
