## Setup

```
$ nvm use # uses node version in .nvmrc
$ yarn install
```

## Build

Build a production distributable DHIS2 zip file:

```
$ yarn build
```

## Development

Copy `.env` to `.env.local` and configure DHIS2 instance to use. Then start the development server:

```
$ yarn start
```

Now in your browser, go to `http://localhost:8081`.

## Tests

```
$ yarn test
```

## Some development tips

### Clean architecture folder structure

-   `src/domain`: Domain layer of the app (entities, use cases, repository definitions)
-   `src/data`: Data of the app (repository implementations)
-   `src/webapp/pages`: Main React components.
-   `src/webapp/components`: React components.
-   `src/utils`: Misc utilities.
-   `i18n/`: Contains literal translations (gettext format)
-   `public/`: General non-React webapp resources.

## Data structures

-   `Future.ts`: Async values, similar to promises, but cancellables and with type-safe errors.
-   `Collection.ts`: Similar to Lodash, provides a wrapper over JS arrays.
-   `Obj.ts`: Similar to Lodash, provides a wrapper over JS objects.
-   `HashMap.ts`: Similar to ES6 map, but immutable.
-   `Struct.ts`: Base class for typical classes with attributes. Features: create, update.
-   `Either.ts`: Either a success value or an error.

## Docs

We use [TypeDoc](https://typedoc.org/example/):

```
$ yarn generate-docs
```

### i18n

Update i18n .po files from `i18n.t(...)` calls in the source code:

```
$ yarn localize
```

### Scripts

#### import-constants

Creates and allows importing DHIS2 constants from an Excel file.
Builds constants for each option of each question with:

-   Code: `{constantCode}_{score}` (e.g., `MAL_MEAT_CM_CAPACITY_1`, `MAL_MEAT_CM_CAPACITY_2`)
-   Value: Major non-conformities (identified by text starting with "This is a major nonconformity" or "This is a major non-conformity") are marked with value `1`, others with value `0`
-   If constants already exist in DHIS2 (matched by code), they will be updated instead of creating duplicates

##### Usage

```bash
yarn run import-constants <input-file> --dhis2-url <url> --dhis2-auth <auth> [options]
```

##### Arguments

-   `input-file` (required): Path to the input Excel file (.xlsx, .xls, .xlsm, or .xlsb)

##### Options

-   `-u, --dhis2-url <url>`: DHIS2 base URL (e.g., `http://localhost:8080`)
    -   Can also be set via `DHIS2_URL` environment variable
-   `-a, --dhis2-auth <auth>`: DHIS2 authentication in format `USERNAME:PASSWORD`
    -   Can also be set via `DHIS2_AUTH` environment variable
-   `-p, --push`: Actually push changes to DHIS2. Without this flag, the script only simulates the process (dry-run mode)
-   `-o, --output <file>`: Path to save the generated constants JSON file (ready to be imported into DHIS2)
-   `-s, --sharing <file>`: Path to a JSON file containing sharing settings to apply to created constants

##### Excel File Format

The Excel file should follow this structure:

-   **Sheet names**: Format should be `{programId} - {Description}`, where `programId` is a valid DHIS2 ID (11 characters, starting with a letter)
-   **Columns**:
    -   `Key`: Constant code prefix (e.g., `MAL_MEAT_CM_CAPACITY`)
    -   `Report`: Definition/description of the option
    -   `Score`: Numeric score value for the option

### Misc Notes

-   Requests to DHIS2 will be transparently proxied (see `vite.config.ts` -> `server.proxy`) from `http://localhost:8081/dhis2/xyz` to `${VITE_DHIS2_BASE_URL}/xyz`. This prevents CORS and cross-domain problems.

-   You can use `.env` variables within the React app: `const value = import.meta.env.NAME;`
