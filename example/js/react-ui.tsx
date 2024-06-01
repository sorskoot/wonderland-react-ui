import { Material } from "@wonderlandengine/api";
import { property } from "@wonderlandengine/api/decorators.js";

import { ReactUiBase } from "@wonderlandengine/react-ui";
import {
  Column,
  Panel,
  Text,
  Button,
} from "@wonderlandengine/react-ui/components";
import React, { useState } from "react";

const App = (props: { comp: ReactUi }) => {
  const [list, setList] = useState([] as string[]);

  const addListElement = () => {
    console.log("Add");
    const newList = list.slice();
    newList.push("Element " + list.length.toString());
    setList(newList);
  };

  return (
    <Panel
      material={props.comp.panelMaterial}
      rounding={100}
      resolution={8}
      width={"80%"}
    >
      <Column padding="8%" width="100%" rowGap={20}>
        <Button
          onClick={addListElement}
          material={props.comp.panelMaterialSecondary}
          materialHovered={props.comp.panelMaterialSecondaryHovered}
          padding={20}
        >
          <Text text={"Add Item"} />
        </Button>
        {list.map((label) => (
          <Text key={label} text={label} fontSize={20} />
        ))}
      </Column>
    </Panel>
  );
};

/**
 * react-ui
 */
export class ReactUi extends ReactUiBase {
  static TypeName = "react-ui";
  static InheritProperties = true;

  @property.material({ required: true })
  panelMaterial!: Material;

  @property.material({ required: true })
  panelMaterialSecondary!: Material;

  @property.material({ required: true })
  panelMaterialSecondaryHovered!: Material;

  render() {
    return <App comp={this} />;
  }
}
