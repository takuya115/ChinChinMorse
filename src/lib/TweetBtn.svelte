<script lang="ts">
    export let tweetText: string = "";
    export let shareLink: string = "";
    $: href = getTweetLink(tweetText, shareLink);

    function getTweetLink(tweetText: string, shareLink: string): string {
        // モールスが120を超えるときは詰める
        const tweetTextShorted = tweetText.length > 120 ? tweetText.slice(0, 120) + "..." : tweetText;
        const currentURL = location.href.split("?")[0];
        let url = "https://twitter.com/share"
        if (tweetText && shareLink) {
            url += `?text=${tweetTextShorted}${encodeURI("\n\n")}${shareLink}`;
        } else {
            url += `?text=${encodeURI("ちんちん")}${encodeURI("\n\n")}${currentURL}`;
        }
        return url
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
    <a href={href} target="_blank" rel="noreferrer" class="tweet" title="ちんちんをツイート"
        ><ion-icon name="logo-twitter" size="large" /></a
    >
</div>

<style>
    ion-icon {
        pointer-events: none;
        color: rgb(29, 155, 240);
    }
    a {
        display: inline-block;
    }
    .tweet {
        background: none;
        border: none;
        cursor: pointer
    }
</style>
