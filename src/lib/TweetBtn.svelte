<script lang="ts">
    export let tweetText: string = "";
    export let shareLink: string = "";

    function openTweetWindow() {
        // モールスが120を超えるときは詰める
        const tweetTextShorted = tweetText.length > 120 ? tweetText.slice(0, 120) + "..." : tweetText;
        const currentURL = location.href.split("?")[0];
        let url = "https://twitter.com/share"
        if (tweetText && shareLink) {
            url += `?text=${tweetTextShorted}${encodeURI("\n\n")}${shareLink}`;
        } else {
            url += `?text=${encodeURI("ちんちん")}${encodeURI("\n\n")}${currentURL}`;
        }
            
        const option = "left=300,top=100,height=430,width=550"
        window.open(url, "ツイートする", option)
    }
</script>

<div>
    <script
        type="module"
        src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"
    ></script>
    <script
        nomodule
        src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"
    ></script>
    <button title="ちんちんをツイート" on:click={openTweetWindow}
        ><ion-icon name="logo-twitter" size="large" /></button
    >
</div>

<style>
    ion-icon {
        pointer-events: none;
        color: rgb(29, 155, 240);
    }
    button {
        background: none;
        border: none;
        cursor: pointer
    }
</style>
