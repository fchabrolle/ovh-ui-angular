import controller from "./message.controller";
import template from "./message.html";

export default {
    template,
    controller,
    bindings: {
        message: "@",
        type: "@",
        dismissable: "<",
        dismissed: "<",
        onDismiss: "&?"
    },
    transclude: true
};
