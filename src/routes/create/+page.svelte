<script>
    let question = "Is this a question?";
    let answers = ["Yes", "No"];
    let encoded_answers = "";

    /**
     * @param {number} index
     */
    function delAnswer(index) {
        console.log(`Deleting answer ${index}...`);
        answers.splice(index, 1);
        answers = answers;
        console.log(answers);
    }

    function addAnswer() {
        console.log("Adding an answer...");
        answers.push("New answer");
        answers = answers;
        console.log(answers);
    }
</script>

<div class="flex flex-col space-y-4">
    <div class="flex flex-col space-y-1">
        <span class="supra">POSIT A RIVETING QUESTION</span>
        <input
            class="text-3xl bg-gray-100 rounded-md p-2"
            id="form-question"
            form="form-meta"
            name="question"
            bind:value={question}
        />
    </div>
    <div class="flex flex-col space-y-1 space-x-1">
        <span class="supra">EMIT SOME INQUISITIVE ANSWERS</span>
        {#each answers as answer, index}
            <div class="flex space-x-1 flex-grow">
                <input
                    bind:value={answer}
                    class="bg-gray-100 p-2 rounded-md text-lg flex-grow"
                />
                <button
                    class="button text-white bg-red-500 text-lg"
                    on:click={() => delAnswer(index)}>Delete!</button
                >
            </div>
        {/each}
        <button class="button text-white bg-black" on:click={addAnswer}
            >Add another answer!</button
        >
    </div>
    <div>
        <span class="supra">ASK ALL ZERO OF YOUR FRIENDS FOR THEIR OPINION</span>
        <form id="form-meta" action="/create" method="POST">
            <input
                class="hidden"
                id="form-answers"
                name="answers"
                bind:value={answers}
            />
            <button type="submit" class="button text-white bg-black w-full">Create!</button>
        </form>
    </div>
</div>


