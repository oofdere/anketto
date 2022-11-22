import { error } from '@sveltejs/kit';
import type { Actions } from './$types';
import { pb } from '$lib/private/pocketbase';
import { validate } from "$lib/private/hcaptcha";

export const actions: Actions = {
    vote: async ({request, params}) => {
        const data = await request.formData();
        
        const hcaptcha_token = <string>data.get('h-captcha-response');
        const hcaptcha_valid = await validate(hcaptcha_token);
        if(!hcaptcha_valid) {
            console.log("invalid hcaptcha")
            throw error(403, "Invalid captcha.");
        };
        
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