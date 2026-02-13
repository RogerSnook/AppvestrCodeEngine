FROM registry.access.redhat.com/ubi9/nodejs-22:latest AS build-env
WORKDIR /opt/app-root/src
COPY --chown=default:root job/* .
RUN npm install
RUN npm audit fix --force
RUN pwd -L
RUN chmod +x job.mjs
RUN ls -l

# Use a small distroless image for as runtime image
# FROM gcr.io/distroless/nodejs22
# Use the debian12 variant tis often more stable for PATHs
FROM gcr.io/distroless/nodejs22-debian12
COPY --from=build-env /opt/app-root/src /app
WORKDIR /app
# causes errors RUN pwd -L
# RUN ls -l
ENTRYPOINT ["/usr/bin/node", "job.mjs"]