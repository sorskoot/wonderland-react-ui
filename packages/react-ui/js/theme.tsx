import {createContext, useMemo} from 'react';
import {Color} from './renderer.js';

const DefaultTheme = {
    background: '#ffffff' as Color,
    primary: '#007bff' as Color,
    primaryActive: '#0056b3' as Color,
    primaryHovered: '#0056b3' as Color,
    secondary: '#ff7b00' as Color,
    secondaryActive: '#b35600' as Color,
    secondaryHovered: '#b35600' as Color,
    borderPrimary: '#0056b3' as Color,
    borderPrimaryActive: '#0056b3' as Color,
    borderPrimaryHovered: '#0056b3' as Color,
    text: '#000000' as Color,
    borderRadius: 5 as number,
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
