FROM registry.access.redhat.com/ubi9/nodejs-22:latest AS build-env
WORKDIR /opt/app-root/src
COPY --chown=default:root job/* .
RUN npm install
RUN npm audit fix --force

# Use a small distroless image for as runtime image
FROM gcr.io/distroless/nodejs22
COPY --from=build-env /opt/app-root/src /app
WORKDIR /app
# RUN ls -l
# RUN chmod +x ./job/job.mjs
ENTRYPOINT ["./cloudant-change-listener/job/job.mjs"]