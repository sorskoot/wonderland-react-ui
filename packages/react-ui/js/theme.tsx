import React, {createContext, useMemo} from 'react';
import {Color} from './renderer.js';
import {Material} from '@wonderlandengine/api';

const DefaultTheme = {
    backgroundColor: '#ffffff' as Color,
    color: '#ffffff' as Color,
    primary: '#007bff' as Color,
    secondary: '#ff7b00' as Color,
    borderPrimary: '#0056b3' as Color,
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

    return merged;
}

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
