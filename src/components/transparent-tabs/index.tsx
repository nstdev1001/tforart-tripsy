import { FloatingIndicator, Tabs, type TabsProps } from "@mantine/core";
import { useEffect, useRef, useState, type ReactNode } from "react";
import classes from "./styles.module.css";

export interface TransparentTabItem {
  value: string;
  label: ReactNode;
  content: ReactNode;
}

interface TransparentTabsProps extends Omit<TabsProps, "children"> {
  tabs: TransparentTabItem[];
}

export const TransparentTabs = ({
  tabs,
  defaultValue,
  value: controlledValue,
  onChange,
  ...others
}: TransparentTabsProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [uncontrolledValue, setUncontrolledValue] = useState<string | null>(
    defaultValue || (tabs.length > 0 ? tabs[0].value : null),
  );
  const [currentTabRef, setCurrentTabRef] = useState<HTMLButtonElement | null>(
    null,
  );
  const [rootElement, setRootElement] = useState<HTMLDivElement | null>(null);

  const value =
    controlledValue !== undefined ? controlledValue : uncontrolledValue;

  const handleValueChange = (val: string | null) => {
    if (controlledValue === undefined) {
      setUncontrolledValue(val);
    }
    onChange?.(val);
  };

  const controlsRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const setControlRef = (val: string) => (node: HTMLButtonElement) => {
    controlsRefs.current[val] = node;
  };

  useEffect(() => {
    if (value && controlsRefs.current[value]) {
      setCurrentTabRef(controlsRefs.current[value]);
    }
    if (rootRef.current) {
      setRootElement(rootRef.current);
    }
  }, [value]);

  return (
    <Tabs variant="none" value={value} onChange={handleValueChange} {...others}>
      <Tabs.List ref={rootRef} className={classes.list} grow>
        {tabs.map((tab) => (
          <Tabs.Tab
            key={tab.value}
            value={tab.value}
            ref={setControlRef(tab.value)}
            className={classes.tab}
          >
            {tab.label}
          </Tabs.Tab>
        ))}

        <FloatingIndicator
          target={currentTabRef}
          parent={rootElement}
          className={classes.indicator}
        />
      </Tabs.List>

      {tabs.map((tab) => (
        <Tabs.Panel key={tab.value} value={tab.value} pt="md">
          {tab.content}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};
