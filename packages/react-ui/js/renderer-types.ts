import type {
    Align,
    Display,
    FlexDirection,
    Justify,
    Overflow,
    PositionType,
    Wrap,
} from './renderer.js';
import type {
    Component,
    Material,
    Mesh,
    Object3D,
    TextComponent,
    Texture,
    Font,
    ViewComponent,
    WonderlandEngine,
} from '@wonderlandengine/api';
import type {ReactNode} from 'react';

export type ValueType = number | 'auto' | `${number}%`;
export type ValueTypeNoAuto = number | `${number}%`;
export type Color = string | Float32Array | number;

export interface YogaNodeProps {
    height?: ValueType;
    width?: ValueType;

    /**
     * Align content defines the distribution of lines along the cross-axis. This only has effect when items are wrapped to multiple lines using flex wrap.
     *
     * **Flex start (default)**: Align wrapped lines to the start of the container's cross axis.
     *
     * **Flex end**: Align wrapped lines to the end of the container's cross axis.
     *
     * **Stretch**: Stretch wrapped lines to match the height of the container's cross axis.
     *
     * **Center**: Align wrapped lines in the center of the container's cross axis.
     *
     * **Space between**: Evenly space wrapped lines across the container's cross axis, distributing remaining space between the lines.
     *
     * **Space around**: Evenly space wrapped lines across the container's cross axis, distributing remaining space around the lines. Compared to space between using space around will result in space being distributed to the beginning of the first lines and end of the last line.
     *
     * **Space evenly**: Evenly space wrapped lines across the container's cross axis, distributing remaining space around the lines. Compared to space around, space evenly will not double the gaps between children. The size of gaps between children and between the parent's edges and the first/last child will all be equal.
     *
     * @see https://www.yogalayout.dev/docs/styling/align-content
     */
    alignContent?: Align;

    /**
     * Align items describes how to align children along the cross axis of their container. Align items is very similar to justify content but instead of applying to the main axis, align items applies to the cross axis.
     *
     * **Stretch (default)**: Stretch children of a container to match the height of the container's cross axis.
     *
     * **Flex start**: Align children of a container to the start of the container's cross axis.
     *
     * **Flex end**: Align children of a container to the end of the container's cross axis.
     *
     * **Center**: Align children of a container in the center of the container's cross axis.
     *
     * **Baseline**: Align children of a container along a common baseline. Individual children can be set to be the reference baseline for their parents.
     *
     * @see {@link https://www.yogalayout.dev/docs/styling/align-items-self}
     */
    alignItems?: Align;

    /**
     * Align self has the same options and effect as `alignItems` (see {@link YogaNodeProps.alignItems})
     * but instead of affecting the children within a container, you can apply this property to a single
     * child to change its alignment within its parent. Align self overrides any option set by the
     * parent with align items.
     *
     * @see {@link https://www.yogalayout.dev/docs/styling/align-items-self}
     */
    alignSelf?: Align;

    /**
     * Justify content describes how to align children within the main axis of their container. For example, you can use this property to center a child horizontally within a container with flex direction set to row or vertically within a container with flex direction set to column.
     *
     * **Flex start (default)**: Align children of a container to the start of the container's main axis.
     *
     * **Flex end**: Align children of a container to the end of the container's main axis.
     *
     * **Center**: Align children of a container in the center of the container's main axis.
     *
     * **Space between**: Evenly space of children across the container's main axis, distributing remaining space between the children.
     *
     * **Space around**: Evenly space of children across the container's main axis, distributing remaining space around the children. Compared to space between using space around will result in space being distributed to the beginning of the first child and end of the last child.
     *
     * **Space evenly**: Evenly distributed within the alignment container along the main axis. The spacing between each pair of adjacent items, the main-start edge and the first item, and the main-end edge and the last item, are all exactly the same.
     *
     * @see {@link https://www.yogalayout.dev/docs/styling/justify-content}
     */
    justifyContent?: Justify;

    /**
     * The aspect ratio property in Yoga has the following properties:
     *  - Accepts any floating point value > 0, the default is undefined.
     * - Defined as the ratio between the width and the height of a node e.g. if a node has an aspect ratio of 2 then its width is twice the size of its height.
     * - Respects the min and max dimensions of an item.
     * - Has higher priority than flex grow
     * - If aspect ratio, width, and height are set then the cross axis dimension is overridden.
     *
     * @see {@link https://www.yogalayout.dev/docs/styling/aspect-ratio}
     */
    aspectRatio?: number;

    /**
     * Display controls which layout specification to follow.
     *
     * **Flex (default)**: The CSS Flexible Box Model specification.
     * **None**: The node is removed from the layout tree and will not be visible.
     * **Contents**: The node is removed from the layout if it has no children.
     *
     * @see {@link https://www.yogalayout.dev/docs/styling/display}
     */
    display?: Display;

    /**
     * Yoga's flex shorthand will act as flex-grow if positive, or flex-shrink if negative.
     *
     * @see {@link https://www.yogalayout.dev/docs/styling/#non-standard-properties}
     */
    flex?: number;

    /**
     * Flex direction controls the direction in which children of a node are laid out. This is also referred to as the main axis. The main axis is the direction in which children are laid out. The cross axis is the axis perpendicular to the main axis, or the axis which wrapping lines are laid out in.
     *
     * **Column (default)**: Align children from top to bottom. If wrapping is enabled then the next line will start to the left first item on the top of the container.
     *
     * **Row**: Align children from left to right. If wrapping is enabled then the next line will start under the first item on the left of the container.
     *
     * **Row reverse**: Align children from right to left. If wrapping is enabled then the next line will start under the first item on the right of the container.
     *
     * **Column reverse**: Align children from bottom to top. If wrapping is enabled then the next line will start to the left first item on the bottom of the container.
     *
     * @see {@link https://www.yogalayout.dev/docs/styling/flex-direction}
     */
    flexDirection?: FlexDirection;

    /**
     * Flex grow: Describes how any space within a container should be distributed among its children along the main axis. After laying out its children, a container will distribute any remaining space according to the flex grow values specified by its children.
     *
     * Flex grow accepts any floating point value >= 0, with 0 being the default value. A container will distribute any remaining space among its children weighted by the child’s flex grow value.
     *
      @see {@link https://www.yogalayout.dev/docs/styling/flex-basis-grow-shrink}
     */
    flexGrow?: number;

    /**
     * Flex basis: Is an axis-independent way of providing the default size of an item along the main axis. Setting the flex basis of a child is similar to setting the width of that child if its parent is a container with a row flex direction or setting the height of a child if its parent is a container with a column flex direction. The flex basis of an item is the default size of that item, the size of the item before any flex grow and flex shrink calculations are performed.
     *
     * @see {@link https://www.yogalayout.dev/docs/styling/flex-basis-grow-shrink}
     */
    flexBasis?: ValueType;

    /**
     * Flex shrink: Describes how to shrink children along the main axis in the case that the total size of the children overflow the size of the container on the main axis. flex shrink is very similar to flex grow and can be thought of in the same way if any overflowing size is considered to be negative remaining space. These two properties also work well together by allowing children to grow and shrink as needed.
     *
     * Flex shrink accepts any floating point value >= 0, with 1 being the default value. A container will shrink its children weighted by the child’s flex shrink value.
     *
     * @see {@link https://www.yogalayout.dev/docs/styling/flex-basis-grow-shrink}
     */
    flexShrink?: number;

    /**
     * The flex wrap property is set on containers and controls what happens when children overflow the size of the container along the main axis. By default children are forced into a single line (which can shrink nodes). When wrapping lines align content can be used to specify how the lines are placed in the container.
     *
     * **No wrap (default)**: No wrapping and children might shrink as a result.
     *
     * **Wrap**: Nodes are wrapped into multiple lines along the main axis if needed.
     *
     * **Wrap reverse**: Behaves the same as wrap but the order of the lines is reversed.
     *
     * @see {@link https://www.yogalayout.dev/docs/styling/flex-wrap}
     */
    flexWrap?: Wrap;

    isReferenceBaseline?: boolean;

    /**
     * Gap will add spacing between the rows and columns of a flex container.
     *
     * @see {@link https://www.yogalayout.dev/docs/styling/gap}
     */
    gap?: number;

    /**
     * columnGap will add spacing between the columns of a flex container.
     *
     * @see {@link https://www.yogalayout.dev/docs/styling/gap}
     */
    columnGap?: number;

    /**
     * Gap will add spacing between the rows of a flex container.
     *
     * @see {@link https://www.yogalayout.dev/docs/styling/gap}
     */
    rowGap?: number;

    border?: number;
    borderTop?: number;
    borderBottom?: number;
    borderLeft?: number;
    borderRight?: number;

    margin?: ValueType;
    marginTop?: ValueType;
    marginBottom?: ValueType;
    marginLeft?: ValueType;
    marginRight?: ValueType;

    maxHeight?: ValueTypeNoAuto;
    maxWidth?: ValueTypeNoAuto;

    minHeight?: ValueTypeNoAuto;
    minWidth?: ValueTypeNoAuto;

    overflow?: Overflow;

    padding?: ValueTypeNoAuto;
    paddingTop?: ValueTypeNoAuto;
    paddingBottom?: ValueTypeNoAuto;
    paddingLeft?: ValueTypeNoAuto;
    paddingRight?: ValueTypeNoAuto;

    /* Relative z value to add to the usual increment, to allow widgets to render on top/behind other widgets */
    z?: number;

    top?: ValueTypeNoAuto;
    left?: ValueTypeNoAuto;
    right?: ValueTypeNoAuto;
    bottom?: ValueTypeNoAuto;
    position?: PositionType;

    onClick?: (e: {x: number; y: number; e: MouseEvent}) => void;
    onUp?: (e: {x: number; y: number; e: PointerEvent}) => void;
    onDown?: (e: {x: number; y: number; e: PointerEvent}) => void;
    onMove?: (e: {x: number; y: number; e: PointerEvent}) => void;
    onHover?: (e: {x: number; y: number; e: PointerEvent}) => void;
    onUnhover?: (e: {x: number; y: number; e: PointerEvent}) => void;
}

export interface TextProps extends YogaNodeProps {
    text?: string;
    fontSize?: number;
    /**
     * Font material
     */
    material?: Material | null;
    textAlign?: 'left' | 'center' | 'right';
    textWrap?: 'none' | 'soft' | 'hard' | 'clip';
}

export interface RoundedRectangleProps extends YogaNodeProps {
    /* Material for the rounded rectangle mesh */
    material?: Material | null;
    /* Material for the rounded rectangle border */
    borderMaterial?: Material | null;
    /* Rounding in pixel-like units */
    rounding?: number;
    /* Rounding resolution */
    resolution?: number;
    roundTopLeft?: boolean;
    roundTopRight?: boolean;
    roundBottomLeft?: boolean;
    roundBottomRight?: boolean;
}

export interface MeshProps extends YogaNodeProps {
    material?: Material | null;
    mesh?: Mesh | null;
}

export interface NineSliceProps extends YogaNodeProps {
    material?: Material | null;
    texture?: Texture | null;
    borderSize?: number;
    borderTextureSize?: number;
}

export type ReactComp = Component & {
    needsUpdate: boolean;
    textMaterial: Material;
    scaling: number[];
    renderCallback: () => void;
    callbacks: Record<string, any>;

    setContext(c: any): void;
    updateLayout(): void;
    render(): ReactNode;
};

// Utility type to convert a union to an intersection
type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (
    x: infer I
) => void
    ? I
    : never;

// Intersects all values of a record type
type IntersectValues<T extends Record<PropertyKey, unknown>> = UnionToIntersection<
    T[keyof T]
>;

// Makes all properties optional recursively
type RecursivePartial<T> = T extends object ? {[K in keyof T]?: RecursivePartial<T[K]>} : T;

// Creates a record of partial overrides for each variant key, based on shared properties
export type VariantOverrides<T extends Record<PropertyKey, unknown>> = Record<
    keyof T,
    RecursivePartial<IntersectValues<T>>
>;
