# Theming in Wonderland React UI

The Wonderland React UI library provides a powerful theming system that allows you to create consistent, reusable styles across your entire UI. The theming system supports cascading styles, component-specific configurations, and variants for different visual states.

## Overview

The theming system in Wonderland React UI is built around:

- **Global theme properties** - Base styles applied across all components
- **Component-specific styles** - Default styles for specific component types
- **Variants** - Named style collections that can be applied to override defaults
- **Cascading behavior** - Styles flow from global → component → variant → inline props

## Basic Theme Structure

A theme is a JavaScript object with the following structure:

```typescript
const theme = {
    // Global properties
    primaryColor: '#1b9ed9',
    color: '#1b9ed9',
    fontSize: 24,
    
    // Component-specific defaults
    components: {
        componentName: {
            // Component-specific properties
        }
    },
    
    // Named style variants
    variants: {
        variantName: {
            // Variant-specific overrides
        }
    }
};
```

## Setting Up ThemeProvider

To use theming, wrap your UI components with the `ThemeProvider`:

```tsx
import { ThemeProvider } from '@wonderlandengine/react-ui';

const App = () => {
    return (
        <ThemeProvider theme={theme}>
            {/* Your UI components */}
        </ThemeProvider>
    );
};
```

## Global Theme Properties

Global properties are applied as defaults across all components:

```typescript
const theme = {
    primaryColor: '#1b9ed9',    // Default primary color
    color: '#1b9ed9',           // Default text color
    fontSize: 24,               // Default font size
    // ... other global properties
};
```

## Component-Specific Styling

Define default styles for specific component types using the `components` object:

### Panel9Slice Components

```typescript
const theme = {
    components: {
        panel9Slice: {
            borderSize: 16,           // Border size in world units
            borderTextureSize: 0.25,  // Texture border size (0-1)
            padding: 16,              // Internal padding
        }
    }
};
```

### Button Components

```typescript
const theme = {
    components: {
        button: {
            height: 40,
            padding: 8,
            nineSlice: true,
            borderSize: 16,
            borderTextureSize: 0.25,
            texture: buttonTexture,           // Default texture
            justifyContent: Justify.Center,
            alignItems: Align.Center,
            
            // State-specific styles
            hovered: {
                texture: buttonHoverTexture,
            },
            active: {
                texture: buttonActiveTexture,
            },
            
            // Nested component styles
            text: {
                fontSize: 16,
            },
        }
    }
};
```

## Variants

Variants are named style collections that can override component defaults. They're perfect for creating reusable style combinations:

```typescript
const theme = {
    variants: {
        'header': {
            components: {
                panel9Slice: {
                    texture: headerTexture,
                    justifyContent: Justify.Center,
                    alignItems: Align.Center,
                },
                text: {
                    color: '#ffffff'
                },
            },
        },
        'body': {
            components: {
                panel9Slice: {
                    texture: bodyTexture
                },
            },
        },
        'secondary': {
            components: {
                button: {
                    texture: secondaryButtonTexture,
                    hovered: {
                        texture: secondaryButtonHoverTexture,
                    },
                },
            },
        },
    }
};
```

## Using Variants

Apply variants to components using the `variant` prop:

```tsx
<Panel9Slice variant="header">
    <Text>This uses header variant styles</Text>
</Panel9Slice>

<Button variant="secondary">
    <Text>Secondary Button</Text>
</Button>
```

## 9-Slice Textures

9-slice textures are essential for scalable UI elements. They allow textures to be stretched without distorting corners and edges:

```typescript
// Enable 9-slice on components
<Panel9Slice 
    nineSlice={true}
    borderSize={16}           // Border size in world units
    borderTextureSize={0.25}  // Texture border size (0-1)
    texture={panelTexture}
/>

<ProgressBar
    nineSlice={true}
    fgTexture={foregroundTexture}
    bgTexture={backgroundTexture}
    borderSize={16}
    borderTextureSize={0.5}
/>
```

### 9-Slice Parameters

- **`borderSize`**: The size of the border in world units
- **`borderTextureSize`**: The relative size of the border in the texture (0-1)
- **`nineSlice`**: Boolean to enable/disable 9-slice behavior

## Style Cascading

Styles are applied in the following order (later overrides earlier):

1. **Global theme properties**
2. **Component-specific defaults** from `theme.components`
3. **Variant overrides** from `theme.variants[variantName]`
4. **Inline component props**

```tsx
// This button will use:
// 1. Global fontSize: 24
// 2. Button component defaults (height: 40, padding: 8)
// 3. Secondary variant overrides (different texture)
// 4. Inline width override
<Button variant="secondary" width={200}>
    <Text>Styled Button</Text>
</Button>
```

## Nested Component Styling

You can style nested components within theme definitions:

```typescript
const theme = {
    components: {
        button: {
            // Button properties...
            text: {
                fontSize: 16,
                color: '#ffffff',
            },
        },
    },
    variants: {
        'header': {
            components: {
                panel9Slice: {
                    // Panel properties...
                },
                text: {
                    color: '#ffffff',
                    fontSize: 20,
                },
            },
        },
    },
};
```

## Complete Example

Here's a complete theming setup using Kenney UI assets:

```tsx
import { ThemeProvider } from '@wonderlandengine/react-ui';
import { Panel9Slice, Button, Text, Container } from '@wonderlandengine/react-ui/components';

const theme = {
    primaryColor: '#1b9ed9',
    color: '#1b9ed9',
    fontSize: 24,
    
    components: {
        panel9Slice: {
            borderSize: 16,
            borderTextureSize: 0.25,
            padding: 16,
        },
        button: {
            height: 40,
            padding: 8,
            nineSlice: true,
            borderSize: 16,
            borderTextureSize: 0.25,
            texture: buttonBlueTexture,
            justifyContent: Justify.Center,
            alignItems: Align.Center,
            hovered: {
                texture: buttonBlueHoverTexture,
            },
            text: {
                fontSize: 16,
            },
        },
    },
    
    variants: {
        'header': {
            components: {
                panel9Slice: {
                    texture: dialogBlueTexture,
                    justifyContent: Justify.Center,
                    alignItems: Align.Center,
                },
                text: { color: '#ffffff' },
            },
        },
        'body': {
            components: {
                panel9Slice: {
                    texture: dialogWhiteTexture
                },
            },
        },
        'secondary': {
            components: {
                button: {
                    texture: buttonWhiteTexture,
                    hovered: {
                        texture: buttonWhiteHoverTexture,
                    },
                },
            },
        },
    },
};

const App = () => (
    <ThemeProvider theme={theme}>
        <Container>
            <Panel9Slice variant="header">
                <Text>Header Panel</Text>
            </Panel9Slice>
            
            <Panel9Slice variant="body">
                <Button variant="default">
                    <Text>Primary Button</Text>
                </Button>
                <Button variant="secondary">
                    <Text>Secondary Button</Text>
                </Button>
            </Panel9Slice>
        </Container>
    </ThemeProvider>
);
```

## Best Practices

1. **Use variants for reusable styles** - Create variants for common UI patterns like headers, cards, and different button types
2. **Leverage cascading** - Set sensible defaults at the component level and use variants for specific overrides
3. **Consistent naming** - Use descriptive names for variants that reflect their purpose (`header`, `primary`, `danger`)
4. **9-slice for scalable UI** - Use 9-slice textures for panels, buttons, and other elements that need to scale
5. **Test responsiveness** - Ensure your themed components work well at different sizes and aspect ratios

The theming system provides the flexibility to create consistent, professional-looking UIs while maintaining the performance benefits of the Wonderland Engine's custom renderer.
