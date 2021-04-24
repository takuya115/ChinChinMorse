var app=function(){"use strict";function t(){}function e(t){return t()}function n(){return Object.create(null)}function o(t){t.forEach(e)}function r(t){return"function"==typeof t}function i(t,e){return t!=t?e==e:t!==e||t&&"object"==typeof t||"function"==typeof t}function u(t,e){t.appendChild(e)}function a(t,e,n){t.insertBefore(e,n||null)}function c(t){t.parentNode.removeChild(t)}function s(t){return document.createElement(t)}function l(t){return document.createTextNode(t)}function d(){return l(" ")}function p(t,e,n,o){return t.addEventListener(e,n,o),()=>t.removeEventListener(e,n,o)}function f(t,e,n){null==n?t.removeAttribute(e):t.getAttribute(e)!==n&&t.setAttribute(e,n)}function h(t,e){e=""+e,t.wholeText!==e&&(t.data=e)}function g(t,e){t.value=null==e?"":e}function m(t,e,n,o){t.style.setProperty(e,n,o?"important":"")}let y;function v(t){y=t}const $=[],x=[],b=[],w=[],C=Promise.resolve();let _=!1;function E(t){b.push(t)}let A=!1;const T=new Set;function F(){if(!A){A=!0;do{for(let t=0;t<$.length;t+=1){const e=$[t];v(e),k(e.$$)}for(v(null),$.length=0;x.length;)x.pop()();for(let t=0;t<b.length;t+=1){const e=b[t];T.has(e)||(T.add(e),e())}b.length=0}while($.length);for(;w.length;)w.pop()();_=!1,A=!1,T.clear()}}function k(t){if(null!==t.fragment){t.update(),o(t.before_update);const e=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,e),t.after_update.forEach(E)}}const j=new Set;function q(t,e){-1===t.$$.dirty[0]&&($.push(t),_||(_=!0,C.then(F)),t.$$.dirty.fill(0)),t.$$.dirty[e/31|0]|=1<<e%31}function S(i,u,a,s,l,d,p=[-1]){const f=y;v(i);const h=i.$$={fragment:null,ctx:null,props:d,update:t,not_equal:l,bound:n(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(f?f.$$.context:[]),callbacks:n(),dirty:p,skip_bound:!1};let g=!1;if(h.ctx=a?a(i,u.props||{},((t,e,...n)=>{const o=n.length?n[0]:e;return h.ctx&&l(h.ctx[t],h.ctx[t]=o)&&(!h.skip_bound&&h.bound[t]&&h.bound[t](o),g&&q(i,t)),e})):[],h.update(),g=!0,o(h.before_update),h.fragment=!!s&&s(h.ctx),u.target){if(u.hydrate){const t=function(t){return Array.from(t.childNodes)}(u.target);h.fragment&&h.fragment.l(t),t.forEach(c)}else h.fragment&&h.fragment.c();u.intro&&((m=i.$$.fragment)&&m.i&&(j.delete(m),m.i($))),function(t,n,i){const{fragment:u,on_mount:a,on_destroy:c,after_update:s}=t.$$;u&&u.m(n,i),E((()=>{const n=a.map(e).filter(r);c?c.push(...n):o(n),t.$$.on_mount=[]})),s.forEach(E)}(i,u.target,u.anchor),F()}var m,$;v(f)}"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self&&self;var L,O,M=(function(t,e){t.exports=(()=>{const t={1:{A:"01",B:"1000",C:"1010",D:"100",E:"0",F:"0010",G:"110",H:"0000",I:"00",J:"0111",K:"101",L:"0100",M:"11",N:"10",O:"111",P:"0110",Q:"1101",R:"010",S:"000",T:"1",U:"001",V:"0001",W:"011",X:"1001",Y:"1011",Z:"1100"},2:{0:"11111",1:"01111",2:"00111",3:"00011",4:"00001",5:"00000",6:"10000",7:"11000",8:"11100",9:"11110"},3:{".":"010101",",":"110011","?":"001100","'":"011110","!":"101011","/":"10010","(":"10110",")":"101101","&":"01000",":":"111000",";":"101010","=":"10001","+":"01010","-":"100001",_:"001101",'"':"010010",$:"0001001","@":"011010","¿":"00101","¡":"110001"},4:{"Ã":"01101","Á":"01101","Å":"01101","À":"01101","Â":"01101","Ä":"0101","Ą":"0101","Æ":"0101","Ç":"10100","Ć":"10100","Ĉ":"10100","Č":"110","Ð":"00110","È":"01001","Ę":"00100","Ë":"00100","É":"00100","Ê":"10010","Ğ":"11010","Ĝ":"11010","Ĥ":"1111","İ":"01001","Ï":"10011","Ì":"01110","Ĵ":"01110","Ł":"01001","Ń":"11011","Ñ":"11011","Ó":"1110","Ò":"1110","Ö":"1110","Ô":"1110","Ø":"1110","Ś":"0001000","Ş":"01100","Ș":"1111","Š":"1111","Ŝ":"00010","ß":"000000","Þ":"01100","Ü":"0011","Ù":"0011","Ŭ":"0011","Ž":"11001","Ź":"110010","Ż":"11001"},5:{"А":"01","Б":"1000","В":"011","Г":"110","Д":"100","Е":"0","Ж":"0001","З":"1100","И":"00","Й":"0111","К":"101","Л":"0100","М":"11","Н":"10","О":"111","П":"0110","Р":"010","С":"000","Т":"1","У":"001","Ф":"0010","Х":"0000","Ц":"1010","Ч":"1110","Ш":"1111","Щ":"1101","Ъ":"11011","Ы":"1011","Ь":"1001","Э":"00100","Ю":"0011","Я":"0101","Ї":"01110","Є":"00100","І":"00","Ґ":"110"},6:{"Α":"01","Β":"1000","Γ":"110","Δ":"100","Ε":"0","Ζ":"1100","Η":"0000","Θ":"1010","Ι":"00","Κ":"101","Λ":"0100","Μ":"11","Ν":"10","Ξ":"1001","Ο":"111","Π":"0110","Ρ":"010","Σ":"000","Τ":"1","Υ":"1011","Φ":"0010","Χ":"1111","Ψ":"1101","Ω":"011"},7:{"א":"01","ב":"1000","ג":"110","ד":"100","ה":"111","ו":"0","ז":"1100","ח":"0000","ט":"001","י":"00","כ":"101","ל":"0100","מ":"11","נ":"10","ס":"1010","ע":"0111","פ":"0110","צ":"011","ק":"1101","ר":"010","ש":"000","ת":"1"},8:{"ا":"01","ب":"1000","ت":"1","ث":"1010","ج":"0111","ح":"0000","خ":"111","د":"100","ذ":"1100","ر":"010","ز":"1110","س":"000","ش":"1111","ص":"1001","ض":"0001","ط":"001","ظ":"1011","ع":"0101","غ":"110","ف":"0010","ق":"1101","ك":"101","ل":"0100","م":"11","ن":"10","ه":"00100","و":"011","ي":"00","ﺀ":"0"},9:{"ا":"01","ب":"1000","پ":"0110","ت":"1","ث":"1010","ج":"0111","چ":"1110","ح":"0000","خ":"1001","د":"100","ذ":"0001","ر":"010","ز":"1100","ژ":"110","س":"000","ش":"1111","ص":"0101","ض":"00100","ط":"001","ظ":"1011","ع":"111","غ":"0011","ف":"0010","ق":"111000","ک":"101","گ":"1101","ل":"0100","م":"11","ن":"10","و":"011","ه":"0","ی":"00"},10:{"ア":"11011","カ":"0100","サ":"10101","タ":"10","ナ":"010","ハ":"1000","マ":"1001","ヤ":"011","ラ":"000","ワ":"101","イ":"01","キ":"10100","シ":"11010","チ":"0010","ニ":"1010","ヒ":"11001","ミ":"00101","リ":"110","ヰ":"01001","ウ":"001","ク":"0001","ス":"11101","ツ":"0110","ヌ":"0000","フ":"1100","ム":"1","ユ":"10011","ル":"10110","ン":"01010","エ":"10111","ケ":"1011","セ":"01110","テ":"01011","ネ":"1101","ヘ":"0","メ":"10001","レ":"111","ヱ":"01100","オ":"01000","コ":"1111","ソ":"1110","ト":"00100","ノ":"0011","ホ":"100","モ":"10010","ヨ":"11","ロ":"0101","ヲ":"0111","゛":"00","゜":"00110","。":"010100","ー":"01101","、":"010101","（":"101101","）":"010010"},11:{"ㄱ":"0100","ㄴ":"0010","ㄷ":"1000","ㄹ":"0001","ㅁ":"11","ㅂ":"011","ㅅ":"110","ㅇ":"101","ㅈ":"0110","ㅊ":"1010","ㅋ":"1001","ㅌ":"1100","ㅍ":"111","ㅎ":"0111","ㅏ":"0","ㅑ":"00","ㅓ":"1","ㅕ":"000","ㅗ":"01","ㅛ":"10","ㅜ":"0000","ㅠ":"010","ㅡ":"100","ㅣ":"001"},12:{"ก":"110","ข":"1010","ค":"101","ง":"10110","จ":"10010","ฉ":"1111","ช":"1001","ซ":"1100","ญ":"0111","ด":"100","ต":"1","ถ":"10100","ท":"10011","น":"10","บ":"1000","ป":"0110","ผ":"1101","ฝ":"10101","พ":"01100","ฟ":"0010","ม":"11","ย":"1011","ร":"010","ล":"0100","ว":"011","ส":"000","ห":"0000","อ":"10001","ฮ":"11011","ฤ":"01011","ะ":"01000","า":"01","ิ":"00100","ี":"00","ึ":"00110","ื":"0011","ุ":"00101","ู":"1110","เ":"0","แ":"0101","ไ":"01001","โ":"111","ำ":"00010","่":"001","้":"0001","๊":"11000","๋":"01010","ั":"01101","็":"11100","์":"11001","ๆ":"10111","ฯ":"11010"}},e=(e,n)=>{const r=o(e),i={};for(const e in t){i[e]={};for(const n in t[e])i[e][n]=t[e][n].replace(/0/g,r.dot).replace(/1/g,r.dash)}return!0!==n&&delete i[0],i},n=t=>{const n={},o=e(t,!0);for(const t in o)for(const e in o[t])void 0===n[o[t][e]]&&(n[o[t][e]]=e);return n},o=e=>((e=e||{}).oscillator=e.oscillator||{},e={dash:e.dash||"-",dot:e.dot||".",space:e.space||"/",separator:e.separator||" ",invalid:e.invalid||"#",priority:e.priority||1,unit:e.unit||.08,fwUnit:e.fwUnit||e.unit||.08,oscillator:{type:e.oscillator.type||"sine",frequency:e.oscillator.frequency||500,onended:e.oscillator.onended||null}},t[1][e.separator]=e.space,t[0]=t[e.priority],e),r=(e,n)=>{const r=o(n);return[...e.replace(/\s+/g,r.separator).trim().toLocaleUpperCase()].map((function(e){for(let n in t)if(void 0!==t[n]&&void 0!==t[n][e])return t[n][e];return r.invalid})).join(r.separator).replace(/0/g,r.dot).replace(/1/g,r.dash)};let i=null,u=null;const a=(t,e,n)=>{null===i&&"undefined"!=typeof window&&(i=window.AudioContext||window.webkitAudioContext,u=new i);const a=o(e),c=n||r(t,e),s=u.createOscillator(),l=u.createGain();let d,p=u.currentTime;s.type=a.oscillator.type,s.frequency.value=a.oscillator.frequency,s.onended=a.oscillator.onended,l.gain.setValueAtTime(0,p);const f=t=>{l.gain.setValueAtTime(1,p),p+=t*a.unit},h=t=>{l.gain.setValueAtTime(0,p),p+=t*a.unit},g=t=>{l.gain.setValueAtTime(0,p),p+=t*a.fwUnit};for(let t=0;t<=c.length;t++)c[t]===a.space?g(7):c[t]===a.dot?(f(1),h(1)):c[t]===a.dash?(f(3),h(1)):void 0!==c[t+1]&&c[t+1]!==a.space&&void 0!==c[t-1]&&c[t-1]!==a.space&&g(3);s.connect(l),l.connect(u.destination);const m=()=>{s.start(u.currentTime),d=setTimeout((()=>y()),1e3*(p-u.currentTime))},y=()=>{clearTimeout(d),d=0,s.stop(0)};return{play:m,stop:y,context:u,oscillator:s,gainNode:l}};return{characters:e,decode:(t,e)=>{const r=o(e),i=n(r);return t.replace(/\s+/g,r.separator).trim().split(r.separator).map((function(t){return void 0!==i[t]?i[t]:r.invalid})).join("")},encode:r,audio:a}})()}(O={path:L,exports:{},require:function(t,e){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==e&&O.path)}},O.exports),O.exports);function N(e){let n,r,i,y,v,$,x,b,w,C,_,E,A,T,F,k,j,q,S,L,O,M,N,U,V,H,P,B,D,G,R,I,J;return{c(){n=s("header"),n.innerHTML="<h1>ちんちんもーるす</h1>",r=d(),i=s("main"),y=s("div"),y.innerHTML="<h4>ひらがなとカタカナをモールス信号に変えるよ！</h4> \n    <p>もはやモールスというか換字式暗号みたくなってるけどツッコまないでね！</p> \n    <p>えんこーど: ぶんしょう → ちんちん...</p> \n    <p>でこーど: ちんちん... → ぶんしょう</p>",v=d(),$=s("div"),x=s("h3"),x.textContent="にゅうりょく",b=d(),w=s("div"),C=l("文字数: "),_=l(e[2]),E=d(),A=s("textarea"),T=d(),F=s("div"),k=s("button"),k.textContent="えんこーど",j=d(),q=s("button"),q.textContent="でこーど",S=d(),L=s("div"),O=s("h3"),O.textContent="しゅつりょく",M=d(),N=s("div"),U=l("文字数: "),V=l(e[3]),H=d(),P=s("textarea"),B=d(),D=s("p"),D.textContent="遊びでひみつのモード仕込んでみたよ！さがしてみてね！",G=d(),R=s("a"),R.textContent="コードはこちら",m(n,"text-align","center"),f(n,"class","svelte-1gggona"),f(A,"name","input-kana"),f(A,"id","input-kana"),f(A,"cols","30"),f(A,"rows","10"),f(A,"class","svelte-1gggona"),m(k,"margin","0 10px"),m(q,"margin","0 10px"),m(F,"display","flex"),m(F,"justify-content","center"),f(P,"name","output-chin"),f(P,"id","output-chin"),f(P,"cols","30"),f(P,"rows","10"),P.readOnly=!0,f(P,"class","svelte-1gggona"),f(R,"href","https://github.com/takuya115/ChinChinMorse"),f(i,"class","svelte-1gggona")},m(t,o){a(t,n,o),a(t,r,o),a(t,i,o),u(i,y),u(i,v),u(i,$),u($,x),u($,b),u($,w),u(w,C),u(w,_),u($,E),u($,A),g(A,e[0]),u(i,T),u(i,F),u(F,k),u(F,j),u(F,q),u(i,S),u(i,L),u(L,O),u(L,M),u(L,N),u(N,U),u(N,V),u(L,H),u(L,P),g(P,e[1]),u(i,B),u(i,D),u(i,G),u(i,R),I||(J=[p(A,"input",e[7]),p(A,"input",e[8]),p(k,"click",e[4]),p(q,"click",e[5]),p(P,"input",e[9])],I=!0)},p(t,[e]){4&e&&h(_,t[2]),1&e&&g(A,t[0]),8&e&&h(V,t[3]),2&e&&g(P,t[1])},i:t,o:t,d(t){t&&c(n),t&&c(r),t&&c(i),I=!1,o(J)}}}function U(t,e,n){let o="",r="",i=0,u=0;const a={priority:10,dash:"ちんちん",dot:"ちんこ",separator:"ちんぽ"},c={priority:10,dash:"ざぁこ",dot:"♥",separator:"♡"};function s(t,e){"input"===e?n(2,i=t.length):n(3,u=t.length)}return[o,r,i,u,function(){if(new RegExp(/([\u{3005}\u{3007}\u{303b}\u{3400}-\u{9FFF}\u{F900}-\u{FAFF}\u{20000}-\u{2FFFF}][\u{E0100}-\u{E01EF}\u{FE00}-\u{FE02}]?)/mu).test(o))return alert("漢字はつかえないよ！　めっ！！");const t=o.split("\n"),e=[],i=document.querySelector("#secret-mode").value;t.forEach((t=>{let n=t;n=function(t){return t.replace(/[\u3041-\u3096]/g,(t=>{const e=t.charCodeAt(0)+96;return String.fromCharCode(e)}))}(n),n=function(t){return t.replace(/[ガギグゲゴザジズゼゾダヂヅデドバビブベボ]/g,(t=>{const e=t.charCodeAt(0)-1;return String.fromCharCode(e)+"゛"}))}(n),n=function(t){return t.replace(/[パピプペポ]/g,(t=>{const e=t.charCodeAt(0)-2;return String.fromCharCode(e)+"゜"}))}(n),n=function(t){return t.replace(/[ァィゥェォャュョッ]/g,(t=>{const e=t.charCodeAt(0)+1;return String.fromCharCode(e)}))}(n),e.push(M.encode(n,"メスガキ"===i?c:a))})),n(1,r=e.join("\n")),s(r,"output")},function(){const t=o.split("\n"),e=[],i=document.querySelector("#secret-mode").value;t.forEach((t=>{e.push(M.decode(t,"メスガキ"===i?c:a))})),n(1,r=e.join("\n")),s(r,"output")},s,t=>s(t.target.value,"input"),function(){o=this.value,n(0,o)},function(){r=this.value,n(1,r)}]}return new class extends class{$destroy(){!function(t,e){const n=t.$$;null!==n.fragment&&(o(n.on_destroy),n.fragment&&n.fragment.d(e),n.on_destroy=n.fragment=null,n.ctx=[])}(this,1),this.$destroy=t}$on(t,e){const n=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return n.push(e),()=>{const t=n.indexOf(e);-1!==t&&n.splice(t,1)}}$set(t){var e;this.$$set&&(e=t,0!==Object.keys(e).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}{constructor(t){super(),S(this,t,U,N,i,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
