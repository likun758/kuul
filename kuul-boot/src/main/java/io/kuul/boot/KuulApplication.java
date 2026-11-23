package io.kuul.boot;

import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Spring Boot application that assembles all kuul modules. Started by heavy CLI commands.
 */
@SpringBootApplication(scanBasePackages = "io.kuul")
public class KuulApplication {
}
