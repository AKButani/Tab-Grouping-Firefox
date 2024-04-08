import { NestedMenuItem } from 'mui-nested-menu';
import { useContext, useState } from 'react';
import { UpdateGroupsContext } from './GroupList';
import IconButton from '@mui/material/IconButton';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Menu, MenuItem } from '@mui/material';
import { FontAwesomeIcon  } from '@fortawesome/react-fontawesome';
import { faEllipsisVertical } from '@fortawesome/free-solid-svg-icons';
import { DarkModeContext } from './App';

export const TabOptionsMenu = (props: {currentTab: browser.tabs.Tab, selectedTabs: browser.tabs.Tab[]}) => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const darkMode = useContext(DarkModeContext).darkMode;

    const handleClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const groups = useContext(UpdateGroupsContext).groups;
    const setGroups = useContext(UpdateGroupsContext).updateGroups;
    
    const changeGroup = async (groupName: string) => {
        let selectedTabs = props.selectedTabs;
        if (!selectedTabs.includes(props.currentTab)) {
            selectedTabs = [...selectedTabs, props.currentTab];
        }
        
        let message = await browser.runtime.sendMessage({
            type: "change-tab-group",
            tabs: selectedTabs,
            groupName: groupName,
        });
        if (message) {
            const groups = await browser.storage.session.get();
            setGroups(groups);
        } else{
            console.error("error");
        }
        handleClose();
    }

    
    let groupNames: string[];
    if (groups !== undefined) {
        groupNames = Object.keys(groups);
    } else {
        groupNames = [];
    }

    return (
        <div>
            <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? 'long-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                size='small'
            >
                {/* <FontAwesomeIcon icon="fa-regular fa-ellipsis-vertical" /> */}
                <FontAwesomeIcon style={{color: darkMode ? '#fbfbfe' : '#15141a'}} icon={faEllipsisVertical} size='sm'/>
            </IconButton>
            <Menu 
                anchorEl={anchorEl} 
                open={open} 
                onClose={handleClose} 
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'center',
                    horizontal: 'right',
                }}
                /* style={{height: '20px'}} */
            >
                <NestedMenuItem 
                    parentMenuOpen={open}
                    label="Move to Group"
                    rightIcon={<ArrowRightIcon />}
                    MenuProps={{
                        anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'right',
                        },
                        transformOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                        

                    }}
                    
                >
                    {groupNames.map((groupName) => (
                        <MenuItem key={groupName} onClick={async () => await changeGroup(groupName)} style={{fontSize: '12px', height: '10px'}} dense={true}>
                            {groupName}
                        </MenuItem>
                    ))}
                </NestedMenuItem>
            </Menu>
        </div>
    );



};