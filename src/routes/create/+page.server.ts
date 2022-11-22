import type { Actions } from "./$types";
import { error, redirect } from "@sveltejs/kit";
import { validate } from "$lib/private/hcaptcha";
import { addHours } from "date-fns";
import { pb } from "$lib/private/pocketbase";



export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();

        const hcaptcha_token = <string>data.get('h-captcha-response');
        const hcaptcha_valid = await validate(hcaptcha_token);
        if(!hcaptcha_valid) {
            console.log("invalid hcaptcha")
            throw error(403, "Invalid captcha.");
        };

        const question = data.get('question');
        const answers = JSON.parse(data.get('answers') as string);
        console.log(question, answers, data);

        const hours = parseInt(<string>data.get('length'));
        const current_date = new Date();
        const end_date = addHours(current_date, hours)
        console.log(current_date, end_date);

        const entry = {
            question: question,
            answers: answers,
            votes: new Array(answers.length).fill(0),
            posted: current_date,
            ending: end_date
        };

        const record = await pb.collection('polls').create(entry);

        throw redirect(302, `/poll/${record.id}`);
    }
}