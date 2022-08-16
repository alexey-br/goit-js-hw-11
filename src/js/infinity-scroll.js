export default class InfinityScroll {
    constructor(action) {
        this.action = action;
    }

    const scrollObserver = new IntersectionObserver(handleIntersect, options);

function handleIntersect(entries) {
  if (entries[0].isIntersecting) {
    loadMore();
  }
}

function infitityScrollOn() {
  scrollObserver.observe(refs.footer);
}

function infitityScrollOff() {
  scrollObserver.unobserve(refs.footer);
}
}