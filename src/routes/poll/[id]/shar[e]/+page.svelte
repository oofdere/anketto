<script lang="ts">
    import type { PageData } from "../$types";
    import createLocalStore from "$lib/public/localstorage";
    import { browser } from "$app/environment";
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";

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
</script>

<div class="flex flex-col space-y-1 container">
    <a href="/poll/{poll.id}/vote" class="supra underline">GO BACK</a>
    <div class="w-96">
        {@html data.qrsvg}
    </div>
    <div class="flex space-x-1">
        <button class="button ~blue @low" on:click={nativeShare}>Copy link</button>
        {#if browser && navigator.share}
            <button class="button ~green @low" on:click={nativeShare}>Share with apps</button>
        {/if}
        
    </div>
    


</div>

<svelte:head>
    <title>{poll.question} | Anketto</title>
</svelte:head>
