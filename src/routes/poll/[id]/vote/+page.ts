import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from "$app/environment";
import { pb } from '$lib/public/pocketbase';

import { isPast, parseISO } from "date-fns";

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

    const end_date = parseISO(record.ending);
    console.log(end_date, isPast(end_date));

    let show_results = false;
    if (isPast(end_date)) {
        // if poll has ended redirect user to results
        show_results = true;
        //throw redirect(302, `/poll/${record.id}`);
    }

    return {
        poll: poll,
        show_results: show_results,
    };
}









