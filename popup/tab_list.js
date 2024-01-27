//@ts-check
async function getandsetCategories(tabs_list) {
    // @ts-ignore
    let categories = await browser.storage.session.get();

    
    
    if (!categories || Object.keys(categories).length === 0) {
        let tabs = [];
        for (var tab of tabs_list) {
            tabs.push(tab)
        }
        categories = {
            'Unassigned': tabs,
        };
        // @ts-ignore
        browser.storage.session.set(categories);
    }
    console.log(categories);
    return categories;
}

function output_tabs(category, tab_list){ //need to generalise this!
    console.log(category);
    console.log(tab_list);
    var main_wrapper = document.getElementById('list-categories');
    
    var header = document.createElement('h2');
    header.innerText = category;
    
    var list = document.createElement('ul');
    
    // @ts-ignore
    main_wrapper.appendChild(header);
    // @ts-ignore
    main_wrapper.appendChild(list);

    
    
    for (var tab of tab_list) {
        {
            var element = document.createElement('li');
            element.textContent = tab.title;
            list.appendChild(element);
        }
    }
}

async function find_tab_list() {
    // @ts-ignore
    var tabs_list = await browser.tabs.query({});

    var categories = await getandsetCategories(tabs_list);

    for (var category of Object.keys(categories)){
        output_tabs(category, categories[category]);
    }
    
}

async function storage_update(changes, area){
    console.log("Area change: " + area);
}

document.addEventListener('DOMContentLoaded', find_tab_list);
// @ts-ignore
browser.storage.onChanged.addListener(storage_update)

