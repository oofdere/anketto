import { error } from '@sveltejs/kit';
import type { PageLoad } from '../$types';
import { pb } from '$lib/public/pocketbase';
import qrcodegen, { toSvgString } from "$lib/public/qrcode";

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

    const qrcode = qrcodegen.QrCode.encodeText(`https://anketto.xyz/poll/${poll.id}/vote`, qrcodegen.QrCode.Ecc.MEDIUM);
    const qrsvg = toSvgString(qrcode, 4, "white", "black");

    return {
        poll: poll,
        qrsvg
    };
}









