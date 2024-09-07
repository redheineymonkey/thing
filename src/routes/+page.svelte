<script>
    import { io } from "socket.io-client";

    const socket = io();

    const allChoices = [
        "Allan",
        "Riko",
        "Adele",
        "Richard",
        "Hans",
        "Cassandra",
        "Johannes",
        "Andrea",
        "Patrik",
        "Mirelle",
        "Victoria",
        "Anneliis",
        "Mattias",
        "Rudolf",
        "Jesse",
        "Kairon",
        "Simona",
        "Britt",
        "Rasmus",
        "Teele",
        "Aaron",
        "Hanna",
        "Lauri",
        "Eve",
    ];
    let question = "";
    let choice = "";

    let choices = allChoices;

    function search(e) {
        const searchTerm = e.target.value.toLowerCase();
        choices = allChoices.filter((name) =>
            name.toLowerCase().includes(searchTerm),
        );
    }

    socket.on("question", (currentQuestion) => {
        if (localStorage.getItem("lastQuestion") == currentQuestion) {
            question = ''
        }
        else{
            question = currentQuestion;
        }
    });
    
    function submit() {
        if (!choice) return;
        socket.emit("submit", choice);
        localStorage.setItem("lastQuestion", question);
        choice = "";
        question = "";
    }
</script>

<main>
    {#if !question}
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <h1 on:click={(e) => (e.target.innerText = "[ ;")}>Ootan...</h1>
    {:else}
        <div class="choose">
            <h1 class="question">{question}</h1>
            <input
                on:input={search}
                type="text"
                class="search"
                placeholder="Otsi..."
            />
            <div class="choices">
                {#each choices as name}
                    <button
                        on:click={() => (choice = name)}
                        class:selected={choice === name}
                        class="choice"
                        id={name}
                    >
                        <img
                            src={`/${name}.jpeg`}
                            alt=""
                            srcset="/person.jpeg"
                        />
                        <p>{name}</p>
                    </button>
                {/each}
            </div>
            <button on:click={submit} class="submit">Esita</button>
        </div>
    {/if}
</main>

<style>
    @import url("https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&family=Open+Sans:ital,wght@0,300..800;1,300..800&family=Space+Grotesk&family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap");
    * {
        font-family: "Space Grotesk", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
    }
    .choose {
        display: flex;
        margin: auto;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .choices {
        width: 295px;
        height: 500px;
        scrollbar-width: none;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: repeat(2000, 1fr);
        min-height: 0;
        overflow: auto;
        border: 3px solid black;
        transition: all 1s;
    }

    .choice {
        margin: auto;
        margin-block: 1rem;

        width: 120px;
        height: 120px;

        background-color: rgb(0, 0, 0);
        border: 2px solid grey;
        display: flex;

        align-items: center;
        justify-content: center;
        flex-direction: column;
        transition: 0.1s;
    }
    .choice p,
    .choice img {
        font-size: 1.3rem;
        pointer-events: none;
    }
    .choice img {
        width: 80px;
        height: 80px;
        border-radius: 5px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    .selected {
        background-color: rgb(50, 50, 50);
        transform: scale(1.1);
    }

    .submit {
        margin: 1.5rem;

        width: 300px;
        height: 50px;

        font-size: 1.3rem;

        background-color: rgb(85, 85, 85);
        border: 2px solid grey;

        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    .submit:active {
        background-color: rgb(131, 131, 131);
    }

    .search {
        color: black;

        width: 300px;
        height: 50px;

        font-size: 1.3rem;
        border-radius: 5px;
    }

    .question {
        font-size: 2rem;
        color: #fff;
        text-align: center;
        margin: 20px;
    }

    button:hover {
        background-color: rgb(68, 68, 68);
    }
</style>
