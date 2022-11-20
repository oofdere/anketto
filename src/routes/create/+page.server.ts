import type { Actions } from "./$types";
import PocketBase from "pocketbase";
import { error, redirect } from "@sveltejs/kit";
import { SECRET_POCKETBASE_USERNAME, SECRET_POCKETBASE_PASSWORD } from '$env/static/private';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { validate } from "$lib/private/hcaptcha";

const pb = new PocketBase(PUBLIC_POCKETBASE_URL);
const adminAuthData = await pb.admins.authWithPassword(SECRET_POCKETBASE_USERNAME, SECRET_POCKETBASE_PASSWORD);

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
        const answers = (data.get('answers') as string).split(',');

        console.log(question, answers, data);

        const entry = {
            question: question,
            answers: answers,
            votes: new Array(answers.length).fill(0)
        };

        const record = await pb.collection('polls').create(entry);

        throw redirect(302, `/poll/${record.id}`);
    }
}