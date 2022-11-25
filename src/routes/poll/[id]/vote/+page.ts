import { error, redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from "$app/environment";
import { pb } from '$lib/public/pocketbase';

import { isPast, parseISO } from "date-fns";
import { goto } from '$app/navigation';

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

    if (isPast(end_date)) {
        if (browser) {
            goto(`/poll/${poll.id}`);
        }
        else {
            throw redirect(302, `/poll/${poll.id}`);
        }
    }

    if (browser) {
        const currentValue = localStorage.getItem(poll.id);
        if (currentValue != null) {
            goto(`/poll/${poll.id}`);
        }
    }

    return {
        poll: poll,
    };
}









