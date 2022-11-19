import { error } from '@sveltejs/kit';
import type { Actions } from './$types';
import { SECRET_POCKETBASE_USERNAME, SECRET_POCKETBASE_PASSWORD } from '$env/static/private';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

import PocketBase from "pocketbase";
const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
const adminAuthData = await pb.admins.authWithPassword(SECRET_POCKETBASE_USERNAME, SECRET_POCKETBASE_PASSWORD);


export const actions: Actions = {
    vote: async ({request, params}) => {
        const data = await request.formData();
        const vote = (data.get('vote') as string);

        let record;
        try {
            record = await pb.collection('polls').getOne(params.id);
        } catch {
            throw error(404);
        };

        let votes = record.votes;
        votes[vote] += 1;

        const entry = {
            votes: votes,
            total_votes: record.total_votes + 1
        }

        const update = await pb.collection('polls').update(record.id, entry)

        return {
            success: true
        }
    }
}