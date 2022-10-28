# BeeFyne
A sumsy little Discord companion for your needs


# Dev Setup
Clone this repo to your local drive. After that navigate into the src/ directory and run npm install. In some cases it might be needed that npm i -D nodemon is run as npm otherwise won't recognize nodemon

## Pre-Requisites
- Recent node version (16+ recommended | 18+ Optional)
- yarn package manager may be used
- Have Git installed on your machine
- VS-Code (recommended | every text editor will work)
- My-SQL Database (any SQL database supported by typeorm may be used)
- A Discord Application already setup in your [Discord Developer Dashboard](https://discord.com/developers/applications)
- Basic Knowledge about Javascript / Typescript

## Environment Variables needed
- TYPEORM_CONNECTION=[TYPE OF DB (mysql, postgres, etc...)]
- TYPEORM_HOST=
- TYPEORM_USERNAME=
- TYPEORM_PASSWORD=
- TYPEORM_DATABASE=
- TYPEORM_PORT=
- TYPEORM_SYNCHRONIZE=
- TYPEORM_LOGGING=
- DISCORDTOKEN=
- CLIENTID=
- GUILDID=
- SENDDEBUGDMS=