FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --include=dev

COPY . .
RUN npx ng build --configuration docker

FROM nginx:alpine

RUN apk add --no-cache envsubst

COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist/dev-ii /usr/share/nginx/html

EXPOSE ${PORT}

CMD ["sh", "-c", "envsubst '${PORT}' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
