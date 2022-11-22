import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from "$app/environment";
import { writable } from "svelte/store";
import { pb } from '$lib/public/pocketbase';

import { isPast, isFuture, parseISO } from "date-fns";

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
        total: record.total_votes,
        id: record.id
    }

    const realtime = writable(poll);

    const end_date = parseISO(record.ending);
    console.log(end_date, isPast(end_date));

    let show_results = false;
    if (isPast(end_date)) {
        show_results = true;
        console.log("POLL ENDED!")
    }

    if (browser && isFuture(end_date)) {
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
        poll: realtime,
        show_results: show_results
    };
}









