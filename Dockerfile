
FROM node:22-alpine  

WORKDIR /app

COPY package.json   pnpm-lock.yaml*   ./
RUN pnpm && pnpm i 

COPY . .
 

RUN pnpm && pnpm run build


USER nextjs

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"
CMD ["node", "server.js"]