type ScrollElement = Element | Document;
export type ScrollCallback = (info: ScrollInfo) => void;
export type ScrollInfo = {
  pxTop: number;
  viewableRatio: number;
  progressRatio: number;
};

export class ScrollReporter {
  element?: ScrollElement;
  pxTop: number = 0;
  callbacks: Record<string, ScrollCallback> = {};

  constructor() {
    // this.element = undefined;
  }

  getScrollInfo = (): ScrollInfo => {
    const pxTop = this.pxTop;
    let viewableHeight = 0;
    let fullHeight = 0;
    if (this.element) {
      if ("clientHeight" in this.element) {
        viewableHeight = this.element.clientHeight;
        fullHeight = this.element.scrollHeight;
      }
      if ("scrollingElement" in this.element && this.element.scrollingElement) {
        const screl = this.element.scrollingElement;
        viewableHeight = screl.clientHeight;
        fullHeight = screl.scrollHeight;
      }
    }

    return {
      pxTop,
      viewableRatio: pxTop / viewableHeight,
      progressRatio: pxTop / (fullHeight - viewableHeight),
    };
  };

  scrollHandler = (e: Event) => {
    const el = this.element;
    requestAnimationFrame(() => {
      if (!el) return;
      if ("scrollTop" in el) {
        this.pxTop = el.scrollTop;
      }
      if ("scrollingElement" in el && el.scrollingElement) {
        if ("scrollTop" in el.scrollingElement) {
          this.pxTop = el.scrollingElement.scrollTop;
        }
      }
      for (const cb of Object.values(this.callbacks)) {
        const _info = this.getScrollInfo();
        cb(_info);
      }
    });
  };

  register(el: ScrollElement) {
    this.element = el;
    el.addEventListener("scroll", this.scrollHandler);
  }

  unregister() {
    this.element?.removeEventListener("scroll", this.scrollHandler);
    this.element = undefined;
  }

  addCallback(key: string, callback: ScrollCallback) {
    this.callbacks[key] = callback;
  }

  removeCallback(key: string) {
    delete this.callbacks[key];
  }
}
