<script lang="ts">
    export let poll: any; // make a type for this at some point
</script>

<h1 class="text-3xl font-black">{poll.question}</h1>
<ul class="flex flex-col space-y-1">
    {#each poll.answers as answer}
        <li class="flex">
            <div class="flex bg-red-500 rounded-md h-full"></div>
            <div class="flex p-2 m-1 bg-[#00000011] w-92 rounded-md"><a href="/poll/{poll.id}">{answer}</a></div>
        </li>
    {/each}
</ul>

<!--
<div class="flex flex-col space-y-1">
    <h1 class="heading">{poll.question}</h1>
        <ul class="flex flex-col  space-y-1">
            {#each poll.answers as answer, index}
                <li class="relative flex-grow">
                    <div
                        class="bg-red-500 rounded-md absolute h-full p-2 -z-10"
                        style="width: {(poll.votes[index] / poll.total) *
                            100}%"
                        aria-hidden="true"
                    />
                    <div class=" bg-black bg-opacity-10 p-2 rounded-md text-lg">
                        {answer} / {(
                            (poll.votes[index] / poll.total) *
                            100
                        ).toFixed(2)}% ({poll.votes[index]} votes)
                    </div>
                </li>
            {/each}
        </ul>
    </div>    -->
