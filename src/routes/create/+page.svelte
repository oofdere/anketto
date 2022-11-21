<script>
    import { browser } from '$app/environment';
    import { PUBLIC_HCAPTCHA_SITE_KEY } from '$env/static/public';

    let question = "Is this a question?";
    let answers = ["Yes", "No"];
    $: encoded_answers = JSON.stringify(answers);

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
        console.log(encoded_answers);
    }
</script>

<div class="flex flex-col space-y-4 container">
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
                bind:value={encoded_answers}
            />

            <div id="hcaptcha" class="h-captcha" data-sitekey="{PUBLIC_HCAPTCHA_SITE_KEY}"></div>

            <div class="flex rounded-md">
                <button type="submit" class="button rounded-l-md rounded-r-none text-white bg-black w-full">Create!</button>
                <select class="form-input rounded-r-md w-36" name="length">
                    <option value="1">1 hour</option>
                    <option value="12">12 hours</option>
                    <option value="24">1 day</option>
                    <option value="72">3 days</option>
                    <option value="120">5 days</option>
                    <option value="168">7 days</option>
                    <option value="336">14 days</option>
                    <option value="720">30 days</option>
                </select>
            </div>

            
        </form>
    </div>
</div>



<svelte:head>
    {#if browser}
    <script>
        var hcaptchaLoad = function () {
            console.log('hcaptcha loaded');
            var widgetID = hcaptcha.render('hcaptcha');
        }
    </script>
    <script src="https://js.hcaptcha.com/1/api.js?render=explicit&onload=hcaptchaLoad" async defer></script>
    {/if}
</svelte:head>