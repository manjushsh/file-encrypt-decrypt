import { useContext, useRef } from "react";
import { ENCRYPT, GlobalStateContext } from "../../../context/GlobalStateContext";
import './style.css';

const FileUploader = ({
    dropHandler,
    filePickHandler,
    type = ENCRYPT,
    message = "Choose files.."
}: PropTypes) => {
    const dragOverHandler = (ev: any) => ev.preventDefault();
    const fileInputRef = useRef<any>(null);
    const { state, setState } = useContext(GlobalStateContext)

    return <>
        <div
            id={`drop_zone_${type}`}
            className="drop_zone"
            onDrop={(e) => {
                e.preventDefault();
                setState({ type });
                dropHandler(e, type);
            }}
            onDragOver={dragOverHandler}
            onClick={() => { fileInputRef?.current?.click() }}
        >
            <label className="file-title">
                <h1>{message}</h1>
            </label>
            <input
                ref={fileInputRef}
                onChange={(e) => {
                    setState({ files: e?.currentTarget?.files });
                    filePickHandler(e, type)
                }}
                type="file"
                value={state?.files}
                hidden
                multiple
            />
        </div>
    </>
}

export default FileUploader

export interface PropTypes {
    dropHandler: any;
    filePickHandler: any;
    type?: string;
    message?: string;
}