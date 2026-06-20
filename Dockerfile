# Container image for the Sandbox module (@cloudflare/sandbox).
# The tag must match the installed @cloudflare/sandbox version.
FROM docker.io/cloudflare/sandbox:0.12.1

# Required for local dev port exposure / preview URLs.
EXPOSE 8080
