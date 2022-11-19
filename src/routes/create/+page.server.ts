import type { Actions } from "./$types";
import PocketBase from "pocketbase";
import { redirect } from "@sveltejs/kit";
import { SECRET_POCKETBASE_USERNAME, SECRET_POCKETBASE_PASSWORD } from '$env/static/private';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

const client = new PocketBase(PUBLIC_POCKETBASE_URL);
const adminAuthData = await client.admins.authViaEmail(SECRET_POCKETBASE_USERNAME, SECRET_POCKETBASE_PASSWORD);

export const actions: Actions = {
    default: async ({ request }) => {
        const data = await request.formData();

        const question = data.get('question');
        const answers = (data.get('answers') as string).split(',');

        console.log(question, answers, data);

        const entry = {
            question: question,
            answers: answers,
            votes: new Array(answers.length).fill(0)
        };

        const record = await client.records.create('polls', entry);

        throw redirect(302, `/poll/${record.id}`);
    }
}