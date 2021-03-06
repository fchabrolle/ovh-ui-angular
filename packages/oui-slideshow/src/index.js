import Slideshow from "./slideshow.component";
import SlideshowPanel from "./panel/slideshow-panel.component";

export default angular
    .module("oui.slideshow", [])
    .component("ouiSlideshow", Slideshow)
    .component("ouiSlideshowPanel", SlideshowPanel)
    .name;
