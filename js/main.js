const menuBtn = document.querySelector('.menu__btn');
const menu = document.querySelector('.header__inner-right');
menuBtn.addEventListener('click', () => menuBtn.setAttribute('aria-expanded', menu.classList.toggle('menu--open')));

const lightbox = document.querySelector('.lightbox');
let playing; // one video at a time: the previous one goes back to its thumbnail

document.addEventListener('click', e => {
  if (e.metaKey || e.ctrlKey || e.shiftKey) return; // let "open in new tab" work
  const yt = e.target.closest('a.yt');
  if (yt) {
    e.preventDefault();
    if (playing) playing.iframe.replaceWith(playing.link);
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + new URL(yt.href).searchParams.get('v') + '?autoplay=1&rel=0';
    iframe.title = yt.querySelector('img').alt;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    iframe.allowFullscreen = true;
    yt.replaceWith(iframe);
    iframe.focus();
    playing = { link: yt, iframe };
    return;
  }
  const photo = e.target.closest('a[href$=".webp"]');
  if (photo && lightbox && lightbox.showModal) {
    e.preventDefault();
    const img = lightbox.querySelector('img');
    img.src = photo.href;
    img.alt = photo.querySelector('img').alt;
    lightbox.showModal();
    return;
  }
  const copy = e.target.closest('[data-copy]');
  if (copy) {
    const flash = text => { copy.textContent = text; setTimeout(() => copy.textContent = 'Copy', 3000); };
    // in-app browsers (Instagram, Facebook) and old ones may refuse the clipboard: select the text instead
    const fallback = () => {
      getSelection().selectAllChildren(copy.previousElementSibling);
      flash(document.execCommand('copy') ? 'Copied' : 'Selected, copy it');
    };
    if (navigator.clipboard) navigator.clipboard.writeText(copy.dataset.copy).then(() => flash('Copied'), fallback);
    else fallback();
  }
});
if (lightbox) {
  lightbox.addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('close', () => lightbox.querySelector('img').removeAttribute('src'));
}
