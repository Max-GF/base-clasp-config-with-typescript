# base-clasp-config-with-typescript
 Just a quick repository to use as start config on my google sheet works


# Usage
1. Clone the repository
2. If you don't have `CLASP` installed, run `pnpm install -g @google/clasp` to install clasp globally, or use your preferred package manager;
4. Run `pnpm install` to install dependencies, or use your preferred package manager;
5. Perform `clasp login` to authenticate with your Google account;
6. Edit the `.clasp.json` file to set your `scriptId` and `projectId`;
7. Run `pnpm build` to compile the TypeScript code and copy HTML files to the `dist` folder;
8. Run `clasp push` to upload the code to Google Apps Script;
   



