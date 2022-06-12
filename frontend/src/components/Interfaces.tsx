export interface IBoardTypes {
    id?: number;
    title?: string;
    content?: string;
    reg_date?: string;
    state?: boolean;
    view_count?: number;
}

export interface IFilesTypes {
    dbId?: number;
    id?: number;
    name: string;
    size: string;
    state: number;
    file?: File;
}