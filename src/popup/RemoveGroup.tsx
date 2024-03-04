import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {ConfirmDialog} from 'primereact/confirmdialog';
import "./RemoveGroup.css"
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
/* import 'primeicons/primeicons.css'; */
import React, { useState } from "react";

export const RemoveGroup = (props: {tabs: browser.tabs.Tab[], groupName: string}) => {
    /* const buttonRef = useRef(null); */
    const [dialogVisible, setDialogVisible] = useState(false);


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
            <ConfirmDialog 
                visible={dialogVisible}
                accept={accept}
                reject={() => setDialogVisible(false)}
                onHide={() => setDialogVisible(false)}
                message="Are you sure you want to proceed?"
                showHeader={false}
                dismissableMask={true}
                /* contentStyle={{
                    display: "flex",
                    backgroundColor:"red",
                    alignSelf: "center",
                    textAlign: "left",
                    alignItems: "center",
                    gap: "10px",
                }}
                style={{
                    gap: "10px",
                }} */

                pt = {{
                    message: {
                        style: {
                            textAlign: "left",
                        }
                    }
                }}
                /* header="Confirmation" */
                /* style={{ 
                    width: '50vw', 
                    height: '50vh',
                    maxWidth: '80vw', // Set a maximum width
                    maxHeight: '80vh', // Set a maximum height
                    overflow: 'auto' // Enable scrolling if content overflows 
                }}  */
            />
            <div className="button-remove-group-wrapper" style={{display: "flex", justifyContent: "center"}}>
                <FontAwesomeIcon  icon={faXmark} className='button-remove-group button' onClick={() => setDialogVisible(true)}/>
            </div>
        </>
    );
}