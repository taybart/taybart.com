### Frontend

FROM node:lts-alpine as frontend

WORKDIR /build
ADD ./frontend .

RUN npm i -g npm
RUN npm i && npm run build

### Backend
FROM golang:1.16-alpine as backend

RUN apk add --update git openssh

RUN mkdir /user
RUN echo 'nobody:x:65534:65534:nobody:/:' > /user/passwd
RUN echo 'nobody:x:65534:' > /user/group

RUN mkdir -p -m 0600 ~/.ssh && ssh-keyscan github.com >> ~/.ssh/known_hosts
RUN git config --global url.git@github.com:taybart/.insteadOf https://github.com/taybart/

WORKDIR /build

RUN CGO_ENABLED=0 go install -a -installsuffix cgo -ldflags="-w -s" github.com/taybart/hc@latest

ADD ./backend/go.mod .
ADD ./backend/go.sum .

ENV GOPRIVATE github.com/taybart
RUN --mount=type=ssh go mod download

ADD ./backend .
RUN CGO_ENABLED=0 go build -a -installsuffix cgo -ldflags="-w -s" .

### App
FROM scratch

COPY --from=backend /user/group /user/passwd /etc/
COPY --from=backend /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

WORKDIR /app
COPY --from=frontend /build/dist /app/dist
COPY --from=backend /build/server /app/server
COPY --from=backend /build/users.json /app/users.json
COPY --from=backend /go/bin/hc /app/hc

ENV PORT=8080
HEALTHCHECK --interval=1s --timeout=1s --start-period=2s --retries=3 CMD [ "/app/hc" ]

EXPOSE 8080

ARG NOTES_BUCKET
ARG NOTES_ACCESS_KEY_ID
ARG NOTES_SECRET_KEY

ENV NOTES_BUCKET=$NOTES_BUCKET
ENV NOTES_ACCESS_KEY_ID=$NOTES_ACCESS_KEY_ID
ENV NOTES_SECRET_KEY=$NOTES_SECRET_KEY

USER nobody:nobody

ENTRYPOINT ["/app/server"]
