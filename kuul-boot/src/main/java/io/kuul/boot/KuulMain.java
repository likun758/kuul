package io.kuul.boot;

import io.kuul.cli.KuulCommand;

/**
 * Entry point of {@code kuul.jar}. Light commands run without Spring; heavy commands
 * (chat, serve, gateway, ...) will start {@link KuulApplication}.
 */
public final class KuulMain {

    private KuulMain() {
    }

    public static void main(String[] args) {
        System.exit(KuulCommand.execute(args));
    }
}
