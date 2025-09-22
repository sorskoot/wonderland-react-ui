import {createContext, useMemo} from 'react';
import {Color} from './renderer.js';

const DefaultTheme = {
    colors: {
        background: '#ffffff' as Color,
        primary: '#007bff' as Color,
        primaryActive: '#0056b3' as Color,
        primaryHovered: '#0056b3' as Color,
        borderPrimary: '#0056b3' as Color,
        borderPrimaryActive: '#0056b3' as Color,
        borderPrimaryHovered: '#0056b3' as Color,
        text: '#000000' as Color,
    },
    panel: {},
    button: {},
};

export type Theme = typeof DefaultTheme;

export const ThemeContext = createContext<Theme>(DefaultTheme);

export const ThemeProvider: React.FC<{
    theme?: Partial<Theme>;
    children: React.ReactNode;
}> = ({theme, children}) => {
    const mergedTheme = useMemo(
        () => ({
            colors: {...DefaultTheme.colors, ...theme?.colors},
            panel: {...DefaultTheme.panel, ...theme?.panel},
            button: {...DefaultTheme.button, ...theme?.button},
        }),
        [theme]
    );

    return <ThemeContext.Provider value={mergedTheme}>{children}</ThemeContext.Provider>;
};
