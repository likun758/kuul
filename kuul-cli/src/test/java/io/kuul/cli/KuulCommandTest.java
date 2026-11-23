package io.kuul.cli;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.PrintWriter;
import java.io.StringWriter;

import org.junit.jupiter.api.Test;
import picocli.CommandLine;

class KuulCommandTest {

    private final StringWriter out = new StringWriter();

    private int run(String... args) {
        CommandLine cmd = new CommandLine(new KuulCommand());
        cmd.setOut(new PrintWriter(out, true));
        return cmd.execute(args);
    }

    @Test
    void printsVersion() {
        assertThat(run("--version")).isZero();
        assertThat(out.toString()).startsWith("kuul ");
    }

    @Test
    void printsVersionAndUsageWithoutArguments() {
        assertThat(run()).isZero();
        assertThat(out.toString()).startsWith("kuul ").contains("Usage: kuul");
    }
}
