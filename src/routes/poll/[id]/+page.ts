import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { browser } from "$app/environment";
import { writable } from "svelte/store";

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

    let poll = {
        question: record.question,
        answers: record.answers,
        votes: record.votes,
        total: record.total_votes
    }

    const realtime = writable(poll);

    if (browser) {
        pb.collection('polls').subscribe(params.id, function (e) {
            let poll = {
                question: e.record.question,
                answers: e.record.answers,
                votes: e.record.votes,
                total: e.record.total_votes
            };
            realtime.set(poll);
        });
    }

    return {
        poll: realtime
    };
}









