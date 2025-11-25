# Digital Design Manager
Created by Robert Patton (RPATT)

- Web Demo Version.

## Requirements

Node JS (recommended v22.14.0 LTS).

## Quick Start

**Install**
```bash
git clone 
cd ddm
npm install 
```

**Development environment**
```bash
npm run dev 
```

**Production environment**
```bash
npm run build
npm run start 
```

<details><summary>Tech Stack</summary>

Digital O&M Manual is build using NextJS.

3D Rendering is handled using Three.js\
https://threejs.org/

**All frameworks/software used are Open Source and free for commercial use.**
</details>

## Auth

Auth handled with Azure Entra ID.

## Installation

Download latest release and build from source:

Requires Node JS V22.14.0 or greater.

Install modules with:

### `npm install`

## Available Scripts

In the project directory, you can run:

### `npm run dev`

Runs the app in the development mode and starts an electron instance concurrently.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### Building

### `npm run build`

Builds the app for production to the `/.next/` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.\
The build is minified and the filenames include the hashes.

### `npm run start`

Serves the project in a production environment.

### Deployment

Reccomend Cloud Run or App Engine to host - requires gcloud CLI.

## Security
Server side data is located in the folder `/data/`, bundled into `.next/server/` during the build.

Users (_and Groups_) can be mapped in the file `/data/users.json`.

User data can then be placed in a folder indicated by the "path" key.

The folder with user (_group_) specific data should be named as the output in `rand_private.key`, generated after running: 
```bash
openssl rand -out rand_private.key -hex 32
```

When a user logs in, the users folder path is looked up on the server from users.json and is then used for API requests.

<details><summary>See example request:</summary>

`/api/getFile?url=/62e6473342a564114b11cc6235d5d89e2fd5523dea587b37e4d172aec4ac9bfe/data.json`

</details> 

The 'users.json' file can only be read server side, and is excluded from the file read APIs (/api/getFile and /api/getModel).

## Azure Setup for Microsoft Entra ID

1. **Register the Application**

   - Navigate to the [Azure portal](https://portal.azure.com/).
   - Go to **Microsoft Entra ID** > **App registrations** > **New registration**.
   - Name your application (e.g., `ddm`).
   - For **Supported account types**, choose **Accounts in this organizational directory only**.
   - In the **Redirect URI** field, set the following value:  
     `http://localhost:3000/api/auth/callback/microsoft-entra-id`
   - Click **Register** to create the application.

2. **Configure the Application**

   - Once registered, navigate to the app's overview page:
     - Copy the **Application (client) ID** and set it in your `.env` file as `AUTH_MICROSOFT_ENTRA_ID_ID`.
     - Copy the **Directory (tenant) ID** and set it in your `.env` file as `AUTH_MICROSOFT_ENTRA_ID_ISSUER`.
   - Next, go to **Certificates & secrets**:
     - Under **Client secrets**, click **New client secret**.
     - Provide a description (e.g., `ddm Secret`) and choose an expiration period.
     - Once created, copy the generated secret value and set it in your `.env` file as `AUTH_MICROSOFT_ENTRA_ID_SECRET`.

3. **Set Up API Permissions**

   - Navigate to **API permissions** > **Add a permission**.
   - Choose **Microsoft Graph** > **Delegated permissions**.
   - Add the following permissions:
     - `User.Read` - for accessing user details
     - `openid` - for OpenID Connect authentication
     - `email` - for email access
     - `profile` - for basic profile info
     - `offline_access` - for refresh tokens
   - After adding the permissions, click **Grant admin consent for [Your Organization]** to apply them.

4. **Set Up Environment Variables**

   Create a (or edit the) `.env` file in the root directory:

   ```bash
   AUTH_SECRET=your_auth_secret
   AUTH_MICROSOFT_ENTRA_ID_ID=your_azure_client_id
   AUTH_MICROSOFT_ENTRA_ID_SECRET=your_azure_client_secret
   AUTH_MICROSOFT_ENTRA_ID_ISSUER=your_azure_tenant_id
   ```

   To generate the `AUTH_SECRET`, run:

   ```bash
   openssl rand -base64 32
   ```

5. **(Optional) Create an Enterprise Application**

   - To manage access to the application:
     - Go to **Azure Active Directory** > **Enterprise applications**.
     - Find your application by name and select it.
     - Under **Users and groups**, assign users or groups that should have access to the application.

## Project structure

- `/src/`: Client and Server side JS.
- `/src/app`: Pages and API routes.
- `/src/app/`: Authenticated and Unauthenticated routes.
- `/src/app/api`: API server functions.
- `/src/app/nouser`: Route for user who is not authorized in users.json database.
- `/public/`: Static public assets.

## After install + build

- `/.next/`: Build files generated by npm run build.
- `/node_modules/`: NPM packages.

## TODOs

- [ ] Add all previous interactive features.
- [ ] Add user group functionality. 
- [ ] Move user data from server to 3rd party solution or dedicated API to allow changes to data without full redeploy.