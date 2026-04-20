import { env } from "@config/env.ts";

const commands = [
    {
        name: "ping",
        description: "Verifica se o bot está online.",
    },
    {
        name: "pegar",
        description: "Pega o item ativo no canal antes que desapareça.",
    },
    {
        name: "obter-stand",
        description: "Usa uma Flecha de Stand para tentar obter uma Stand.",
    },
];

const res = await fetch(
    `https://discord.com/api/v10/applications/${env.discordAppId}/commands`,
    {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bot ${env.discordBotToken}`,
        },
        body: JSON.stringify(commands),
    },
);

if (!res.ok) {
    console.error(`Erro ${res.status}:`, await res.text());
    Deno.exit(1);
}

const registered = await res.json();
for (const cmd of registered) {
    console.log(`Registrado: /${cmd.name} (id: ${cmd.id})`);
}

console.log("Comandos registrados com sucesso.");
Deno.exit(0);
