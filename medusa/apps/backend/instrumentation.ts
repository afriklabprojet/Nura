import { registerOtel } from "@medusajs/medusa"
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http"

export function register() {
	if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
		return
	}

	registerOtel({
		serviceName: process.env.OTEL_SERVICE_NAME || "nura-backend",
		exporter: new OTLPTraceExporter(),
		instrument: {
			http: true,
			workflows: true,
			query: true,
			db: true,
			cache: true,
		},
	})
}