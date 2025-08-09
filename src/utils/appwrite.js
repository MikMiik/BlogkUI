import { Client, Account } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Endpoint Appwrite của bạn
  .setProject("6896448f001e2a0a1341"); // ID project Appwrite

const account = new Account(client);

export { client, account };
