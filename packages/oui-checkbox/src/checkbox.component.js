import controller from "./checkbox.controller";
import template from "./checkbox.html";

export default {
    template,
    controller,
    bindings: {
        model: "=?",
        id: "@?",
        name: "@?",
        text: "@?", // Deprecated: Replaced by transclude value
        description: "@?",
        disabled: "<?",
        required: "<?",
        onChange: "&"
    },
    transclude: true
};
