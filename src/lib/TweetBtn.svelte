<script lang="ts">
    export let tweetText: string = "";
    export let shareLink: string = "";
    $: href = getTweetLink(tweetText, shareLink);

    function getTweetLink(tweetText: string, shareLink: string): string {
        // App側で50文字程度に短縮済みのPrettyを受け取り、改行1つでURLを続ける
        const currentURL = location.href.split("?")[0];
        let url = "https://twitter.com/intent/tweet";
        if (tweetText && shareLink) {
            url += `?text=${tweetText}${encodeURI("\n")}${shareLink}`;
        } else {
            url += `?text=${encodeURI("ちんちん")}${encodeURI("\n")}${currentURL}`;
        }
        return url;
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
    {#if navigator.userAgent.match(/iPhone|Android.+Mobile/)}
    <!-- スマホの場合は別タブで開く -->
        <a
            {href}
            target="_blank"
            rel="noreferrer"
            class="tweet"
            title="ちんちんをツイート"
            ><ion-icon name="logo-twitter" size="large" /></a
        >
    {:else}
    <!-- PCの場合は別ウィンドウで開く -->
        <a
            href={null}
            target="_blank"
            rel="noreferrer"
            class="tweet"
            title="ちんちんをツイート"
            on:click|preventDefault = {() => window.open(href, "ツイートする", "left=300,top=100,height=430,width=550")}
            ><ion-icon name="logo-twitter" size="large" /></a
        >
    {/if}
    
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
        cursor: pointer;
    }
</style>
