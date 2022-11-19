<script lang="ts">
    import type { PageData, ActionData } from "./$types";

    export let data: PageData;
    export let form: ActionData;

    let show_results = false;
</script>

{#if form?.success || show_results}
<div class="flex flex-col space-y-1">
    <h1 class="heading">{data.poll.question}</h1>
        <ul class="flex flex-col  space-y-1">
            {#each data.poll.answers as answer, index}
                <li class="relative flex-grow">
                    <div
                        class="bg-red-500 rounded-md absolute h-full p-2 -z-10"
                        style="width: {(data.poll.votes[index] / data.poll.total) *
                            100}%"
                        aria-hidden="true"
                    />
                    <div class=" bg-black bg-opacity-10 p-2 rounded-md text-lg">
                        {answer} / {(
                            (data.poll.votes[index] / data.poll.total) *
                            100
                        ).toFixed(2)}% ({data.poll.votes[index]} votes)
                    </div>
                </li>
            {/each}
        </ul>
    </div>    

{:else}
    <div class="flex flex-col space-y-1">
        <h1 class="heading">{data.poll.question}</h1>
        <form class="flex flex-col space-y-1" action="?/vote" method="POST">
            <ul class="flex flex-col  space-y-1">
                {#each data.poll.answers as answer, index}
                    <li class="bg-gray-100 p-2 rounded-md text-lg flex-grow">
                        <input type="radio" name="vote" value={index} />
                        <label for={index.toString()}>{answer}</label>
                    </li>
                {/each}
            </ul>

            <button type="submit" class="button text-white bg-black w-full"
                >Vote!</button
            >

            <button
                on:click={() => (show_results = true)}
                class="button text-white bg-black w-full"
                >No thanks, just show me the results.</button
            >
        </form>
    </div>
{/if}
