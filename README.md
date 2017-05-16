# instaGrab


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

