<script lang="ts">
    import type { PageData } from "./$types";
    import createLocalStore from "$lib/public/localstorage";
    import { browser } from "$app/environment";
    import { page } from "$app/stores";

    export let data: PageData;

    let stores = new Array();

    let poll: any;
    stores.push(
        data.poll.subscribe((value) => {
            poll = value;
        })
    );
    
    let pollState: string | null = null;
    $: console.log(JSON.stringify(pollState))
    if (browser) {
        const pollStorage = createLocalStore(poll.id);
        stores.push(pollStorage);
        pollStorage.subscribe((value) => {
            pollState = value;
        })

        const selected = $page.url.searchParams.has('selected');
        if (selected) {
            pollStorage.set(<string>$page.url.searchParams.get('selected'));
        }
    }

    const time = data.time;
</script>

<div class="flex flex-col space-y-1 container">
    {@html data.qrsvg}
    {#if pollState === null && $time != "VOTING ENDED"}
        <a href="/poll/{poll.id}/vote" class="supra underline">BACK TO VOTING</a
        >
    {/if}
    <h1 class="heading">{poll.question}</h1>
    <ul class="flex flex-col  space-y-1">
        {#each poll.answers as answer, index}
            <li class="relative flex-grow">
                <div
                    class="transition-all bg-red-500 rounded-md absolute h-full p-2 -z-10"
                    style="width: {(poll.votes[index] / poll.total) * 100}%"
                    aria-hidden="true"
                />
                <div
                    class="bg-black bg-opacity-10 p-2 rounded-md text-lg flex space-x-1"
                >
                    <span class="grow block break-words">{answer} 
                        {#if index.toString() === pollState}
                            ✓
                        {/if}
                    </span>
                    <span class="min-w-fit place-self-end">
                        {(poll.total &&
                            (
                                (poll.votes[index] / poll.total) *
                                100
                            ).toLocaleString(undefined, {
                                maximumFractionDigits: 2,
                            })) ||
                            0}%
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
