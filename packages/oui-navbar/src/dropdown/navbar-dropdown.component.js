import controller from "./navbar-dropdown.controller";
import template from "./navbar-dropdown.html";

export default {
    require: {
        navbarCtrl: "^^ouiNavbar"
    },
    bindings: {
        name: "@",
        text: "@",
        label: "@?ariaLabel",
        iconBadge: "<?",
        iconClass: "@?",
        onClick: "&"
    },
    controller,
    template,
    transclude: true
};
