export type ErrCallbackType = (err: { [key: string]: string }) => void

export interface DynamicObject {
    [key: string]: any;
}