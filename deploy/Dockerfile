### Frontend

FROM node:lts-alpine as frontend

WORKDIR /build
ADD ./frontend .

RUN npm i -g npm
RUN npm i && npm run build

### Backend
FROM golang:1.16-alpine as backend


WORKDIR /build

RUN CGO_ENABLED=0 go install -a -installsuffix cgo -ldflags="-w -s" github.com/taybart/hc@latest

ADD ./backend .
RUN CGO_ENABLED=0 go build -a -installsuffix cgo -ldflags="-w -s" .

RUN mkdir /user
RUN echo 'nobody:x:65534:65534:nobody:/:' > /user/passwd
RUN echo 'nobody:x:65534:' > /user/group

### App
FROM scratch

COPY --from=backend /user/group /user/passwd /etc/
COPY --from=backend /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

WORKDIR /app
COPY --from=frontend /build/dist /app/dist
COPY --from=backend /build/server /app/server
COPY --from=backend /go/bin/hc /app/hc

ENV PORT=8080
HEALTHCHECK --interval=1s --timeout=1s --start-period=2s --retries=3 CMD [ "/app/hc" ]

EXPOSE 8080

USER nobody:nobody

ENTRYPOINT ["/app/server"]
