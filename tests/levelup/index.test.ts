import {
    importUp,
    globUpwards,
    globUpwardsSync,
    jsonParseUp,
    jsonParseUpSync,
    packageJsonUp,
    packageJsonUpSync,
} from '../../src/index';
import path from 'path';

const __dirname = path.dirname(import.meta.url.replace('file:///', ''));

describe('Sample Test', () => {
    beforeAll(async () => {});

    beforeEach(async () => {});

    afterAll(() => {});

    it('should import all exported methods', async () => {
        let modules = await importUp('fixtures/*.js', {
            cwd: __dirname,
        });

        expect(modules.fileA).not.toBeNull();
        expect(modules.fileB).not.toBeNull();
        expect(modules.default).not.toBeNull();
        expect(modules.default2).not.toBeNull();
        expect(modules.fileA()).toBe('fileA');
        expect(modules.fileB()).toBe('fileB');
        expect(modules.default()).toBe('fileC');
        expect(modules.default2()).toBe('fileD');
    });

    it('should find one file asyncronous', async () => {
        let files = await globUpwards('fixtures/package.json', {
            cwd: __dirname,
            depth: 2,
        });
        expect(files).toHaveLength(1);
    });

    it('should find one file syncronous', () => {
        let files = globUpwardsSync('fixtures/package.json', {
            cwd: __dirname,
            depth: 2,
        });
        expect(files).toHaveLength(1);
    });


    it('should parse json asyncronous', async () => {
        let files = await jsonParseUp('fixtures/*.json', {
            cwd: __dirname,
        });
        expect(files).toHaveLength(1);
        expect(files[0].name).toBe('fixtures');
    });


    it('should parse json syncronous', () => {
        let files = jsonParseUpSync('fixtures/*.json', {
            cwd: __dirname,
        });
        expect(files).toHaveLength(1);
        expect(files[0].name).toBe('fixtures');
    });

    it('should find the package.json (not fixtures)', () => {
        let pkgJson = packageJsonUpSync({
            cwd: __dirname,
        });
        expect(pkgJson.type).toBe('module');
    });

    it('should find the package.json (not fixtures)', async () => {
        let pkgJson = await packageJsonUp({
            cwd: __dirname,
        });
        expect(pkgJson.type).toBe('module');
    });
});
