import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

import PocketBase from "pocketbase";
const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

export const load: PageLoad = async ({params}) => {
    // get poll from PocketBase, SSR and client-side render supported
    
    let record;
    try {
        record = await pb.collection('polls').getOne(params.id);
    } catch {
        throw error(404);
    };

    return {
        poll: {
            question: record.question,
            answers: record.answers,
            votes: record.votes,
            total: record.total_votes
        }
    };
}









import { redirect } from "@sveltejs/kit";


import type { PageData } from "./$types";
export let data: PageData;

let record;

