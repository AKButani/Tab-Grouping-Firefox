export const ItemTypes = {
    tab: 'Tab',
    tabs: 'Tabs',
}
export type TabGroups = Record<string, Array<browser.tabs.Tab>>;

export type DraggableTabProps = {
    tabs: browser.tabs.Tab[];
    groupName: string;
}