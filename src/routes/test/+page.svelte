<script>
    import { io } from "socket.io-client";
    const socket = io();

    const allChoices = [
        "Allan",
        "Riko",
        "Adele",
        "Richard",
        "Rihana",
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

    let speed = 1
    function loadTest(){
        let interval = setInterval(() => {
            socket.emit("submit", allChoices[Math.floor(Math.random()*allChoices.length)]);
        }, 1000/speed)
        setInterval(() => {
            clearInterval(interval)
            speed++
            interval = setInterval(() => {
                socket.emit("submit", allChoices[Math.floor(Math.random()*allChoices.length)]);
            }, 1000/speed)
            console.log(speed);
        } , 10000)
    }
</script>

<main>
    <button on:click={loadTest}> load test</button>
</main>
