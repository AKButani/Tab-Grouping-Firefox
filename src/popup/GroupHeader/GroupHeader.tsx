import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { ItemTypes } from "../types";
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import "./GroupHeader.css"
import { Alert } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faPlus, faXmark } from '@fortawesome/free-solid-svg-icons';

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
        let tabIds = props.tabs.map((tab) => tab.id);

        //tells background to create new window
        browser.runtime.sendMessage({
            tabIds: tabIds,
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
            let message = await browser.runtime.sendMessage({
                type: "store-as-bookmark",
                title: props.groupName,
                tabs: props.tabs,
            });
            if (message){
                setAlert(true);
            }else{
                console.log("error");
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    const closeGroup = async () => {
        let tabIds = props.tabs.map((tab) => tab.id);
        
        try{
            let response = await browser.runtime.sendMessage({
                type: "remove-group-and-tabs",
                title: props.groupName,
                tabIds: tabIds,
            });
            if (response){
                
            }else{
                console.error("error");
            }
        }catch (error){
            console.error(error)
        }
    }

    return (
        <>  
            {showAlert && <Alert dismissible variant='success' onClose={() => setAlert(false)}> Success </Alert>}
            <div ref={drop} className='group-header' style={{ backgroundColor: (isOver && canDrop) ? 'grey' : 'red' }}>
                {props.isExpanded ? <FaAngleDown onClick={() => props.setIsExpanded(!props.isExpanded)} className='expand-collapse-tabs button'/> : <FaAngleRight onClick={() => props.setIsExpanded(!props.isExpanded)} className='expand-collapse-tabs button'/>}
                <h2 className='group-header-category'>
                    {props.groupName}
                </h2>
                <FontAwesomeIcon icon={faPlus} className='button-open-group-new-window button' onClick={openTabsnewWindow} />
                <FontAwesomeIcon icon={faBookmark} className='bookmark-group button' onClick={storeBookmark}/>
                <FontAwesomeIcon icon={faXmark} className='button-remove-group button' onClick={closeGroup}/>
            </div>
        </>
    );
};
