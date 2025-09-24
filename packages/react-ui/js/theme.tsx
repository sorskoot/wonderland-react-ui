import {createContext, useMemo} from 'react';
import {Color} from './renderer.js';
import {Material} from '@wonderlandengine/api';

const DefaultTheme = {
    backgroundColor: '#ffffff' as Color,
    primary: '#007bff' as Color,
    primaryActive: '#0056b3' as Color,
    primaryHovered: '#0056b3' as Color,
    secondary: '#ff7b00' as Color,
    secondaryActive: '#b35600' as Color,
    secondaryHovered: '#b35600' as Color,
    borderPrimary: '#0056b3' as Color,
    borderPrimaryActive: '#aed5ffff' as Color,
    borderPrimaryHovered: '#aed5ffff' as Color,
    textColor: '#ffffff' as Color,
    borderRadius: 5 as number,
    textMaterial: null as unknown as Material,
    hovered: {},
    active: {},
};

DefaultTheme.hovered = {
    backgroundColor: DefaultTheme.primaryHovered,
    borderSize: 1,
    borderColor: DefaultTheme.borderPrimaryHovered,
};

DefaultTheme.active = {
    backgroundColor: DefaultTheme.primaryActive,
    borderSize: 0,
    borderColor: DefaultTheme.borderPrimaryActive,
};

export type Theme = typeof DefaultTheme;

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
