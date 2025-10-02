import {Material, Texture} from '@wonderlandengine/api';
import {property} from '@wonderlandengine/api/decorators.js';

import {
    Align,
    FlexDirection,
    Justify,
    ReactUiBase,
    ThemeProvider,
} from '@wonderlandengine/react-ui';
import {
    Column,
    Panel,
    Text,
    Button,
    Row,
    ProgressBar,
    MaterialContext,
    Image,
    Panel9Slice,
    Container,
} from '@wonderlandengine/react-ui/components';
import React, {act, useEffect, useState} from 'react';

const App = (props: {comp: ReactUi}) => {
    const comp = props.comp;

    const [list, setList] = useState(['Element 0', 'Element 1']);

    const addListElement = () => {
        const newList = list.slice();
        newList.push('Element ' + list.length.toString());
        setList(newList);
    };

    const removeListElement = (i: number) => {
        const newList = list.slice();
        newList.splice(i, 1);
        setList(newList);
    };

    const [text, setText] = useState(
        'This is a 9-slice. It is a texture that can be stretched and scaled without losing quality. It is used for UI elements like panels and buttons.'
    );

    const theme = {
        primaryColor: '#1b9ed9',
        color: '#1b9ed9',
        fontSize: 24,
        components: {
            panel9Slice: {
                borderSize: 16, // in world units
                borderTextureSize: 0.25,
                padding: 16,
            },
            button: {
                height: 40,
                padding: 8,
                nineSlice: true,
                borderSize: 16, // in world units
                borderTextureSize: 0.25,
                texture: comp.buttonBlue,
                justifyContent: Justify.Center,
                alignItems: Align.Center,
                hovered: {
                    texture: comp.buttonBlueHover,
                },
                active: {
                    texture: comp.buttonBlue,
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
                        texture: comp.diaglogBlue,
                        justifyContent: Justify.Center,
                        alignItems: Align.Center,
                    },
                    text: {color: '#ffffff'},
                },
            },
            'body': {
                components: {
                    panel9Slice: {texture: comp.diaglogWhite},
                },
            },
            'secondary': {
                components: {
                    button: {
                        texture: comp.buttonWhite,
                        hovered: {
                            texture: comp.buttonWhiteHover,
                        },
                        active: {
                            texture: comp.buttonWhite,
                        },
                    },
                },
            },
        },
    };

    return (
        <MaterialContext.Provider value={props.comp}>
            <ThemeProvider theme={theme}>
                <Container
                    width={500}
                    alignContent={Align.SpaceAround}
                    alignItems={Align.Center}
                    justifyContent={Justify.Center}
                >
                    <Panel9Slice variant="header" width="100%" height={64}>
                        <Text>This is the header</Text>
                    </Panel9Slice>
                    <ProgressBar
                        nineSlice={true}
                        fgTexture={comp.progressBarForeground}
                        bgTexture={comp.progressBarBackground}
                        borderSize={16} // in world units
                        borderTextureSize={0.5}
                        // bgColor={theme.primaryColor}
                        // fgColor="#440044"
                        value={0.5}
                        height={50}
                        width="100%"
                    >
                        <Text variant="header" fontSize={13} top={3}>
                            progress
                        </Text>
                    </ProgressBar>
                    <Panel9Slice variant="body" width={500} height={400} gap={16}>
                        <Text>This is the body</Text>
                        <Button variant="default">
                            <Text fontSize={16} color="#ffffff">
                                Primary Button
                            </Text>
                        </Button>
                        <Button variant="secondary">
                            <Text fontSize={16}>Secondary Button</Text>
                        </Button>
                        <Image
                            borderColor={theme.primaryColor}
                            src="Orange-grumpy-cat-.jpg"
                            width="100%"
                            flexGrow={1}
                            borderSize={2}
                        />
                    </Panel9Slice>
                </Container>
            </ThemeProvider>
        </MaterialContext.Provider>
    );
};

/**
 * react-ui
 */
export class ReactUi extends ReactUiBase {
    static TypeName = 'react-ui';
    static InheritProperties = true;

    @property.texture()
    diaglogWhite?: Texture;

    @property.texture()
    diaglogBlue?: Texture;

    @property.texture()
    buttonBlue?: Texture;

    @property.texture()
    buttonBlueHover?: Texture;

    @property.texture()
    buttonWhite?: Texture;

    @property.texture()
    buttonWhiteHover?: Texture;

    @property.texture()
    progressBarBackground?: Texture;

    @property.texture()
    progressBarForeground?: Texture;

    render() {
        return <App comp={this} />;
    }
}
