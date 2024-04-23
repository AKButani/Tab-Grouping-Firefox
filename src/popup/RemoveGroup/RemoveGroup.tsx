import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import "./RemoveGroup.css"
import React, { useContext, useState } from "react";
import { UpdateGroupsContext } from "../GroupList";
import { Button, DialogContentText } from "@mui/material";

export const RemoveGroup = (props: {tabs: browser.tabs.Tab[], groupName: string}) => {
    /* const buttonRef = useRef(null); */
    const [dialogVisible, setDialogVisible] = useState(false);
    const setGroups = useContext(UpdateGroupsContext).updateGroups;

    const accept = async () => {
        let tabIds = props.tabs.map((tab) => tab.id);
        
        try{
            let response = await browser.runtime.sendMessage({
                type: "remove-group-and-tabs",
                title: props.groupName,
                tabIds: tabIds,
            });
            if (response){
                //force rerender the popup?
                /* window.close(); */
                const groups = await browser.storage.session.get();
                if (setGroups !== undefined){
                    setGroups(groups);
                }
                
            }else{
                console.error("error");
            }
        }catch (error){
            console.error(error)
        }
        setDialogVisible(false);
    }

/*     const confirm = () => {
        /* let target = undefined;
        if (buttonRef.current){
            target = buttonRef.current;
        } 
        console.log("in confirmation dialog");
        
        confirmDialog({
            message: 'Are you sure you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            defaultFocus: 'accept',
            accept,
            reject,
        });
    }  */
    

    
    return (
        <>
            <Dialog 
                open={dialogVisible}
                onClose={() => setDialogVisible(false)}
            >
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to close all tabs in the group?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogVisible(false)}> No </Button>
                    <Button onClick={accept} autoFocus> Yes </Button>
                </DialogActions>
            </Dialog>

            {/* <div className="button-remove-group-wrapper" style={{display: "flex", justifyContent: "center", backgroundColor: "red"}}> */}
            <FontAwesomeIcon  icon={faXmark} className='button-remove-group button' onClick={() => setDialogVisible(true)}/>
           {/*  </div> */}
        </>
    );
}