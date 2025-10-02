import React, {createContext, useMemo} from 'react';
import {Color} from './renderer.js';
import {Material} from '@wonderlandengine/api';
import type {YogaNodeProps} from './renderer-types.js'; // if placed elsewhere, import the type

// small helper: ensures every string in the array is a key of T (compile-time only)
function assertKeysOf<T>() {
    return <K extends readonly (keyof T)[]>(keys: K) => keys;
}

// Explicit runtime list of layout keys (kept in sync with YogaNodeProps).
export const YOGA_LAYOUT_KEYS = assertKeysOf<YogaNodeProps>()([
    'width',
    'height',
    'minWidth',
    'minHeight',
    'maxWidth',
    'maxHeight',
    'padding',
    'paddingTop',
    'paddingBottom',
    'paddingLeft',
    'paddingRight',
    'margin',
    'marginTop',
    'marginBottom',
    'marginLeft',
    'marginRight',
    'flex',
    'flexDirection',
    'flexGrow',
    'flexShrink',
    'flexBasis',
    'justifyContent',
    'alignContent',
    'alignItems',
    'alignSelf',
    'gap',
    'rowGap',
    'columnGap',
    'display',
    'position',
    'left',
    'right',
    'top',
    'bottom',
    'aspectRatio',
    'border',
    'borderTop',
    'borderBottom',
    'borderLeft',
    'borderRight',
    'z',
] as const);
// derive a compile-time union and runtime set
export type YogaLayoutKey = (typeof YOGA_LAYOUT_KEYS)[number];
export const YOGA_LAYOUT_KEY_SET = new Set<string>(YOGA_LAYOUT_KEYS as readonly string[]);

const DefaultTheme = {
    backgroundColor: '#ffffff' as Color,
    primary: '#007bff' as Color,
    secondary: '#ff7b00' as Color,
    borderPrimary: '#0056b3' as Color,
    color: '#ffffff' as Color,
    borderRadius: 5 as number,
    textMaterial: null as unknown as Material,
    components: {} as Record<string, any>,
    variants: {} as Record<string, any>,
    hovered: {},
    active: {},
};

DefaultTheme.hovered = {
    backgroundColor: DefaultTheme.primary,
    borderSize: 1,
    borderColor: DefaultTheme.borderPrimary,
};

DefaultTheme.active = {
    backgroundColor: DefaultTheme.primary,
    borderSize: 0,
    borderColor: DefaultTheme.borderPrimary,
};

export type Theme = typeof DefaultTheme & {[key: string]: any};

export const colors = DefaultTheme;

export const ThemeContext = createContext<Theme>(DefaultTheme);

export const ThemeProvider: React.FC<{
    theme?: Partial<Theme>;
    children: React.ReactNode;
}> = ({theme, children}) => {
    const mergedTheme = useMemo(
        () => ({
            ...DefaultTheme,
            ...theme,
        }),
        [theme]
    );

    return <ThemeContext.Provider value={mergedTheme}>{children}</ThemeContext.Provider>;
};

interface ResolveStyleOptions {
    theme: Partial<Theme>;
    props: {[key: string]: any};
    variant?: string;
    variants?: Record<string, {[key: string]: any}>;
    states?: {
        hovered?: boolean;
        active?: boolean;
    };
    specializeKey?: string; // e.g. 'button'
}

export function resolveStyle({
    theme,
    props,
    variant = 'default',
    variants = {},
    states = {},
    specializeKey,
}: ResolveStyleOptions): {[string: string]: any} {
    let baseTheme = {...theme};

    let componentTheme: {[string: string]: any} = {};
    // does the theme have a specializeKey component?
    if (specializeKey && theme.components && specializeKey in theme.components) {
        componentTheme = theme.components[specializeKey];
    }

    let generalVariant: {[string: string]: any} = {};
    let specializedVariant: {[string: string]: any} = {};

    // do we need a variant? and does the theme have it?
    if (variant && theme.variants && variant in theme.variants) {
        generalVariant = theme.variants[variant];
        // does the general variant have a specializeKey component?
        if (
            specializeKey &&
            'components' in generalVariant &&
            generalVariant.components &&
            specializeKey in generalVariant.components
        ) {
            specializedVariant = generalVariant.components[specializeKey];
        }
    }

    // Merge base theme with component theme and variants
    let merged = {
        ...baseTheme,
        ...componentTheme,
        ...generalVariant,
        ...specializedVariant,
        ...props,
    };

    // const variantStyle = baseTheme?.variants ? baseTheme?.variants[variant] ?? {} : {};

    // // if variantStyle also has components
    // if (
    //     variantStyle?.components &&
    //     specializeKey &&
    //     specializeKey in variantStyle.components
    // ) {
    //     Object.assign(variantStyle, variantStyle.components[specializeKey]);
    // }

    // // Specialize theme if needed
    // if (specializeKey && baseTheme.components && specializeKey in baseTheme.components) {
    //     const component = {
    //         ...baseTheme.components[specializeKey],
    //         ...variantStyle.components[specializeKey],
    //     };
    //     baseTheme = {...baseTheme, ...component};
    // }

    // baseTheme = {...baseTheme, ...variantStyle};
    // // Merge base styles
    // let merged = {
    //     ...baseTheme,
    //     ...props,
    // };

    // Apply state overrides
    if (states.hovered) {
        merged = {
            ...merged,
            ...(merged.hovered ?? {}),
        };
    }

    if (states.active) {
        merged = {
            ...merged,
            ...(merged.active ?? {}),
        };
    }

    // // Final fallback resolution (e.g. backgroundColor)
    // merged.backgroundColor =
    //     props.backgroundColor ?? baseTheme.backgroundColor ?? variantStyle.backgroundColor;

    return merged;
}

// Runtime helper to strip layout props from an object:
export function stripLayoutProps<T extends Record<string, any>>(
    obj?: T
): Omit<T, YogaLayoutKey> | undefined {
    if (!obj) return obj;
    // shallow copy and delete layout keys
    const out: any = {...obj};
    for (const k of YOGA_LAYOUT_KEYS) {
        if (k in out) delete out[k as string];
    }
    return out;
}

// TK TODO:
//  - Move to separate file
//  - Maybe allow multiple variants, like CSS classes?
export type VariantProps = {variant?: string};
export const VariantContext = createContext<string | undefined>(undefined);
export const VariantContextProvider = VariantContext.Provider;
export function wrapWithVariantProvider(
    variant: string | undefined,
    node: React.ReactNode
) {
    return variant == null
        ? node
        : React.createElement(VariantContext.Provider, {value: variant}, node);
}
