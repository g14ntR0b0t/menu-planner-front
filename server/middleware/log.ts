import { defineEventHandler } from 'h3';

export default defineEventHandler((ev) => console.log(ev.req.url));