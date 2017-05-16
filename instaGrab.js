// ==UserScript==
// @name        show links oh hover
// @namespace   pRi
// @description Adds a download button for instagram images
// @include     https://www.instagram.com/*
// @include     http://www.instagram.com/*
// @version     1.001
// @grant       none
// ==/UserScript==

(function() {
    'use strict';

    /**
    * DISCLAIMER: THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

    * This script will provide download buttons over each
    * image on the profile page of any instagram user
    *
    * --------   USE   ----------
    *  1) Install tapermonkey
    *  2) paste this script
    *  3) go to a IG user page like: https://www.instagram.com/userXYZ
    *  4) click the dowload button
    *  5) wait 1.5s
    *  6) click the ready button.
    *  7) the dowload should start
    * -------- END USE ------------
    *
    * This works by inserting a row of clickable spans.
    * however getting the original image turns out to be rather difficult
    * some clever user (credit to: u/sotopheavy and u/MeNoGoodReddit) has figured out that you can find
    * the original image by a script that he wrote.
    * yet this only works on the IG single page view.
    *
    * so the dowload now works by creating an IFrame when a button is clicked
    * waiting for the time defined in window.DOWLOAD_WAIT_TIME
    * (the iframe has to load)
    * then changeing the content of the spans to a <a href=* dowload>...</a> tag.
    * after all of that the iFrame is destroyed.
    *
    * It can sometimes happen that the created link becomes undefined
    * (this happens when the iframe has not finished loading)
    *
    * This also chnages the behaviour of the "load more" button
    * since I found no solution for binding to the fired event upon loading
    * more items.
    */

    // global variable, change this depending on your average
    // internet connection speed
    window.DOWLOAD_WAIT_TIME = 1500;

    function getData()
    {
        /* returns data so that:
          the elements are Arrays of size 2
          the fist elem of those is the row
          the 2nd is an array of the cols.*/

        var frame = document.querySelector("#react-root").firstChild.firstChild
        .firstChild.children[1].firstChild;

        return Array.from(frame.children)
            .map(function(e) { return [e, Array.from(e.children)]; });
    }

    function createIFrame(aTag)
    {
        // create an iframe of the specefied aTag.
        var iframe = document.createElement("iframe");
        iframe.setAttribute("src", "https://www.instagram.com" + aTag.getAttribute("href"));
        document.body.appendChild(iframe);
        return iframe;
    }

    function getOgURL(doc)
    {
        // gets the og:img URL from the specefied document.
        // LPT link: https://www.reddit.com/r/LifeProTips/comments/6abp2b/lpt_want_to_download_the_highest_quality_version/
        // and u/sotopheavy
        // and u/MeNoGoodReddit
        var meta = doc.querySelector("meta[property=\"og:image\"]");
        if (meta === null) {
            return;
        }
        var url = meta.getAttribute("content");
        if (url === null || url.length === 0) {
            return;
        }
        return url;
    }

    function addDonwloadFrames(data)
    {
      // adds the dowload frames
        var spanStyle = "background-color: white;" +
            "color: inherit;" +
            "font-size: 14pt;" +
            "height: 40px" +
            "text-align: center;" +
            "position: relative;" +
            "top: 10px;" +
            "border: solid 1px rgba(182, 182, 182, 0.3);" +
            "border-radius: 2px;" +
            "font-family: 'proxima-nova', 'Helvetica Neue', Arial, Helvetica, sans-serif";

        var rowStyle = "position: relative;" +
            "top: 28px;" +
            "height: 28px;" +
            "text-align: center;";

        for(var r = 0; r < data.length; r++)
        {
             if(data[r][0].getAttribute("data-checked") === "true") continue;

            var createdRow = document.createElement("div");
            createdRow.setAttribute("class", data[r][0].getAttribute("class"));
            createdRow.setAttribute("style", rowStyle);

            var cols = data[r][1];
            for(var c = 0; cols.length; c++)
            {
                var current_col = cols[c];
                if(current_col === undefined) break;

                var download = document.createElement("span");
                download.setAttribute("class", current_col.getAttribute("class"));
                download.setAttribute("style", spanStyle);
                download.innerHTML = "download &#8631;";

                var click_fn = (function(col, dLoadSpan){
                    return function(e){
                        var iframe = createIFrame(col);
                        dLoadSpan.innerHTML = "buffering";
                        var create_fn = (function(iframe, ds){
                            return function(){
                                var link =  getOgURL(iframe.contentDocument);
                                var tag = "<a href=" + link +
                                    " download> ready </a>";
                                ds.innerHTML = tag;
                                iframe.parentNode.removeChild(iframe);
                            };
                        })(iframe, dLoadSpan);
                        setTimeout(create_fn, window.DOWLOAD_WAIT_TIME);
                    };
                })(current_col, download);

                download.addEventListener("click", click_fn);
                createdRow.appendChild(download);
            }
            data[r][0].parentElement.insertBefore(createdRow, data[r][0]);

            data[r][0].setAttribute("data-checked", "true");
            createdRow.setAttribute("data-checked", "true");
            // data attr is there to not apply the same function twice.


        }
    }
    addDonwloadFrames(getData());

    // all the document handlers have to be removed
    // cloneing the node kills all the events.
    // after that add the

    var load_more_button = document.querySelector("#react-root>section>main>article>div>a");
    var new_button = load_more_button.cloneNode(true);
    load_more_button.parentNode.replaceChild(new_button, load_more_button);
    new_button.click = delegate;
})();
