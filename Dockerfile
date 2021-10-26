# node:14.17.6-buster as of 2021/09/03
FROM node@sha256:a9848514a416933e3e7862747a1c2883b1d60a7a50912b4a1011f6f22236101e
WORKDIR /root
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build


# node:14.17.6-buster as of 2021/09/03
FROM node@sha256:a9848514a416933e3e7862747a1c2883b1d60a7a50912b4a1011f6f22236101e
WORKDIR /pacakges
RUN wget -q https://github.com/wkhtmltopdf/packaging/releases/download/0.12.6-1/wkhtmltox_0.12.6-1.buster_amd64.deb
RUN apt update
RUN dpkg -i wkhtmltox_0.12.6-1.buster_amd64.deb; exit 0
RUN apt install -f -y

WORKDIR /root
COPY package*.json ./
RUN npm ci --production
COPY --from=0 /root/dist ./dist


WORKDIR /root/dist
EXPOSE 3003

ENV NODE_ENV=production \
    PORT=3003 \
    ACCESS_TOKEN_SECRET=b$^AMNEm%8&Z=m[hNfQfeGVt333*M[ \
    ACCESS_TOKEN_LIFE=30m \
    REFRESH_TOKEN_SECRET=oa@p7@Z6g9*RpaTg2t-moexX-QinM8PTEhnQ \
    REFRESH_TOKEN_LIFE=30d \
    LOG_TRANSPORTS=file_console \

# COPY ./.aws/ /root/.aws/

CMD ["node", "server.js"]
