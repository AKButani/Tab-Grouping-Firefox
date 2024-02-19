import React from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from "../types";
import { FaAngleRight, FaAngleDown, FaPlus, FaBookmark } from "react-icons/fa";
import "./GroupHeader.css"

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

    const openTabsnewWindow = () => {
        let tabs = props.tabs.map((tab) => tab.id);

        //tells background to create new window
        browser.runtime.sendMessage({
            tabIds: tabs,
            type: "open_tabs_new_win"
        })    
        
    }

    const storeBookmark = () => {
        browser.runtime.sendMessage({
            type: "store-as-bookmark",
            title: props.groupName,
            tabs: props.tabs,
        });
    }

    return (
        <div ref={drop} className='group-header' onClick={() => props.setIsExpanded(!props.isExpanded)} style={{ backgroundColor: (isOver && canDrop) ? 'grey' : 'red' }}>
            {props.isExpanded ? <FaAngleDown className='expand-collapse-tabs'/> : <FaAngleRight className='expand-collapse-tabs'/>}
            <h1 className='group-header-category'>
                {props.groupName}
            </h1>
            <FaPlus className='button-open-group-new-window' onClick={openTabsnewWindow} />
            <FaBookmark className='bookmark-group' onClick={storeBookmark}/>
        </div>
    );
};
