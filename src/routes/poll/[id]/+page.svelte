<script lang="ts">
    import { browser } from "$app/environment";
    import { PUBLIC_HCAPTCHA_SITE_KEY } from "$env/static/public";
    import type { PageData, ActionData } from "./$types";

    export let data: PageData;
    export let form: ActionData;

    let poll: any;
    const unsubscribe = data.poll.subscribe((value) => {
        poll = value;
    });

    let show_results = data.show_results;
</script>

{#if form?.success || show_results}
    <div class="flex flex-col space-y-1">
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
                        class="bg-black bg-opacity-10 p-2 rounded-md text-lg flex"
                    >
                        <span class="flex-grow">{answer}</span>
                        <span class="place-self-end">
                            {((poll.votes[index] / poll.total) * 100).toFixed(
                                2
                            )}%
                        </span>
                    </div>
                </li>
            {/each}
            <p class="supra">{poll.total} VOTES</p>
        </ul>
    </div>
{:else}
    <div class="flex flex-col space-y-1">
        <h1 class="heading">{poll.question}</h1>
        <form class="flex flex-col space-y-1" action="?/vote" method="POST">
            <ul class="flex flex-col  space-y-1">
                {#each poll.answers as answer, index}
                    <li class="bg-gray-100 p-2 rounded-md text-lg flex-grow">
                        <input type="radio" name="vote" value={index} />
                        <label for={index.toString()}>{answer}</label>
                    </li>
                {/each}
            </ul>
            
            <div id="hcaptcha" class="h-captcha" data-sitekey="{PUBLIC_HCAPTCHA_SITE_KEY}"></div>

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

<svelte:head>
    {#if browser}
        <script>
            var hcaptchaLoad = function () {
                console.log("hcaptcha loaded");
                var widgetID = hcaptcha.render("hcaptcha");
            };
        </script>
        <script
            src="https://js.hcaptcha.com/1/api.js?render=explicit&onload=hcaptchaLoad"
            async
            defer
        ></script>
    {/if}
</svelte:head>
