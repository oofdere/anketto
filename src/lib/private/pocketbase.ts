import { SECRET_POCKETBASE_USERNAME, SECRET_POCKETBASE_PASSWORD } from '$env/static/private';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

import PocketBase from "pocketbase";
export const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
await pb.admins.authWithPassword(SECRET_POCKETBASE_USERNAME, SECRET_POCKETBASE_PASSWORD);

console.log("PocketBase Connection Established");