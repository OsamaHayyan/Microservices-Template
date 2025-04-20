export const isIncludeText = (mainText?:string, searchText?: string[])=>{
    if (!mainText || !searchText || searchText.length === 0) {
        return false;
    }

    const lowerCaseMainText = mainText.toLowerCase();
    const lowerCaseSearchText = searchText.map(text => text.toLowerCase());

    return lowerCaseSearchText.some(text => lowerCaseMainText.includes(text));
}