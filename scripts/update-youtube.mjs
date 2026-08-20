import { readFile, writeFile } from "node:fs/promises";

const channelId = "UC1AUWjKI3I7Y3ZJkOtFVi5g";
const channelUrl = "https://www.youtube.com/@juanmanuelynerinacurbelo";
const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
const outputPath = new URL("../_data/latest-youtube.json", import.meta.url);

const response = await fetch(feedUrl, {
  headers: { "user-agent": "juan-manuel-nerina-site/1.0" },
});

if (!response.ok) {
  throw new Error(`YouTube respondió ${response.status}`);
}

const xml = await response.text();
const entry = xml.match(/<entry>([\s\S]*?)<\/entry>/)?.[1];
if (!entry) throw new Error("El canal no devolvió videos");

const extract = (tag) => {
  const escapedTag = tag.replace(":", "\\:");
  const value = entry.match(new RegExp(`<${escapedTag}[^>]*>([\\s\\S]*?)<\\/${escapedTag}>`))?.[1] ?? "";
  return value
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
};

const videoId = extract("yt:videoId");
const title = extract("title");
const sourceDescription = extract("media:description");
if (!videoId || !title) throw new Error("El video más reciente no tiene identificador o título");

const shorten = (text, limit = 360) => {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).replace(/\s+\S*$/, "").trim()}…`;
};

const description = sourceDescription
  ? shorten(sourceDescription)
  : `En este mensaje, Juan Manuel y Nerina comparten una enseñanza titulada “${title}”, pensada para fortalecer tu fe y ayudarte a crecer espiritualmente.`;

const latest = {
  channel_id: channelId,
  channel_name: "JUAN MANUEL Y NERINA CURBELO",
  channel_url: channelUrl,
  video_id: videoId,
  title,
  description,
  url: `https://www.youtube.com/watch?v=${videoId}`,
  published: extract("published"),
};

const next = `${JSON.stringify(latest, null, 2)}\n`;
const previous = await readFile(outputPath, "utf8").catch(() => "");
if (previous !== next) await writeFile(outputPath, next, "utf8");
