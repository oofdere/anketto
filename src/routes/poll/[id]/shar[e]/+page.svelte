<script lang="ts">
    import type { PageData } from "../$types";
    import { browser } from "$app/environment";
    import { generateCohostEmbed } from "./(cohost)/cohost";

    export let data: PageData;
    const poll = data.poll
    const url = `https://anketto.xyz/poll/${poll.id}/vote`

    function nativeShare() {
        navigator.share({
            url,
        });
    }

    function copyLink() {
        navigator.clipboard.writeText(url);
    }

    function copyChost() {
        const chost = generateCohostEmbed(poll);
        navigator.clipboard.writeText(chost);
    }
</script>

<div class="flex flex-col space-y-1 container">
    <a href="/poll/{poll.id}/vote" class="supra underline">GO BACK</a>
    <div class="w-96">
        {@html data.qrsvg}
    </div>
    <div class="flex space-x-1">
        <button class="button ~blue @low" on:click={copyLink}>Copy link</button>
        <button class="button bg-[#671a3d] text-white @low" on:click={copyChost}>Copy cohost html</button>
        {#if browser && navigator.share}
            <button class="button ~green @low" on:click={nativeShare}>Share with apps</button>
        {/if}
        
    </div>
    


</div>

<svelte:head>
    <title>{poll.question} | Anketto</title>
</svelte:head>
