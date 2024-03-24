interface SearchOptions {
    cwd?: string;
    depth?: number;
    jsonParse?: boolean;
    import?: boolean;
    single?: boolean;
    maxResults?: number;
    includeTsForJs?: boolean;
}
declare function globUp(globPattern: string, options: SearchOptions): Promise<string[]>;
declare function globUpSync(globPattern: string, options: SearchOptions): string[];
declare function importUp(fileName: string, options?: SearchOptions): Promise<any>;
declare function jsonParseUp(fileName: string, options?: SearchOptions): Promise<any>;
declare function jsonParseUpSync(fileName: string, options?: SearchOptions): any;
declare function packageJsonUp(options?: SearchOptions): Promise<any>;
declare function packageJsonUpSync(options?: SearchOptions): any;
export { importUp, globUp, globUpSync, jsonParseUp, jsonParseUpSync, packageJsonUp, packageJsonUpSync, SearchOptions, };
