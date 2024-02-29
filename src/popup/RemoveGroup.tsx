import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {ConfirmDialog, confirmDialog} from 'primereact/confirmdialog';
import "./RemoveGroup.css"
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
/* import 'primeicons/primeicons.css'; */
import React, { useRef } from "react";

export const RemoveGroup = (props: {tabs: browser.tabs.Tab[], groupName: string}) => {
    const buttonRef = useRef(null);

    const accept = async () => {
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

    const reject = () => {
        return;
    }

    const confirm = () => {
        let target = undefined;
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
    } 
    

    
    return (
        <>
            <ConfirmDialog style={{width: '50vw', height: '50vh'}} />
            <div className="button-remove-group-wrapper" style={{display: "flex", justifyContent: "center"}}>
                <FontAwesomeIcon  icon={faXmark} className='button-remove-group button' onClick={confirm}/>
            </div>
        </>
    );
}