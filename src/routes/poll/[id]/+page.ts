import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from "$app/environment";
import { readable, writable } from "svelte/store";
import { pb } from '$lib/public/pocketbase';

import { isPast, isFuture, parseISO, formatDistanceToNowStrict } from "date-fns";

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

    if (browser && isFuture(end_date)) {
        pb.collection('polls').subscribe(params.id, function (e) {
            let poll = {
                question: e.record.question,
                answers: e.record.answers,
                votes: e.record.votes,
                total: e.record.total_votes,
                id: e.record.id
            };
            realtime.set(poll);
        });
    }

    const pretty_time = readable("", set => {
        let poll_ended = isPast(end_date);
        

        function update() {
            set(
                formatDistanceToNowStrict(end_date) + " REMAINING"
            )

            if (isPast(end_date)) {
                clearInterval(interval);
                return_value = null;
                set("VOTING ENDED");
            }
        }

        
        const interval = setInterval(update, 500);
        
        let return_value: any = () => clearInterval(interval)
        return return_value;
    })
    
    let show_results = false;
    if (isPast(end_date)) {
        show_results = true;
        console.log("POLL ENDED!")
    }

    return {
        poll: realtime,
        time: pretty_time,
        show_results: show_results
    };
}









