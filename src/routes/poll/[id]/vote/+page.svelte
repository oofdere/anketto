<script lang="ts">
    import { browser } from "$app/environment";
    import { PUBLIC_HCAPTCHA_SITE_KEY } from "$env/static/public";
    import JsRequired from "$lib/components/JsRequired.svelte";
    import type { PageData, ActionData } from "./$types";

    export let data: PageData;
    export let form: ActionData;

    const poll = data.poll;
</script>

<div class="flex flex-col space-y-1">
    <JsRequired action="vote on polls" />
    <h1 class="heading">{poll.question}</h1>
    <form class="flex flex-col space-y-1" action="?/vote" method="POST">
        <ul class="flex flex-col  space-y-1">
            {#each poll.answers as answer, index}
                <li class="bg-gray-100 p-2 rounded-md text-lg flex-grow">
                    <label
                        class="block w-full h-full break-words"
                        for="form-radio-{index.toString()}"
                    >
                        <input
                            id="form-radio-{index.toString()}"
                            type="radio"
                            name="vote"
                            value={index}
                        />
                        {answer}
                    </label>
                </li>
            {/each}
        </ul>

        <div
            id="hcaptcha"
            class="h-captcha"
            data-sitekey={PUBLIC_HCAPTCHA_SITE_KEY}
        />

        <button type="submit" class="button text-white bg-black w-full"
            >Vote!</button
        >

        <a href="/poll/{poll.id}" class="button text-white bg-black w-full"
            >No thanks, just show me the results.</a
        >
    </form>
</div>

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
    <title>{poll.question} | Anketto</title>
</svelte:head>
