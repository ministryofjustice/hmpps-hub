require.config({
    paths: {
        bootstraplib: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/bootstrap/js/bootstrap.min",
        bootstrapModal: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/bootstrapModal/bootstrap-modal",
        bootstrapModalManager: "/sitecore/shell/client/Speak/Assets/lib/ui/1.1/deps/bootstrapModal/bootstrap-modalmanager"
    },
    shim: {
        'bootstraplib': { deps: ['jquery'] },
        'bootstrapModalManager': { deps: ['bootstraplib'] },
        'bootstrapModal': { deps: ['bootstrapModalManager'] }
    }
});

define("dialog", ["jquery", "bootstraplib", "bootstrapModalManager", "bootstrapModal"], function () {
    return true;
});