<script>
    import { io } from "socket.io-client";
    import JSConfetti from "js-confetti";
    import { onMount } from "svelte";

    const socket = io();
    
    let win;
    let confetti;
    onMount(() => {
        let jsConfetti = new JSConfetti();
        confetti = () => {
            jsConfetti.addConfetti({
                confettiRadius: 9,
                confettiNumber: 500,
            });
        };
        win = new Audio("/win.mp3");

        window.ask = (q) => {
            winner = "";
            i = 1;
            socket.emit("ask", (questions[i - 1] = q));
        };
        window.i = (x) => {
            i = x
        }
    });

    let winner = ""; 
    socket.on("end", (result) => {
        if (!result) {
            socket.emit("ask", questions[i - 1]);
        } else {
            winner = result;

            confetti();
            // win.play();
        }
    });

    let i = 0;
    let questions = [
        "Kes on klassi kõige naljakam?",
        "Kes on kõige loomingulisem?",
        "Kes on parim laulja?",
        "Kes on parim tantsija?",
        "Kes riietub kõige paremini?",
        "Kes loeb kõige rohkem raamatuid?",
        "Keda leitakse kõige tõenäolisemalt raamatut lugemas?",
        "Kes püsib kõige kauem ärkvel?",
        "Kes õpib kõige paremini?",
        "Kes hilineb kõige tõenäolisemalt tundi?",
        "Kes teeb kõige tõenäolisemalt kellegi päeva säravaks?",
        "Kes on kõige sportlikum?",
        "Kellest saab kõige tõenäolisemalt proffsportlane?",
        "Kes on parim probleemi lahendaja?",
        "Kes suudab kõige tõenäolisemalt mõistatuse lahendada?",
        "Kes leiutab kõige tõenäolisemalt midagi maailma muutvat?",
        "Kes saab kõige tõenäolisemalt teadlaseks?",
        "Kes saab kõige tõenäolisemalt õpetajaks?",
        "Kes saab kõige tõenäolisemalt presidendiks?",
        "Kes saab kõige tõenäolisemalt miljonäriks?",
        "Kes saab suurima tõenäosusega rikkaimaks?",
        "Kellest saab kõige tõenäolisemalt kuulus muusik?",
        "Kellest saab kõige tõenäolisemalt kuulus näitleja?",
        "Kellest saab kõige tõenäolisemalt tehnikamogul?",
        "Kes võidab kõige tõenäolisemalt Nobeli preemia?",
    ];

    let progress = {
        timeLeft: 30,
        ansnum: 0,
    };
    socket.on("progress", (time, num) => {
        progress.timeLeft = time;
        progress.ansnum = num;
    });

    function ask() {
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
                    <img
                        class="winner-pic"
                        src={`/${winner}.jpeg`}
                        alt="winner"
                        srcset="/person.jpeg"
                    />
                    <h1 class="winner-name">{winner}</h1>
                    <button
                        style="margin-top: 0px;"
                        on:click={ask}
                        class="start">Järgmine</button
                    >
                {:else}
                    <h1 class="time">{progress.timeLeft} sekundit jäänud.</h1>
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
    .gradient {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        background: linear-gradient(90deg ,#111, #454545);
        background-size: 1000% 1000%;
        animation: spin 10s linear infinite;
    }
    @keyframes spin{
        0%{
            background-position: 0 50%;
        }
        50%{
            background-position: 100% 50%;
        }
        100%{
            background-position: 0 50%;
        }
    }
    main {
        z-index: 0;
        margin: auto;
        margin-top: 20px;
        height: 75vh;
        width: 75vw;
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
        border-radius: 15px;
        font-size: 40px;
        margin-top: 40vh;
        transition: all 0.2s;
    }
    .start:hover {
        background-color: rgb(50, 50, 50);
        box-shadow: 0px 0px 10px rgb(91, 91, 91);
    }
    .start:active {
        background-color: rgb(102, 102, 102);
    }
    .winner-pic {
        width: 300px;
        height: 300px;
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
    .question {
        text-align: center;
        font-size: 50px;
        margin-top: 40px;
    }
    .time,
    .numofanswers {
        text-align: center;
        font-size: 40px;
        margin-top: 60px;
    }
</style>
