import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from "../types";
import { FaAngleRight, FaAngleDown, FaPlus, FaBookmark } from "react-icons/fa";
import "./GroupHeader.css"
import { Alert } from 'react-bootstrap';

export const GroupHeader = (props: { groupName: string; isExpanded: boolean; setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>; onDrop: (TabId: browser.tabs.Tab, groupName: string) => void; tabs: browser.tabs.Tab[] }) => {
    const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.tab,
        drop: (Tab) => (props.onDrop(((Tab as { tab: browser.tabs.Tab; }).tab as browser.tabs.Tab), props.groupName)),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    }));

    const [showAlert, setAlert] = useState(false);

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

    const storeBookmark = async () => {
        /* console.log(props.groupName);
        console.log(props.tabs);
        let sending = browser.runtime.sendMessage({
            type: "store-as-bookmark",
            title: props.groupName,
            tabs: props.tabs,
        });
        sending.then((response) => {
            if (response.response === "success"){
                console.log("received success");
                setAlert(true);
            }
        }, (e) => {console.error(e)}) */
        try {
            await browser.runtime.sendMessage({
                type: "store-as-bookmark",
                title: props.groupName,
                tabs: props.tabs,
            });
            setAlert(true);
        } catch (error) {
            console.error(error);
        }
        
    }

    return (
        <>  
            {showAlert && <Alert dismissible variant='success' onClose={() => setAlert(false)}> Success </Alert>}
            <div ref={drop} className='group-header' style={{ backgroundColor: (isOver && canDrop) ? 'grey' : 'red' }}>
                {props.isExpanded ? <FaAngleDown onClick={() => props.setIsExpanded(!props.isExpanded)} className='expand-collapse-tabs'/> : <FaAngleRight onClick={() => props.setIsExpanded(!props.isExpanded)} className='expand-collapse-tabs'/>}
                <h1 className='group-header-category'>
                    {props.groupName}
                </h1>
                <FaPlus className='button-open-group-new-window' onClick={openTabsnewWindow} />
                <FaBookmark className='bookmark-group' onClick={storeBookmark}/>
            </div>
        </>
    );
};
