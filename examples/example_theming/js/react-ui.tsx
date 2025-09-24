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
        // primary: comp.panelSecondary,
        // primaryActive: comp.panelSecondaryActive,
        // primaryHovered: comp.panelSecondaryHovered,
        // borderPrimary: 0,
        // borderPrimaryActive: 0,
        // borderPrimaryHovered: 0xffffffff,
        // text: comp.textColor,
        //},
        // button: {
        //     backgroundColor: '#ff0000',
        //     text: {
        //         textColor: '#00ffff',
        //         textMaterial: comp.buttonTextMaterial,
        //     },
        // },
    };

    return (
        <MaterialContext.Provider value={props.comp}>
            <ThemeProvider theme={theme}>
                <Container
                    alignContent={Align.SpaceAround}
                    alignItems={Align.Center}
                    justifyContent={Justify.Center}
                >
                    <Panel alignSelf={Align.Center} width={500} height={400}></Panel>
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

    render() {
        return <App comp={this} />;
    }
}
