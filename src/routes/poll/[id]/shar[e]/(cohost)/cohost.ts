export function generateCohostEmbed(poll: any) {
    const url = `https://anketto.xyz/poll/${poll.id}/vote`;
    const question = poll.question;
    
    const startHtml = `\n<div style="display: flex; flex-direction: column; border: 1px solid; border-radius: 16px; text-align: center; background-color: rgb(255, 241, 223);"><a href="${url}" style="font-weight: bold; font-size: 24px; margin: 0.5em;">${question}</a><div style="display: flex; flex-direction: column; list-style: none;">`
    
    let html = startHtml;

    poll.answers.forEach(function (answer: string, index: number) {
        const answer_url = url + `?selected=${index}`;

        html += `<a href="${answer_url}" style="display: inline-block; border-radius: 16px; padding: 10px; background-color: rgb(103, 26, 61); color: white; margin: 2px 10px;">${answer}</a>`;
    });

    const endHtml = '</div><p style="margin: 0.5em;"><a href="https://anketto.xyz">Anketto</a><span style="font-family: monospace;"> &lt;3 </span>:eggbug:</p></div>\n'
    html += endHtml;

    return html;
}