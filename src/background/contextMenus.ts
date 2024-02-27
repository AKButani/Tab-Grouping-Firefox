
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
}

export async function handleContextMenuClicks(info: browser.contextMenus.OnClickData) {
    if (info.menuItemId === "OPEN_BOOKMARK_SAME_WINDOW") {
        await openBookmarksameWindow(info);

    } else if (info.menuItemId === "OPEN_BOOKMARK_NEW_WINDOW") {
        await openBookmarknewWindow(info);
    }
}

async function openBookmarksameWindow(info: browser.contextMenus.OnClickData) {
    console.log(info);
    let bookmarkId = info.bookmarkId;
    if (typeof bookmarkId === "string") { //checking if not undefined
        //bookmarks will always have length 1 since bookmarkId is a single string
        let bookmarks = await browser.bookmarks.get(bookmarkId);
        console.log(bookmarks);
        let tabIdOpened = []; //list of id's of tabs opened
        tabIdOpened = await recursiveOpener(bookmarks[0]);
        let groupName = bookmarks[0].title;
        let storage = await browser.storage.session.get();
        let uniqueGroupName = handleRepitition(groupName, storage);
        console.log("Tabs Opened: ")
        console.log(tabIdOpened);
        await moveTabs(tabIdOpened, uniqueGroupName, storage);
    }
    //now need to add these newly opened tabs to a group
}

async function openBookmarknewWindow(info: browser.contextMenus.OnClickData) {
    console.log("clicked on openBookmarknewWindow");
    let bookmarkId = info.bookmarkId;
    if (typeof bookmarkId === "string") {
        let bookmarks = await browser.bookmarks.get(bookmarkId);
        let urls: string[] = [];
        for (let bookmark of bookmarks) { //this only runs once
            urls = await getAllurls(bookmark);
        }
        let window = await browser.windows.create({ focused: true, type: "normal", url: urls });
        let tabs = window.tabs;
        let tabIds = tabs!.map((tab) => tab.id);
        /* console.log("tabs after creating a new window");
        console.log(tabs);
        if (tabs !== undefined){
            let storage = await browser.storage.session.get();
            let groupName = bookmarks[0].title;
            let uniqueGroupName = handleRepitition(groupName, storage);
            storage[uniqueGroupName] = tabs;
            await browser.storage.session.set(storage);
            console.log("added bookmarked tabs to group");
        } */
        let groupName = bookmarks[0].title;
        let storage = await browser.storage.session.get();
        let uniqueGroupName = handleRepitition(groupName, storage);
        await moveTabs(tabIds, uniqueGroupName, storage);
    }
}

async function moveTabs(tabIds: (number | undefined)[], uniqueGroupName: string, storage: { [key: string]: any; }) {
    storage['Unassigned'].filter((tab: browser.tabs.Tab) => tabIds.includes(tab.id));
    let tabList = [];

    for (let tabId of tabIds) {
        if (typeof tabId === "number") {
            let tab = await browser.tabs.get(tabId);
            tabList.push(tab);
        }
    }
    storage[uniqueGroupName] = tabList;

    await browser.storage.session.set(storage);

}
function handleRepitition(groupName: string, storage: { [key: string]: any; }) {
    var res = groupName;
    console.log(storage[res]);
    if (storage[res] === undefined) {
        console.log("returning: " + res);
        return res;
    } else {
        let count = 1;
        while (storage[res] !== undefined) { //potential inf loop??
            console.log("count: " + count);
            res = groupName + ` (${count})`;
            count += 1;
        }
        console.log("returning: " + res);
        return res;
    }


}
//bookmark: folder or a url
//opens all the urls in a bookmark 
//including every child 
async function recursiveOpener(bookmark: browser.bookmarks.BookmarkTreeNode, tabIds: (number | undefined)[] = []) {
    if (bookmark.url) {
        const tab = await browser.tabs.create({
            active: false,
            url: bookmark.url,
        });
        tabIds.push(tab.id);
    } else {
        let children = await browser.bookmarks.getChildren(bookmark.id);
        for (let child of children) {
            await recursiveOpener(child, tabIds);
        }
    }
    return tabIds;
}

async function getAllurls(bookmark: browser.bookmarks.BookmarkTreeNode) {
    const urls: string[] = [];

    // Check if the bookmark is a folder
    let children = await browser.bookmarks.getChildren(bookmark.id);
    if (children) {
        // Iterate over each child
        children.forEach(async (child) => {
            // If the child is a URL, add it to the list of URLs
            if (child.url) {
                urls.push(child.url);
            }

            // If the child is a folder, recursively call the function to get URLs from it
            else {
                let child_children = await browser.bookmarks.getChildren(child.id);
                if (child_children) {
                    const childUrls = await getAllurls(child);
                    urls.push(...childUrls);
                }
            }
        });
    }

    return urls;
}

