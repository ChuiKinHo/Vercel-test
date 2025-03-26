const defaultOuterStyle = `w-full border-[3px] border-dashed border-s5 rounded-[30px]`;
const defaultInnerStyle = `flex flex-col items-center justify-center h-full cursor-pointer`;

export const outerStyles = {
    default: `${defaultOuterStyle}`,
    "add-toilet-file-uploader": ``
}

export const innerStyles = {
    default: `${defaultInnerStyle} rounded-[30px] hover:bg-s2 hover:opacity-70`,
    "add-toilet-file-uploader": `${defaultInnerStyle} bg-s2 w-full p-5 rounded-lg gap-y-2 hover:opacity-50`
};
