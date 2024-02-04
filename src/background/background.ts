export {}

async function initGroups(){
    let stored = await browser.storage.session.get();
    if (Object.keys(stored).length !== 0){
        console.log(stored);
        console.log("storage already set")
        return;
    }
    let groups: Record<string, Array<browser.tabs.Tab>> = {};
    let tabs = await browser.tabs.query({});
    groups['Unassigned'] = tabs;
    console.log(groups);
    browser.storage.session.set(groups);
}

console.log("background running")
initGroups().then(() => {
    console.log("initialised groups")
}).catch((e) => console.log("Error " + e));