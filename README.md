# @agebrock/globup

## Overview
GlobUp is a handy tool for Node.js developers who need to work with file globs and directory structures in a hassle-free manner. With GlobUp, you can effortlessly import, parse, and navigate through files and directories in your projects.

## Installation
You can install GlobUp via npm:

```bash
npm install @agebrock/globup
```

## Usage
GlobUp provides several useful methods to simplify your file and directory operations. Here's how you can use it:
(you can find the examples in the test folder)

### Importing Modules
```typescript
import { importUp } from '@agebrock/globup';

const modules = await importUp('fixtures/*.js', {
    cwd: __dirname,
});

console.log(modules.fileA()); // 'fileA'
console.log(modules.fileB()); // 'fileB'
console.log(modules.default()); // 'fileC'
console.log(modules.default2()); // 'fileD'
```

### Finding Files
```typescript
import { globUp, globUpSync } from '@agebrock/globup';

const filesAsync = await globUp('fixtures/package.json', {
    cwd: __dirname,
    depth: 2,
});
console.log(filesAsync); // ['fixtures/package.json']

const filesSync = globUpSync('fixtures/package.json', {
    cwd: __dirname,
    depth: 2,
});
console.log(filesSync); // ['fixtures/package.json']
```

### Parsing JSON
```typescript
import { jsonParseUp, jsonParseUpSync } from '@agebrock/globup';

const jsonAsync = await jsonParseUp('fixtures/*.json', {
    cwd: __dirname,
});
console.log(jsonAsync[0].name); // 'fixtures'

const jsonSync = jsonParseUpSync('fixtures/*.json', {
    cwd: __dirname,
});
console.log(jsonSync[0].name); // 'fixtures'
```

### Finding Package.json
```typescript
import { packageJsonUp, packageJsonUpSync } from '@agebrock/globup';

const pkgJsonAsync = await packageJsonUp({
    cwd: __dirname,
});
console.log(pkgJsonAsync.type); // 'module'

const pkgJsonSync = packageJsonUpSync({
    cwd: __dirname,
});
console.log(pkgJsonSync.type); // 'module'
```

## Contributing
Contributions are welcome! Feel free to submit issues and pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.