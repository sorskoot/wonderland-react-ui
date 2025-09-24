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
import React, {useEffect, useState} from 'react';

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
        //colors: {
        // background: comp.panelSecondary,
        primary: '#1b9ed9',
        secondary: '#1b9ed9',
        // primaryActive: comp.panelSecondaryActive,
        // primaryHovered: comp.panelSecondaryHovered,
        // borderPrimary: 0,
        // borderPrimaryActive: 0,
        // borderPrimaryHovered: 0xffffffff,
        textColor: '#1b9ed9',
        //},
        button: {
            padding: 8,
            height: 40,
            text: {
                fontSize: 16,
            },
            hovered: {
                backgroundColor: '#1b9ed9',
                text: {
                    textColor: '#ffffff',
                },
            },
        },
        fontSize: 24,
        panel9Slice: {
            borderSize: 16, // in world units
            borderTextureSize: 0.25,
            padding: 16,
            variant: {
                'header': {
                    texture: comp.diaglogBlue,
                    justifyContent: Justify.Center,
                    alignItems: Align.Center,
                    text: {textColor: '#ffffff'},
                },
                'body': {texture: comp.diaglogWhite},
            },
        },
    };

    return (
        <MaterialContext.Provider value={props.comp}>
            <ThemeProvider theme={theme}>
                <Container
                    alignContent={Align.SpaceAround}
                    alignItems={Align.Center}
                    justifyContent={Justify.Center}
                >
                    <Panel9Slice variant="header" width={500} height={64}>
                        <Text>This is the header</Text>
                    </Panel9Slice>
                    <Panel9Slice variant="body" width={500} height={400} gap={16}>
                        <Text>This is the body</Text>
                        <Button variant="default">Primary Button</Button>
                        <Button variant="secondary">Secondary Button</Button>
                    </Panel9Slice>
                </Container>
            </ThemeProvider>
        </MaterialContext.Provider>
    );
};

/**
                        width={500}
                        height={400}
                    ></Panel9Slice>
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

    render() {
        return <App comp={this} />;
    }
}
