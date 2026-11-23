package io.kuul.cli;

import picocli.CommandLine;
import picocli.CommandLine.Command;
import picocli.CommandLine.Model.CommandSpec;
import picocli.CommandLine.Spec;

/**
 * Root {@code kuul} command. Subcommands (init, chat, serve, ...) are registered here as they are implemented.
 */
@Command(
        name = "kuul",
        mixinStandardHelpOptions = true,
        versionProvider = KuulVersionProvider.class,
        description = "Java-native, self-hosted, auditable enterprise Agent OS.")
public class KuulCommand implements Runnable {

    @Spec
    private CommandSpec spec;

    /**
     * Runs the CLI without Spring (light commands). {@code kuul.jar} delegates here as well.
     */
    public static void main(String[] args) {
        System.exit(execute(args));
    }

    public static int execute(String... args) {
        return new CommandLine(new KuulCommand()).execute(args);
    }

    @Override
    public void run() {
        // No subcommand given: print the version, then usage.
        CommandLine cmd = spec.commandLine();
        cmd.printVersionHelp(cmd.getOut());
        cmd.getOut().println();
        cmd.usage(cmd.getOut());
    }
}
