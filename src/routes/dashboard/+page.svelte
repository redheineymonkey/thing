<script>
    import { goto } from "$app/navigation";
    import { io } from "socket.io-client";
    import JSConfetti from "js-confetti";
    import { onMount } from "svelte";

    const socket = io("/admin");

    let sound;
    let confetti;
    onMount(() => {
        let jsConfetti = new JSConfetti();
        confetti = () => {
            jsConfetti.addConfetti({
                confettiRadius: 9,
                confettiNumber: 500,
            });
        };
        sound = new Audio("/win.mp3");

        window.ask = (q) => {
            socket.emit("ask", "");
            winner = "";
            i = 1;
            socket.emit("ask", (questions[i - 1] = q));
        };
        window.setI = (x) => {
            socket.emit("ask", "");
            winner = "";
            i = x;
            socket.emit("ask", questions[i - 1]);
        };
        window.setWinner = (x) => {
            winner = x;
        };
        window.onbeforeunload = () => {
            socket.emit("ask", "");
        };
    });

    let i = 0;
    let questions = [
        "Kes on kõige kiireim?",
        "Kes on kõige sportlikum?",
        "Kes jõuab esimesena kooli?",
        "Kes loeb kõige rohkem raamatuid?",
        "Kes on parim kokk?",
        "Kes on parim matemaatikas?",
        "Kes käitub kõige lapselikumalt?",
        "Kes on kõige targem?",
        "Kes saab kõige tõenäolisemalt õpetajaks?",
        "Kes saab kõige tõenäolisemalt näitlejaks?",
        "Kes hakkab kõige tõenäolisemalt ettevõtjaks?",
        "Kes on kõige naljakam?",
        "Kes saab suurima tõenäosusega esimesena surma?",
        "Kes on kõige pikem?",
        "Kellel on kõige rohkem märkusi?",
        "Kes on kõige sigmam??",
        "Kes on kõige ohtlikum?",
        "Kes on su lemmik?",
    ];

    let winner = "";
    let progress = {
        timeLeft: 0,
        ansnum: 0,
    };
    socket.on("end", (result) => {
        if (!result) {
            socket.emit("ask", questions[i - 1]);
        } else {
            socket.emit("ask", "");
            winner = result;

            confetti();
            // sound.play();
        }
    });
    socket.on("progress", (time, num) => {
        progress.timeLeft = time;
        progress.ansnum = num;
    });

    function ask() {
        socket.emit("ask", "");
        if (questions.length == i) {
            goto("/yayyyy");
        }
        winner = "";
        socket.emit("ask", questions[i]);
        i++;
    }
    let condition = false;
</script>

<div class="gradient"></div>
<main>
    {#if condition}
        {#if i !== 0}
            <div class="cont">
                <h1 class="question">{i}. {questions[i - 1]}</h1>
                {#if winner}
                    <div class="podium">
                        {#if typeof winner == "object"}
                            <div class="podium-spot second-place">
                                <img
                                    class="winner-pic"
                                    src={`/friends/${Object.keys(winner[1])[0]}.jpeg`}
                                    alt="winner"
                                    onerror="this.onerror=null; this.src='/friends/person.jpeg';"
                                />
                                <h1 class="winner-name">
                                    {Object.keys(winner[1])[0]}
                                </h1>
                                <h1 class="winner-place">2. koht</h1>
                                <h1 class="winner-votes">
                                    {Object.values(winner[1])[0]}
                                    {Object.values(winner[1])[0] == 1
                                        ? "hääletus"
                                        : "hääletust"}
                                </h1>
                            </div>

                            <div class="podium-spot first-place">
                                <img
                                    class="winner-pic"
                                    src={`/friends/${Object.keys(winner[0])[0]}.jpeg`}
                                    alt="winner"
                                    onerror="this.onerror=null; this.src='/friends/person.jpeg';"
                                />
                                <h1 class="winner-name">
                                    {Object.keys(winner[0])[0]}
                                </h1>
                                <h1 class="winner-place">1. koht</h1>
                                <h1 class="winner-votes">
                                    {Object.values(winner[0])[0]}
                                    {Object.values(winner[0])[0] == 1
                                        ? "hääletus"
                                        : "hääletust"}
                                </h1>
                            </div>

                            <div class="podium-spot third-place">
                                <img
                                    class="winner-pic"
                                    src={`/friends/${Object.keys(winner[2])[0]}.jpeg`}
                                    alt="winner"
                                    onerror="this.onerror=null; this.src='/friends/person.jpeg';"
                                />
                                <h1 class="winner-name">
                                    {Object.keys(winner[2])[0]}
                                </h1>
                                <h1 class="winner-place">3. koht</h1>
                                <h1 class="winner-votes">
                                    {Object.values(winner[2])[0]}
                                    {Object.values(winner[2])[0] == 1
                                        ? "hääletus"
                                        : "hääletust"}
                                </h1>
                            </div>
                        {:else}
                            <div>
                                <img
                                    class="winner-pic"
                                    src={`/friends/${winner}.jpeg`}
                                    alt="winner"
                                    onerror="this.onerror=null; this.src='/friends/person.jpeg';"
                                    style="height: 350px;width: 350px;"
                                />
                                <h1 class="winner-name">{winner}</h1>
                            </div>
                        {/if}
                    </div>
                    <button
                        style="margin-top: 0px;"
                        on:click={ask}
                        class="start">Järgmine</button
                    >
                {:else}
                    <h1 class="time">
                        {Math.ceil(progress.timeLeft)} sekundit jäänud.
                    </h1>
                    <h1 class="numofanswers">{progress.ansnum} vastust.</h1>
                {/if}
            </div>
        {:else}
            <button on:click={ask} class="start"> Alusta </button>
        {/if}
    {:else}
        <input
            style="background-color: grey; color: white; text-align: center; font-size: 1px; "
            type="text"
            on:input={(e) =>
                (condition = e.target.value === "9012" ? true : false)}
        />
    {/if}
</main>

<style>
    @import url("https://fonts.googleapis.com/css2?family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap");
    * {
        font-family: "Ubuntu Mono", sans-serif;
        font-optical-sizing: auto;
        font-weight: 400;
        font-style: normal;
    }
    .gradient {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background: linear-gradient(90deg, #111, #454545);
        background-size: 1000% 1000%;
        animation: spin 10s linear infinite;
    }
    @keyframes spin {
        0% {
            background-position: 0 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0 50%;
        }
    }
    main {
        z-index: 0;
        margin: auto;
        margin-top: 20px;
        height: 90vh;
        overflow: hidden;
        width: 80vw;
        background-color: #222;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
    }
    .cont {
        text-align: center;
        padding: 40px;
        border-radius: 10px;
    }
    .start {
        background-color: rgb(0, 0, 0);
        color: rgb(255, 255, 255);
        border: 2px solid white;
        text-align: center;
        padding: 15px;
        margin: 40vh;
        border-radius: 15px;
        font-size: 40px;
        transition: all 0.3s;
    }
    .start:hover {
        background-color: rgb(50, 50, 50);
        box-shadow: 0px 0px 10px rgb(91, 91, 91);
    }
    .start:active {
        background-color: rgb(102, 102, 102);
    }
    .winner-pic {
        width: 400px;
        height: 400px;
        margin: auto;
        margin-top: 20px;
        border-radius: 20px;
        border: 5px solid black;
    }
    .winner-name {
        text-align: center;
        font-size: 50px;
        margin-block: 20px;
    }
    .winner-place {
        text-align: center;
        font-size: 50px;
        margin-block: 20px;
    }
    .winner-votes {
        text-align: center;
        font-size: 50px;
        margin-block: 20px;
    }
    .podium {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 80px;
    }
    .podium-spot {
        padding: 10px;
        margin: 0.45rem;
    }
    .first-place .winner-pic {
        height: 300px;
        width: 300px;
    }
    .second-place .winner-pic {
        height: 270px;
        width: 270px;
    }
    .third-place .winner-pic {
        height: 260px;
        width: 260px;
    }
    .question {
        text-align: center;
        font-size: 64px;
        margin-top: 1rem;
    }
    .time,
    .numofanswers {
        text-align: center;
        font-size: 40px;
        margin-top: 60px;
    }
</style>
