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
    const { state, setState } = useContext(GlobalStateContext);

    const getIcon = () => {
        if (type === ENCRYPT) {
            return (
                <svg className="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
            );
        }
        return (
            <svg className="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
            </svg>
        );
    };

    return (
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
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fileInputRef?.current?.click();
                }
            }}
            aria-label={message}
        >
            {getIcon()}
            <label className="file-title">
                <h1>{message}</h1>
                <p className="file-hint">or click to browse files</p>
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
                aria-label={`File input for ${type}`}
            />
        </div>
    );
}

export default FileUploader

export interface PropTypes {
    dropHandler: any;
    filePickHandler: any;
    type?: string;
    message?: string;
}
