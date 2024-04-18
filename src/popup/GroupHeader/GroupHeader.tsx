import React, { useContext, useState } from 'react';
import { FaAngleRight, FaAngleDown } from "react-icons/fa";
import "./GroupHeader.css"
/* import { Alert } from 'react-bootstrap'; */
import { Alert } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faPenToSquare, faPlus } from '@fortawesome/free-solid-svg-icons';
import { RemoveGroup } from '../RemoveGroup/RemoveGroup';
import { DarkModeContext } from '../App';
import { UpdateGroupsContext } from '../GroupList';

export const GroupHeader = (props: { groupName: string; isExpanded: boolean; setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>; onDrop: (tabs: browser.tabs.Tab[], groupName: string) => void; tabs: browser.tabs.Tab[] }) => {
    //console.log(`in group header ${props.groupName}`)
    
    /* const groupNameRef = useRef(props.groupName); // Initialize the ref with the initial groupName

    // Update the ref whenever the groupName prop changes
    React.useEffect(() => {
        groupNameRef.current = props.groupName;
    }, [props.groupName]); */

    /* const [{ canDrop, isOver }, drop] = useDrop(() => ({
        accept: ItemTypes.tabs,
        drop: (tabs) => (props.onDrop(((tabs as { tabs: browser.tabs.Tab[]; }).tabs as browser.tabs.Tab[]), groupNameRef.current)),
        collect: (monitor) => ({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    })); */

    let renameValue = props.groupName;
    const [showAlert, setAlert] = useState(false);
    const [renaming, setRenaming] = useState(false);
    const {updateGroups} = useContext(UpdateGroupsContext);
    
    const darkMode = useContext(DarkModeContext);

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

    const renameGroup = async () => {
        if (renameValue === "" || renameValue === props.groupName){
            renameValue = props.groupName;
            setRenaming(false);
            return;
        }
        
        try{
            let message = await browser.runtime.sendMessage({
                type: "rename-group",
                oldName: props.groupName,
                newName: renameValue,
            });
            if (message){
                const groups = await browser.storage.session.get();
                updateGroups(groups);
            } else {
                renameValue = props.groupName;
                console.error("error");
            }
        }catch(error){
            console.error(error);
        }


        setRenaming(false);
    }

    return (
        <>  
            {showAlert && <Alert severity='success' onClose={() => setAlert(false)}>
                Successfully saved as a bookmark
            </Alert>}
            <div /* ref={drop} */ className='group-header'>
                {props.isExpanded ? <FaAngleDown onClick={() => props.setIsExpanded(!props.isExpanded)} className='expand-collapse-tabs button'/> : <FaAngleRight onClick={() => props.setIsExpanded(!props.isExpanded)} className='expand-collapse-tabs button'/>}
                {!renaming && 
                    (<h3 className='group-header-category'>
                        {props.groupName}
                    </h3>)
                }
                {renaming && (
                    <div className='add-group-container group-header-category'>
                        <input 
                            className='add-group-input'
                            type="text"
                            defaultValue={props.groupName}
                            onChange={(e) => renameValue = e.target.value} 
                        />
                        <button className='add-group-button' onClick={renameGroup}>
                            Save
                        </button>
                    </div>
                    //need to fix input field not updating
                )}
                
                {
                    !renaming && props.groupName !== "Unassigned" &&
                    <FontAwesomeIcon icon={faPenToSquare} className='rename-group button' onClick={() => setRenaming(true)}/>
                }
                <FontAwesomeIcon icon={faPlus} className='button-open-group-new-window button' onClick={openTabsnewWindow} />
                <FontAwesomeIcon icon={faBookmark} className='bookmark-group button' onClick={storeBookmark}/>
                <RemoveGroup tabs={props.tabs} groupName={props.groupName}/>
            </div>
        </>
    );
};
