<script lang="ts">
    import type { PageData } from "./$types";

    export let data: PageData;

    let poll: any;
    const unsubscribe = data.poll.subscribe((value) => {
        poll = value;
    });

    const time = data.time

    let show_results = data.show_results;
</script>

<div class="flex flex-col space-y-1 container">
    <a href="/poll/{poll.id}/vote" class="supra underline">BACK TO VOTING</a>
    <h1 class="heading">{poll.question}</h1>
    <ul class="flex flex-col  space-y-1">
        {#each poll.answers as answer, index}
            <li class="relative flex-grow">
                <div
                    class="transition-all bg-red-500 rounded-md absolute h-full p-2 -z-10"
                    style="width: {(poll.votes[index] / poll.total) * 100}%"
                    aria-hidden="true"
                />
                <div class="bg-black bg-opacity-10 p-2 rounded-md text-lg flex space-x-1">
                    <span class="grow block break-words">{answer}</span>
                    <span class="min-w-fit place-self-end">
                        {(poll.total && ((poll.votes[index] / poll.total) * 100).toLocaleString(undefined, {maximumFractionDigits: 2})) || 0}%
                    </span>
                </div>
            </li>
        {/each}
    </ul>
    <div class="supra flex space-x-1">
        <span class="grow">{$time}</span>
        <span class="min-w-fit place-self-end">
            {poll.total} VOTES
        </span>
    </div>
</div>

<svelte:head>
    <title>{poll.question} | Anketto</title>
</svelte:head>
