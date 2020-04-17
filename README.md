# student_20_columbus_react
Implementation of an intuitive and insightful blockchain explorer - by Iozzia Anthony Lucien

## Setup
Download conode from https://github.com/dedis/cothority/releases
Extract
In folder: `./conode.Linux.x86_64 setup`
Please enter the [address:]PORT for incoming to bind to and where other nodes will be able to contact you. [7770]: 127.0.0.1:7770

Start server: `./conode.Linux.x86_64 server`
Stop it (ctrl+C)
Replace database in `~/.local/share/conode` (put same name)
Copy content of `~/.config/conode/public.toml`
Replace rosterStr in index.ts
In root of project: `npm install`

## Run
Start server in conode folder: `./conode.Linux.x86_64 server`
Debug: `./conode.Linux.x86_64 -d 2 server`
In root of project: `npm run bundle` or `npm run watch`
