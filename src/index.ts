import fs from 'fs-extra';
import path from 'path';
import minimatch from 'minimatch';

interface SearchOptions {
    cwd?: string;
    depth?: number;
    jsonParse?: boolean;
    import?: boolean;
    single?: boolean;
    maxResults?: number;
    includeTsForJs?: boolean;
}

async function globUpwards(
    globPattern: string,
    options: SearchOptions,
): Promise<string[]> {
    let currentPath = options.cwd || process.cwd();
    let maxDepth = options.depth || Infinity;
    const maxResults = options.maxResults || Infinity;
    const matches: string[] = [];

    while (matches.length < maxResults) {
        if (matches.length >= maxResults) {
            break;
        }
        let relativePath = extractPath(globPattern);
        let pathtoSearch = path.join(currentPath, relativePath);
        let pattern = globPattern.replace(relativePath + '/', '');
        let files = [];
        if (fs.pathExistsSync(pathtoSearch) === true) {
            files = await fs.readdir(pathtoSearch);
        }

        for (const file of files) {
            const filePath = path.join(pathtoSearch, file);
            if (
                minimatch(filePath, `**/${pattern}`, {
                    dot: true,
                    nocase: true,
                })
            ) {
                try {
                    await fs.access(filePath);
                    matches.push(filePath);
                    if (matches.length >= maxResults) {
                        return matches;
                    }
                } catch {
                    if (options.includeTsForJs) {
                        if (filePath.endsWith('js')) {
                            try {
                                let alternativePath = filePath.replace(
                                    '.js',
                                    '.ts',
                                );
                                await fs.access(alternativePath);
                                matches.push(alternativePath);
                                if (matches.length >= maxDepth) {
                                    break;
                                }
                            } catch {}
                        }
                    }
                    // File not found, do nothing
                }
            }
        }

        // Adjust depth
        if (maxDepth !== undefined) {
            maxDepth = maxDepth - 1;
            if (maxDepth <= 0) {
                break;
            }
        }
        if (currentPath === path.parse(currentPath).root) {
            break;
        }
        currentPath = path.dirname(currentPath);
    }

    return matches;
}

function extractPath(filePath: string): string {
    const lastSlashIndex = filePath.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
        return filePath.substring(0, lastSlashIndex);
    } else {
        return '';
    }
}

function globUpwardsSync(
    globPattern: string,
    options: SearchOptions,
): string[] {
    let currentPath = options.cwd || process.cwd();
    let maxDepth = options.depth || Infinity;
    const maxResults = options.maxResults || Infinity;
    const matches: string[] = [];

    while (matches.length < maxResults) {
        if (matches.length >= maxResults) {
            break;
        }
        let relativePath = extractPath(globPattern);
        let pathtoSearch = path.join(currentPath, relativePath);
        let pattern = globPattern.replace(relativePath + '/', '');
        let files = [];
        if (fs.pathExistsSync(pathtoSearch) === true) {
            files = fs.readdirSync(pathtoSearch);
        }

        for (const file of files) {
            const filePath = path.join(pathtoSearch, file);
            if (
                minimatch(filePath, `**/${pattern}`, {
                    dot: true,
                    nocase: true,
                })
            ) {
                try {
                    fs.accessSync(filePath);
                    matches.push(filePath);
                    if (matches.length >= maxResults) {
                        return matches;
                    }
                } catch {
                    if (options.includeTsForJs) {
                        if (filePath.endsWith('js')) {
                            try {
                                let alternativePath = filePath.replace(
                                    '.js',
                                    '.ts',
                                );
                                fs.accessSync(alternativePath);
                                matches.push(alternativePath);
                                if (matches.length >= maxDepth) {
                                    break;
                                }
                            } catch {}
                        }
                    }
                }
            }
        }

        // Adjust depth
        if (maxDepth !== undefined) {
            maxDepth = maxDepth - 1;
            if (maxDepth <= 0) {
                break;
            }
        }
        if (currentPath === path.parse(currentPath).root) {
            break;
        }
        currentPath = path.dirname(currentPath);
    }

    return matches;
}

async function map(items: any[], callback: Function) {
    return Promise.all(items.map((item, index) => callback(item)));
}

async function importer(module: string) {
    return await import(`${module}`);
}

async function importAll(paths: string[]): Promise<any> {
    let names = paths.map(async (p) => {
        return {
            name: path.basename(p, path.extname(p)),
            path: await import(`${p}`),
        };
    });
    let resolvedNames = await Promise.all(names);
    let res = resolvedNames.map((n) => {
        if (n.path?.default) {
            return {
                [n.name]: n.path.default,
            };
        } else {
            return n.path;
        }
    });
    return Object.assign.apply(null, [{}, ...res]);
}

async function importUp(
    fileName: string,
    options: SearchOptions = {},
): Promise<any> {
    if (fileName.endsWith('.json')) {
        options.jsonParse = true;
        return jsonParseUp(fileName, options);
    }
    options.import = true;
    return globUpwards(fileName, options)
        .then(async (matchesAsync) => {
            return await importAll(matchesAsync);
        })
        .catch((err) => {
            console.error('An error occurred in asynchronous search:', err);
        });
}

async function jsonParseUp(
    fileName: string,
    options: SearchOptions = {},
): Promise<any> {
    options.jsonParse = true;
    return globUpwards(fileName, options)
        .then(async (matchesAsync) => {
            return await map(matchesAsync, fs.readJson);
        })
        .catch((err) => {
            console.error('An error occurred in asynchronous search:', err);
        });
}
function jsonParseUpSync(
    fileName: string,
    options: SearchOptions = {},
): any {
    options.jsonParse = true;
    return globUpwardsSync(fileName, options).map((file) =>
        fs.readJsonSync(file),
    );
}

async function packageJsonUp(options: SearchOptions = {}): Promise<any> {
    options.jsonParse = true;
    let fileName = 'package.json';
    options.maxResults = 1;

    const result = await jsonParseUp(fileName, options);
    if (options.maxResults === 1) {
        return result[0];
    }
}

function packageJsonUpSync(options: SearchOptions = {}): any {
    options.jsonParse = true;
    let fileName = 'package.json';
    options.maxResults = 1;

    let matches = globUpwardsSync(fileName, options);
    const res = matches.map((m) => fs.readJsonSync(m));
    if (options.maxResults === 1) {
        return res[0];
    }
}
/** example
  importUp('foo.js').then(console.log);

  console.log(packageJsonUpSync());
*/

export {
    importUp,
    globUpwards,
    globUpwardsSync,
    jsonParseUp,
    jsonParseUpSync,
    packageJsonUp,
    packageJsonUpSync,
    SearchOptions,
};
