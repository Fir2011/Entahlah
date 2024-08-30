document.addEventListener('DOMContentLoaded', function () {
    // IFRAME
    let originalIframe = null;
    let originalParent = null;
    const iframe = document.querySelector('iframe');
    if (iframe) {
        originalIframe = iframe;
        originalParent = iframe.parentElement;
    }
    function toggleTopContinue(hidden) {
        const topContinue = document.querySelector('#top-continue');
        if (topContinue) {
            hidden ? topContinue.classList.add('hidden') : topContinue.classList.remove('hidden');
        }
    }
    document.addEventListener('click', function (event) {
        const target = event.target;
        if (target.matches('a.comment-reply[data-comment-id]')) {
            event.preventDefault();
            const commentId = target.getAttribute('data-comment-id');
            const targetBox = document.querySelector(`.comment-replybox-single[id="c${commentId}-ce"]`);
            if (iframe && targetBox) {
                document.querySelectorAll('a.comment-reply[data-comment-id]').forEach((replyLink) => {
                    replyLink.parentElement.classList.remove('hidden');
                });
                target.parentElement.classList.add('hidden');
                targetBox.appendChild(iframe);
                let src = iframe.getAttribute('src');
                src = `${src.split('&parentID=')[0]}&parentID=${commentId}`;
                iframe.setAttribute('src', src);
                toggleTopContinue(false);
            }
        } else if (target.matches('#top-continue a.comment-reply')) {
            event.preventDefault();
            if (iframe && originalParent) {
                const topCe = document.querySelector('#top-ce');
                if (topCe) {
                    topCe.appendChild(iframe);
                }
                const commentEditorSrc = document.querySelector('#comment-editor-src');
                if (commentEditorSrc) {
                    topCe.insertBefore(iframe, commentEditorSrc.nextSibling);
                }
                let src = iframe.getAttribute('src');
                src = src.split('&parentID=')[0];
                iframe.setAttribute('src', src);
                document.querySelectorAll('a.comment-reply[data-comment-id]').forEach((replyLink) => {
                    replyLink.parentElement.classList.remove('hidden');
                });
                toggleTopContinue(true);
            }
        }
    });

    // TOGGLE REPLY & REPLIES COUNTER
    document.querySelectorAll('ol.thread-chrome').forEach(threadOl => {
        const comments = threadOl.querySelectorAll('li.comment');
        if (comments.length > 0) {
            const threadToggle = threadOl.previousElementSibling;
            const count = comments.length;
            threadToggle.querySelector('a').textContent = 'Sembunyikan Balasan';
            if (threadToggle.classList.contains('thread-toggle')) {
                threadToggle.classList.add('has-children');
                threadToggle.classList.add('thread-expanded');
            }
        }
    });
    document.querySelectorAll('.thread-toggle').forEach(threadToggle => {
        threadToggle.addEventListener('click', function () {
            const ol = this.nextElementSibling;
            const comments = ol.querySelectorAll('li.comment');
            const count = comments.length;
            comments.forEach(comment => comment.classList.toggle('hidden'));
            const link = this.querySelector('a');
            if (link.textContent === `(${count}) Balasan`) {
                link.textContent = 'Sembunyikan Balasan';
                this.classList.add('thread-expanded');
            } else {
                link.textContent = `(${count}) Balasan`;
                this.classList.remove('thread-expanded');
            }
        });
    });
});
