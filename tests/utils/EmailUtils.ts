import { MailSlurp } from "mailslurp-client";

export async function createInbox()
{
    const mailslurp = new MailSlurp({ apiKey: process.env.MAILSLURP_API_KEY! });
    const inbox = await mailslurp.inboxController.createInboxWithDefaults();
    return inbox;
}