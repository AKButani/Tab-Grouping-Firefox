import { recursiveOpener, handleRepitition, addTabstoGroup, getAllurls, moveTabs } from "./helperfunctions";
import { addTab } from "./tabEvents";

//Creates the right-click options
export function createContextMenus() {
    browser.contextMenus.create({
        id: "OPEN_BOOKMARK_SAME_WINDOW",
        /* command: "_execute_browser_action", */
        contexts: ["bookmark"],
        title: "Open Bookmark in Same Window",
    });

    browser.contextMenus.create({
        id: "OPEN_BOOKMARK_NEW_WINDOW",
        /* command: "_execute_browser_action", */
        contexts: ["bookmark"],
        title: "Open Bookmark in New Window",
    });

    browser.contextMenus.create({
        id: "ADD_TO_GROUP",
        contexts: ["tab"],
        title: "Move to Group",
        
    });
}


export async function handleContextMenuClicks(info: browser.contextMenus.OnClickData, tab?: browser.tabs.Tab) {
    if (info.menuItemId === "OPEN_BOOKMARK_SAME_WINDOW") {
        await openBookmarks(info, true);
    } else if (info.menuItemId === "OPEN_BOOKMARK_NEW_WINDOW") {
        await openBookmarks(info, false);
    } else if (typeof info.menuItemId === "string" && info.menuItemId.includes("ADD_TO_GROUP")) {
        moveTabsContextMenu(info.menuItemId.slice(13), tab!);
    }
}

export const handleStorageChangeForContextMenu = async (changes: {[key: string]: browser.storage.StorageChange;}) => {
    //check if a key has been added or removed
    for (let key in changes) {
        if (changes[key].newValue === null || changes[key].newValue === undefined) {
            //key has been removed
            console.log("removing context menu " + key);
            try{
                await browser.contextMenus.remove(`ADD_TO_GROUP_${key}`);
            } catch (error) {
                console.error(error);
            }
            
        } else if (changes[key].oldValue === null || changes[key].oldValue === undefined) {
            //key has been added
            console.log("adding context menu " + key);
            try{
                browser.contextMenus.create({
                    parentId: "ADD_TO_GROUP",
                    id: `ADD_TO_GROUP_${key}`,
                    contexts: ["tab"],
                    title: key,
                });
            } catch (error) {
                console.error(error);
            }
            
        }
    }
}


/* 
    @param info: browser.contextMenus.OnClickData - contains the bookmarkId of the bookmark clicked
    @param sameWindow: boolean - true if the bookmark is to be opened in the same window, false if in a new window
    @returns void
    Opens the bookmark in the same window or a new window
*/
async function openBookmarks(info: browser.contextMenus.OnClickData, sameWindow: boolean) {
    var bookmarkId = info.bookmarkId;
    if (typeof bookmarkId === "string"){//checking if not undefined
        var bookmarks = await browser.bookmarks.get(bookmarkId);
        //bookmarks will always have length 1 since bookmarkId is a single string
        if (sameWindow) {
            console.log(info);
            console.log(bookmarks);
            let tabIdOpened = []; //list of id's of tabs opened
            if (browser.tabs.onCreated.hasListener(addTab)) {
                browser.tabs.onCreated.removeListener(addTab);
                tabIdOpened = await recursiveOpener(bookmarks[0]);
                let groupName = bookmarks[0].title;
                let storage = await browser.storage.session.get();
                let uniqueGroupName = handleRepitition(groupName, storage);
                console.log("Tabs Opened: ")
                console.log(tabIdOpened);

                //temporarily disable the listener

                await addTabstoGroup(tabIdOpened, uniqueGroupName);
                console.log("Added tabs");
                browser.tabs.onCreated.addListener(addTab);
            }
                //await moveTabs(tabIdOpened, uniqueGroupName, storage);
        } else {
            console.log("clicked on openBookmarknewWindow");
            let urls: string[] = [];
           
            urls = await getAllurls(bookmarks[0]);
            if (browser.tabs.onCreated.hasListener(addTab)){
                browser.tabs.onCreated.removeListener(addTab);
                
                let window = await browser.windows.create({ focused: true, type: "normal", url: urls });
                let tabs = window.tabs;
                let tabIds = tabs!.map((tab) => tab.id);
                let groupName = bookmarks[0].title;
                let storage = await browser.storage.session.get();
                let uniqueGroupName = handleRepitition(groupName, storage);
                await addTabstoGroup(tabIds, uniqueGroupName);
                
                browser.tabs.onCreated.addListener(addTab);
            }
            
            
        }
    }

}

async function moveTabsContextMenu(groupName: string, tab: browser.tabs.Tab){
    let highlightedTabs = await browser.tabs.query({ highlighted: true });
    console.log(highlightedTabs);
    let tabsToMove = [];
    if (highlightedTabs.map((tabs) => tabs.id).includes(tab.id)){
        tabsToMove = highlightedTabs;
    }else {
        tabsToMove = [tab];
    }
    console.log(tabsToMove);
    await moveTabs(tabsToMove, groupName); 
}

