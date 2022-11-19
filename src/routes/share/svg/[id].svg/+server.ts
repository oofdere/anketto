import { error } from "@sveltejs/kit";
import type { RequestHandler } from "@sveltejs/kit";

import satori from "satori";
import { html } from "satori-html";
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

// satori requires that we have a font loaded even when not using it in svg
import fs from 'fs/promises'
const murecho = await fs.readFile('src/routes/share/svg/[id].svg/murecho/Murecho-Regular.ttf')

import Card from "$lib/Card.svelte";

import PocketBase from "pocketbase";
const pb = new PocketBase(PUBLIC_POCKETBASE_URL);

export const GET: RequestHandler = async ({ params }) => {
    let record;
    try {
        record = await pb.collection('polls').getOne(params.id);
    } catch {
        throw error(404);
    };

    const poll = {
        question: record.question,
        answers: record.answers,
        votes: record.votes,
        total: record.total_votes,
        id: record.id
    }
    
    const markup = Card.render({poll});
    const jsx = html(`${markup.html}<style>${markup.css.code}</style>`);

    const svg = await satori(jsx, {
        width: 600,
        height: 400,
        fonts: [
            {
                name: 'murecho',
                data: murecho
            }
        ],
    });

    let options = {
        status: 200,
        headers: {
            "Content-Type": "image/svg+xml"
        }
    }
    return new Response(svg, options);
};
