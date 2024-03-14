import { Tooltip } from "react-tooltip";


const Tooltips = () => {
    
    const MyTooltip = (props: {selector: string, content: string} ) =>
    { 
        return (
            <Tooltip 
                style={{fontSize: 15}}
                anchorSelect={props.selector}
                content={props.content}
                place="top-start"
                delayShow={10}
            />
        )
    };

    
    return (
        <>
            <MyTooltip 
                selector=".expand-collapse-tabs"
                content="Show/Hide Tabs"
            />
            <MyTooltip 
                selector=".button-open-group-new-window"
                content="Open Tabs in New Window"
            />
            <MyTooltip 
                selector=".bookmark-group"
                content="Save Group as a Bookmark"
            />
            <MyTooltip 
                selector=".button-remove-group"
                content="Remove Group and Close all Tabs"
            />
            <MyTooltip 
                selector=".rename-group"
                content="Rename Group"
            />
        </>
    );
}

export default Tooltips;