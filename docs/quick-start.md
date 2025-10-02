# Quick Start Guide

This guide will walk you through setting up your first React UI component in Wonderland Engine.

## Prerequisites

- Wonderland Engine project set up
- `@wonderlandengine/react-ui` package installed
- Basic knowledge of React and TypeScript

## Step 1: Create the React UI Component

Create a new TypeScript file (e.g., `js/react-ui.tsx`) in your project:

```tsx
import { ReactUiBase } from '@wonderlandengine/react-ui';
import { MaterialContext, Panel, Text, Button } from '@wonderlandengine/react-ui/components';
import React from 'react';

const App = (props: { comp: ReactUi }) => {
    return (
        <MaterialContext.Provider value={props.comp}>
            <Panel width={400} height={300} padding={20}>
                <Text height={24} fontSize={24}>Hello React UI!</Text>
                <Button 
                    backgroundColor="#007BFF"
                    padding={15}
                    onClick={() => console.log('Button clicked!')}
                >
                    <Text height={24} fontSize={18}>Click Me</Text>
                </Button>
            </Panel>
        </MaterialContext.Provider>
    );
};

export class ReactUi extends ReactUiBase {
    static TypeName = 'react-ui';
    static InheritProperties = true;

    render() {
        return <App comp={this} />;
    }
}
```

## Step 2: Set Up Materials and Pipelines in Wonderland Editor

### Create Custom Pipelines

1. **Clone Default Pipelines:**
   - Duplicate the default `Flat Opaque` pipeline → rename to `UI Color`
   - Duplicate the default `Flat Opaque Textured` pipeline → rename to `UI Color Textured`
   - Duplicate the default `Text` pipeline → rename to `UI Text`

### Create Materials

1. **Create Three Materials:**
   - Create a new material named `UI Text`
     - Assign the `UI Text` pipeline
   - Create a new material named `UI Color`
     - Assign the `UI Color` pipeline
     - Leave texture slots empty
   - Create a new material named `UI Color Textured`
     - Assign the `UI Color Textured` pipeline
     - This will be used for components that need textures

## Step 3: Set Up the Component in Wonderland Editor

### Create the Object

1. **Create an Empty Object** in your scene hierarchy
2. **Add the React UI Component** to this object:
   - Click "Add Component"
   - Select your custom component (e.g., "react-ui")

### Configure Required References

1. **Set the Required Properties** in the component inspector:

   **Font Reference:**
   - Assign a font asset to the `font` property
   - This will be used for all text rendering

   **Panel Material (UI Color):**
   - Assign the `UI Color` material to the `panelMaterial` property
   - Used for solid color panels, buttons, and UI elements

   **Panel Material Textured (UI Color Textured):**
   - Assign the `UI Color Textured` material to the `panelMaterialTextured` property
   - Used for textured panels, images, and 9-slice elements

   **Text Material:**
   - Assign the `UI Text` material to the `textMaterial` property
   - Used for all text rendering

## Step 4: Build and Test

1. **Build your project** using the Wonderland Editor
2. **Deploy and test** in your browser
3. You should see your UI rendered in 3D space

## Common Component Patterns

### Basic Panel with Text

```tsx
<Panel width={300} height={200} backgroundColor={[0.1, 0.1, 0.1, 0.8]}>
    <Text fontSize={20} color="#ffffff">Panel Content</Text>
</Panel>
```

### Interactive Button

```tsx
<Button
    backgroundColor="#3399FF"
    hovered={{ backgroundColor: "#4DB3FF" }}
    active={{ backgroundColor: "#1A80E6" }}
    padding={15}
    onClick={() => console.log('Clicked!')}
>
    <Text fontSize={16}>Button Text</Text>
</Button>
```

### Layout with Columns

```tsx
import { Column, Row } from '@wonderlandengine/react-ui/components';
import { Justify, Align } from '@wonderlandengine/react-ui';

<Panel width={400} height={300}>
    <Column padding={20} gap={15} justifyContent={Justify.Center}>
        <Text fontSize={24}>Title</Text>
        <Row gap={10} justifyContent={Justify.SpaceBetween}>
            <Button><Text>Button 1</Text></Button>
            <Button><Text>Button 2</Text></Button>
        </Row>
    </Column>
</Panel>
```

## Important Notes

### Material Context

Always wrap your UI in `MaterialContext.Provider` and pass your component instance:

```tsx
<MaterialContext.Provider value={props.comp}>
    {/* Your UI components */}
</MaterialContext.Provider>
```

### Color Format

Colors in Wonderland React UI use normalized RGBA arrays:

```tsx
// Red color: [R, G, B, Alpha] where values are 0-1
backgroundColor={[1.0, 0.0, 0.0, 1.0]}
```

### Component Inheritance

Your component should extend `ReactUiBase` and implement the `render()` method:

```tsx
export class ReactUi extends ReactUiBase {
    static TypeName = 'react-ui';
    static InheritProperties = true;

    render() {
        return <App comp={this} />;
    }
}
```

## Next Steps

- Explore the [Theming documentation](theming.md) for advanced styling
- Add interactivity with state management using React hooks
- Try using 9-slice textures for scalable UI elements
- Experiment with layout components like `Column`, `Row`, and `Container`

## Troubleshooting

**UI not appearing?**

- Check that all three materials are properly assigned
- Ensure the object with the React UI component is active
- Verify that your font asset is loaded

**Materials not working?**

- Confirm pipelines are correctly assigned to materials
- Check that `MaterialContext.Provider` wraps your components
- Ensure material names match the pipeline requirements

**Text not rendering?**

- Verify the font property is set on your component
- Check that the text material uses the correct pipeline
- Ensure text color has sufficient contrast with the background
