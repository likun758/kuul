package io.kuul.cli;

import picocli.CommandLine.IVersionProvider;

/**
 * Reads the version from the JAR manifest; falls back to "dev" when running from the IDE or tests.
 */
public class KuulVersionProvider implements IVersionProvider {

    @Override
    public String[] getVersion() {
        String version = KuulVersionProvider.class.getPackage().getImplementationVersion();
        return new String[] {"kuul " + (version != null ? version : "dev")};
    }
}
