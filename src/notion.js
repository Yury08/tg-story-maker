import { Client } from "@notionhq/client";
import config from "config";

const notion = new Client({
    auth: config.get("NOTION_KEY"),
})

export async function create(short, text) {
    const res = await notion.pages.create({
        // указываем в какую таблицу вставлять данные в notion
        parent: { database_id: config.get("NOTION_DB_ID") },
        properties: {
            // записываем в поле name короткие тезисы
            Name: {
                title: [
                    {
                        text: {
                            content: short
                        }
                    }
                ]
            },
            Date: {
                date: {
                    start: new Date().toISOString()
                }
            }
        }
    })

    await notion.blocks.children.append({
        block_id: res.id,
        children: [
            {
                object: "block",
                type: "paragraph",
                paragraph: {
                    rich_text: [
                        {
                            type: "text",
                            text: {
                                content: text
                            }
                        }
                    ]
                }
            }
        ]
    })

    return res;
}

