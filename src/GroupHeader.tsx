import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from "./types";
import { FaAngleRight, FaAngleDown, FaPlus } from "react-icons/fa";

export const GroupHeader = (props: { groupName: string; isExpanded: boolean; setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>; onDrop: (TabId: browser.tabs.Tab, groupName: string) => void; tabs: browser.tabs.Tab[] }) => {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.tab,
        drop: (Tab) => (props.onDrop(((Tab as { tab: browser.tabs.Tab; }).tab as browser.tabs.Tab), props.groupName)),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    }));

    /* const onOpenSuccess = async (window: browser.windows.Window, tabs: number[]) => {
        //now open other tabs in this window
        console.log("tabs to move");
        console.log(tabs);
        await browser.tabs.move(tabs, {windowId: window.id, index: -1});
    } */

    const openTabsnewWindow = async () => {
        let tabs = props.tabs.map((tab) => tab.id);

        //tells background to create new window
        browser.runtime.sendMessage({
            tabIds: tabs,
            type: "open_tabs_new_win"
        })    
        
    }
    return (
        <div ref={drop} className='group-header' onClick={() => props.setIsExpanded(!props.isExpanded)} style={{ backgroundColor: (isOver && canDrop) ? 'grey' : 'red' }}>
            {props.isExpanded ? <FaAngleDown /> : <FaAngleRight />}
            <h1>
                {props.groupName}
            </h1>
            <FaPlus onClick={openTabsnewWindow}/>
        </div>
    );
};
